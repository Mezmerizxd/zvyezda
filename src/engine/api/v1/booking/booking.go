package booking

import (
	"zvyezda/src/engine/features"
	"zvyezda/src/engine/pkg/database"
	"zvyezda/src/engine/types"

	"github.com/gin-gonic/gin"
)

type Config struct {
	Features features.Features
}

type Booking interface {
	GetAllBookings(c *gin.Context)
	GetAllBookingsByAccountID(c *gin.Context)
	Create(c *gin.Context)
	Cancel(c *gin.Context)
	IsDateBooked(c *gin.Context)
	ConfirmBooking(c *gin.Context)
	ConfirmBookingPayment(c *gin.Context)
	RescheduleConfirmedBooking(c *gin.Context)
	RescheduleBooking(c *gin.Context)
}

type booking struct {
	Features features.Features
}

func New(cfg *Config) Booking {
	return &booking{
		Features: cfg.Features,
	}
}

/*
curl \
-X GET http://localhost:4000/api/v1/bookings/get-all \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (b *booking) GetAllBookings(c *gin.Context) {
	bookings, err := database.GetAllBookings()
	
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

	var fullBookings []types.FullBooking

	for _, booking := range *bookings {
		address, err := database.GetAddressByID(booking.AddressID)
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

		account, err := database.GetAccountByID(booking.AccountID)
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

		fullBooking := types.FullBooking{
			ID:          booking.ID,
			Date:        booking.Date,
			Price:       booking.Price,
			ServiceType: booking.ServiceType,
			Paid:        booking.Paid,
			Confirmed:   booking.Confirmed,
			Address:     *address,
			Account:     *account,
			CreatedAt:   booking.CreatedAt,
		}

		fullBookings = append(fullBookings, fullBooking)
	}
	
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBookings,
	})
}

/*
curl \
-X GET http://localhost:4000/api/v1/bookings/get \
-H "Content-Type: application/json" \
-H "Authorization: token"
*/
func (b *booking) GetAllBookingsByAccountID(c *gin.Context) {
	account := c.MustGet(types.AccountCtx).(*types.Account)

	bookings, err := database.GetAllBookingsByAccountID(account.ID)
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

	var fullBookings []types.FullBooking

	for _, booking := range *bookings {
		address, err := database.GetAddressByID(booking.AddressID)
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

		account, err := database.GetAccountByID(booking.AccountID)
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

		fullBooking := types.FullBooking{
			ID:          booking.ID,
			Date:        booking.Date,
			Price:       booking.Price,
			ServiceType: booking.ServiceType,
			Paid:        booking.Paid,
			Confirmed:   booking.Confirmed,
			Address:     *address,
			Account:     *account,
			CreatedAt:   booking.CreatedAt,
		}

		fullBookings = append(fullBookings, fullBooking)
	}
	
	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBookings,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/bookings/create \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "date": "2021-01-01T00:00:00.000Z", "type": 1 }' 
*/
func (b *booking) Create(c *gin.Context) {
	var data types.CreateBooking

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

	booking, err := b.Features.Booking.Create(data, *account)
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
			"error":   nil,
		},
		"data": booking,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/bookings/cancel \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "id": "id" }'
*/
func (b *booking) Cancel(c *gin.Context) {
	var data types.CancelBooking

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

	err := b.Features.Booking.Cancel(data.BookingID, *account)
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
			"error":   nil,
		},
		"data": nil,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/bookings/is-date-booked \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "date": "2021-01-01T00:00:00.000Z" }'
*/
func (b *booking) IsDateBooked(c *gin.Context) {
	var data types.IsDateBooked

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": false,
		})
		return
	}

	booked, err := b.Features.Booking.IsDateBooked(data.Date)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": false,
		})
		return
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": booked,
	})
}

/*
curl \
-X POST http://localhost:4000/api/v1/bookings/confirm \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "id": "id" }'
*/
func (b *booking) ConfirmBooking(c *gin.Context) {
	var data types.ConfirmBooking

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

	booking, err := b.Features.Booking.ConfirmBooking(data.BookingID)
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

	var fullBooking types.FullBooking

	address, err := database.GetAddressByID(booking.AddressID)
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

	account, err := database.GetAccountByID(booking.AccountID)
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

	fullBooking = types.FullBooking{
		ID:          booking.ID,
		Date:        booking.Date,
		Price:       booking.Price,
		ServiceType: booking.ServiceType,
		Paid:        booking.Paid,
		Confirmed:   booking.Confirmed,
		Address:     *address,
		Account:     *account,
		CreatedAt:   booking.CreatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBooking,
	})
} 

/*
curl \
-X POST http://localhost:4000/api/v1/bookings/confirm-payment \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "id": "id" }'
*/
func (b *booking) ConfirmBookingPayment(c *gin.Context) {
	var data types.ConfirmBookingPayment

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

	booking, err := b.Features.Booking.ConfirmBookingPayment(data.BookingID)
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

	var fullBooking types.FullBooking

	address, err := database.GetAddressByID(booking.AddressID)
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

	account, err := database.GetAccountByID(booking.AccountID)
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

	fullBooking = types.FullBooking{
		ID:          booking.ID,
		Date:        booking.Date,
		Price:       booking.Price,
		ServiceType: booking.ServiceType,
		Paid:        booking.Paid,
		Confirmed:   booking.Confirmed,
		Address:     *address,
		Account:     *account,
		CreatedAt:   booking.CreatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBooking,
	})
}

/*
curl \
-X PATCH http://localhost:4000/api/v1/bookings/reschedule-confirmed \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "bookingId": "id", "date": "2021-01-01T00:00:00.000Z" }'
*/
func (b *booking) RescheduleConfirmedBooking(c *gin.Context) {
	var data types.RescheduleConfirmedBooking

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	booking, err := b.Features.Booking.RescheduleConfirmedBooking(data.BookingID, data.Date)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	var fullBooking types.FullBooking

	address, err := database.GetAddressByID(booking.AddressID)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	account, err := database.GetAccountByID(booking.AccountID)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	fullBooking = types.FullBooking{
		ID:          booking.ID,
		Date:        booking.Date,
		Price:       booking.Price,
		ServiceType: booking.ServiceType,
		Paid:        booking.Paid,
		Confirmed:   booking.Confirmed,
		Address:     *address,
		Account:     *account,
		CreatedAt:   booking.CreatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBooking,
	})
}

/*
curl \
-X PATCH http://localhost:4000/api/v1/bookings/reschedule \
-H "Content-Type: application/json" \
-H "Authorization: token" \
-d '{ "bookingId": "id", "date": "2021-01-01T00:00:00.000Z" }'
*/
func (b *booking) RescheduleBooking(c *gin.Context) {
	var data types.RescheduleConfirmedBooking

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	booking, err := b.Features.Booking.RescheduleBooking(data.BookingID, data.Date)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	var fullBooking types.FullBooking

	address, err := database.GetAddressByID(booking.AddressID)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	account, err := database.GetAccountByID(booking.AccountID)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error":   err.Error(),
			},
			"data": nil,
		})
		return
	}

	fullBooking = types.FullBooking{
		ID:          booking.ID,
		Date:        booking.Date,
		Price:       booking.Price,
		ServiceType: booking.ServiceType,
		Paid:        booking.Paid,
		Confirmed:   booking.Confirmed,
		Address:     *address,
		Account:     *account,
		CreatedAt:   booking.CreatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error":   nil,
		},
		"data": fullBooking,
	})
}