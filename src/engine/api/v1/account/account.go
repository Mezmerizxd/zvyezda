package account

import (
	"zvyezda/src/engine/features"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/types"

	"github.com/gin-gonic/gin"
)

type Config struct {
	Features features.Features
}

type Account interface {
	Login(c *gin.Context)
	Create(c *gin.Context)
	Delete(c *gin.Context)
	Profile(c *gin.Context)
	UpdateProfile(c *gin.Context)
	Accounts(c *gin.Context)
	Authorize(c *gin.Context)
	Addresses(c *gin.Context)
	UpdateAddress(c *gin.Context)
	DeleteAddress(c *gin.Context)
	CreateAddress(c *gin.Context)
}

type account struct {
	Features features.Features
}

func New(cfg *Config) Account {
	return &account{
		Features: cfg.Features,
	}
}

/*
curl \
-X POST http://localhost:4000/api/v1/account/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"test\",\"password\":\"test\"}" 
*/
func (a *account) Login(c *gin.Context) {
	var data types.LoginAccountData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account, err := a.Features.Account.Login(data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
    "server": gin.H{
      "success": true,
      "error": nil,
    },
    "data": account,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/account/create \
-H "Content-Type: application/json" \
-d "{\"email\":\"test@test\", \"username\":\"test\",\"password\":\"test\"}" 
*/
func (a *account) Create(c *gin.Context) {
	var data types.CreateAccountData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account, err := a.Features.Account.Create(data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": account,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/account/delete \
-H "Content-Type: application/json" \
-d "{\"identifier\":\"token\", \"value\":\"test\"}" 
*/
func (a *account) Delete(c *gin.Context) {
	var data types.DeleteAccountData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	err := a.Features.Account.Delete(data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}
	
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": nil,
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/account/profile \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (a *account) Profile(c *gin.Context) {
	account := c.MustGet(types.AccountCtx).(*types.Account)

	filteredAccount := &types.Profile{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": filteredAccount,
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/account/profile/update \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d "{\"a\":\"a\", \"b\":\"b\"}" TODO: Setup curl data
*/
func (a *account) UpdateProfile(c *gin.Context) {
	var data types.Profile

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account := c.MustGet(types.AccountCtx).(*types.Account)

	updatedProfile, err := a.Features.Account.UpdateProfile(account, &data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": updatedProfile,
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/account/accounts \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (a *account) Accounts(c *gin.Context) {
	accounts, err := database.GetAllAccounts()
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": accounts,
	}) 
}

/*
curl \
-X GET http://localhost:4000/api/v1/account/authorize \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (a *account) Authorize(c *gin.Context) {
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": nil,
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/account/addresses \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (a *account) Addresses(c *gin.Context) {
	account := c.MustGet(types.AccountCtx).(*types.Account)

	addresses, err := a.Features.Account.GetAddresses(*account)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})	
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": addresses,
	})
}

/*
curl \
-X PATCH http://localhost:4000/api/v1/account/addresses/update \
-H "Content-Type: application/json" \
-H "Authorization: token"
-d "{\"a\":\"a\", \"b\":\"b\"}" TODO: Setup curl data
*/
func (a *account) UpdateAddress(c *gin.Context) {
	var data types.Address

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,	
		})
		return
	}

	account := c.MustGet(types.AccountCtx).(*types.Account)

	updatedAddress, err := a.Features.Account.UpdateAddress(*account, data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),	
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,	
		},
		"data": updatedAddress,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/account/addresses/delete \
-H "Content-Type: application/json" \
-H "Authorization: token"
-d "{\"a\":\"a\", \"b\":\"b\"}" TODO: Setup curl data
*/
func (a *account) DeleteAddress(c *gin.Context) {
	var data types.Address

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,	
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account := c.MustGet(types.AccountCtx).(*types.Account)

	if account.ID != data.AccountID {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,	
				"error": "you do not own this address",
			},
			"data": nil,
		})
		return
	}

	err := database.DeleteAddress(data.ID)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,	
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,	
			"error": nil,
		},
		"data": nil,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/account/addresses/create \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d "{\"a\":\"a\", \"b\":\"b\"}" TODO: Setup curl data
*/
func (a *account) CreateAddress(c *gin.Context) {
	var data types.Address

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,	
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account := c.MustGet(types.AccountCtx).(*types.Account)

	address, err := a.Features.Account.CreateAddress(*account, data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,	
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,	
			"error": nil,
		},
		"data": address,
	})
}