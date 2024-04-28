# 🗺️ ZK Guesser

ZK Guesser is a decentralized geo-location guessing game built on zero-knowledge proofs. Players attempt to pinpoint a hidden location on a map, but unlike traditional GeoGuessr, their exact guesses remain hidden. Through zero-knowledge proofs, the game verifies that guesses fall within a designated proximity to the actual location.

![OG Image](https://zk-guesser.vercel.app/og.png)

Players can start game choosing different regions such as:

1. World
2. Europe
3. Asia
4. Africa
5. North America
6. Oceania

The game contracts are deployed and verified on Scroll Sepolia Blockchain. The contracts are deployed at the following addresses:

```bash
# GameLib(Helper Library for the Game)
0x3b9A09147840FeC2B40234ca717C8DEEa13985Ba
# UltraVerifier(Compiled plonk_vk prover)
0xe86b1899376c77e1a109eA2124E462EF58E56897
# ZKGuesser(Main Game Contract)
0xb2af159c02b708f3270929d6d2b0e01b415cbfab
```

---

## How Proofs are generated?

The Proofs are written in Noir DSL and compiled using the Noir compiler. The compiled proof is then used to verify the guess of the player. The proof is generated using the following steps:

The circuit takes the following public inputs:

- The Game Operator Address
- The Hashed message to be signed by operator
- Range Start
- Range End

```ts
// Hashed Message
keccak256(abi.encodePacked(playerAddress, gameId, currentRound, start, end));
```

And the following private inputs:

- The player's guess
- The Actual Answer
- Operator's Signature for the hashed Message
- Operator Public Key X
- Operator Public Key Y

1. First the Signature is Verified using the Operator's Public Key and the Hashed Message.
2. Then the guess is verified to be within the range of the actual answer.
3. The proof is then generated using the above inputs and the compiled proof is then used to verify the guess of the player.

The Circuits also use an Oracle to calculate distance between the co-ordinates of the guess and the actual answer. The Oracle is a simple RPC server that calculates the distance between two co-ordinates.

An example can be found in the `packages/rpc-server` directory.

---

## How Random Locations are Generated?

Random locations around the globe or a region are done using geo spatial data. Under the hood it uses libraries like `@turf/bbox-polygon` and `@turf/area` to compute on the existing Geo Spatial data and generate coordinates avoiding water bodies and other non-land areas.

---

## 🧑🏼‍💻 Tech Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn
- **Integration**: wagmi, viem, noir-js
- **Smart Contracts**: Foundry, Solidity, Scroll Sepolia
- **Circuits**: Noir DSL, Noir Compiler

---

## 🚀 Quick Start

Clone the repository

```bash
git clone https://github.com/Envoy-VC/zk-guesser.git
```

Install dependencies

```bash
cd zk-guesser
pnpm install
```

To Start Generating Proofs you need to start a small RPC server for oracles. Go to `packages/rpc-server` and run the following commands:

```bash
cd packages/rpc-server
pnpm dev
```

Then to verify the proofs, Go to `packages/circuits` and run the following commands:

```bash
pnpm prove
```

Or to test the circuit, run the following command:

```bash
pnpm test
```

To start the frontend, Go to `apps/www` and run the following commands:

```bash
cd apps/www
pnpm dev
```

---
