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

// Prices
var Quick int = 1
var Normal int = 2
var Extra int = 3

type CreateBooking struct {
	Date  time.Time `json:"date"`
	Type int       `json:"type"`
}

type CancelBooking struct {
	ID string `json:"id"`
}

type ConfirmBooking struct {
	ID string `json:"id"`
}

type ConfirmBookingPayment struct {
	ID string `json:"id"`
}

type IsDateBooked struct {
	Date time.Time `json:"date"`
}