import {
  Hex,
  createWalletClient,
  hashMessage,
  recoverPublicKey,
  toBytes,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
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

const account = privateKeyToAccount(
  env.NEXT_PUBLIC_OPERATOR_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  chain: scrollSepolia,
  transport: http(env.NEXT_PUBLIC_ANKR_RPC_URL),
});

export const getSignedMessage = async (message: Hex) => {
  const hashedMessage = hashMessage({ raw: message }, 'bytes');
  const sig = await walletClient.signMessage({
    message: { raw: message },
  });

  const signature = Array.from(toBytes(sig).subarray(0, 64));

  const pubKey = await recoverPublicKey({
    hash: hashedMessage,
    signature: sig,
  });

  const pub = pubKey.slice(4);

  const pub_x = Array.from(toBytes(`0x${pub.substring(0, 64)}`));
  const pub_y = Array.from(toBytes(`0x${pub.substring(64)}`));

  return { hashed_message: Array.from(hashedMessage), signature, pub_x, pub_y };
};
