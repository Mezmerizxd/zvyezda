package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	v1 "zvyezda/src/engine/api/v1"
	env "zvyezda/src/engine/pkg/env"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	server *http.Server
}

func New(addr string, cfg *v1.Config) *Server {
	if cfg.Features != nil {
		fmt.Println("Server: found Features")
	}

	if env.EnvConfigs.Mode == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	handler := gin.Default()

	// Middleware
	handler.Use(gin.Recovery())
	handler.Use(gin.Logger())
	handler.Use(gin.ErrorLogger())
	handler.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"*"},
    AllowMethods:     []string{"*"},
    AllowHeaders:     []string{"*"},
    ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin"},
    AllowCredentials: true,
    AllowOriginFunc: func(origin string) bool {
      return origin == "https://github.com"
    },
    MaxAge: 12 * time.Hour,
  }))

	// API Controllers
	v1.New(handler, cfg)

	return &Server{
		server: &http.Server{
			Addr:    addr,
			Handler: handler,
		},
	}
}

func (s *Server) Start() error {
	fmt.Println("Server: starting at http://localhost" + s.server.Addr)
	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	fmt.Println("Server: shutting down")
	return s.server.Shutdown(ctx)
}
