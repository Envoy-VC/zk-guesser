import { CompiledCircuit } from '@noir-lang/backend_barretenberg';

export const noirCircuit: CompiledCircuit = {
  abi: {
    parameters: [
      {
        name: 'range',
        type: {
          kind: 'array',
          length: 2,
          type: { kind: 'integer', sign: 'unsigned', width: 64 },
        },
        visibility: 'public',
      },
      { name: 'operator', type: { kind: 'field' }, visibility: 'public' },
      {
        name: 'hashed_message',
        type: {
          kind: 'array',
          length: 32,
          type: { kind: 'integer', sign: 'unsigned', width: 8 },
        },
        visibility: 'public',
      },
      {
        name: 'signature',
        type: {
          kind: 'array',
          length: 64,
          type: { kind: 'integer', sign: 'unsigned', width: 8 },
        },
        visibility: 'private',
      },
      {
        name: 'publicKey',
        type: {
          kind: 'struct',
          path: 'ecrecover::PublicKey',
          fields: [
            {
              name: 'pub_x',
              type: {
                kind: 'array',
                length: 32,
                type: { kind: 'integer', sign: 'unsigned', width: 8 },
              },
            },
            {
              name: 'pub_y',
              type: {
                kind: 'array',
                length: 32,
                type: { kind: 'integer', sign: 'unsigned', width: 8 },
              },
            },
          ],
        },
        visibility: 'private',
      },
      {
        name: 'guess',
        type: {
          kind: 'struct',
          path: 'coordinates::Coordinate',
          fields: [
            {
              name: 'latitude',
              type: {
                kind: 'struct',
                path: 'coordinates::Latitude',
                fields: [
                  { name: 'negative', type: { kind: 'boolean' } },
                  {
                    name: 'integral',
                    type: { kind: 'integer', sign: 'signed', width: 32 },
                  },
                  {
                    name: 'fractional',
                    type: { kind: 'integer', sign: 'unsigned', width: 32 },
                  },
                ],
              },
            },
            {
              name: 'longitude',
              type: {
                kind: 'struct',
                path: 'coordinates::Longitude',
                fields: [
                  { name: 'negative', type: { kind: 'boolean' } },
                  {
                    name: 'integral',
                    type: { kind: 'integer', sign: 'signed', width: 32 },
                  },
                  {
                    name: 'fractional',
                    type: { kind: 'integer', sign: 'unsigned', width: 32 },
                  },
                ],
              },
            },
          ],
        },
        visibility: 'private',
      },
      {
        name: 'actual',
        type: {
          kind: 'struct',
          path: 'coordinates::Coordinate',
          fields: [
            {
              name: 'latitude',
              type: {
                kind: 'struct',
                path: 'coordinates::Latitude',
                fields: [
                  { name: 'negative', type: { kind: 'boolean' } },
                  {
                    name: 'integral',
                    type: { kind: 'integer', sign: 'signed', width: 32 },
                  },
                  {
                    name: 'fractional',
                    type: { kind: 'integer', sign: 'unsigned', width: 32 },
                  },
                ],
              },
            },
            {
              name: 'longitude',
              type: {
                kind: 'struct',
                path: 'coordinates::Longitude',
                fields: [
                  { name: 'negative', type: { kind: 'boolean' } },
                  {
                    name: 'integral',
                    type: { kind: 'integer', sign: 'signed', width: 32 },
                  },
                  {
                    name: 'fractional',
                    type: { kind: 'integer', sign: 'unsigned', width: 32 },
                  },
                ],
              },
            },
          ],
        },
        visibility: 'private',
      },
    ],
    param_witnesses: {
      actual: [{ start: 169, end: 175 }],
      guess: [{ start: 163, end: 169 }],
      hashed_message: [{ start: 3, end: 35 }],
      operator: [{ start: 2, end: 3 }],
      publicKey: [{ start: 99, end: 163 }],
      range: [{ start: 0, end: 2 }],
      signature: [{ start: 35, end: 99 }],
    },
    return_type: null,
    return_witnesses: [],
  },
  bytecode:
    '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',
};
