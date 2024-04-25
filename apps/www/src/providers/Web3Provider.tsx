'use client';

import React from 'react';

import { config } from '~/lib/viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type State, WagmiProvider } from 'wagmi';

interface Props extends React.PropsWithChildren {
  initialState: State | undefined;
}

const Web3Provider = ({ children, initialState }: Props) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
