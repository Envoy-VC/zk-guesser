export const ZK_GUESSER_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'verifier_', type: 'address', internalType: 'address' },
      { name: 'initialOwner_', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_currentRound',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_games',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'totalRounds', type: 'uint8', internalType: 'uint8' },
      { name: 'totalPlayers', type: 'uint8', internalType: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_nextGameId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_scores',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_totalScores',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_verifier',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract UltraVerifier' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getSigningMessage',
    inputs: [
      { name: '_player', type: 'address', internalType: 'address' },
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isPlayer',
    inputs: [
      { name: '_player', type: 'address', internalType: 'address' },
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'joinGame',
    inputs: [{ name: '_gameId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'makeGuess',
    inputs: [
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: '_proof', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'GameFull',
    inputs: [{ name: '_gameId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'GameNotExists',
    inputs: [{ name: '_gameId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidPlayer',
    inputs: [
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: 'player', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidRound',
    inputs: [
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: 'player', type: 'address', internalType: 'address' },
      { name: 'round', type: 'uint8', internalType: 'uint8' },
    ],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'PlayerAlreadyJoined',
    inputs: [
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: 'player', type: 'address', internalType: 'address' },
    ],
  },
] as const;
