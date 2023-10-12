package env

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"github.com/spf13/viper"
)

var EnvConfigs *EnvironmentConfig
var ServerConfigs *PackageConfig
var WebConfigs *PackageConfig

func InitEnvConfigs() {
	EnvConfigs = loadEnvVariables()
	ServerConfigs = fetchDataFromPackages("../server/package.json")
	WebConfigs = fetchDataFromPackages("../web/package.json")
}

type EnvironmentConfig struct {
	Mode string `mapstructure:"MODE"`
	Port string `mapstructure:"ENGINE_PORT"`
	DatabaseHost string `mapstructure:"DB_HOST"`
	SocketHost string `mapstructure:"SOCKET_HOST"`
	ServerHost string `mapstructure:"SERVER_HOST"`
	StreamHost string `mapstructure:"STREAM_HOST"`
	StripeKey string `mapstructure:"STRIPE_KEY"`
}

type PackageConfig struct {
	Version string `json:"version"`
}

func loadEnvVariables() (config *EnvironmentConfig) {
	viper.AddConfigPath("../../")

	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Configs: failed to load environment variables", err)
		return
	}

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
		return
	}
	return
}

func fetchDataFromPackages(path string) (config *PackageConfig) {
	file, err := os.Open(path)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}

	var packageData PackageConfig
	err = json.Unmarshal(data, &packageData)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}

	return &packageData
}