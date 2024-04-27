'use client';

import { LocationPoint } from '~/types/server';

export const getMapillaryImage = async (location: LocationPoint) => {
  const { x, y } = location;
  const lat = Number(x.toFixed(3));
  const lon = Number(y.toFixed(3));


  const getImage = async (precision: number) => {
    const box = {
      x1: Number((lon - precision).toFixed(3)),
      y1: Number((lat - precision).toFixed(3)),
      x2: Number((lon + precision).toFixed(3)),
      y2: Number((lat + precision).toFixed(3)),
    };
    const bbox = `${box.x1},${box.y1},${box.x2},${box.y2}`;
    const res = await fetch(
      `https://graph.mapillary.com/images?access_token=MLY|6595222197247556|926b1a426752978da130b0fd07b73cb0&fields=id&bbox=${bbox}`
    );

    const data = (await res.json()) as {
      data: { id: string }[];
    };

    if (data.data.length > 0 && data.data[0]) {
      const image = data.data[0];
      return image.id;
    } else {
      // recursion
      return await getImage(precision * 2);
    }
  };

  return getImage(0.01);
};
