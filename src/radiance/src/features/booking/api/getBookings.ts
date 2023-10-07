import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '../../../libs/react-query';
import { engine } from '../../../libs/engine';
import { useNotificationStore } from '../../../stores/notifications';

export const getBookings = async (): Promise<Booking[]> => {
  const response = await engine.GetAllBookings();
  if (!response.server.success) {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error',
      message: response.server.error,
    });
  }
  return response.data;
};

type QueryFnType = typeof getBookings;

type UseBookingsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useBookings = ({ config }: UseBookingsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
  });
};
