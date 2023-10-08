package v1

import (
	"github.com/gin-gonic/gin"

	"zvyezda/src/engine/api/v1/account"
	"zvyezda/src/engine/api/v1/booking"
	"zvyezda/src/engine/api/v1/xbox"
	"zvyezda/src/engine/features"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/pkg/env"
	"zvyezda/src/engine/types"
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
		xbox := xbox.New(&xbox.Config{
			Features: *cfg.Features,
		})
		booking := booking.New(&booking.Config{
			Features: *cfg.Features,
		})

		// Routes
		v1.GET("/get-version", GetVersion)
		v1.GET("/get-socket-details", GetSocketDetails)

		/* Account */
		v1.POST("/account/login", account.Login)
		v1.POST("/account/create", account.Create)
		v1.POST("/account/delete", UseAuthorization(cfg, account.Delete, &types.AdminRole))
		v1.GET("/account/profile", UseAuthorization(cfg, account.Profile, &types.UserRole))
		v1.PATCH("/account/profile/update", UseAuthorization(cfg, account.UpdateProfile, &types.UserRole))
		v1.GET("/account/accounts", UseAuthorization(cfg, account.Accounts, &types.AdminRole))
		v1.GET("/account/authorize", UseAuthorization(cfg, account.Authorize, &types.UserRole))
		v1.GET("/account/addresses", UseAuthorization(cfg, account.Addresses, &types.UserRole))
		v1.PATCH("/account/addresses/update", UseAuthorization(cfg, account.UpdateAddress, &types.UserRole))
		v1.POST("/account/addresses/delete", UseAuthorization(cfg, account.DeleteAddress, &types.UserRole))
		v1.POST("/account/addresses/create", UseAuthorization(cfg, account.CreateAddress, &types.UserRole))

		/* Xbox */
		v1.POST("/xbox/create", UseAuthorization(cfg, xbox.Create, &types.UserRole))
		v1.POST("/xbox/edit", UseAuthorization(cfg, xbox.Edit, &types.UserRole))
		v1.POST("/xbox/delete", UseAuthorization(cfg, xbox.Delete, &types.UserRole))
		v1.GET("/xbox/get-all", UseAuthorization(cfg, xbox.GetAll, &types.UserRole))

		/* Bookings */
		v1.GET("/bookings/get-all", UseAuthorization(cfg, booking.GetAllBookings, &types.UserRole))
		v1.GET("/bookings/get", UseAuthorization(cfg, booking.GetAllBookingsByAccountID, &types.UserRole))
		v1.POST("/bookings/create", UseAuthorization(cfg, booking.Create, &types.UserRole))
		v1.POST("/bookings/cancel", UseAuthorization(cfg, booking.Cancel, &types.UserRole))
		v1.POST("/bookings/is-date-booked", UseAuthorization(cfg, booking.IsDateBooked, &types.UserRole))
		v1.PATCH("/bookings/confirm", UseAuthorization(cfg, booking.ConfirmBooking, &types.AdminRole))
		v1.PATCH("/bookings/confirm-payment", UseAuthorization(cfg, booking.ConfirmBookingPayment, &types.AdminRole))
	}
}

/*
curl \
-X GET http://localhost:4000/api/v1/get-version \
-H "Content-Type: application/json" 
*/
func GetVersion(c *gin.Context) {
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": false,
			"error": nil,
		},
		"data": gin.H{
			"server": env.ServerConfigs.Version,
			"client": env.WebConfigs.Version,
		},
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/get-socket-details \
-H "Content-Type: application/json" 
*/
func GetSocketDetails(c *gin.Context) {
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": false,
			"error": nil,
		},
		"data": gin.H{
			"socketUrl": env.EnvConfigs.SocketHost,
		},
	})
}

func UseAuthorization(cfg *Config, handler gin.HandlerFunc, role *string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		account, err := database.GetAccountByToken(token)
		if err != nil {
			c.JSON(400, gin.H{
				"server": gin.H{
					"success": false,
					"error": err.Error(),
				},
				"data": nil,
			})

			c.Abort()
			return
		}

		valid, err := cfg.Features.Account.ValidateToken(*account)
		if err != nil && !valid {
			c.JSON(400, gin.H{
				"server": gin.H{
					"success": false,
					"error": err.Error(),
				},
				"data": nil,
			})

			c.Abort()
			return
		}

		if role != nil {
			authorized, err := cfg.Features.Account.HasAccess(*account, *role)
			if err != nil && !authorized {
				c.JSON(400, gin.H{
					"server": gin.H{
						"success": false,
						"error": err.Error(),
					},
					"data": nil,
				})

				c.Abort()
				return
			}
		}

		c.Set(types.AccountCtx, account)
		handler(c)
	}
}