import {
  createWalletClient,
  hashMessage,
  http,
  recoverPublicKey,
  toBytes,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount(
  '0x91487f27e131659af251cad31eb46012d83410428c1ddf8392611c40fccd91bc'
);

const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});

console.log('Address: ', client.account.address);
const message = 'hello world';
console.log('Hashed Message: ', hashMessage(message, 'bytes'));

const sig = await client.signMessage({
  message: { raw: toBytes(message) },
});

console.log('Signature: ', toBytes(sig).subarray(0, 64));

const pubKey = await recoverPublicKey({
  hash: hashMessage(message),
  signature: sig,
});

const pub = pubKey.slice(4);
console.log('Public Key: ', pub);

const pub_x = toBytes(`0x${pub.substring(0, 64)}`);
const pub_y = toBytes(`0x${pub.substring(64)}`);
console.log({ pub_x, pub_y });
