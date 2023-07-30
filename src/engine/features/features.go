package features

import (
	"zvyezda/src/engine/features/test"
)

type Config struct {
	Test test.Test
}

type Features struct {
	TestFeatures test.Test
}

func New(cfg *Config) Features {
	return Features{
		TestFeatures: cfg.Test,
	}
}
