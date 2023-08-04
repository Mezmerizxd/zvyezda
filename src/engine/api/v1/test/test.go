package test

import (
	"fmt"

	"github.com/gin-gonic/gin"

	cfg "zvyezda/src/engine/configs/test"
	"zvyezda/src/engine/features"
)

type Config struct {
	Features features.Features
}

type Test interface {
	Login(c *gin.Context)
	Create(c *gin.Context)
}

type test struct {
	Features features.Features
}

func New(cfg *Config) Test {
	return &test{
		Features: cfg.Features,
	}
}

func (a *test) Login(c *gin.Context) {
	var data cfg.LoginData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": "Missing required fields"})
		return
	}

	fmt.Println("Login: ", data)

	account, err := a.Features.TestFeatures.Login(cfg.LoginData{
		Email: data.Email,
		Password: data.Password,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err})
	}

	fmt.Println("Account: ", account)

	c.JSON(200, gin.H{"message": "Login successful", "account": account})
}

func (a *test) Create(c *gin.Context) {
	var data cfg.CreateData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": "Missing required fields"})
		return
	}

	fmt.Println("Create: ", data)

	account, err := a.Features.TestFeatures.Create(cfg.CreateData{
		FirstName: data.FirstName,
		LastName: data.LastName,
		Email: data.Email,
		Password: data.Password,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err})
	}

	fmt.Println("Account: ", account)

	c.JSON(200, gin.H{"message": "Create successful", "account": account})
}
