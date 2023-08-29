package database

import (
	"database/sql"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/lib/pq"
)

var connection *sql.DB = nil
var listener *pq.Listener = nil

var (
	minimumReconnect = 10 * time.Second
	maximumReconnect = time.Minute
)

func Start(url string) {
	fmt.Println("Database: connecting to database")

	url, err := filterDatabaseUrl(url + "&sslmode=disable")
	if err != nil {
		fmt.Println("Database: failed to filter url")
	}

	conn, err := sql.Open("postgres", "postgresql://" + url)
	if err != nil {
		fmt.Println("Database:", err.Error())
		Stop()
		return;
	}

	_, err = conn.Exec("SET search_path TO public")
	if err != nil {
		fmt.Println("Database:", err.Error())
		return
	}

	if connection == nil {
		connection = conn
	}

	reportProblem := func(ev pq.ListenerEventType, err error) {
		if err != nil {
			fmt.Println("Database:", err.Error())
		}
	}

	listener := pq.NewListener(url, minimumReconnect, maximumReconnect, reportProblem)
	err = listener.Listen("getwork")
	if err != nil {
		fmt.Println("Database:", err.Error())
		Stop()
		return
	}
}

func Stop() {
	connection.Close()
	listener.Close()

	connection = nil 
	listener = nil
}

func filterDatabaseUrl(connStr string) (string, error) {
	u, err := url.Parse(connStr)
	if err != nil {
			return "", err
	}

	q := u.Query()
	q.Del("schema")
	u.RawQuery = q.Encode()

	return strings.TrimPrefix(u.String(), "postgresql://"), nil
}