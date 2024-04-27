import {
  ForeignCallHandler,
  ForeignCallInput,
  ForeignCallOutput,
} from '@noir-lang/noir_js';

import '~/types/noir';
import { Coordinate } from '~/types/noir';

export const foreignCallHandler: ForeignCallHandler = async (
  name: string,
  inputs: ForeignCallInput[]
): Promise<ForeignCallOutput[]> => {
  const [lat1, lon1, lat2, lon2] = parseCoordinates(inputs);

  const distance = calculateDistance(lat1, lon1, lat2, lon2);

  return [distance.toString(16)];
};

export const parseCoordinates = (params: ForeignCallInput[]) => {
  let coordinates = [];
  for (let index = 0; index < params.length; index += 3) {
    const sign = parseInt(params[index]![0]!, 16) === 1 ? -1 : 1;
    const integral = parseInt(params![index + 1]![0]!, 16);
    const fractional = parseInt(params![index + 2]![0]!, 16);
    const totalDecimals = String(fractional).length;
    coordinates.push(
      sign * (integral + fractional / Math.pow(10, totalDecimals))
    );
  }

  return coordinates as [number, number, number, number];
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(0));
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const serializeCoordinates = (
  coordinates: [number, number]
): Coordinate => {
  const [lat, lon] = coordinates;
  const latSign = lat < 0;
  const lonSign = lon < 0;
  const latIntegral = Math.abs(Math.floor(lat));
  const lonIntegral = Math.abs(Math.floor(lon));
  const latDecimals = String(lat).split('.')[1]?.length || 0;
  const lonDecimals = String(lon).split('.')[1]?.length || 0;

  const latFractional = parseInt(
    String(lat).split('.')[1]?.substring(0, 4) ?? '0'
  );
  const lonFractional = parseInt(
    String(lon).split('.')[1]?.substring(0, 4) ?? '0'
  );

  return {
    latitude: {
      negative: latSign,
      integral: latIntegral,
      fractional: latFractional,
    },
    longitude: {
      negative: lonSign,
      integral: lonIntegral,
      fractional: lonFractional,
    },
  };
};

export const getRange = (distance: number) => {
  let range: [number, number] = [0, 0];

  if (distance > 0 && distance <= 500) {
    range = [1, 500];
  } else if (distance > 500 && distance <= 1000) {
    range = [500, 1000];
  } else if (distance > 1000 && distance <= 3000) {
    range = [1000, 3000];
  } else if (distance > 3000 && distance <= 5000) {
    range = [3000, 5000];
  } else if (distance > 5000 && distance <= 10000) {
    range = [5000, 10000];
  } else {
    range = [10000, 20000];
  }

  return range;
};
