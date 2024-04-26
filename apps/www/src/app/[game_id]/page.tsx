import React from 'react';

import { getLocationsForGameId } from '~/lib/server';

import { hexToBigInt, isHex } from 'viem';

import { GameWrapper } from '~/components/wrapper';

interface Props {
  params: { game_id: string };
}

const GamePage = async ({ params }: Props) => {
  const gameId = params.game_id;

  if (!isHex(gameId)) {
    return <div>invalid game id</div>;
  }

  const locations = await getLocationsForGameId(Number(gameId));

  return (
    <GameWrapper
      gameId={hexToBigInt(gameId)}
      locations={locations.location_point ?? []}
    >
      <pre>{JSON.stringify(locations, null, 2)}</pre>
    </GameWrapper>
  );
};

export default GamePage;
