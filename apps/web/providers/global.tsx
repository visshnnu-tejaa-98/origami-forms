"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useState } from "react";
import { OrigamiToaster } from "~/components/origami/toast";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

import { trpc } from "~/trpc/client";
import { createTRPCHttpBatchClient } from "~/trpc/create-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: Infinity,
    },
  },
});

// Must live inside <ClerkProvider> so it can read the Clerk session token and
// attach it as a Bearer header on every tRPC request.
const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useAuth();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCHttpBatchClient({ getToken: () => getToken() })],
    }),
  );

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      {children}
    </trpc.Provider>
  );
};

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ClerkProvider>
          <TRPCProvider>
            {children}
            <OrigamiToaster />
          </TRPCProvider>
        </ClerkProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};
