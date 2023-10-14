package payment

import (
	"errors"
	env "zvyezda/src/engine/pkg/env"

	stripe "github.com/stripe/stripe-go/v75"
	"github.com/stripe/stripe-go/v75/checkout/session"
)

type Config struct{}

type Payment interface{
	// TestCreateProduct()
	TestCreatePaymentLink() (*stripe.CheckoutSession, error)
}

type payment struct{}

func New(cfg *Config) Payment {
	return &payment{}
}

// EXAMPLE CODE
// stripe.Key = "sk_test_26PHem9AhJZvU623DfE1x4sd"

// 	product_params := &stripe.ProductParams{
// 		Name:        stripe.String("Starter Subscription"),
// 		Description: stripe.String("$12/Month subscription"),
// 	}
// 	starter_product, _ := product.New(product_params)

// 	price_params := &stripe.PriceParams{
// 		Currency: stripe.String(string(stripe.CurrencyUSD)),
// 		Product:  stripe.String(starter_product.ID),
// 		Recurring: &stripe.PriceRecurringParams{
// 			Interval: stripe.String(string(stripe.PriceRecurringIntervalMonth)),
// 		},
// 		UnitAmount: stripe.Int64(1200),
// 	}
// 	starter_price, _ := price.New(price_params)

// 	fmt.Println("Success! Here is your starter subscription product id: " + starter_product.ID)
// 	fmt.Println("Success! Here is your starter subscription price id: " + starter_price.ID)
// }

// func (p *payment) TestCreateProduct() {
// 	stripe.Key = env.EnvConfigs.StripeKey
// 	product_params := &stripe.ProductParams{
// 		Params: stripe.Params{},
// 		Name:        stripe.String("Starter Subscription"),
// 		Description: stripe.String("$12/Month subscription"),
// 	}
// 	starter_product, err := stripe.New(product_params)
	
// 	if err != nil {
// 		fmt.Println("Payment: Error creating product:", err)
// 		return
// 	}

// 	fmt.Println("Payment: Success! Here is your starter subscription product id:", starter_product.ID)
// }

func (p *payment) TestCreatePaymentLink() (*stripe.CheckoutSession, error) {
	stripe.Key = env.EnvConfigs.StripeKey

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String("price_1O15XXKepyV1QE691Iv16a6a"),				
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String("payment"),
		Metadata:  map[string]string{"bookingId": "76de738a-4c0f-45ba-b0d5-d0bb6e868d34"},
		SuccessURL: stripe.String("https://example.com/success"),
		CancelURL:  stripe.String("https://example.com/cancel"),
	}

	session, err := session.New(params)
	if err != nil {
		return nil, errors.New("Payment: Error creating payment link: " + err.Error())
	}

	return session, nil
}