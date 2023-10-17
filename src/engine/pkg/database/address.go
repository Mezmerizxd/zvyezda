package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllAddresses() (*[]types.Address, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	rows, err := connection.Query(`
		SELECT 
			id, 
			street, 
			city, 
			state, 
			country, 
			"postalCode", 
			"accountId" 
		FROM 
			public."Address"
	`)
	if err != nil {
		fmt.Println("Database, GetAllAddresses:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var addresses []types.Address

	for rows.Next() {
		var address types.Address
		err := rows.Scan(
			&address.ID, 
			&address.Street, 
			&address.City, 
			&address.State, 
			&address.Country, 
			&address.PostalCode, 
			&address.AccountID,
		)
		if err != nil {
			fmt.Println("Database, GetAllAddresses:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		addresses = append(addresses, address)
	}

	return &addresses, nil
}

func GetAllAddressesByAccountID(accountID string) (*[]types.Address, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	rows, err := connection.Query(`
		SELECT 
			id, 
			street, 
			city, 
			state, 
			country, 
			"postalCode", 
			"accountId" 
		FROM 
			public."Address" 
		WHERE 
			"accountId" = $1
	`, accountID)
	if err != nil {
		fmt.Println("Database, GetAllAddressesByAccountID:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var addresses []types.Address

	for rows.Next() {
		var address types.Address
		err := rows.Scan(
			&address.ID, 
			&address.Street, 
			&address.City, 
			&address.State, 
			&address.Country, 
			&address.PostalCode, 
			&address.AccountID,
		)
		if err != nil {
			fmt.Println("Database, GetAllAddressesByAccountID:", err)
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

	rows, err := connection.Query(`
		SELECT 
			id, 
			street, 
			city, 
			state, 
			country, 
			"postalCode", 
			"accountId" 
		FROM 
			public."Address" 
		WHERE 
		id = $1
	`, addressID)
	if err != nil {
		fmt.Println("Database, GetAddressByID:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Next() {
		var address types.Address
		err := rows.Scan(
			&address.ID, 
			&address.Street, 
			&address.City, 
			&address.State, 
			&address.Country, 
			&address.PostalCode, 
			&address.AccountID,
		)
		if err != nil {
			fmt.Println("Database, GetAddressByID:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		return &address, nil
	} else {
		return nil, types.ErrorAddressDoesNotExist
	}
}

func CreateAddress(address *types.Address) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	_, err := connection.Exec(`
		INSERT INTO 
			public."Address" (
				id, 
				street, 
				city, 
				state, 
				country, 
				"postalCode", 
				"accountId"
			) 
		VALUES (
			$1, 
			$2, 
			$3, 
			$4, 
			$5, 
			$6, 
			$7
		)
	`, 
	address.ID, 
	address.Street, 
	address.City, 
	address.State, 
	address.Country, 
	address.PostalCode, 
	address.AccountID,
)
	if err != nil {
		fmt.Println("Database, CreateAddress:", err)
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}

func DeleteAddress(addressID string) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	_, err := connection.Exec(`
		DELETE FROM 
			public."Address" 
		WHERE 
			id=$1`, 
	addressID,
	)
	if err != nil {
		fmt.Println("Database, DeleteAddress:", err)
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}

func UpdateAddress(address *types.Address) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	_, err := connection.Exec(`
	UPDATE 
		public."Address" 
	SET 
		street=$1, 
		city=$2, 
		state=$3, 
		country=$4, 
		"postalCode"=$5 
	WHERE 
		id=$6`, 
	address.Street, 
	address.City, 
	address.State, 
	address.Country, 
	address.PostalCode, 
	address.ID,
)
	if err != nil {
		fmt.Println("Database, UpdateAddress:", err)
		return types.ErrorFailedToQueryDatabase
	}

	return nil
}