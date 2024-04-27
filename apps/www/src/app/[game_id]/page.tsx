import React from 'react';

import { getLocationsForGameId } from '~/lib/server';

import { hexToBigInt, isHex } from 'viem';
import { ErrorScreen } from '~/screens';

import { GameWrapper } from '~/components/wrapper';

interface Props {
  params: { game_id: string };
}

const GamePage = async ({ params }: Props) => {
  const gameId = params.game_id;

  if (!isHex(gameId)) {
    return <ErrorScreen message='Invalid Game ID' />;
  }

  const locations = await getLocationsForGameId(Number(gameId));

  return (
    <GameWrapper
      gameId={hexToBigInt(gameId)}
      locations={locations ? locations.location_point : []}
    />
  );
};

export default GamePage;
