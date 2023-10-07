import { Button, ConfirmationDialog } from '../../../components/Elements';
import { useConfirmRequest } from '../api/confirmRequest';

type ConfirmRequestProps = {
  id: string;
};

export const ConfirmRequest = ({ id }: ConfirmRequestProps) => {
  const confirmRequestMutation = useConfirmRequest();

  return (
    <ConfirmationDialog
      icon="info"
      title="Confirm Request"
      body="Are you sure you want to confirm this request?"
      triggerButton={<Button variant="primary">Confirm</Button>}
      confirmButton={
        <Button
          isLoading={confirmRequestMutation.isLoading}
          type="button"
          className="bg-radiance-dark"
          onClick={() => confirmRequestMutation.mutate({ bookingId: id })}
        >
          Confirm Request
        </Button>
      }
    />
  );
};
