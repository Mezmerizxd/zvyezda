import { Spinner } from '../../../components/Elements';
import Calendar from '../../../components/Elements/Calendar/Calendar';
import { ContentLayout } from '../../../components/Layout';
import { Authorization, ROLES } from '../../../libs/authorization';
import { useBookings } from '../api/getBookings';

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
            renderCell={(entry) => (
              <div className="border p-1 mt-1 rounded-md border-radiance-light/50 bg-radiance-dark/10 text-radiance-light text-sm">
                <p>Booked</p>
              </div>
            )}
          />
        </Authorization>
      </div>
    </ContentLayout>
  );
};
