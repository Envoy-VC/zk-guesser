// @ts-nocheck
import geoPolygons from '~/lib/geo-polygons.json';

// @ts-ignore
import area from '@turf/area';
// @ts-ignore
import bboxPolygon from '@turf/bbox-polygon';

export type Regions = 'nam' | 'eur' | 'afr' | 'asi' | 'oce' | 'wrl';

const randRange = (min: number, max: number, integer = true) =>
  ((wt) => (integer ? Math.round(wt) : wt))(Math.random() * (max - min) + min);

export function randChance(prpt) {
  const randomVal = Math.random() * prpt.reduce((r, c) => r + c, 0);
  let last = 0;
  for (let i = 0; i < prpt.length; i++) {
    const curr = last + prpt[i];
    if (randomVal < curr) return i;
    last = curr;
  }
}

export default function calcGeoArea(pointA, pointB) {
  return area(
    bboxPolygon([...pointA.slice().reverse(), ...pointB.slice().reverse()])
  );
}

export function scaleArray(arr, maxVal, fixed = Infinity) {
  const max = Math.max(...arr);
  return arr.map((el) =>
    ((wt) => (fixed === Infinity ? wt : +wt.toFixed(fixed)))(
      (el / max) * maxVal
    )
  );
}

function allPolygons(obj) {
  if (obj instanceof Array) return obj;
  return Object.values(obj).reduce((res, curr) => [
    ...res,
    ...allPolygons(curr),
  ]);
}

export function genRandomCoords(region: Regions) {
  const regPlg = allPolygons(
    region === 'wrl' ? geoPolygons : geoPolygons[region]
  );
  const proportions = scaleArray(
    regPlg.map((el) => calcGeoArea(...el)),
    10000,
    6
  );

  const randPlg = regPlg[randChance(proportions)];
  return [
    randRange(randPlg[0][0], randPlg[1][0], false),
    randRange(randPlg[0][1], randPlg[1][1], false),
  ];
}

export const getGameLocations = () => {
  const locations = [];
  for (let i = 0; i < 8; i++) {
    locations.push(genRandomCoords('wrl'));
  }
  return locations;
};
