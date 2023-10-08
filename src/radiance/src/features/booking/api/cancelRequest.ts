import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type CancelRequestDTO = {
  bookingId: string;
};

export const cancelRequest = async ({ bookingId }: CancelRequestDTO) => {
  const response = await engine.CancelBooking({ bookingId: bookingId });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseCancelRequestOptions = {
  config?: MutationConfig<typeof cancelRequest>;
};

export const useCancelRequest = ({ config }: UseCancelRequestOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (cancelRequest) => {
      // Delete booking from cache
      await queryClient.cancelQueries('bookings');

      const previousBookings = queryClient.getQueryData<Booking[]>('bookings');

      queryClient.setQueryData(
        'bookings',
        previousBookings?.filter((booking) => booking.id !== cancelRequest.bookingId),
      );

      return { previousBookings };
    },
    onError: (error, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData('bookings', context.previousBookings);
      }
      addNotification({
        type: 'error',
        title: 'Failed to Confirm',
        message: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      addNotification({
        type: 'success',
        title: 'Confirmed',
      });
    },
    ...config,
    mutationFn: cancelRequest,
  });
};
