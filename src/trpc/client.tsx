
"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, createTRPCClient } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@/server/trpc/routers/_app";

export const { TRPCProvider, useTRPC } =
  createTRPCContext<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function TRPCProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
