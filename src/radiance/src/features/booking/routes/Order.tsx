import { format } from 'date-fns';
import { Spinner } from '../../../components/Elements';
import Calendar from '../../../components/Elements/Calendar/Calendar';
import { ContentLayout } from '../../../components/Layout';
import { Authorization, ROLES } from '../../../libs/authorization';
import { useBookings } from '../api/getBookings';
import { CreateOrder } from '../components/CreateOrder';

export const Order = () => {
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
    <ContentLayout title="Order">
      <div className="mt-4">
        <Authorization
          forbiddenFallback={<div>Only user can view this.</div>}
          allowedRoles={[ROLES.USER, ROLES.DEVELOPER, ROLES.ADMIN]}
        >
          <Calendar<Booking>
            entries={bookingsQuery.data.filter((booking) => booking.confirmed)}
            dateField="date"
            renderCell={(day) => {
              let isBooked = false;
              for (let i = 0; i < bookingsQuery.data.length; i++) {
                const booking = bookingsQuery.data[i];
                const bookingDate = new Date(booking.date);
                if (format(bookingDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')) {
                  isBooked = true;
                  return (
                    <>
                      <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
                        <p>Booked</p>
                      </div>
                      <div className="pt-1">
                        {booking.confirmed ? (
                          <div className="w-fit border p-1 rounded-md border-green-500/50 bg-green-500/10 text-green-500 text-xs">
                            <p>Confirmed</p>
                          </div>
                        ) : (
                          <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
                            <p>Not Confirmed</p>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }
              }

              if (!isBooked) {
                if (day.getTime() > new Date().getTime()) {
                  return <CreateOrder date={day} />;
                }
              }
            }}
          />
        </Authorization>
      </div>
    </ContentLayout>
  );
};
// format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
