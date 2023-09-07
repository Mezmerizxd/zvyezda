package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllAccounts() (*[]types.Account, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, email, username, password, role, token, "tokenExp", avatar, biography, "createdAt", "updatedAt" FROM public."Accounts"`
	rows, err := connection.Query(query)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var accounts []types.Account

	for rows.Next() {
		var acc types.Account
		err := rows.Scan(&acc.ID, &acc.Email, &acc.Username, &acc.Password, &acc.Role, &acc.Token, &acc.TokenExp, &acc.Avatar, &acc.Biography, &acc.CreatedAt, &acc.UpdatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		accounts = append(accounts, acc)
	}

	return &accounts, nil
}

func GetAccountBy(key types.AccountSearchParameter, value string) (*types.Account, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, email, username, password, role, token, "tokenExp", avatar, biography, "createdAt", "updatedAt" FROM public."Accounts" WHERE ` + key.String() + ` = $1`
	rows, err := connection.Query(query, value)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Next() {
		var acc types.Account
		err := rows.Scan(&acc.ID, &acc.Email, &acc.Username, &acc.Password, &acc.Role, &acc.Token, &acc.TokenExp, &acc.Avatar, &acc.Biography, &acc.CreatedAt, &acc.UpdatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		return &acc, nil
	} else {
		return nil, types.ErrorAccountDoesNotExist
	}
}

func GetAccountByID(id string) (*types.Account, error) {
	return GetAccountBy(types.AccountSearchParameter(types.ID), id)
}

func GetAccountByUsername(username string) (*types.Account, error) {
	return GetAccountBy(types.AccountSearchParameter(types.Username), username)
}

func GetAccountByEmail(email string) (*types.Account, error) {
	return GetAccountBy(types.AccountSearchParameter(types.Email), email)
}

func GetAccountByToken(token string) (*types.Account, error) {
	return GetAccountBy(types.AccountSearchParameter(types.Token), token)
}

func UpdateAccount(account types.Account) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `UPDATE public."Accounts" SET email=$1, username=$2, password=$3, role=$4, token=$5, "tokenExp"=$6, avatar=$7, biography=$8, "updatedAt"=now() WHERE id=$9`
	_, err := connection.Exec(query, account.Email, account.Username, account.Password, account.Role, account.Token, account.TokenExp, account.Avatar, account.Biography, account.ID)
	if err != nil {
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}

func CreateAccount(account types.Account) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `INSERT INTO public."Accounts" (id, email, username, password, role, token, "tokenExp", avatar, biography, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())`
	_, err := connection.Exec(query, account.ID, account.Email, account.Username, account.Password, account.Role, account.Token, account.TokenExp, account.Avatar, account.Biography)
	if err != nil {
		return types.ErrorFailedToInsertDatabase
	}
	
	return nil
}

func DeleteAccountBy(key types.AccountSearchParameter, value string) (error) {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `DELETE FRON public."Accounts" WHERE ` + key.String() + ` = $1`
	rows, err := connection.Query(query, value)
	if err != nil {
		return types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Err() != nil {
		return rows.Err()
	}

	return nil
}

func DeleteAccountByID(id string) (error) {
	return DeleteAccountBy(types.AccountSearchParameter(types.ID), id)
}

func DeleteAccountByUsername(username string) (error) {
	return DeleteAccountBy(types.AccountSearchParameter(types.Username), username)
}

func DeleteAccountByEmail(email string) (error) {
	return DeleteAccountBy(types.AccountSearchParameter(types.Email), email)
}

func DeleteAccountByToken(token string) (error) {
	return DeleteAccountBy(types.AccountSearchParameter(types.Token), token)
}