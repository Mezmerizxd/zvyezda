package features

import (
	"zvyezda/src/engine/features/account"
	"zvyezda/src/engine/features/xbox"
)

type Config struct {
	Account account.Account
	Xbox xbox.Xbox
}

type Features struct {
	Account account.Account
	Xbox xbox.Xbox
}

func New(cfg *Config) Features {
	return Features{
		Account: cfg.Account,
		Xbox: cfg.Xbox,
	}
}

