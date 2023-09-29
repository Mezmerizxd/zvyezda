package types

import (
	"errors"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	ErrorFailedToConnectToDatabase = errors.New("failed to connect to database")
	ErrorFailedToQueryDatabase     = errors.New("failed to query the database")
	ErrorFailedToScanQueryResult   = errors.New("failed to scan query result")
	ErrorFailedToUpdateDatabase    = errors.New("failed to update database")
	ErrorFailedToInsertDatabase    = errors.New("failed to insert database")
)

type AccountSearchParameter int
const (
	ID AccountSearchParameter = iota
	Username
	Email
	Token
)

func (p AccountSearchParameter) String() string {
	switch p {
	case ID:
		return "id"
	case Username:
		return "username"
	case Email:
		return "email"
	case Token:
		return "token"
	default:
		return "unknown"
	}
}

type Account struct {
	ID        string     `json:"id"`
	Email     string     `json:"email"`
	Username  string     `json:"username"`
	Password  string     `json:"password"`
	Token     *string    `json:"token,omitempty"`
	TokenExp  *time.Time `json:"tokenExp,omitempty"`
	Role      string     `json:"role"`
	Avatar    *string    `json:"avatar,omitempty"`
	Biography *string    `json:"biography,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

// Create implements account.Account.
func (*Account) Create(c *gin.Context) {
	panic("unimplemented")
}

// Login implements account.Account.
func (*Account) Login(c *gin.Context) {
	panic("unimplemented")
}

// Profile implements account.Account.
func (*Account) Profile(c *gin.Context) {
	panic("unimplemented")
}

type Profile struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Role      string    `json:"role"`
	Avatar    *string   `json:"avatar,omitempty"`
	Biography *string   `json:"biography,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Xbox struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	XboxType        string    `json:"xboxType"`
	XboxColour      string    `json:"xboxColour"`
	MotherboardType string    `json:"motherboardType"`
	SerialNumber    string    `json:"serialNumber"`
	MfrDate         time.Time `json:"mfrDate"`
	Model           string    `json:"model"`
	NandSize        string    `json:"nandSize"`
	RghVersion      string    `json:"rghVersion"`
	RghGlitchType   string    `json:"rghGlitchType"`
	Images          []string  `json:"images"` // Urls
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type DiscussionMessage struct {
	ID        string    `json:"id"`
	Message   string    `json:"message"`
	Username  string    `json:"username"`
	Avatar    *string   `json:"avatar,omitempty"`   // Url
	ReplyTo   *string   `json:"reply_to,omitempty"` // DiscussionMessage ID
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type RtspStream struct {
	ID   string `json:"id"`
	URL  string `json:"url"` // rtsp://
	Name string `json:"name"`
}
