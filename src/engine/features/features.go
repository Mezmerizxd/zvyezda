package features

import (
	"zvyezda/src/engine/features/account"
	"zvyezda/src/engine/features/booking"
	"zvyezda/src/engine/features/payment"
	"zvyezda/src/engine/features/xbox"
)

type Config struct {
	Account account.Account
	Xbox xbox.Xbox
	Booking booking.Booking
	Payment payment.Payment
}

type Features struct {
	Account account.Account
	Xbox xbox.Xbox
	Booking booking.Booking
	Payment payment.Payment
}

func New(cfg *Config) Features {
	return Features{
		Account: cfg.Account,
		Xbox: cfg.Xbox,
		Booking: cfg.Booking,
		Payment: cfg.Payment,
	}
}

