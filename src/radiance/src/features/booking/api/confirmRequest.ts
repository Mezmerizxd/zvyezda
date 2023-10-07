import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type ConfirmRequestDTO = {
  bookingId: string;
};

export const confirmRequest = async ({ bookingId }: ConfirmRequestDTO) => {
  const response = await engine.ConfirmBooking({ id: bookingId });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseConfirmRequestOptions = {
  config?: MutationConfig<typeof confirmRequest>;
};

export const useConfirmRequest = ({ config }: UseConfirmRequestOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (confirmRequest) => {
      await queryClient.cancelQueries('bookings');

      const previousUsers = queryClient.getQueryData<Booking[]>('bookings');

      queryClient.setQueryData(
        'bookings',
        previousUsers?.filter((user) => user.id !== confirmRequest.bookingId),
      );

      return { previousUsers };
    },
    onError: (error, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData('bookings', context.previousUsers);
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
    mutationFn: confirmRequest,
  });
};
