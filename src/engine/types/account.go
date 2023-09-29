package types

import (
	"errors"
	"time"
)

var (
	ErrorAccountDoesNotExist = errors.New("account does not exist")
	ErrorPasswordsDoNotMatch = errors.New("passwords do not match")

	ErrorUsernameInvalid = errors.New("invalid username")
	ErrorUsernameTaken = errors.New("this username is already taken")
	ErrorUsernameLength = errors.New("username is either too long or too short")

	ErrorEmailInvalid = errors.New("invalid email")
	ErrorEmailUsed = errors.New("this email is being used by someone else")
	ErrorEmailLength = errors.New("email is either too long or too short")

	ErrorFailedToCreateAccount = errors.New("failed to create account")
	ErrorFailedToGenerateAccess = errors.New("failed to generate token")
	
	ErrorTokenIsNil = errors.New("token is nil")
	ErrorTokenExpIsNil = errors.New("token expiry date is nil")
	ErrorTokenHasExpired = errors.New("token has expired")

	ErrorUnauthorizedAccessAttempt = errors.New("you do not have authorization")
	ErrorInvalidIdentifier = errors.New("invalid identifier")
)

var AccountCtx string = "account"

var UserRole string = "USER"
var DeveloperRole string = "DEVELOPER"
var AdminRole string = "ADMIN"

type TokenData struct {
	Token     string    `json:"token"`
	TokenExp  time.Time `json:"tokenExp"`
}

type LoginAccountData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateAccountData struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type DeleteAccountData struct {
	Identifier        string     `json:"Identifier"`
	Value string `json:"value"`
}