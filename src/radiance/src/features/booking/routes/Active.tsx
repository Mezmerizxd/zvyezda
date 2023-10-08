import { ContentLayout } from '../../../components/Layout';
import { Authorization, ROLES } from '../../../libs/authorization';

import { ActiveList } from '../components/ActiveList';

export const Active = () => {
  return (
    <ContentLayout title="Active Bookings">
      <div className="mt-4">
        <Authorization
          forbiddenFallback={<div>Only admin can view this.</div>}
          allowedRoles={[ROLES.ADMIN, ROLES.DEVELOPER]}
        >
          <ActiveList />
        </Authorization>
      </div>
    </ContentLayout>
  );
};
