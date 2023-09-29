package types

import (
	"errors"
	"time"
)

var (
	ErrorTest = errors.New("test")
)

type CreateXboxData struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	XboxType        string    `json:"xbox_type"`
	XboxColour      string    `json:"xbox_colour"`
	MotherboardType string    `json:"motherboard_type"`
	SerialNumber    string    `json:"serial_number"`
	MfrDate         time.Time `json:"mfr_date"`
	Model           string    `json:"model"`
	NandSize        string    `json:"nand_size"`
	RghVersion      string    `json:"rgh_version"`
	RghGlitchType   string    `json:"rgh_glitch_type"`
	Images          []string  `json:"images"` // Urls
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}