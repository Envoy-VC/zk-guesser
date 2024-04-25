import {
  createWalletClient,
  encodePacked,
  hashMessage,
  http,
  keccak256,
  recoverPublicKey,
  toBytes,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount(
  '0xf03e0d12c515d029737a1667a0aa032ede7b750f512475c8564aa04e0d7b4797'
);

const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});

console.log('Address: ', client.account.address);

const message =
  '0xdf43c8efdff555f8010c2d51358c47a19321a466392b3be3b38187ad0ed11275';

const hashedMessage = hashMessage({ raw: message });

const sig = await client.signMessage({
  message: { raw: message },
});

console.log('Hashed Message: ', toBytes(hashedMessage));
console.log('Signature: ', toBytes(sig));

const pubKey = await recoverPublicKey({
  hash: hashedMessage,
  signature: sig,
});

const pub = pubKey.slice(4);

const pub_x = toBytes(`0x${pub.substring(0, 64)}`);
const pub_y = toBytes(`0x${pub.substring(64)}`);

console.log('Pub X: ', pub_x);
console.log('Pub Y: ', pub_y);
