package v1

import (
	"github.com/gin-gonic/gin"

	"zvyezda/src/engine/api/v1/account"
	"zvyezda/src/engine/features"
)

type Config struct {
	Features *features.Features
}

func New(handler *gin.Engine, cfg *Config) {
	v1 := handler.Group("/api/v1")
	{
		// Controllers
		account := account.New(&account.Config{
			Features: *cfg.Features,
		})

		// Routes

		v1.POST("/account/login", account.Login)
		v1.POST("/account/create", account.Create)
		v1.GET("/account/profile", account.Profile)
	}
}
