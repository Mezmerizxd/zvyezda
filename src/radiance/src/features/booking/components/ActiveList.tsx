import { format } from 'date-fns';
import { Spinner, Table } from '../../../components/Elements';
import Calendar from '../../../components/Elements/Calendar/Calendar';

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

  return (
    <>
      <Table<Booking>
        data={bookingsQuery?.data ? bookingsQuery.data.filter((booking) => booking.confirmed) : []}
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
    </>
  );
};
