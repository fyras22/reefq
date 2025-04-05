'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Check authentication and role on the client side
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/admin');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/auth/unauthorized');
    }
  }, [status, session, router]);
  
  // Show loading state while checking auth
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Asset Management Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Asset Management
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  Manage jewelry assets
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link href="/dashboard/admin/assets" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Management Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                User Management
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  Manage user accounts
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link href="/dashboard/admin/users" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Management Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Content Management
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  Manage educational content
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link href="/dashboard/admin/content" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Current User</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>You are signed in as {session.user.name} ({session.user.email}) with role: <span className="font-semibold">{session.user.role}</span></p>
                  </div>
                  <div className="mt-3 text-sm">
                    <Link href="/demo/jewelry/assets-demo" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Visit Jewelry Assets Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 