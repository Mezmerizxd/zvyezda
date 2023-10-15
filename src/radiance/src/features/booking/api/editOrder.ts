import { useMutation } from 'react-query';

import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';
import { useBookings } from './getBookings';

export type EditOrderDTO = {
  date: Date;
  bookingId: string;
  timeSlot: string;
};

export const EditOrder = async (data: EditOrderDTO) => {
  const response = await engine.RescheduleBooking({
    date: data.date,
    bookingId: data.bookingId,
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseEditOrderOptions = {
  config?: MutationConfig<typeof EditOrder>;
};

export const useEditOrder = ({ config }: UseEditOrderOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const bookingsQuery = useBookings();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Edit Order',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Edited Order',
      });
      bookingsQuery.refetch();
    },
    ...config,
    mutationFn: EditOrder,
  });
};
