package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllXboxs() (*[]types.Xbox, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, title, description, xboxType, xboxColour, motherboardType, serialNumber, "mfrDate", model, nandSize, rghVersion, rghGlitchType, images "createdAt", "updatedAt" FROM public."HackedXboxs"`
	rows, err := connection.Query(query)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var xboxs []types.Xbox

	for rows.Next() {
		var xbox types.Xbox
		err := rows.Scan(&xbox.ID, &xbox.Title, &xbox.Description, &xbox.XboxType, &xbox.XboxColour, &xbox.MotherboardType, &xbox.SerialNumber, &xbox.MfrDate, &xbox.Model, &xbox.NandSize, &xbox.RghVersion, &xbox.RghGlitchType, &xbox.Images, &xbox.CreatedAt, &xbox.UpdatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		xboxs = append(xboxs, xbox)
	}

	return &xboxs, nil
}