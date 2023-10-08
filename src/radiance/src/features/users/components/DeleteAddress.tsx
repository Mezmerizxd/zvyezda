import { Button, ConfirmationDialog, ConfirmationDialogProps } from '../../../components/Elements';
import { useDeleteAddress } from '../api/deleteAddress';

export const DeleteAddress = ({ address }: { address: Address }) => {
  const deleteAddressMutation = useDeleteAddress();

  return (
    <ConfirmationDialog
      icon="danger"
      title="Delete Address"
      body="Are you sure you want to delete this address?"
      triggerButton={<Button variant="danger">Delete</Button>}
      confirmButton={
        <Button
          isLoading={deleteAddressMutation.isLoading}
          type="button"
          className="bg-red-600"
          onClick={() => deleteAddressMutation.mutate(address)}
        >
          Delete Address
        </Button>
      }
    />
  );
};
