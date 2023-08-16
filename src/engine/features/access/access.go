package access

import (
	"errors"
	"time"
)

type Config struct{}

type Access interface {
	Create(id string, username string) (*string, error)
	IsActive(token string, role *string) bool
	IsRoleValid(role string) bool
	GetAccessById(id string) (*ActiveAccess, error)
	GetAccessByToken(token string) (*ActiveAccess, error)
}

type access struct{}

var Roles = [3]string{"USER", "DEVELOPER", "ADMIN"}

type Account struct {
	Id           string
	Email        string
	Username     string
	Password     string
	Token        *string
	TokenExpires *string
	Role         string
	Avatar       *string
	Biography    *string
	CreatedAt    string
	UpdatedAt    string
}

type ActiveAccess struct {
	Id       string
	Username string
	Token    string
	Expires  time.Time
}

var active []ActiveAccess

func New(cfg *Config) Access {
	return &access{}
}

func (a *access) Create(id string, username string) (*string, error) {
	token := GenerateAccessToken()
	if token == nil {
		return nil, errors.New("failed to generate acccess token.")
	}

	return nil, nil
}

func (a *access) IsActive(token string, role *string) bool {
	return false
}

func (a *access) IsRoleValid(role string) bool {
	for _, v := range Roles {
		if v == role {
			return true
		}
	}
	return false
}

func (a *access) GetAccessById(id string) (*ActiveAccess, error) {
	for _, v := range active {
		if v.Id == id {
			return &v, nil
		}
	}
	return nil, errors.New("failed to get access by id.")
}

func (a *access) GetAccessByToken(token string) (*ActiveAccess, error) {
	for _, v := range active {
		if v.Token == token {
			return &v, nil
		}
	}
	return nil, errors.New("failed to get access by token.")
}

func GenerateAccessToken() *string {
	return nil
}
