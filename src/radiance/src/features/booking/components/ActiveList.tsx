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
          title: 'Type',
          field: 'price',
          Cell({ entry: { price } }) {
            let priceText;
            switch (price) {
              case 1:
                priceText = 'Quick';
                break;
              case 2:
                priceText = 'Normal';
                break;
              case 3:
                priceText = 'Extra';
                break;
              default:
                priceText = '';
                break;
            }
            return <span>{priceText}</span>;
          },
        },
        {
          title: 'Date',
          field: 'date',
          Cell({ entry: { date } }) {
            return <span>{new Date(date.toString()).toLocaleString()}</span>;
          },
        },
        {
          title: 'Created At',
          field: 'createdAt',
          Cell({ entry: { createdAt } }) {
            return <span>{new Date(createdAt.toString()).toLocaleString()}</span>;
          },
        },
      ]}
    />
  );
};
