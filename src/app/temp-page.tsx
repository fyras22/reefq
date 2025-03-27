'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the main page component
const MainPage = dynamic(() => import('./page'), { ssr: false });

export default function Home() {
  return <MainPage />;
} 