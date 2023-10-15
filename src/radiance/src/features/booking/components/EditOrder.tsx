import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, SelectField, TextAreaField } from '../../../components/Form';
import { EditOrderDTO, useEditOrder } from '../api/editOrder';

const schema = z.object({
  date: z.date().min(new Date(), 'Date must be after today'),
  timeSlot: z.string().min(0, 'Required'),
});

export const EditOrder = ({ booking }: { booking: Booking }) => {
  const editOrderMutation = useEditOrder();

  let fServiceType: string;

  switch (booking.serviceType) {
    case 0:
      fServiceType = '£30 - Quick';
      break;
    case 1:
      fServiceType = '£45 - Normal';
      break;
    case 2:
      fServiceType = '£60 - Extra';
      break;
    default:
      fServiceType = 'Unknown';
  }

  return (
    <FormDrawer
      isDone={editOrderMutation.isSuccess}
      triggerButton={
        <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
          <p>Booked</p>
        </div>
      }
      title="Edit Order"
      submitButton={
        <Button form="edit-order" type="submit" size="sm" isLoading={editOrderMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<EditOrderDTO, typeof schema>
        id="edit-order"
        onSubmit={async (values) => {
          await editOrderMutation.mutateAsync({
            date: new Date(),
            bookingId: booking.id,
            timeSlot: values.timeSlot,
          });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Date"
              registration={null}
              defaultValue={new Date(booking.date).toDateString()}
              disabled={true}
              type="text"
            />
            <InputField
              label="Service Type"
              registration={null}
              defaultValue={`${booking.address.street}, ${booking.address.city}, ${booking.address.postalCode}`}
              disabled={true}
              type="text"
            />
            <InputField
              label="Service Type"
              registration={null}
              defaultValue={fServiceType}
              disabled={true}
              type="text"
            />
            <SelectField
              label="Time Slot"
              error={formState.errors['timeSlot']}
              registration={register('timeSlot')}
              defaultValue={booking.timeSlot.toString()}
              options={[
                { label: '8am - 10am', value: '0' },
                { label: '11am - 1pm', value: '1' },
                { label: '2pm - 4pm', value: '2' },
                { label: '5pm - 7pm', value: '3' },
              ]}
            />{' '}
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
