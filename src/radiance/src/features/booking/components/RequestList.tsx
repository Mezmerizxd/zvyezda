import { Spinner, Table } from '../../../components/Elements';

import { useBookings } from '../api/getBookings';

import { ConfirmRequest } from './ConfirmRequest';
import { CancelRequest } from './CancelRequest';

export const RequestList = () => {
  const bookingsQuery = useBookings();

  if (bookingsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Table<Booking>
      data={bookingsQuery?.data ? bookingsQuery.data.filter((booking) => !booking.confirmed) : []}
      columns={[
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
            return <span>{`${address.street} | ${address.city} | ${address.postalCode}`}</span>;
          },
        },
        {
          title: 'Type',
          field: 'serviceType',
          Cell({ entry: { serviceType } }) {
            let serviceTypeString = '';
            switch (serviceType) {
              case 0:
                serviceTypeString = 'Quick';
                break;
              case 1:
                serviceTypeString = 'Normal';
                break;
              case 2:
                serviceTypeString = 'Extra';
                break;
              default:
                serviceTypeString = 'Unknown';
                break;
            }
            return <span>{serviceTypeString}</span>;
          },
        },
        {
          title: 'Time Slot',
          field: 'timeSlot',
          Cell({ entry: { timeSlot } }) {
            let serviceTypeString = '';
            switch (timeSlot) {
              case 0:
                serviceTypeString = '8am - 10am';
                break;
              case 1:
                serviceTypeString = '11a - 1pm';
                break;
              case 2:
                serviceTypeString = '2pm - 4pm';
                break;
              case 3:
                serviceTypeString = '5pm - 7pm';
                break;
              default:
                serviceTypeString = 'Unknown';
                break;
            }
            return <span>{serviceTypeString}</span>;
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
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <ConfirmRequest bookingId={id} />;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <CancelRequest bookingId={id} />;
          },
        },
      ]}
    />
  );
};
