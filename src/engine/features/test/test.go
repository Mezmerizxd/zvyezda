package test

import (
	"zvyezda/src/engine/configs"
)

type Config struct {}

type Test interface{
	Create(account configs.CreateData) (*configs.AccountData, error)
	Login(account configs.LoginData) (*configs.AccountData, error)
	GetAccountById(accountId int) (*configs.AccountData, error)
	GetAccountByEmail(email string) (*configs.AccountData, error)
}

type test struct {}

var activeAccounts []configs.AccountData

func New(cfg *Config) Test {
	return &test{}
}

func (t *test) Create(account configs.CreateData) (*configs.AccountData, error) {
	_, err := t.GetAccountByEmail(account.Email)
	if err != nil {
		return nil, err
	}

	data := configs.AccountData{
		AccountId: len(activeAccounts) + 1,
		FirstName: account.FirstName,
		LastName: account.LastName,
		Email: account.Email,
		Password: account.Password,
	}

	activeAccounts = append(activeAccounts, data)

	return &data, nil
}

func (t *test) Login(account configs.LoginData) (*configs.AccountData, error) {
	data, err := t.GetAccountByEmail(account.Email)
	if err != nil {
		return nil, err
	}

	if account.Password != data.Password {
		return nil, configs.ErrorPasswordsDoNotMatch
	} 

	return data, nil
}

func (t *test) GetAccountById(accountId int) (*configs.AccountData, error) {
	for _, account := range activeAccounts {
		if account.AccountId == accountId {
			return &account, nil
		}
	}
	return nil, configs.ErrorAccountNotFound
}

func (t *test) GetAccountByEmail(email string) (*configs.AccountData, error) {
	for _, account := range activeAccounts {
		if account.Email == email {
			return &account, nil
		}
	}
	return nil, configs.ErrorAccountNotFound
}