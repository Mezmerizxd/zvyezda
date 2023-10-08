import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export const deleteAddress = async (address: Address) => {
  const response = await engine.DeleteAddress(address);
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
};

type UseDeleteAddressOptions = {
  config?: MutationConfig<typeof deleteAddress>;
};

export const useDeleteAddress = ({ config }: UseDeleteAddressOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deletedAddress) => {
      await queryClient.cancelQueries('addresses');

      const previousAddresses = queryClient.getQueryData<Address[]>('addresses');

      queryClient.setQueryData(
        'addresses',
        previousAddresses?.filter((address) => address.id !== deletedAddress.id),
      );

      return { previousAddresses };
    },
    onError: (error, __, context: any) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData('addresses', context.previousAddresses);
      }
      addNotification({
        type: 'error',
        title: 'Failed to Delete Address',
        message: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('addresses');
      addNotification({
        type: 'success',
        title: 'Address Deleted',
      });
    },
    ...config,
    mutationFn: deleteAddress,
  });
};
