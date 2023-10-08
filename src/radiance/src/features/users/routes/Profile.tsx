import { Spinner, Table } from '../../../components/Elements';
import { ContentLayout } from '../../../components/Layout';
import { useAuth } from '../../../libs/auth';
import { useAddresses } from '../api/getAddresses';
import { CreateAddress } from '../components/CreateAddress';
import { DeleteAddress } from '../components/DeleteAddress';

import { UpdateProfile } from '../components/UpdateProfile';

type EntryProps = {
  label: string;
  value: string;
};

const Entry = ({ label, value }: EntryProps) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-200">{label}</dt>
    <dd className="mt-1 text-sm text-radiance-light sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

export const Profile = () => {
  const { user } = useAuth();
  const addressesQuery = useAddresses();

  if (!user.profile) return null;

  return (
    <>
      <ContentLayout title="Profile">
        <div className="bg-background-dark shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-300">User Information</h3>
              <UpdateProfile />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-200">Personal details of the user.</p>
          </div>
          <div className="border-t border-background-light px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-background-light">
              <Entry label="Username" value={user.profile.username} />
              <Entry label="Email Address" value={user.profile.email} />
              <Entry label="Role" value={user.profile.role} />
              <Entry label="Biography" value={user.profile.biography || 'None'} />
            </dl>
          </div>
        </div>
      </ContentLayout>
      <ContentLayout title="Address">
        <div className="bg-background-dark shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-300">Address Information</h3>
              <CreateAddress />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-200">Add or remove addresses.</p>
          </div>
          <div className="border-t border-background-light px-4 py-5 sm:p-0">
            {addressesQuery.isLoading ? (
              <div className="w-full h-48 flex justify-center items-center">
                <Spinner size="lg" />
              </div>
            ) : addressesQuery.data ? (
              <Table<Address>
                data={addressesQuery.data}
                columns={[
                  {
                    title: 'Street Address',
                    field: 'street',
                  },
                  {
                    title: 'City',
                    field: 'city',
                  },
                  {
                    title: 'State',
                    field: 'state',
                  },
                  {
                    title: 'Postal Code',
                    field: 'postalCode',
                  },
                  {
                    title: '',
                    field: 'id',
                    Cell({ entry: address }) {
                      return <DeleteAddress address={address} />;
                    },
                  },
                ]}
              />
            ) : (
              <div className="p-5 flex justify-center">
                <h1>No Addresses Found</h1>
              </div>
            )}
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
