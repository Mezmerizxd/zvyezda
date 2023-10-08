import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';
import { useAddresses } from '../../users/api/getAddresses';

export type CreateOrderDTO = {
  date: Date;
  serviceType: string;
  addressId: string;
};

export const CreateOrder = async (data: CreateOrderDTO) => {
  const response = await engine.CreateBooking({
    date: data.date,
    serviceType: data.serviceType,
    addressId: data.addressId,
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseCreateOrderOptions = {
  config?: MutationConfig<typeof CreateOrder>;
};

export const useCreateOrder = ({ config }: UseCreateOrderOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const addressesQuery = useAddresses();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Address',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Create Address',
      });
      addressesQuery.refetch();
    },
    ...config,
    mutationFn: CreateOrder,
  });
};
