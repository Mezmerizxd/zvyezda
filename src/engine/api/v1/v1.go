package v1

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/stripe/stripe-go/webhook"

	"zvyezda/src/engine/api/v1/account"
	"zvyezda/src/engine/api/v1/xbox"
	"zvyezda/src/engine/features"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/pkg/env"
	"zvyezda/src/engine/types"
)

type Config struct {
	Features *features.Features
}

func New(handler *gin.Engine, upgrader *websocket.Upgrader, cfg *Config) {
	v1 := handler.Group("/api/v1")
	{
		// Controllers
		account := account.New(&account.Config{
			Features: *cfg.Features,
		})
		xbox := xbox.New(&xbox.Config{
			Features: *cfg.Features,
		})

		// Routes
		v1.GET("/get-version", GetVersion)
		v1.GET("/get-socket-details", GetSocketDetails)

		// Webhooks
		v1.POST("/webhook/stripe", Stripe)

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
	}

	ws := handler.Group("/ws") 
	{
		ws.GET("/connect", func(c *gin.Context) {
			conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
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

			go func() {
				{
					defer conn.Close()
				
					token := c.GetHeader("Authorization")
					if token == "" {
						conn.WriteMessage(websocket.TextMessage, []byte(types.ErrorTokenIsNil.Error()))
						return
					}
				
					for {
						account, err := database.GetAccountByToken(token)
						if err != nil {
							conn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
							return
						}
				
						valid, err := cfg.Features.Account.ValidateToken(*account)
						if err != nil && !valid {
							conn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
							return
						}
				
						messageType, p, err := conn.ReadMessage()
						if err != nil {
							return
						}
				
						_ = messageType
						_ = p
						if string(p) == "ping" {
							conn.WriteMessage(messageType, []byte(token))
						}
					}
				}
			}()
		})
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

func Stripe(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(503, gin.H{"error": err.Error()})
		return
	}

	endpointSecret := env.EnvConfigs.StripeWebhookKey

	event, err := webhook.ConstructEvent(payload, c.GetHeader("Stripe-Signature"), endpointSecret)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

  if event.Data != nil {
    fmt.Println("Event Data is not nil")

    if event.Data.Object != nil {
      fmt.Println("Event Data Object is not nil")

      if event.Data.Object["metadata"] != nil {
        fmt.Println("Event Data Object Metadata is not nil")

        if event.Data.Object["metadata"].(map[string]interface{})["bookingId"] != nil {
          fmt.Println("Event Data Object Metadata BookingID is not nil")

          bookingID := event.Data.Object["metadata"].(map[string]interface{})["bookingId"].(string)
          fmt.Println("BookingID: ", bookingID)
        }
      }
    }
  }

	switch event.Type {
	case "payment_intent.succeeded":
		// Use bookingID here
		c.JSON(http.StatusOK, gin.H{"status": "success"})
	default:
		c.JSON(http.StatusOK, gin.H{"status": "success"})
	}
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
