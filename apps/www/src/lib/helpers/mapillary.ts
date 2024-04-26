import { LocationPoint } from '~/types/server';

export const getMapillaryImage = async (location: LocationPoint) => {
  const { x: lat, y: lon } = location;
  // float,float,float,float: filter images in the bounding box. Specify in this order: left, bottom, right, top (or minLon, minLat, maxLon, maxLat).
  const precision = 0.001;
  const bbox = `${lon - precision},${lat - precision},${lon + precision},${lat + precision}`;
  const res = await fetch(
    `https://graph.mapillary.com/images?access_token=MLY|6595222197247556|926b1a426752978da130b0fd07b73cb0&fields=id&bbox=${bbox}`
  );

  const data = (await res.json()) as {
    data: { id: string }[];
  };
  return data.data;
};
