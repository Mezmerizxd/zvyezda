import { lazyImport } from '../libs/lazyImport';

const { AuthRoutes } = lazyImport(() => import('../features/auth'), 'AuthRoutes');

export const publicRoutes = [
  {
    path: '/auth/*',
    element: <AuthRoutes />,
  },
];
