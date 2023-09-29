package xbox

import (
	"zvyezda/src/engine/features"

	"github.com/gin-gonic/gin"
)

type Config struct {
	Features features.Features
}

type Xbox interface {
	Create(c *gin.Context)
	Edit(c *gin.Context)
	Delete(c *gin.Context)
	GetAll(c *gin.Context)
}

type xbox struct {
	Features features.Features
}

func New(cfg *Config) Xbox {
	return &xbox{
		Features: cfg.Features,
	}
}

func (x *xbox) Create(c *gin.Context) {}

func (x *xbox) Edit(c *gin.Context) {}

func (x *xbox) Delete(c *gin.Context) {}

func (x *xbox) GetAll(c *gin.Context) {}