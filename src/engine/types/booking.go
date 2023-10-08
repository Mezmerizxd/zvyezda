package types

import (
	"errors"
	"time"
)

var (
	ErrorDateAlreadyBooked = errors.New("date is already booked")
	ErrorBookingDoesNotExist = errors.New("booking does not exist")
	ErrorYouDoNotOwnThisBooking = errors.New("you do not own this booking")
	ErrorThisBookingIsConfirmed = errors.New("this booking is confirmed")
)

type CreateBooking struct {
	Date        time.Time `json:"date"`
	ServiceType string    `json:"serviceType"`
	AddressID   string    `json:"addressId"`
}

type CancelBooking struct {
	BookingID string `json:"bookingId"`
}

type ConfirmBooking struct {
	BookingID string `json:"bookingId"`
}

type ConfirmBookingPayment struct {
	BookingID string `json:"bookingId"`
}

type IsDateBooked struct {
	Date time.Time `json:"date"`
}

type RescheduleConfirmedBooking struct {
	BookingID string    `json:"bookingId"`
	Date      time.Time `json:"date"`
}

type FullBooking struct {
	ID          string    `json:"id"`
	Date        time.Time `json:"date"`
	Price       int       `json:"price"`
	ServiceType string    `json:"serviceType"`
	Paid        bool      `json:"paid"`
	Confirmed   bool      `json:"confirmed"`
	Address   Address    `json:"address"`
	Account   Account    `json:"account"`
	CreatedAt   time.Time `json:"createdAt"`
}