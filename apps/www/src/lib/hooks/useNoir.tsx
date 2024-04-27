import {
  calculateDistance,
  foreignCallHandler,
  serializeCoordinates,
} from '~/lib/helpers/coordinates';

import { noirCircuit } from '~/lib/circuit';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { encodePacked, keccak256, toHex } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { getSignedMessage, zkGuesserContract } from '../viem';

import { ZKGuesserInputs } from '~/types/noir';

const useNoir = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const OPERATOR = '0xe269688F24e1C7487f649fC3dCD99A4Bf15bDaA1';

  const generateProof = async (
    gameId: bigint,
    currentRound: number,
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
      const backend = new BarretenbergBackend(noirCircuit, { threads: 10 });
      const noir = new Noir(noirCircuit, backend);

      const message = keccak256(
        encodePacked(
          ['address', 'uint256', 'uint8'],
          [address, gameId, currentRound]
        )
      );

      const { hashed_message, signature, pub_x, pub_y } =
        await getSignedMessage(message);

      const inputs: ZKGuesserInputs = {
        range,
        operator: OPERATOR,
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
      const hexProof = toHex(proof.proof);

      const res = await writeContractAsync({
        ...zkGuesserContract,
        functionName: 'makeGuess',
        args: [gameId, hexProof],
      });

      return {
        hash: res,
        proof: hexProof,
        distance: distance,
      };
    } catch (error) {
      console.log(error);
    }
  };
  return { generateProof };
};

export default useNoir;
