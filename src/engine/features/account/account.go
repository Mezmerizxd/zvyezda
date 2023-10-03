package account

import (
	"errors"
	"time"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/pkg/utils"
	types "zvyezda/src/engine/types"

	"github.com/google/uuid"
)

type Config struct{}

type Account interface {
	Login(data types.LoginAccountData) (*types.Account, error)
	Create(data types.CreateAccountData) (*types.Account, error)
	Delete(data types.DeleteAccountData) (error)
	GenerateToken() (*types.TokenData, error)
	ValidateToken(account types.Account) (bool, error)
	HasAccess(account types.Account, role string) (bool, error)
	GetProfile(token string) (*types.Profile, error)
}

type account struct{}

func New(cfg *Config) Account {
	return &account{}
}

func (a *account) Login(data types.LoginAccountData) (*types.Account, error) {
	account, err := database.GetAccountByUsername(data.Username)
	if err != nil {
		return nil, err
	}

	hashedPassword := utils.StringToSha512(data.Password)
	if hashedPassword != account.Password {
		return nil, types.ErrorPasswordsDoNotMatch
	}

	access, err2 := a.GenerateToken()
	if err2 != nil {
		return nil, err2
	}

	account.Token = &access.Token
	account.TokenExp = &access.TokenExp

	err3 := database.UpdateAccount(*account)
	if err2 != nil {
		return nil, err3
	}

	return account, nil
}

func (a *account) Create(data types.CreateAccountData) (*types.Account, error) {
	if len(data.Email) < 1 {
		return nil, types.ErrorEmailLength
	} else if len(data.Username) < 1 {
		return nil, types.ErrorUsernameLength
	}

	_, err := database.GetAccountByEmail(data.Email)
	if err == nil {
		return nil, types.ErrorEmailUsed
	}

	_, err = database.GetAccountByUsername(data.Username)
	if err == nil {
		return nil, types.ErrorUsernameTaken
	}

	hashedPassword := utils.StringToSha512(data.Password)

	access, err := a.GenerateToken()
	if err != nil {
		return nil, err
	}

	newAccount := types.Account{
		ID: uuid.New().String(),
		Email: data.Email,
		Username: data.Username,
		Password: hashedPassword,
		Token: &access.Token,
		TokenExp: &access.TokenExp,
		Role: "USER",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err = database.CreateAccount(newAccount)
	if err != nil {
		return nil, types.ErrorFailedToCreateAccount
	}

	return &newAccount, nil
}

func (a *account) Delete(data types.DeleteAccountData) (error) {
	switch data.Identifier {
	case "id":
		err := database.DeleteAccountByID(data.Value)
		if err != nil {
			return err
		}
	case "username":
		err := database.DeleteAccountByUsername(data.Value)
		if err != nil {
			return err
		}
	case "email":
		err := database.DeleteAccountByEmail(data.Value)
		if err != nil {
			return err
		}
	case "token":
		err := database.DeleteAccountByToken(data.Value)
		if err != nil {
			return err
		}
	default:
		return types.ErrorInvalidIdentifier
	}

	return nil
}

func (a *account) GenerateToken() (*types.TokenData, error) {
	var attempts = 5
	var generated = false
	
	token := utils.GenerateToken()

	for i := 0; i < attempts; i++ {
		acc, _ := database.GetAccountByToken(token)

		if acc != nil {
			token = utils.GenerateToken()
		} else {
			generated = true
			break
		}
	}

	if !generated {
		return nil, types.ErrorFailedToGenerateAccess
	}

	expiry := time.Now().Add(24 * time.Hour)

	return &types.TokenData{
		Token: token,
		TokenExp: expiry,
	}, nil
}

func (a *account) ValidateToken(account types.Account) (bool, error) {
	if account.Token == nil {
		return false, types.ErrorTokenIsNil
	}
	if account.TokenExp == nil {
		return false, types.ErrorTokenExpIsNil
	}

	if time.Now().After(*account.TokenExp) {
		return false, types.ErrorTokenHasExpired
	}

	return true, nil
}

func (a *account) HasAccess(account types.Account, role string) (bool, error) {
	var authorized bool
	switch role {
	case types.UserRole:
		authorized = account.Role == types.UserRole || account.Role == types.DeveloperRole || account.Role == types.AdminRole
	case types.DeveloperRole:
		authorized = account.Role == types.DeveloperRole || account.Role == types.AdminRole
	case types.AdminRole:
		authorized = account.Role == types.AdminRole
	default:
		return false, errors.New("invalid role, " + role)
	}

	if !authorized {
		return false, errors.New("account does not have the role, " + role)
	}

	return true, nil
}


func (a *account) GetProfile(token string) (*types.Profile, error) {
	account, err := database.GetAccountByToken(token)
	if err != nil {
		return nil, err
	}

	return &types.Profile{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}, nil
}