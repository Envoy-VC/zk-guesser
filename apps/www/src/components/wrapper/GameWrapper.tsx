'use client';

import React from 'react';

import { zkGuesserContract } from '~/lib/viem';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { ErrorScreen } from '~/screens';

import GuesserMap from '../guesser-map';

import { LocationPoint } from '~/types/server';

interface Props extends React.PropsWithChildren {
  gameId: bigint;
  locations: LocationPoint[];
}

const GameWrapper = ({ gameId, locations }: Props) => {
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        ...zkGuesserContract,
        functionName: '_nextGameId',
        args: [],
      },
      {
        ...zkGuesserContract,
        functionName: 'getPlayerIndex',
        args: address ? [address, gameId] : undefined,
      },
    ],
  });

  const gameExists = Number(data?.[0].result ?? BigInt(0)) > Number(gameId);
  const playerIndex = data?.[1].result;

  const isPlayer = playerIndex !== 8;

  if (!gameExists) {
    return <ErrorScreen message='Game does not exist' />;
  }

  if (!isPlayer) {
    return <ErrorScreen message='You are not a player in this game' />;
  }

  return (
    <Map
      locations={locations}
      gameId={gameId}
      playerIndex={Number(playerIndex)}
    />
  );
};

interface MapProps {
  locations: LocationPoint[];
  gameId: bigint;
  playerIndex: number;
}

const Map = ({ locations, gameId, playerIndex }: MapProps) => {
  const { data: currentRound } = useReadContract({
    ...zkGuesserContract,
    functionName: '_currentRound',
    args: [gameId, playerIndex],
  });

  if (currentRound)
    return (
      <GuesserMap
        location={locations[currentRound]!}
        gameId={gameId}
        currentRound={currentRound}
      />
    );
};

export default GameWrapper;
