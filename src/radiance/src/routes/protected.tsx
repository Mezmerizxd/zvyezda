import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../components/Layout';

import { lazyImport } from '../libs/lazyImport';
import { Spinner } from '../components/Elements';

// const { DiscussionsRoutes } = lazyImport(() => import('../features/discussions'), 'DiscussionsRoutes');
const { Dashboard } = lazyImport(() => import('../features/misc'), 'Dashboard');
const { Profile } = lazyImport(() => import('../features/users'), 'Profile');
const { Users } = lazyImport(() => import('../features/users'), 'Users');
const { Requests } = lazyImport(() => import('../features/booking'), 'Requests');
const { Active } = lazyImport(() => import('../features/booking'), 'Active');
const { Order } = lazyImport(() => import('../features/booking'), 'Order');

const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'booking/order', element: <Order /> },
      { path: 'booking/requests', element: <Requests /> },
      { path: 'booking/active', element: <Active /> },
      { path: 'users', element: <Users /> },
      { path: 'profile', element: <Profile /> },
      { index: true, element: <Dashboard /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
