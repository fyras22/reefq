'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  
  const isAdmin = session?.user?.role === 'admin';
  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, {session?.user?.name || session?.user?.email}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAdmin && (
              <>
                <Link
                  href="/dashboard/admin"
                  className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Admin Dashboard</h3>
                    <p className="text-sm text-gray-500">Manage products, orders and settings</p>
                  </div>
                </Link>
                
                <Link
                  href="/dashboard/admin/products"
                  className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Product Management</h3>
                    <p className="text-sm text-gray-500">Add, edit and manage your products</p>
                  </div>
                </Link>
                
                <Link
                  href="/dashboard/admin/products/new"
                  className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                  </div>
                </Link>
              </>
            )}
            
            <Link
              href="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
            >
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
                <p className="text-sm text-gray-500">Manage your account details</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* User info card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-md text-gray-900">{session?.user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-md text-gray-900">
                {isAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Customer
                  </span>
                )}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/api/auth/signout"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 