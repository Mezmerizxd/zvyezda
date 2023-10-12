package payment

import (
	"fmt"
	env "zvyezda/src/engine/pkg/env"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/product"
)

type Config struct{}

type Payment interface{
	Test()
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

func (p *payment) Test() {
	stripe.Key = env.EnvConfigs.StripeKey
	product_params := &stripe.ProductParams{
		Params: stripe.Params{},
		Name:        stripe.String("Starter Subscription"),
		Description: stripe.String("$12/Month subscription"),
	}
	starter_product, err := product.New(product_params)
	if err != nil {
		fmt.Println("Payment: Error creating product:", err)
		return
	}

	fmt.Println("Payment: Success! Here is your starter subscription product id:", starter_product.ID)
}