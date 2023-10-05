import { ContentLayout } from '../../../components/Layout';
import { useAuth } from '../../../libs/auth';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl mt-2">
        Welcome <b>{`${user.profile.username}`}</b>
      </h1>
      <h4 className="my-3">
        Your role is : <b>{user.profile.role}</b>
      </h4>
      <p className="font-medium">This is the Radiance Website Application.</p>
    </ContentLayout>
  );
};
