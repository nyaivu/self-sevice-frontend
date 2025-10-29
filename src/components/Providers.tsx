"use client"; // Mark this as a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react"; // Import React to use its types

// 1. Create an instance of QueryClient outside the component
const queryClient = new QueryClient();

// 2. Define the props interface for the Providers component
// The 'children' prop is typed as React.ReactNode (or React.ReactElement, depending on strictness)
interface ProvidersProps {
  children: React.ReactNode;
}

// 3. Apply the interface to the functional component
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Rename the file to `providers.tsx` or `providers.ts`
