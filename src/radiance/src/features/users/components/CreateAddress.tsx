import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, TextAreaField } from '../../../components/Form';
import { CreateAddressDTO, useCreateAddress } from '../api/createAddress';

const schema = z.object({
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  postalCode: z.string(),
});

export const CreateAddress = () => {
  const createAddressMutation = useCreateAddress();

  return (
    <FormDrawer
      isDone={createAddressMutation.isSuccess}
      triggerButton={
        <Button startIcon={<PencilIcon className="h-4 w-4" />} size="sm">
          Create Address
        </Button>
      }
      title="Create Address"
      submitButton={
        <Button form="create-address" type="submit" size="sm" isLoading={createAddressMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<CreateAddressDTO, typeof schema>
        id="create-address"
        onSubmit={async (values) => {
          await createAddressMutation.mutateAsync(values);
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField label="Street" error={formState.errors['street']} registration={register('street')} />
            <InputField label="City" type="text" error={formState.errors['city']} registration={register('city')} />
            <InputField label="State" error={formState.errors['state']} registration={register('state')} />
            <InputField label="Country" error={formState.errors['country']} registration={register('country')} />
            <InputField
              label="Postal Code"
              error={formState.errors['postalCode']}
              registration={register('postalCode')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
