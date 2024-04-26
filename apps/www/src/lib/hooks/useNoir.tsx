import React from 'react';

import { noirCircuit } from '~/lib/circuit';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { toHex } from 'viem';

import { foreignCallHandler } from '../helpers/coordinates';

import { ZKGuesserInputs } from '~/types/noir';

const useNoir = () => {
  const generateProof = async () => {
    const backend = new BarretenbergBackend(noirCircuit);
    const noir = new Noir(noirCircuit, backend);

    const inputs: ZKGuesserInputs = {
      range: [1, 1000],
      operator: '0x0009D5d42d946c42E8138D7EfE483118dbCA414B',
      hashed_message: [
        106, 66, 40, 170, 243, 63, 60, 17, 56, 150, 90, 247, 119, 140, 24, 98,
        183, 76, 104, 12, 120, 164, 239, 194, 63, 35, 27, 195, 193, 110, 80, 6,
      ],
      signature: [
        238, 40, 53, 223, 85, 186, 149, 138, 146, 3, 11, 177, 242, 12, 241, 111,
        50, 97, 95, 64, 246, 175, 94, 161, 189, 107, 13, 229, 61, 221, 34, 54,
        51, 178, 47, 31, 48, 45, 218, 68, 130, 26, 16, 205, 224, 81, 82, 188,
        218, 175, 255, 197, 188, 225, 228, 201, 184, 92, 195, 71, 113, 219, 141,
        107,
      ],
      publicKey: {
        pub_x: [
          224, 117, 65, 44, 181, 126, 126, 206, 100, 136, 127, 140, 111, 57, 8,
          6, 16, 68, 199, 139, 215, 145, 174, 95, 86, 106, 121, 40, 250, 45, 18,
          86,
        ],
        pub_y: [
          93, 241, 76, 152, 89, 186, 145, 163, 91, 68, 228, 13, 213, 15, 15,
          133, 185, 64, 236, 186, 59, 140, 113, 57, 87, 136, 133, 137, 109, 152,
          133, 57,
        ],
      },
      guess: {
        latitude: {
          negative: false,
          integral: 52,
          fractional: 52,
        },
        longitude: {
          negative: false,
          integral: 13,
          fractional: 4050,
        },
      },
      actual: {
        latitude: {
          negative: false,
          integral: 51,
          fractional: 5047,
        },
        longitude: {
          negative: true,
          integral: 0,
          fractional: 1278,
        },
      },
    };

    const proof = await noir.generateProof(inputs, foreignCallHandler);
    console.log(toHex(proof.proof));
    return proof;
  };
  return { generateProof };
};

export default useNoir;