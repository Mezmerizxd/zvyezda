package database

import (
	"fmt"
	"zvyezda/src/engine/types"
)

func GetAllBookings() (*[]types.Booking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, date, price, "serviceType", paid, "timeSlot", "additionalNotes", "paymentIntentId", confirmed, "accountId", "addressId", "createdAt" FROM public."Bookings"`
	rows, err := connection.Query(query)
	if err != nil {
		fmt.Println("Database, GetAllBookings:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.Booking

	for rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.TimeSlot, &booking.AdditionalNotes, &booking.PaymentIntentID, &booking.Confirmed, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database, GetAllBookings:", err)
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

	query := `SELECT id, date, price, "serviceType", paid, "timeSlot", "additionalNotes", "paymentIntentId", confirmed, "accountId", "addressId", "createdAt" FROM public."Bookings" WHERE id = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		fmt.Println("Database, GetBookingByID:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	if rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.TimeSlot, &booking.AdditionalNotes, &booking.PaymentIntentID, &booking.Confirmed, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database, GetBookingByID:", err)
			return nil, types.ErrorFailedToScanQueryResult
		}

		return &booking, nil
	} else {
		return nil, types.ErrorBookingDoesNotExist
	}
}

func GetAllBookingsByAccountID(id string) (*[]types.Booking, error) {
	if connection == nil {
		return nil, types.ErrorFailedToConnectToDatabase
	}

	query := `SELECT id, date, price, "serviceType", paid, confirmed, "timeSlot", "additionalNotes", "paymentIntentId", "accountId", "addressId", "createdAt" FROM public."Bookings" WHERE "accountId" = $1`
	rows, err := connection.Query(query, id)
	if err != nil {
		fmt.Println("Database, GetAllBookingsByAccountID:", err)
		return nil, types.ErrorFailedToQueryDatabase
	}
	defer rows.Close()

	var bookings []types.Booking

	for rows.Next() {
		var booking types.Booking
		err := rows.Scan(&booking.ID, &booking.Date, &booking.Price, &booking.ServiceType, &booking.Paid, &booking.Confirmed, &booking.TimeSlot, &booking.AdditionalNotes, &booking.PaymentIntentID, &booking.AccountID, &booking.AddressID, &booking.CreatedAt)
		if err != nil {
			fmt.Println("Database, GetAllBookingsByAccountID:", err)
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

	query := `INSERT INTO public."Bookings" (id, date, price, "serviceType", paid, confirmed, "timeSlot", "additionalNotes", "paymentIntentId", "accountId", "addressId", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())`
	_, err := connection.Exec(query, booking.ID, booking.Date, booking.Price, booking.ServiceType, booking.Paid, booking.Confirmed, booking.TimeSlot, booking.AdditionalNotes, booking.PaymentIntentID, booking.AccountID, booking.AddressID,)
	if err != nil {
		fmt.Println("Database, CreateBooking:", err)
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
		fmt.Println("Database, DeleteBookingByID:", err)
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}

func UpdateBooking(booking types.Booking) error {
	if connection == nil {
		return types.ErrorFailedToConnectToDatabase
	}

	query := `UPDATE public."Bookings" SET id=$1, date=$2, price=$3, "serviceType"=$4, paid=$5, confirmed=$6, "timeSlot"=$7, "additionalNotes"=$8, "paymentIntentId"=$9, "accountId"=$10, "addressId"=$11, "createdAt"=$12 WHERE id=$13`
	_, err := connection.Exec(query, booking.ID, booking.Date, booking.Price, booking.ServiceType, booking.Paid, booking.Confirmed, booking.TimeSlot, booking.AdditionalNotes, booking.PaymentIntentID, booking.AccountID, booking.AddressID, booking.CreatedAt, booking.ID)
	if err != nil {
		fmt.Println("Database, UpdateBooking:", err)
		return types.ErrorFailedToUpdateDatabase
	}
	
	return nil
}