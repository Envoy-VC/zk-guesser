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

  //const locations = await getLocationsForGameId(Number(gameId));

  return (
    <GameWrapper
      gameId={hexToBigInt(gameId)}
      locations={[
        {
          x: 13,
          y: 12,
        },
      ]}
      // locations={locations.location_point ?? []}
    ></GameWrapper>
  );
};

export default GamePage;
