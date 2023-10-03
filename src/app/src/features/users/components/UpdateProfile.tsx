import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, TextAreaField } from '../../../components/Form';
import { useAuth } from '../../../libs/auth';

import { UpdateProfileDTO, useUpdateProfile } from '../api/updateProfile';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  username: z.string().min(1, 'Required'),
  avatar: z.string(),
  biography: z.string(),
});

export const UpdateProfile = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button startIcon={<PencilIcon className="h-4 w-4" />} size="sm">
          Update Profile
        </Button>
      }
      title="Update Profile"
      submitButton={
        <Button form="update-profile" type="submit" size="sm" isLoading={updateProfileMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<UpdateProfileDTO['data'], typeof schema>
        id="update-profile"
        onSubmit={async (values) => {
          await updateProfileMutation.mutateAsync({ data: values }).catch(() => {
            return;
          });
        }}
        options={{
          defaultValues: {
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            biography: user.biography,
          },
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField label="Username" error={formState.errors['username']} registration={register('username')} />
            <InputField
              label="Email Address"
              type="email"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <InputField label="Avatar" error={formState.errors['avatar']} registration={register('avatar')} />
            <TextAreaField
              label="Biography"
              error={formState.errors['biography']}
              registration={register('biography')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
