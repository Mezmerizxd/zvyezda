package test

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"zvyezda/src/engine/features"
)

type Config struct {
	Features features.Features
}

type Test interface {
	TestingTesting(c *gin.Context)
}

type test struct {
	Features features.Features
}

func New(cfg *Config) Test {
	return &test{
		Features: cfg.Features,
	}
}

func (a *test) TestingTesting(c *gin.Context) {
	var data interface{}

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": "Missing required fields"})
		return
	}

	fmt.Println(data)

	c.JSON(200, gin.H{"message": "Testing Testing", "data": data})
}