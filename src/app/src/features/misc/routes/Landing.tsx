import { useNavigate } from 'react-router';

import { Head } from '../../../components/Head';
import { Button } from '../../../components/Elements';
import { useAuth } from '../../../libs/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Head description="Welcome to bulletproof react" />
      <div className="bg-background h-[100vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-zvyezda-light sm:text-4xl p-5">
            <span className="block">Zvyezda Client</span>
          </h2>
          <p className="text-gray-200">Login to Zvyezda Client or Request Access</p>
          <div className="mt-5 flex justify-center">
            {!user.profile ? (
              <>
                <Button type="button" variant="inverse" className="mx-1" onClick={() => navigate('/auth/login')}>
                  Login
                </Button>
                <Button type="button" variant="inverse" className="mx-1" onClick={() => {}}>
                  Request Access
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="inverse" className="mx-1" onClick={() => navigate('/app')}>
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
