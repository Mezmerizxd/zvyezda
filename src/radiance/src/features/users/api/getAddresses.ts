import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '../../../libs/react-query';
import { engine } from '../../../libs/engine';
import { useNotificationStore } from '../../../stores/notifications';

export const getAddresses = async (): Promise<Address[]> => {
  const response = await engine.GetAddresses();
  if (!response.server.success) {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error',
      message: response.server.error,
    });
  }
  return response.data;
};

type QueryFnType = typeof getAddresses;

type UseAddressesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useAddresses = ({ config }: UseAddressesOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['addresses'],
    queryFn: () => getAddresses(),
  });
};
