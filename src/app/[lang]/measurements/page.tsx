"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MeasurementsRedirect({ params }: { params: { lang: string } }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${params.lang}/features/measurements`);
  }, [router, params.lang]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the measurements feature page.</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
} 