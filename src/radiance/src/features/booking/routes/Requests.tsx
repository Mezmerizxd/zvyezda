import { ContentLayout } from '../../../components/Layout';
import { Authorization, ROLES } from '../../../libs/authorization';

import { RequestList } from '../components/RequestList';

export const Requests = () => {
  return (
    <ContentLayout title="Booking Requests">
      <div className="mt-4">
        <Authorization forbiddenFallback={<div>Only admin can view this.</div>} allowedRoles={[ROLES.ADMIN]}>
          <RequestList />
        </Authorization>
      </div>
    </ContentLayout>
  );
};
