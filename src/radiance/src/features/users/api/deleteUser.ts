import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type DeleteUserDTO = {
  userId: string;
};

export const deleteUser = async ({ userId }: DeleteUserDTO) => {
  const response = await engine.DeleteAccount({ identifier: 'id', value: userId });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
};

type UseDeleteUserOptions = {
  config?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ config }: UseDeleteUserOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deletedUser) => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData<Account[]>('users');

      queryClient.setQueryData(
        'users',
        previousUsers?.filter((user) => user.id !== deletedUser.userId),
      );

      return { previousUsers };
    },
    onError: (error, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData('users', context.previousUsers);
      }
      addNotification({
        type: 'error',
        title: 'Failed to Delete User',
        message: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      addNotification({
        type: 'success',
        title: 'User Deleted',
      });
    },
    ...config,
    mutationFn: deleteUser,
  });
};
