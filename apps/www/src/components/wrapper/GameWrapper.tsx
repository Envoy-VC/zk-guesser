'use client';

import React from 'react';

import { zkGuesserContract } from '~/lib/viem';

import { useAccount, useReadContracts } from 'wagmi';

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

  //   const startTime = Number(data?.[0]?.result?.[2] ?? BigInt(0));
  //   // end = start + 24 min
  //   const endTime = startTime + 40 * 60;
  //   const gameExists = Number(data?.[2].result ?? BigInt(0)) > Number(gameId);
  //   const isPlayer = data?.[1].result ?? false;
  //   const currentRound = Number((endTime - startTime) / 300);

  const currentTime = Math.round(Date.now() / 1000);
  const startTime = Math.round(Date.now() / 1000) - 4;
  const endTime = startTime + 40 * 60;
  const gameExists = true;
  const isPlayer = true;
  const currentRound = Math.floor((currentTime - startTime) / 300);

  if (!gameExists) {
    return <div>Game not found</div>;
  }

  if (endTime < Math.floor(Date.now() / 1000)) {
    return <div>Game ended</div>;
  }

  if (!isPlayer) {
    return <div>Not a player</div>;
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
