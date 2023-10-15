import { useNavigate } from 'react-router';
import { NumberWidget } from '../components/NumberWidget';
import { ContentLayout } from '../../../components/Layout';
import { useAuth } from '../../../libs/auth';
import { useAddresses } from '../../users/api/getAddresses';
import { useBookings } from '../../booking/api/getBookings';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addressesQuery = useAddresses();
  const bookingsQuery = useBookings();

  const requests = bookingsQuery.data?.filter((booking) => booking.confirmed === false);
  const confirmed = bookingsQuery.data?.filter((booking) => booking.confirmed === true);

  // Get bookings that are confirmed and unpaid
  const unpaidAndConfirmed = bookingsQuery.data?.filter(
    (booking) => booking.confirmed === true && booking.paid === false,
  );
  const upaidAndConfirmedNearExpired = unpaidAndConfirmed?.filter(
    (booking) => new Date(booking.date) < new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl mt-2">
        Welcome <b>{`${user.profile.username}`}</b>
      </h1>

      {!addressesQuery.data?.length && (
        <div className="border p-2 my-2 rounded-md border-red-600/50 bg-red-600/10 text-red-600">
          <h3>
            You need to add an address before you can start booking. Go to your{' '}
            <span
              className="font-bold underline cursor-pointer hover:text-red-700"
              onClick={() => navigate('/app/profile')}
            >
              Profile
            </span>{' '}
            to add it.
          </h3>
        </div>
      )}

      {upaidAndConfirmedNearExpired?.length && (
        <div className="border p-2 my-2 rounded-md border-red-600/50 bg-red-600/10 text-red-600">
          <h3>
            Warning, You have {upaidAndConfirmedNearExpired.length} Unpaid Booking/s that will expire in 24 hours!
          </h3>
        </div>
      )}

      {unpaidAndConfirmed?.length && (
        <div className="border p-2 my-2 rounded-md border-radiance-light/50 bg-radiance-light/10 text-radiance-light">
          <h3>You have {unpaidAndConfirmed.length} Unpaid Booking/s!</h3>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {unpaidAndConfirmed?.length > 0 && (
          <NumberWidget
            number={unpaidAndConfirmed.length.toString()}
            title="Unpaid"
            description={`You have ${unpaidAndConfirmed.length.toString()} booking/s that haven't been paid.`}
          />
        )}
        {confirmed?.length > 0 && (
          <NumberWidget
            number={confirmed.length.toString()}
            title="Confirmed"
            description={`You have ${confirmed.length.toString()} booking/s on your schedule.`}
          />
        )}
        {confirmed?.length > 0 && (
          <NumberWidget
            number={requests.length.toString()}
            title="Requests"
            description={`You have ${requests.length.toString()} request/s that are pending confirmation.`}
          />
        )}
      </div>
    </ContentLayout>
  );
};
