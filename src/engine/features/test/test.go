package test

type Config struct {}

type Test interface{}

type test struct {}

func New(cfg *Config) Test {
	return &test{}
}