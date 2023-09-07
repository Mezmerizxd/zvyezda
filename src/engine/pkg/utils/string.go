package utils

import (
	"crypto/sha512"
	"encoding/hex"
	"math/rand"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandomStringBytes(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func StringToSha512(value string) string {
  hash := sha512.New()
  hash.Write([]byte(value))
  return hex.EncodeToString(hash.Sum(nil))
}

func GenerateToken() string {
	token := make([]byte, 64)
	_, err := rand.Read(token)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(token)
}