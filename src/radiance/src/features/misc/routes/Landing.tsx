import { useNavigate } from 'react-router';
import { AiFillCheckCircle } from 'react-icons/ai';

import { Head } from '../../../components/Head';
import { Button } from '../../../components/Elements';
import { useAuth } from '../../../libs/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Head description="Radiance" />
      <div className="bg-background h-[100vh] flex justify-center">
        <div className="align-middle text-center justify-center items-center">
          <h1 className="my-20 text-8xl font-normal text-radiance-light font-['Lalezar']">Radiance</h1>
          <div className="py-20 font-['Roboto']">
            <h2 className="py-5 px-5 text-4xl font-extrabold text-white-light w-4/6 m-auto">
              Clean Homes, Clear Minds!
            </h2>
            <p className="px-5 font-normal text-white-dark w-4/6 m-auto">
              Radiance is your digital concierge for home cleaning services. With a few taps, you can schedule, manage,
              and pay for professional cleaning services tailored to your needs.
            </p>
            <div className="flex justify-center px-5 py-2">
              <Button
                className="mx-2"
                variant="primary"
                onClick={() => (!user.profile ? navigate('/auth/login') : navigate('/app'))}
              >
                Login
              </Button>
              <Button
                className="mx-2"
                variant="inverse"
                onClick={() => (!user.profile ? navigate('/auth/register') : navigate('/app'))}
              >
                Register
              </Button>
            </div>
          </div>
          <div className="py-10 font-['Roboto']">
            <p className="font-normal text-radiance-light">Pricing</p>
            <h2 className="py-2 px-5 text-4xl font-extrabold text-white-light w-4/6 m-auto">
              Choose the right plan for you
            </h2>
            <p className="px-5 font-normal text-white-dark w-4/6 m-auto">
              Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas
              in. Explicabo id ut laborum.
            </p>
          </div>
          <div className="grid grid-flow-row-dense grid-cols-3">
            <div className="mx-4 my-4 px-4 py-4 w-fit border border-white-dark/20 rounded-md">
              <p className="text-left font-medium text-white-light w-fit">Basic</p>
              <h2 className="my-2 text-left font-medium text-4xl text-white-light w-fit">£15</h2>
              <h3 className="text-left font-medium text-white-light w-fit">Some very informative information here.</h3>
              <div className="my-4 w-fit">
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
              </div>
            </div>

            <div className="mx-4 my-4 px-4 py-4 w-fit border border-white-dark/20 rounded-md">
              <p className="text-left font-medium text-white-light w-fit">Basic</p>
              <h2 className="my-2 text-left font-medium text-4xl text-white-light w-fit">£15</h2>
              <h3 className="text-left font-medium text-white-light w-fit">Some very informative information here.</h3>
              <div className="my-4 w-fit">
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
              </div>
            </div>

            <div className="mx-4 my-4 px-4 py-4 w-fit border border-white-dark/20 rounded-md">
              <p className="text-left font-medium text-white-light w-fit">Basic</p>
              <h2 className="my-2 text-left font-medium text-4xl text-white-light w-fit">£15</h2>
              <h3 className="text-left font-medium text-white-light w-fit">Some very informative information here.</h3>
              <div className="my-4 w-fit">
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
                <div className="my-2 flex items-center w-fit">
                  <AiFillCheckCircle className="text-radiance-light" size={26} />
                  <p className="ml-2 text-left font-normal text-white-dark">Some very informative information here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
