package features

import (
	"zvyezda/src/engine/features/account"
)

type Config struct {
	Account account.Account
}

type Features struct {
	Account account.Account
}

func New(cfg *Config) Features {
	return Features{
		Account: cfg.Account,
	}
}

