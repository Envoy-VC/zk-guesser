'use server';

import { sql } from '@vercel/postgres';

import { LocationPoint, Row } from '~/types/server';

export const getLocationsForGameId = async (gameId: number) => {
  const { rows } = await sql`SELECT * FROM zkguessergames WHERE id = ${gameId}`;
  return rows[0] as Row;
};

export const storeGameLocations = async (
  gameId: number,
  locations: LocationPoint[]
) => {
  if (locations.length !== 8) {
    throw new Error('Invalid number of locations');
  }
  const Points = Array(8)
    .fill(true)
    .map(
      (val, index) => `POINT(${locations[index]?.x},${locations[index]?.x})`
    );

  const query = `
    INSERT INTO zkguessergames (id, location_point)
    VALUES
    (${gameId}, ARRAY[${Points.join(',')}])`;

  console.log(query);

  // await sql.query(query);
};
