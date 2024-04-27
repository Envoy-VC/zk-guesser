'use client';

import React from 'react';

import { zkGuesserContract } from '~/lib/viem';

import { useAccount, useReadContracts } from 'wagmi';
import { ErrorScreen } from '~/screens';

import GuesserMap from '../guesser-map';

import { LocationPoint } from '~/types/server';

interface Props extends React.PropsWithChildren {
  gameId: bigint;
  locations: LocationPoint[];
}

const GameWrapper = ({ children, gameId, locations }: Props) => {
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        ...zkGuesserContract,
        functionName: '_games',
        args: [gameId],
      },
      {
        ...zkGuesserContract,
        functionName: 'isPlayer',
        args: address ? [address, gameId] : undefined,
      },
      {
        ...zkGuesserContract,
        functionName: '_nextGameId',
        args: [],
      },
    ],
  });

  const currentTime = Math.round(Date.now() / 1000);
  const startTime = Number(data?.[0]?.result?.[2] ?? BigInt(0));
  const endTime = startTime + 40 * 60;
  const gameExists = Number(data?.[2].result ?? BigInt(0)) > Number(gameId);
  const isPlayer = data?.[1].result ?? false;
  const currentRound = Math.round(Number((currentTime - startTime) / 300));

  if (!gameExists) {
    return <ErrorScreen message='Game does not exist' />;
  }

  if (endTime < Math.floor(Date.now() / 1000)) {
    return <ErrorScreen message='Game has ended' />;
  }

  if (!isPlayer) {
    return <ErrorScreen message='You are not a player in this game' />;
  }

  return (
    <GuesserMap
      location={locations[currentRound]!}
      startTime={startTime}
      gameId={gameId}
    />
  );
};

export default GameWrapper;
