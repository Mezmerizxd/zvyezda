package booking

import (
	"fmt"
	"time"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/types"
)

type Config struct{}

type Booking interface {
	Create(data types.CreateBooking, account types.Account) (*types.Booking, error)
	Cancel(bookingID string, account types.Account) (error)
	IsDateBooked(date time.Time) (bool, error)
	ConfirmBooking(bookingID string) (*types.Booking, error)
	ConfirmBookingPayment(bookingID string) (*types.Booking, error)
}

type booking struct{}

func New(cfg *Config) Booking {
	return &booking{}
}

func (b *booking) Create(data types.CreateBooking, account types.Account) (*types.Booking, error) {
	booked, err := b.IsDateBooked(data.Date)
	if err != nil {
		return nil, err
	}

	if booked {
		return nil, types.ErrorDateAlreadyBooked
	}

	var price = 0
	switch data.ServiceType {
	case "QUICK":
		price = 5
	case "NORMAL":
		price = 10
	case "EXTRA":
		price = 15
	}

	booking := types.Booking{
		Date:      data.Date,
		Price:     price,
		ServiceType: data.ServiceType,
		Paid: 		false,
		Confirmed: false,
		AddressID: data.AddressID,
		AccountID: account.ID,
		CreatedAt: time.Now(),
	}

	err = database.CreateBooking(booking)
	if err != nil {
		return nil, err
	}

	return &booking, nil
}

func (b *booking) Cancel(bookingID string, account types.Account) (error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return err
	}

	if booking.AccountID != account.ID {
		return types.ErrorYouDoNotOwnThisBooking
	}

	if booking.Confirmed {
		return types.ErrorThisBookingIsConfirmed
	}

	err = database.DeleteBookingByID(bookingID)
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

func (b *booking) ConfirmBooking(bookingID string) (*types.Booking, error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return nil, err
	}

	booking.Confirmed = true

	err = database.UpdateBooking(*booking)
	if err != nil {
		fmt.Println("Features:", err)
		return nil, err
	}

	return booking, nil
}

func (b *booking) ConfirmBookingPayment(bookingID string) (*types.Booking, error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return nil, err
	}

	booking.Paid = true

	err = database.UpdateBooking(*booking)
	if err != nil {
		return nil, err
	}

	return booking, nil
}