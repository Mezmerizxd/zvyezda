package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllBookings() (*[]types.Booking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, date, price, "serviceType", paid, confirmed, "accountId", "addressId", "createdAt" FROM public."Bookings"`
	rows, err := connection.Query(query)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.Booking

	for rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.Confirmed, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		bookings = append(bookings, booking)
	}

	return &bookings, nil
}

func GetBookingByID(id string) (*types.Booking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, date, price, "serviceType", paid, confirmed, "accountId", "addressId", "createdAt" FROM public."Bookings" WHERE id = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		fmt.Println("Database:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.Confirmed, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		return &booking, nil
	} else {
		return nil, types.ErrorBookingDoesNotExist
	}
}

func GetAllBookingsByAccoundID(id string) (*[]types.Booking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, date, price, "serviceType", paid, confirmed, "accountId", "addressId", "createdAt" FROM public."Bookings" WHERE "accountId" = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.Booking

	for rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.Confirmed, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		bookings = append(bookings, booking)
	}

	return &bookings, nil
}

func CreateBooking(booking types.Booking) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `INSERT INTO public."Bookings" (id, date, price, "serviceType", paid, confirmed, "accountId", "addressId", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())`
	_, err := connection.Exec(query, booking.ID, booking.Date, booking.Price, booking.ServiceType, booking.Paid, booking.Confirmed, booking.AccountID, booking.AddressID,)
	if err != nil {
		fmt.Println("CreateBooking:", err)
		return types.ErrorFailedToInsertDatabase
	}
	
	return nil
}

func DeleteBookingByID(id string) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `DELETE FROM public."Bookings" WHERE id = $1`
	_, err := connection.Exec(query, id)
	if err != nil {
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}

func UpdateBooking(booking types.Booking) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `UPDATE public."Bookings" SET id=$1, date=$2, price=$3, "serviceType"=$4, paid=$5, confirmed=$6, "accountId"=$7, "addressId"=$8, "createdAt"=$9 WHERE id=$10`
	_, err := connection.Exec(query, booking.ID, booking.Date, booking.Price, booking.ServiceType, booking.Paid, booking.Confirmed, booking.AccountID, booking.AddressID, booking.CreatedAt, booking.ID)
	if err != nil {
		fmt.Println("Database:", err)
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}