package booking

import (
	"time"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/types"
)

type Config struct{}

type Booking interface {
	Create(data types.CreateBooking, accountId string) (*types.ServiceBooking, error)
	Cancel(id string, accountId string) (error)
	IsDateBooked(date time.Time) (bool, error)
	ConfirmBooking(id string) (*types.ServiceBooking, error)
	ConfirmBookingPayment(id string) (*types.ServiceBooking, error)
}

type booking struct{}

func New(cfg *Config) Booking {
	return &booking{}
}

func (b *booking) Create(data types.CreateBooking, accountId string) (*types.ServiceBooking, error) {
	booked, err := b.IsDateBooked(data.Date)
	if err != nil {
		return nil, err
	}

	if booked {
		return nil, types.ErrorDateAlreadyBooked
	}

	var price = 0
	switch data.Type {
	case types.Quick:
		price = 5
	case types.Normal:
		price = 10
	case types.Extra:
		price = 15
	}

	booking := types.ServiceBooking{
		AccountID: accountId,
		Date:      data.Date,
		Price:     price,
		CreatedAt: time.Now(),
	}

	err = database.CreateBooking(booking)
	if err != nil {
		return nil, err
	}

	return &booking, nil
}

func (b *booking) Cancel(id string, accountId string) (error) {
	booking, err := database.GetBookingByID(id)
	if err != nil {
		return err
	}

	if booking.AccountID != accountId {
		return types.ErrorYouDoNotOwnThisBooking
	}

	if booking.Confirmed {
		return types.ErrorThisBookingIsConfirmed
	}

	err = database.DeleteBookingByID(id)
	if err != nil {
		return err
	}

	return nil
}

func (b *booking) IsDateBooked(date time.Time) (bool, error) {
	bookings, err := database.GetAllBookings()
	if err != nil {
		return false, err
	}

	for _, booking := range *bookings {
		if booking.Date == date {
			return true, nil
		}

		if booking.Date.Day() == date.Day() && booking.Date.Month() == date.Month() && booking.Date.Year() == date.Year() {
			return true, nil
		}
	}

	return false, nil
}

func (b *booking) ConfirmBooking(id string) (*types.ServiceBooking, error) {
	booking, err := database.GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	booking.Confirmed = true
	err = database.UpdateBooking(booking) // dereference the pointer to get a value of type types.ServiceBooking
	if err != nil {
		return nil, err
	}

	return booking, nil
}

func (b *booking) ConfirmBookingPayment(id string) (*types.ServiceBooking, error) {
	booking, err := database.GetBookingByID(id)
	if err != nil {
		return nil, err
	}

	booking.Paid = true

	err = database.UpdateBooking(booking)
	if err != nil {
		return nil, err
	}

	return booking, nil
}