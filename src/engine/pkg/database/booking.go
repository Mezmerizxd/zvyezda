package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllBookings() (*[]types.ServiceBooking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, "accountId", date, price, confirmed, paid, "createdAt" FROM public."ServiceBookings"`
	rows, err := connection.Query(query)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.ServiceBooking

	for rows.Next() {
		var booking types.ServiceBooking
		err := rows.Scan(&booking.ID, &booking.AccountID, &booking.Date, &booking.Price, &booking.Confirmed, &booking.Paid, &booking.CreatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		bookings = append(bookings, booking)
	}

	return &bookings, nil
}

func GetBookingByID(id string) (*types.ServiceBooking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, "accountId", date, price, confirmed, paid, "createdAt" FROM public."ServiceBookings" WHERE id = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Next() {
		var booking types.ServiceBooking
		err := rows.Scan(&booking.ID, &booking.AccountID, &booking.Date, &booking.Price, &booking.Confirmed, &booking.Paid, &booking.CreatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		return &booking, nil
	} else {
		return nil, types.ErrorBookingDoesNotExist
	}
}

func GetAllBookingsByAccoundID(id string) (*[]types.ServiceBooking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, "accountId", date, price, confirmed, paid, "createdAt" FROM public."ServiceBookings" WHERE "accountId" = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.ServiceBooking

	for rows.Next() {
		var booking types.ServiceBooking
		err := rows.Scan(&booking.ID, &booking.AccountID, &booking.Date, &booking.Price, &booking.Confirmed, &booking.Paid, &booking.CreatedAt)
		if err != nil {
			fmt.Println(err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		bookings = append(bookings, booking)
	}

	return &bookings, nil
}

func CreateBooking(booking types.ServiceBooking) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `INSERT INTO public."ServiceBookings" (id, "accountId", date, price, confirmed, paid, "createdAt") VALUES ($1, $2, $3, $4, now())`
	_, err := connection.Exec(query, booking.ID, booking.AccountID, booking.Date, &booking.Confirmed, &booking.Paid, booking.CreatedAt)
	if err != nil {
		return types.ErrorFailedToInsertDatabase
	}
	
	return nil
}

func DeleteBookingByID(id string) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `DELETE FROM public."ServiceBookings" WHERE id = $1`
	_, err := connection.Exec(query, id)
	if err != nil {
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}

func UpdateBooking(booking *types.ServiceBooking) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `UPDATE public."ServiceBookings" SET "accountId"=$1, date=$2, price=$3, paid=$4, confirmed=$5, "createdAt"=now() WHERE id=$6`
	_, err := connection.Exec(query, booking.AccountID, booking.Date, booking.Price, booking.Paid, booking.Confirmed, booking.ID)
	if err != nil {
		fmt.Println(err)
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}