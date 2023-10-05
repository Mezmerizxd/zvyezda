import { useMutation } from 'react-query';

import { useAuth } from '../../../libs/auth';
import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type UpdateProfileDTO = {
  data: {
    email: string;
    username: string;
    avatar?: string | null;
    biography?: string | null;
  };
};

export const updateProfile = async ({ data }: UpdateProfileDTO) => {
  const response = await engine.UpdateProfile({
    id: engine.profile.id,
    email: data.email,
    username: data.username,
    role: engine.profile.role,
    avatar: data?.avatar,
    biography: data?.biography,
    createdAt: engine.profile.createdAt,
    updatedAt: engine.profile.updatedAt,
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseUpdateProfileOptions = {
  config?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ config }: UseUpdateProfileOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const { refetchUser } = useAuth();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Profile',
        message: error.message,
      });
      refetchUser();
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'User Updated',
      });
      refetchUser();
    },
    ...config,
    mutationFn: updateProfile,
  });
};
