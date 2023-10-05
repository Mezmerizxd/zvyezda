import * as React from 'react';

import { Head } from '../../../components/Head';
import { Link } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link className="flex items-center text-white" to="/">
              <img
                className="h-24 w-auto"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2.bp.blogspot.com%2F-hZUdbXMBYRg%2FWdYSu2CPO8I%2FAAAAAAAAA14%2Fhvj-2RGQKikMF_isM1x4oemjBc6l73oXwCLcBGAs%2Fs1600%2FA%252BLogo%252BDesign%252BTransparent%252BBy%252BMTCTutorials%252BYouTube.png"
                alt="Workflow"
              />
            </Link>
          </div>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-radiance-dark">{title}</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-background-light py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>
        </div>
      </div>
    </>
  );
};
