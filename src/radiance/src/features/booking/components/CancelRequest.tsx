import { Button, ConfirmationDialog } from '../../../components/Elements';
import { useCancelRequest } from '../api/cancelRequest';

type CancelRequestProps = {
  bookingId: string;
};

export const CancelRequest = ({ bookingId }: CancelRequestProps) => {
  const cancelRequestMutation = useCancelRequest();

  return (
    <ConfirmationDialog
      icon="danger"
      title="Cancel Request"
      body="Are you sure you want to delete this request?"
      triggerButton={<Button variant="danger">Delete</Button>}
      confirmButton={
        <Button
          isLoading={cancelRequestMutation.isLoading}
          type="button"
          className="bg-red-600"
          onClick={() => cancelRequestMutation.mutate({ bookingId: bookingId })}
        >
          Delete Request
        </Button>
      }
    />
  );
};
