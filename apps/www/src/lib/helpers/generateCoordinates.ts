// @ts-nocheck
import geoPolygons from '~/lib/geo-polygons.json';

// @ts-ignore
import area from '@turf/area';
// @ts-ignore
import bboxPolygon from '@turf/bbox-polygon';

import { LocationPoint } from '~/types/server';

export type Regions = 'nam' | 'eur' | 'afr' | 'asi' | 'oce' | 'wrl';

export const GameRegions = [
  {
    name: 'World',
    value: 'wrl',
    image:
      'https://us.123rf.com/450wm/kerdazz/kerdazz1403/kerdazz140300008/26817433-abstract-map-of-the-world-made-of-3d-blue-boxes.jpg?ver=6',
  },
  {
    name: 'North America',
    value: 'nam',
    image:
      'https://us.123rf.com/450wm/ahasoft2000/ahasoft20001804/ahasoft2000180406672/99602845-winter-north-america-map-vector-geographic-map-in-blue-frosty-colors-vector-concept-of-north-america.jpg?ver=6',
  },
  {
    name: 'Europe',
    value: 'eur',
    image:
      'https://us.123rf.com/450wm/kerdazz/kerdazz1403/kerdazz140300037/26956338-abstract-map-of-the-europe-made-of-blue-and-white-boxes.jpg?ver=6',
  },
  {
    name: 'Africa',
    value: 'afr',
    image:
      'https://us.123rf.com/450wm/kerdazz/kerdazz1403/kerdazz140300016/26956290-abstract-map-of-the-africa-made-of-blue-and-white-boxes.jpg?ver=6',
  },
  {
    name: 'Asia',
    value: 'asi',
    image:
      'https://us.123rf.com/450wm/kerdazz/kerdazz1403/kerdazz140300031/26956315-abstract-map-of-the-asia-made-of-blue-and-white-boxes.jpg?ver=6',
  },
  {
    name: 'Oceania',
    value: 'oce',
    image:
      'https://us.123rf.com/450wm/kerdazz/kerdazz1403/kerdazz140300034/26956325-abstract-map-of-the-australia-made-of-blue-and-white-boxes.jpg?ver=6',
  },
] as const;

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

export const getGameLocations = (region: Regions) => {
  const locations: LocationPoint[] = [];
  for (let i = 0; i < 8; i++) {
    const [lat, lon] = genRandomCoords(region);
    locations.push({
      x: lat,
      y: lon,
    });
  }
  return locations;
};
