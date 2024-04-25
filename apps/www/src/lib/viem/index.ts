import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, scrollSepolia } from 'wagmi/chains';
import { env } from '~/env';

import { ZK_GUESSER_ABI } from './abi';

export const config = createConfig({
  chains: [mainnet, scrollSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [scrollSepolia.id]: http(env.NEXT_PUBLIC_ANKR_RPC_URL),
  },
});

export const zkGuesserContract = {
  abi: ZK_GUESSER_ABI,
  address: '',
};

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
