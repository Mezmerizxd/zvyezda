import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '../../../libs/react-query';
import { engine } from '../../../libs/engine';
import { useNotificationStore } from '../../../stores/notifications';

export const getUsers = async (): Promise<Account[]> => {
  const response = await engine.GetAllAccounts();
  if (!response.server.success) {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error',
      message: response.server.error,
    });
  }
  return response.data;
};

type QueryFnType = typeof getUsers;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useUsers = ({ config }: UseUsersOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
