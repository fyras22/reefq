// Temporary placeholder to fix build
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface ARViewerPageProps {
  params: {
    productId: string;
  };
}

export default function ARViewerPage({ params }: ARViewerPageProps) {
  const { productId } = params;
  const [modelPath, setModelPath] = useState<string>('');
  const [productName, setProductName] = useState<string>('');

  useEffect(() => {
    // In a real implementation, we would fetch product details
    // For now, use placeholder data
    const placeholder = {
      name: "Sample Product",
      modelPath: "/models/sample-model.glb"
    };
    
    setProductName(placeholder.name);
    setModelPath(placeholder.modelPath);
  }, [productId]);

  if (!productId) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AR Viewer: {productName || 'Loading...'}
          </h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              {modelPath ? (
                <p>AR viewer would load model from: {modelPath}</p>
              ) : (
                <p>Loading AR model...</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
