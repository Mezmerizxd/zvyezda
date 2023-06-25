import { Fragment, useState } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';

import { Navigation, Container } from './styled';

import { FiChevronDown, FiBell } from 'react-icons/fi';
import { FaXbox } from 'react-icons/fa';
import { AiFillMessage, AiFillCode } from 'react-icons/ai';
import { MdMore } from 'react-icons/md';

import { Pages } from '../../views/home';

export default ({ setPage }: Zvyezda.Client.Models.NavigationProps) => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const products: Zvyezda.Client.Models.NavigationProductsProps[] = [
    {
      name: 'Xbox Hacking (Unfinished)',
      description: "Modifying Xbox 360's with Glitch Chips",
      href: () => {},
      icon: FaXbox,
    },
    {
      name: 'Social App V2',
      description: 'Basic Chat App',
      href: () => {
        window.open('http://sav2.zvyezda.com/', '_blank');
      },
      icon: AiFillMessage,
    },
    {
      name: "Grand Theft Auto V Mod Menu's (Unfinished)",
      description: 'iVritex Menu & Purge Engine',
      href: () => {},
      icon: AiFillCode,
    },
  ];

  const callsToAction: Zvyezda.Client.Models.NavigationCallsToActionProps[] = [
    { name: 'Announcements', href: () => setPage(Pages.News), icon: FiBell },
    { name: 'More', href: () => setPage(Pages.Projects), icon: MdMore },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Navigation>
      <Container>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a onClick={() => setPage(Pages.Home)} className="-m-1.5 p-1.5">
              <h1 id="LogoText" className=" text-3xl font-bold">
                Zvyezda
              </h1>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-50"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <FiChevronDown className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <a
              onClick={() => setPage(Pages.Home)}
              className="text-sm font-semibold leading-6 text-gray-50 hover:text-light-green"
            >
              Home
            </a>

            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-50 hover:text-light-green">
                Projects
                <FiChevronDown className="h-5 w-5 flex-none" aria-hidden="true" />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-background shadow-lg ring-1 ring-gray-300">
                  <div className="p-4">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-light-background"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-inherit group-hover:bg-light-background">
                          <item.icon className="h-6 w-6 text-gray-50 group-hover:text-light-green" aria-hidden="true" />
                        </div>
                        <div className="flex-auto">
                          <a
                            onClick={item.href}
                            className="block font-semibold text-gray-50 group-hover:text-light-green"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-300 group-hover:text-dark-green">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x bg-background ring-1 ring-gray-300">
                    {callsToAction.map((item) => (
                      <a
                        key={item.name}
                        onClick={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-50 hover:text-light-green hover:bg-light-background"
                      >
                        <item.icon className="h-5 w-5 flex-none" aria-hidden="true" />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            <a
              onClick={() => setPage(Pages.AboutMe)}
              className="text-sm font-semibold leading-6 text-gray-50 hover:text-light-green"
            >
              About Me
            </a>
            <a
              onClick={() => setPage(Pages.News)}
              className="text-sm font-semibold leading-6 text-gray-50 hover:text-light-green"
            >
              News
            </a>
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {state.session.connected ? (
              <a
                onClick={() => setPage(Pages.Login)}
                className="text-sm font-semibold leading-6 text-gray-50 hover:text-light-green"
              >
                Dashboard
              </a>
            ) : (
              <a
                onClick={() => setPage(Pages.Login)}
                className="text-sm font-semibold leading-6 text-gray-50 hover:text-light-green"
              >
                Log in
              </a>
            )}
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-300">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <h1 id="LogoText">Zvyezda</h1>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <FiChevronDown className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-50/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-gray-50 hover:text-light-green font-semibold leading-7 hover:bg-light-background">
                          Projects
                          <FiChevronDown
                            className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {[...products, ...callsToAction].map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              onClick={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-50 hover:bg-light-background"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <a
                    onClick={() => setPage(Pages.AboutMe)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-50 hover:text-light-green"
                  >
                    About Me
                  </a>
                  <a
                    onClick={() => setPage(Pages.News)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-50 hover:text-light-green"
                  >
                    News
                  </a>
                </div>
                <div className="py-6">
                  {state.session.connected ? (
                    <a
                      onClick={() => setPage(Pages.Login)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-50 hover:text-light-green"
                    >
                      Dashboard
                    </a>
                  ) : (
                    <a
                      onClick={() => setPage(Pages.Login)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-50 hover:text-light-green"
                    >
                      Log in
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Container>
    </Navigation>
  );
};
