import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type CreateAddressDTO = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export const createAddress = async (data: CreateAddressDTO) => {
  const response = await engine.CreateAddress({
    id: '0',
    street: data.street,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
    accountId: '0',
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseCreateAddressOptions = {
  config?: MutationConfig<typeof createAddress>;
};

export const useCreateAddress = ({ config }: UseCreateAddressOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (address) => {
      // await queryClient.cancelQueries('addresses');
      // const previousAddresses = queryClient.getQueryData<Address[]>('addresses');
      // queryClient.setQueryData(
      //   'addresses',
      //   previousAddresses?.filter((address) => address.id !== deletedAddress.id),
      // );
      // return { previousAddresses };

      // Switch to add address

      await queryClient.cancelQueries('addresses');

      const previousAddresses = queryClient.getQueryData<Address[]>('addresses');
      if (previousAddresses) {
        const newAddress = await createAddress(address);
        queryClient.setQueryData('addresses', [...previousAddresses, newAddress]);
      } else {
        const newAddress = await createAddress(address);
        queryClient.setQueryData('addresses', [newAddress]);
      }

      return queryClient.getQueryData<Address[]>('addresses');
    },
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
    },
    ...config,
    mutationFn: createAddress,
  });
};
