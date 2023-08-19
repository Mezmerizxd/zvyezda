package v1

import (
	"github.com/gin-gonic/gin"

	"zvyezda/src/engine/api/v1/test"
	"zvyezda/src/engine/features"
)

type Config struct {
	Features *features.Features
}

func New(handler *gin.Engine) {
	v1 := handler.Group("/api/v1")
	{
		// Controllers
		test := test.New(&test.Config{})

		// Routes
		v1.POST("/test/testing", test.TestingTesting)
	}
}
