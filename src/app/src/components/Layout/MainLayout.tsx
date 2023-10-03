import { Dialog, Menu, Transition } from '@headlessui/react';
import { UserIcon, FolderIcon, HomeIcon, MenuAlt2Icon, UsersIcon, XIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { clsx } from 'clsx';

import { useAuth } from '../../libs/auth';
import { ROLES, useAuthorization } from '../../libs/authorization';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const SideNavigation = () => {
  const { checkAccess } = useAuthorization();

  const navigation = [
    { name: 'Dashboard', to: '.', icon: HomeIcon },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      name: 'Users',
      to: './users',
      icon: UsersIcon,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      {navigation.map((item, index) => (
        <NavLink
          end={index === 0}
          key={item.name}
          to={item.to}
          className={clsx(
            'text-gray-300 hover:bg-background-light hover:text-white',
            'group flex items-center px-2 py-2 text-base font-medium rounded-md',
          )}
        >
          <item.icon
            className={clsx('text-gray-400 group-hover:text-gray-300', 'mr-4 flex-shrink-0 h-6 w-6')}
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </>
  );
};

type UserNavigationItem = {
  name: string;
  to: string;
  onClick?: () => void;
};

const UserNavigation = () => {
  const { user, logout } = useAuth();

  const userNavigation = [
    { name: 'Your Profile', to: './profile' },
    {
      name: 'Sign out',
      to: '',
      onClick: () => {
        logout();
      },
    },
  ].filter(Boolean) as UserNavigationItem[];

  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zvyezda-light">
              <span className="sr-only">Open user menu</span>
              {user.avatar ? (
                <img className="h-10 w-10 rounded-full" src={user.avatar} alt="Workflow" />
              ) : (
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-400">
                  <h1 className="text-white text-lg">{user.username[0]}</h1>
                </div>
              )}
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background-dark ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      onClick={item.onClick}
                      to={item.to}
                      className={clsx(
                        active ? 'bg-background-light' : '',
                        'block px-4 py-2 text-sm text-gray-300 hover:text-white',
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

type MobileSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar = ({ sidebarOpen, setSidebarOpen }: MobileSidebarProps) => {
  return (
    <Transition.Root show={sidebarOpen} as={React.Fragment}>
      <Dialog as="div" static className="fixed inset-0 flex z-40 md:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-background-dark bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-background-dark">
            <Transition.Child
              as={React.Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zvyezda-light"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XIcon className="h-6 w-6 text-zvyezda-light" aria-hidden="true" />
                </button>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo />
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <SideNavigation />
              </nav>
            </div>
          </div>
        </Transition.Child>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </Dialog>
    </Transition.Root>
  );
};

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-background-light">
            <Logo />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-background-dark space-y-1">
              <SideNavigation />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to=".">
      <img
        className="h-8 w-auto mr-2"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2.bp.blogspot.com%2F-hZUdbXMBYRg%2FWdYSu2CPO8I%2FAAAAAAAAA14%2Fhvj-2RGQKikMF_isM1x4oemjBc6l73oXwCLcBGAs%2Fs1600%2FA%252BLogo%252BDesign%252BTransparent%252BBy%252BMTCTutorials%252BYouTube.png"
        alt="Workflow"
      />
      <span className="text-xl text-zvyezda-light font-semibold">Zvyezda</span>
    </Link>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-background-light shadow">
          <button
            className="px-4 text-zvyezda-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zvyezda-light md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              <UserNavigation />
            </div>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>
      </div>
    </div>
  );
};
