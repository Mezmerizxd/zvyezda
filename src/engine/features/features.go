package features

import (
	"zvyezda/src/engine/features/account"
	"zvyezda/src/engine/features/booking"
	"zvyezda/src/engine/features/stripe"
	"zvyezda/src/engine/features/xbox"
)

type Config struct {
	Account account.Account
	Xbox xbox.Xbox
	Booking booking.Booking
	Stripe stripe.Stripe
}

type Features struct {
	Account account.Account
	Xbox xbox.Xbox
	Booking booking.Booking
	Stripe stripe.Stripe
}

func New(cfg *Config) Features {
	return Features{
		Account: cfg.Account,
		Xbox: cfg.Xbox,
		Booking: cfg.Booking,
		Stripe: cfg.Stripe,
	}
}

