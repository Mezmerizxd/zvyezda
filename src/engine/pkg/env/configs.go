package env

import (
	"log"

	"github.com/spf13/viper"
)

var EnvConfigs *envConfigs

func InitEnvConfigs() {
	EnvConfigs = loadEnvVariables()
}

type envConfigs struct {
	Mode string `mapstructure:"MODE"`
	Port string `mapstructure:"ENGINE_PORT"`
	DatabaseHost string `mapstructure:"DB_HOST"`
}

func loadEnvVariables() (config *envConfigs) {
	viper.AddConfigPath(".")

	viper.SetConfigName(".env")

	viper.SetConfigType("env")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Configs: failed to load environment variables", err)
	}

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}
	return
}