package v1

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/stripe/stripe-go/webhook"

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
		booking := booking.New(&booking.Config{
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

		/* Bookings */
		v1.GET("/bookings/get-all", UseAuthorization(cfg, booking.GetAllBookings, &types.UserRole))
		v1.GET("/bookings/get", UseAuthorization(cfg, booking.GetAllBookingsByAccountID, &types.UserRole))
		v1.POST("/bookings/create", UseAuthorization(cfg, booking.Create, &types.UserRole))
		v1.POST("/bookings/cancel", UseAuthorization(cfg, booking.Cancel, &types.UserRole))
		v1.POST("/bookings/is-date-booked", UseAuthorization(cfg, booking.IsDateBooked, &types.UserRole))
		v1.PATCH("/bookings/confirm", UseAuthorization(cfg, booking.ConfirmBooking, &types.AdminRole))
		v1.PATCH("/bookings/confirm-payment", UseAuthorization(cfg, booking.ConfirmBookingPayment, &types.AdminRole))
		v1.PATCH("/bookings/reschedule", UseAuthorization(cfg, booking.RescheduleBooking, &types.UserRole))
		v1.PATCH("/bookings/reschedule-confirmed", UseAuthorization(cfg, booking.RescheduleConfirmedBooking, &types.AdminRole))
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

	switch event.Type {
	case "payment_intent.succeeded":
		paymentIntent := event.Data.Object
		bookingID := paymentIntent["metadata"].(map[string]interface{})["bookingId"].(string)
		fmt.Println("PaymentIntent was successful! Booking ID: " + bookingID)
		// Use bookingID here
		c.JSON(http.StatusOK, gin.H{"status": "success"})
	case "account.updated":
    // Then define and call a function to handle the event account.updated
  case "account.application.authorized":
    // Then define and call a function to handle the event account.application.authorized
  case "account.application.deauthorized":
    // Then define and call a function to handle the event account.application.deauthorized
  case "account.external_account.created":
    // Then define and call a function to handle the event account.external_account.created
  case "account.external_account.deleted":
    // Then define and call a function to handle the event account.external_account.deleted
  case "account.external_account.updated":
    // Then define and call a function to handle the event account.external_account.updated
  case "application_fee.created":
    // Then define and call a function to handle the event application_fee.created
  case "application_fee.refunded":
    // Then define and call a function to handle the event application_fee.refunded
  case "application_fee.refund.updated":
    // Then define and call a function to handle the event application_fee.refund.updated
  case "balance.available":
    // Then define and call a function to handle the event balance.available
  case "billing_portal.configuration.created":
    // Then define and call a function to handle the event billing_portal.configuration.created
  case "billing_portal.configuration.updated":
    // Then define and call a function to handle the event billing_portal.configuration.updated
  case "billing_portal.session.created":
    // Then define and call a function to handle the event billing_portal.session.created
  case "capability.updated":
    // Then define and call a function to handle the event capability.updated
  case "cash_balance.funds_available":
    // Then define and call a function to handle the event cash_balance.funds_available
  case "charge.captured":
    // Then define and call a function to handle the event charge.captured
  case "charge.expired":
    // Then define and call a function to handle the event charge.expired
  case "charge.failed":
    // Then define and call a function to handle the event charge.failed
  case "charge.pending":
    // Then define and call a function to handle the event charge.pending
  case "charge.refunded":
    // Then define and call a function to handle the event charge.refunded
  case "charge.succeeded":
    // Then define and call a function to handle the event charge.succeeded
  case "charge.updated":
    // Then define and call a function to handle the event charge.updated
  case "charge.dispute.closed":
    // Then define and call a function to handle the event charge.dispute.closed
  case "charge.dispute.created":
    // Then define and call a function to handle the event charge.dispute.created
  case "charge.dispute.funds_reinstated":
    // Then define and call a function to handle the event charge.dispute.funds_reinstated
  case "charge.dispute.funds_withdrawn":
    // Then define and call a function to handle the event charge.dispute.funds_withdrawn
  case "charge.dispute.updated":
    // Then define and call a function to handle the event charge.dispute.updated
  case "charge.refund.updated":
    // Then define and call a function to handle the event charge.refund.updated
  case "checkout.session.async_payment_failed":
    // Then define and call a function to handle the event checkout.session.async_payment_failed
  case "checkout.session.async_payment_succeeded":
    // Then define and call a function to handle the event checkout.session.async_payment_succeeded
  case "checkout.session.completed":
    // Then define and call a function to handle the event checkout.session.completed
  case "checkout.session.expired":
    // Then define and call a function to handle the event checkout.session.expired
  case "coupon.created":
    // Then define and call a function to handle the event coupon.created
  case "coupon.deleted":
    // Then define and call a function to handle the event coupon.deleted
  case "coupon.updated":
    // Then define and call a function to handle the event coupon.updated
  case "credit_note.created":
    // Then define and call a function to handle the event credit_note.created
  case "credit_note.updated":
    // Then define and call a function to handle the event credit_note.updated
  case "credit_note.voided":
    // Then define and call a function to handle the event credit_note.voided
  case "customer.created":
    // Then define and call a function to handle the event customer.created
  case "customer.deleted":
    // Then define and call a function to handle the event customer.deleted
  case "customer.updated":
    // Then define and call a function to handle the event customer.updated
  case "customer.discount.created":
    // Then define and call a function to handle the event customer.discount.created
  case "customer.discount.deleted":
    // Then define and call a function to handle the event customer.discount.deleted
  case "customer.discount.updated":
    // Then define and call a function to handle the event customer.discount.updated
  case "customer.source.created":
    // Then define and call a function to handle the event customer.source.created
  case "customer.source.deleted":
    // Then define and call a function to handle the event customer.source.deleted
  case "customer.source.expiring":
    // Then define and call a function to handle the event customer.source.expiring
  case "customer.source.updated":
    // Then define and call a function to handle the event customer.source.updated
  case "customer.subscription.created":
    // Then define and call a function to handle the event customer.subscription.created
  case "customer.subscription.deleted":
    // Then define and call a function to handle the event customer.subscription.deleted
  case "customer.subscription.paused":
    // Then define and call a function to handle the event customer.subscription.paused
  case "customer.subscription.pending_update_applied":
    // Then define and call a function to handle the event customer.subscription.pending_update_applied
  case "customer.subscription.pending_update_expired":
    // Then define and call a function to handle the event customer.subscription.pending_update_expired
  case "customer.subscription.resumed":
    // Then define and call a function to handle the event customer.subscription.resumed
  case "customer.subscription.trial_will_end":
    // Then define and call a function to handle the event customer.subscription.trial_will_end
  case "customer.subscription.updated":
    // Then define and call a function to handle the event customer.subscription.updated
  case "customer.tax_id.created":
    // Then define and call a function to handle the event customer.tax_id.created
  case "customer.tax_id.deleted":
    // Then define and call a function to handle the event customer.tax_id.deleted
  case "customer.tax_id.updated":
    // Then define and call a function to handle the event customer.tax_id.updated
  case "customer_cash_balance_transaction.created":
    // Then define and call a function to handle the event customer_cash_balance_transaction.created
  case "file.created":
    // Then define and call a function to handle the event file.created
  case "financial_connections.account.created":
    // Then define and call a function to handle the event financial_connections.account.created
  case "financial_connections.account.deactivated":
    // Then define and call a function to handle the event financial_connections.account.deactivated
  case "financial_connections.account.disconnected":
    // Then define and call a function to handle the event financial_connections.account.disconnected
  case "financial_connections.account.reactivated":
    // Then define and call a function to handle the event financial_connections.account.reactivated
  case "financial_connections.account.refreshed_balance":
    // Then define and call a function to handle the event financial_connections.account.refreshed_balance
  case "identity.verification_session.canceled":
    // Then define and call a function to handle the event identity.verification_session.canceled
  case "identity.verification_session.created":
    // Then define and call a function to handle the event identity.verification_session.created
  case "identity.verification_session.processing":
    // Then define and call a function to handle the event identity.verification_session.processing
  case "identity.verification_session.requires_input":
    // Then define and call a function to handle the event identity.verification_session.requires_input
  case "identity.verification_session.verified":
    // Then define and call a function to handle the event identity.verification_session.verified
  case "invoice.created":
    // Then define and call a function to handle the event invoice.created
  case "invoice.deleted":
    // Then define and call a function to handle the event invoice.deleted
  case "invoice.finalization_failed":
    // Then define and call a function to handle the event invoice.finalization_failed
  case "invoice.finalized":
    // Then define and call a function to handle the event invoice.finalized
  case "invoice.marked_uncollectible":
    // Then define and call a function to handle the event invoice.marked_uncollectible
  case "invoice.paid":
    // Then define and call a function to handle the event invoice.paid
  case "invoice.payment_action_required":
    // Then define and call a function to handle the event invoice.payment_action_required
  case "invoice.payment_failed":
    // Then define and call a function to handle the event invoice.payment_failed
  case "invoice.payment_succeeded":
    // Then define and call a function to handle the event invoice.payment_succeeded
  case "invoice.sent":
    // Then define and call a function to handle the event invoice.sent
  case "invoice.upcoming":
    // Then define and call a function to handle the event invoice.upcoming
  case "invoice.updated":
    // Then define and call a function to handle the event invoice.updated
  case "invoice.voided":
    // Then define and call a function to handle the event invoice.voided
  case "invoiceitem.created":
    // Then define and call a function to handle the event invoiceitem.created
  case "invoiceitem.deleted":
    // Then define and call a function to handle the event invoiceitem.deleted
  case "issuing_authorization.created":
    // Then define and call a function to handle the event issuing_authorization.created
  case "issuing_authorization.updated":
    // Then define and call a function to handle the event issuing_authorization.updated
  case "issuing_card.created":
    // Then define and call a function to handle the event issuing_card.created
  case "issuing_card.updated":
    // Then define and call a function to handle the event issuing_card.updated
  case "issuing_cardholder.created":
    // Then define and call a function to handle the event issuing_cardholder.created
  case "issuing_cardholder.updated":
    // Then define and call a function to handle the event issuing_cardholder.updated
  case "issuing_dispute.closed":
    // Then define and call a function to handle the event issuing_dispute.closed
  case "issuing_dispute.created":
    // Then define and call a function to handle the event issuing_dispute.created
  case "issuing_dispute.funds_reinstated":
    // Then define and call a function to handle the event issuing_dispute.funds_reinstated
  case "issuing_dispute.submitted":
    // Then define and call a function to handle the event issuing_dispute.submitted
  case "issuing_dispute.updated":
    // Then define and call a function to handle the event issuing_dispute.updated
  case "issuing_token.created":
    // Then define and call a function to handle the event issuing_token.created
  case "issuing_token.updated":
    // Then define and call a function to handle the event issuing_token.updated
  case "issuing_transaction.created":
    // Then define and call a function to handle the event issuing_transaction.created
  case "issuing_transaction.updated":
    // Then define and call a function to handle the event issuing_transaction.updated
  case "mandate.updated":
    // Then define and call a function to handle the event mandate.updated
  case "payment_intent.amount_capturable_updated":
    // Then define and call a function to handle the event payment_intent.amount_capturable_updated
  case "payment_intent.canceled":
    // Then define and call a function to handle the event payment_intent.canceled
  case "payment_intent.created":
    // Then define and call a function to handle the event payment_intent.created
  case "payment_intent.partially_funded":
    // Then define and call a function to handle the event payment_intent.partially_funded
  case "payment_intent.payment_failed":
    // Then define and call a function to handle the event payment_intent.payment_failed
  case "payment_intent.processing":
    // Then define and call a function to handle the event payment_intent.processing
  case "payment_intent.requires_action":
    // Then define and call a function to handle the event payment_intent.requires_action
  case "payment_link.created":
    // Then define and call a function to handle the event payment_link.created
  case "payment_link.updated":
    // Then define and call a function to handle the event payment_link.updated
  case "payment_method.attached":
    // Then define and call a function to handle the event payment_method.attached
  case "payment_method.automatically_updated":
    // Then define and call a function to handle the event payment_method.automatically_updated
  case "payment_method.detached":
    // Then define and call a function to handle the event payment_method.detached
  case "payment_method.updated":
    // Then define and call a function to handle the event payment_method.updated
  case "payout.canceled":
    // Then define and call a function to handle the event payout.canceled
  case "payout.created":
    // Then define and call a function to handle the event payout.created
  case "payout.failed":
    // Then define and call a function to handle the event payout.failed
  case "payout.paid":
    // Then define and call a function to handle the event payout.paid
  case "payout.reconciliation_completed":
    // Then define and call a function to handle the event payout.reconciliation_completed
  case "payout.updated":
    // Then define and call a function to handle the event payout.updated
  case "person.created":
    // Then define and call a function to handle the event person.created
  case "person.deleted":
    // Then define and call a function to handle the event person.deleted
  case "person.updated":
    // Then define and call a function to handle the event person.updated
  case "plan.created":
    // Then define and call a function to handle the event plan.created
  case "plan.deleted":
    // Then define and call a function to handle the event plan.deleted
  case "plan.updated":
    // Then define and call a function to handle the event plan.updated
  case "price.created":
    // Then define and call a function to handle the event price.created
  case "price.deleted":
    // Then define and call a function to handle the event price.deleted
  case "price.updated":
    // Then define and call a function to handle the event price.updated
  case "product.created":
    // Then define and call a function to handle the event product.created
  case "product.deleted":
    // Then define and call a function to handle the event product.deleted
  case "product.updated":
    // Then define and call a function to handle the event product.updated
  case "promotion_code.created":
    // Then define and call a function to handle the event promotion_code.created
  case "promotion_code.updated":
    // Then define and call a function to handle the event promotion_code.updated
  case "quote.accepted":
    // Then define and call a function to handle the event quote.accepted
  case "quote.canceled":
    // Then define and call a function to handle the event quote.canceled
  case "quote.created":
    // Then define and call a function to handle the event quote.created
  case "quote.finalized":
    // Then define and call a function to handle the event quote.finalized
  case "radar.early_fraud_warning.created":
    // Then define and call a function to handle the event radar.early_fraud_warning.created
  case "radar.early_fraud_warning.updated":
    // Then define and call a function to handle the event radar.early_fraud_warning.updated
  case "refund.created":
    // Then define and call a function to handle the event refund.created
  case "refund.updated":
    // Then define and call a function to handle the event refund.updated
  case "reporting.report_run.failed":
    // Then define and call a function to handle the event reporting.report_run.failed
  case "reporting.report_run.succeeded":
    // Then define and call a function to handle the event reporting.report_run.succeeded
  case "review.closed":
    // Then define and call a function to handle the event review.closed
  case "review.opened":
    // Then define and call a function to handle the event review.opened
  case "setup_intent.canceled":
    // Then define and call a function to handle the event setup_intent.canceled
  case "setup_intent.created":
    // Then define and call a function to handle the event setup_intent.created
  case "setup_intent.requires_action":
    // Then define and call a function to handle the event setup_intent.requires_action
  case "setup_intent.setup_failed":
    // Then define and call a function to handle the event setup_intent.setup_failed
  case "setup_intent.succeeded":
    // Then define and call a function to handle the event setup_intent.succeeded
  case "sigma.scheduled_query_run.created":
    // Then define and call a function to handle the event sigma.scheduled_query_run.created
  case "source.canceled":
    // Then define and call a function to handle the event source.canceled
  case "source.chargeable":
    // Then define and call a function to handle the event source.chargeable
  case "source.failed":
    // Then define and call a function to handle the event source.failed
  case "source.mandate_notification":
    // Then define and call a function to handle the event source.mandate_notification
  case "source.refund_attributes_required":
    // Then define and call a function to handle the event source.refund_attributes_required
  case "source.transaction.created":
    // Then define and call a function to handle the event source.transaction.created
  case "source.transaction.updated":
    // Then define and call a function to handle the event source.transaction.updated
  case "subscription_schedule.aborted":
    // Then define and call a function to handle the event subscription_schedule.aborted
  case "subscription_schedule.canceled":
    // Then define and call a function to handle the event subscription_schedule.canceled
  case "subscription_schedule.completed":
    // Then define and call a function to handle the event subscription_schedule.completed
  case "subscription_schedule.created":
    // Then define and call a function to handle the event subscription_schedule.created
  case "subscription_schedule.expiring":
    // Then define and call a function to handle the event subscription_schedule.expiring
  case "subscription_schedule.released":
    // Then define and call a function to handle the event subscription_schedule.released
  case "subscription_schedule.updated":
    // Then define and call a function to handle the event subscription_schedule.updated
  case "tax.settings.updated":
    // Then define and call a function to handle the event tax.settings.updated
  case "tax_rate.created":
    // Then define and call a function to handle the event tax_rate.created
  case "tax_rate.updated":
    // Then define and call a function to handle the event tax_rate.updated
  case "terminal.reader.action_failed":
    // Then define and call a function to handle the event terminal.reader.action_failed
  case "terminal.reader.action_succeeded":
    // Then define and call a function to handle the event terminal.reader.action_succeeded
  case "test_helpers.test_clock.advancing":
    // Then define and call a function to handle the event test_helpers.test_clock.advancing
  case "test_helpers.test_clock.created":
    // Then define and call a function to handle the event test_helpers.test_clock.created
  case "test_helpers.test_clock.deleted":
    // Then define and call a function to handle the event test_helpers.test_clock.deleted
  case "test_helpers.test_clock.internal_failure":
    // Then define and call a function to handle the event test_helpers.test_clock.internal_failure
  case "test_helpers.test_clock.ready":
    // Then define and call a function to handle the event test_helpers.test_clock.ready
  case "topup.canceled":
    // Then define and call a function to handle the event topup.canceled
  case "topup.created":
    // Then define and call a function to handle the event topup.created
  case "topup.failed":
    // Then define and call a function to handle the event topup.failed
  case "topup.reversed":
    // Then define and call a function to handle the event topup.reversed
  case "topup.succeeded":
    // Then define and call a function to handle the event topup.succeeded
  case "transfer.created":
    // Then define and call a function to handle the event transfer.created
  case "transfer.reversed":
    // Then define and call a function to handle the event transfer.reversed
  case "transfer.updated":
    // Then define and call a function to handle the event transfer.updated
  // ... handle other event types
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
