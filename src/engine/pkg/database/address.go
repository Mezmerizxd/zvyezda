package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllAddressesByAccountID(accountID string) (*[]types.Address, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, street, city, state, country, "postalCode", "accountId" FROM public."Address" WHERE "accountId" = $1`
	rows, err := connection.Query(query, accountID)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var addresses []types.Address

	for rows.Next() {
		var address types.Address
		err := rows.Scan(&address.ID, &address.Street, &address.City, &address.State, &address.Country, &address.PostalCode, &address.AccountID)
		if err != nil {
			fmt.Println("GetAllAddressesByAccountID:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		addresses = append(addresses, address)
	}

	return &addresses, nil
}

func GetAddressByID(addressID string) (*types.Address, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, street, city, state, country, "postalCode", "accountId" FROM public."Address" WHERE id = $1`
	row := connection.QueryRow(query, addressID)

	var address types.Address
	err := row.Scan(&address.ID, &address.Street, &address.City, &address.State, &address.Country, &address.PostalCode, &address.AccountID)
	if err != nil {
		fmt.Println("GetAddressByID:", err)
		return nil, types.ErrorFailedToScanQueryResult
	}

	return &address, nil
}

func CreateAddress(address *types.Address) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `INSERT INTO public."Address" (id, street, city, state, country, "postalCode", "accountId") VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := connection.Exec(query, address.ID, address.Street, address.City, address.State, address.Country, address.PostalCode, address.AccountID)
	if err != nil {
		fmt.Println("CreateAddress:", err)
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}

func DeleteAddress(addressID string) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `DELETE FROM public."Address" WHERE id=$1`
	_, err := connection.Exec(query, addressID)
	if err != nil {
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}

func UpdateAddress(address *types.Address) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `UPDATE public."Address" SET street=$1, city=$2, state=$3, country=$4, "postalCode"=$5 WHERE id=$6`
	_, err := connection.Exec(query, address.Street, address.City, address.State, address.Country, address.PostalCode, address.ID)
	if err != nil {
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}