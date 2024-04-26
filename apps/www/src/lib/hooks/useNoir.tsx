import { noirCircuit } from '~/lib/circuit';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { toHex } from 'viem';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import {
  calculateDistance,
  serializeCoordinates,
} from '../helpers/coordinates';
import { foreignCallHandler } from '../helpers/coordinates';
import { config, getSignedMessage, zkGuesserContract } from '../viem';

import { ZKGuesserInputs } from '~/types/noir';

const useNoir = () => {
  const { address } = useAccount();
  const OPERATOR = '0x0009D5d42d946c42E8138D7EfE483118dbCA414B';

  const generateProof = async (
    gameId: bigint,
    _actual: [number, number],
    _guess: [number, number]
  ) => {
    try {
      const actual = serializeCoordinates(_actual);
      const guess = serializeCoordinates(_guess);
      const distance = calculateDistance(
        _actual[0],
        _actual[1],
        _guess[0],
        _guess[1]
      );

      let range: [number, number] = [0, 0];
      if (distance > 0 && distance <= 1000) {
        range = [1, 1000];
      } else if (distance > 1000 && distance <= 5000) {
        range = [1001, 5000];
      } else if (distance > 5000 && distance <= 10000) {
        range = [5001, 10000];
      } else {
        range = [10001, 20000];
      }

      if (!address) throw new Error('Please connect your wallet.');
      const backend = new BarretenbergBackend(noirCircuit);
      const noir = new Noir(noirCircuit, backend);

      // @ts-expect-error err
      const message = await readContract(config, {
        ...zkGuesserContract,
        chainId: 534351,
        functionName: 'getSigningMessage',
        args: [address, gameId],
      });

      const { hashed_message, signature, pub_x, pub_y } =
        await getSignedMessage(message);

      const inputs: ZKGuesserInputs = {
        range,
        operator: '0x0009D5d42d946c42E8138D7EfE483118dbCA414B',
        hashed_message,
        signature,
        publicKey: {
          pub_x,
          pub_y,
        },
        guess,
        actual,
      };

      const proof = await noir.generateProof(inputs, foreignCallHandler);
      console.log(toHex(proof.proof));
      return proof;
    } catch (error) {}
  };
  return { generateProof };
};

export default useNoir;
