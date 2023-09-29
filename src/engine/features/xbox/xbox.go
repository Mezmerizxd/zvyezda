package xbox

import (
	"zvyezda/src/engine/types"
)

type Config struct{}

type Xbox interface {
	GetAll() (*[]types.Xbox, error)
	Create(data types.CreateXboxData) (*types.Xbox, error)
	Delete(id string) (error)
	Edit(id string, data types.CreateXboxData) (*types.Xbox, error)
}

type xbox struct{}

func New(cfg *Config) Xbox {
	return &xbox{}
}

func (x *xbox) GetAll() (*[]types.Xbox, error) {
	return nil, nil
}

func (x *xbox) Create(data types.CreateXboxData) (*types.Xbox, error) { 
	return nil, nil
}

func (x *xbox) Delete(id string) (error) {
	return nil
}

func (x *xbox) Edit(id string, data types.CreateXboxData) (*types.Xbox, error) {
	return nil, nil
}