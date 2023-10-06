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
          <div className="flex align-middle justify-center items-center">
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2.bp.blogspot.com%2F-hZUdbXMBYRg%2FWdYSu2CPO8I%2FAAAAAAAAA14%2Fhvj-2RGQKikMF_isM1x4oemjBc6l73oXwCLcBGAs%2Fs1600%2FA%252BLogo%252BDesign%252BTransparent%252BBy%252BMTCTutorials%252BYouTube.png"
              alt="radiance"
              className="w-28 h-auto"
            />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-radiance-light sm:text-4xl p-5">
            <span className="block">Radiance</span>
          </h2>
          <p className="text-gray-200">Login or Register to Radiance</p>
          <div className="mt-5 flex justify-center">
            {!user.profile ? (
              <>
                <Button type="button" variant="inverse" className="mx-1" onClick={() => navigate('/auth/login')}>
                  Login
                </Button>
                <Button type="button" variant="inverse" className="mx-1" onClick={() => navigate('/auth/register')}>
                  Register
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
