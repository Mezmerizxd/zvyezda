import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, SelectField, TextAreaField } from '../../../components/Form';
import { CreateOrderDTO, useCreateOrder } from '../api/createOrder';
import { useAddresses } from '../../users/api/getAddresses';

const schema = z.object({
  serviceType: z.string().min(1, 'Required'),
  addressId: z.string().min(1, 'Required'),
});

export const CreateOrder = ({ date }: { date: Date }) => {
  const createOrderMutation = useCreateOrder();
  const addressesQuery = useAddresses();

  return (
    <FormDrawer
      isDone={createOrderMutation.isSuccess}
      triggerButton={<button>Open</button>}
      title="Create Order"
      submitButton={
        <Button form="create-order" type="submit" size="sm" isLoading={createOrderMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<CreateOrderDTO, typeof schema>
        id="create-order"
        onSubmit={async (values) => {
          await createOrderMutation.mutateAsync({
            ...values,
            date: date,
          });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <SelectField
              label="Service Type"
              error={formState.errors['serviceType']}
              registration={register('serviceType')}
              options={[
                { label: 'Quick', value: 'quick' },
                { label: 'Normal', value: 'normal' },
                { label: 'Extra', value: 'extra' },
              ]}
            />
            <SelectField
              label="Address"
              error={formState.errors['addressId']}
              registration={register('addressId')}
              options={addressesQuery.data?.map((address) => ({
                label: `${address.street}, ${address.city}, ${address.state}`,
                value: address.id,
              }))}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
