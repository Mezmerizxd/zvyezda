package configs

import (
	"errors"
)

/* Erros */
var AccountNotFound = errors.New("account not found.")
var PasswordsDoNotMatch = errors.New("passwords do not match.")
/*********/

type JWT struct {
	Token    string
	TokenExp string
}

type AccountData struct {
	AccountId int `json:"accountId"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type LoginData struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CreateData struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
}