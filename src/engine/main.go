package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	v1 "zvyezda/src/engine/api/v1"
	"zvyezda/src/engine/features"
	"zvyezda/src/engine/features/account"
	"zvyezda/src/engine/features/xbox"
	"zvyezda/src/engine/pkg/database"
	env "zvyezda/src/engine/pkg/env"
	"zvyezda/src/engine/pkg/server"
)

func main() {
	fmt.Println("Engine startup sequence initiated...")

	/* Env */
	env.InitEnvConfigs()

	go database.Start(env.EnvConfigs.DatabaseHost)

	/* Features */
	featAccount := account.New(&account.Config{})
	featXbox := xbox.New(&xbox.Config{})
	f := features.New(&features.Config{
		Account: featAccount,
		Xbox: featXbox,
	})

	srv := server.New(env.EnvConfigs.Port, &v1.Config{
		Features: &f,
	})

	quitChannel := make(chan bool, 1)

	go func() {
		if err := srv.Start(); err != nil {
			select {
			case <-quitChannel:
				return
			default:
				fmt.Println("Server: failed to start server: " + err.Error())
			}
		}
	}()

	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM)
	<-sc
	quitChannel <- true

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	if err := srv.Stop(ctx); err != nil {
		fmt.Println("Server: failed to stop server: " + err.Error())
	}

	database.Stop()

	fmt.Println("Aborting...")
}
