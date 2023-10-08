import { Spinner, Table } from '../../../components/Elements';

import { useBookings } from '../api/getBookings';

export const ActiveList = () => {
  const bookingsQuery = useBookings();

  if (bookingsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bookingsQuery.data) return null;

  return (
    <Table<Booking>
      data={bookingsQuery.data.filter((booking) => booking.confirmed)}
      columns={[
        {
          title: 'ID',
          field: 'id',
        },
        {
          title: 'Username',
          field: 'account',
          Cell({ entry: { account } }) {
            return <span>{account.username}</span>;
          },
        },
        {
          title: 'Address',
          field: 'address',
          Cell({ entry: { address } }) {
            return (
              <span>
                {address.street}, {address.city}, {address.postalCode}
              </span>
            );
          },
        },
        {
          title: 'Type',
          field: 'serviceType',
        },
        {
          title: 'Date',
          field: 'date',
          Cell({ entry: { date } }) {
            return <span>{new Date(date.toString()).toLocaleString()}</span>;
          },
        },
        {
          title: 'Paid',
          field: 'paid',
          Cell({ entry: { paid } }) {
            return paid ? (
              <span className="text-green-600 font-bold">Yes</span>
            ) : (
              <span className="text-red-600 font-bold">No</span>
            );
          },
        },
      ]}
    />
  );
};
