'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };
  
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {isAuthenticated ? (
            <>
              <span className="mr-2">{session?.user?.name || 'User'}</span>
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </>
          ) : (
            <>
              <UserCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Account</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
          {isAuthenticated ? (
            <>
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                </div>
                
                {session?.user?.role === 'admin' && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/admin"
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block px-4 py-2 text-sm`}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                )}
                
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm`}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard"
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm`}
                    >
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>
              </div>
              
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/auth/login"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm`}
                  >
                    Sign in
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/auth/register"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm`}
                  >
                    Create account
                  </Link>
                )}
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 