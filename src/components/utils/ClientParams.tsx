'use client';

import { Suspense } from 'react';
import { useSearchParams as useNextSearchParams, ReadonlyURLSearchParams } from 'next/navigation';

function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

function RawSearchParamsContent({
  onParams,
}: {
  onParams: (params: ReadonlyURLSearchParams) => void;
}) {
  const searchParams = useNextSearchParams();
  onParams(searchParams);
  return null;
}

export function useSearchParamsWithSuspense(): URLSearchParams {
  let params: ReadonlyURLSearchParams | URLSearchParams = new URLSearchParams();
  
  return {
    get wrapper() {
      return ({ children }: { children: React.ReactNode }) => (
        <SearchParamsProvider>
          <RawSearchParamsContent onParams={(p) => (params = p)} />
          {children}
        </SearchParamsProvider>
      );
    },
    get value() {
      return params;
    },
  } as unknown as URLSearchParams & {
    wrapper: (props: { children: React.ReactNode }) => JSX.Element;
  };
} 