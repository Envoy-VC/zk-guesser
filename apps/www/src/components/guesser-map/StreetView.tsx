'use client';

import React, { useEffect, useRef } from 'react';

import { getMapillaryImage } from '~/lib/helpers/mapillary';

import { useQuery } from '@tanstack/react-query';
import { Viewer, ViewerOptions } from 'mapillary-js';
import { env } from '~/env';

import { LocationPoint } from '~/types/server';

interface Props {
  location: LocationPoint;
}

const StreetView = ({ location }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  const { data: image } = useQuery({
    queryKey: ['mapillary-image', location.x, location.y],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const res = await getMapillaryImage(location);
      console.log(res, location);
      return res;
    },
  });

  useEffect(() => {
    if (!viewerRef.current) return;

    if (!image) return;

    const container = viewerRef.current;
    container.className = 'relative w-full h-full z-[10]';

    const options: ViewerOptions = {
      accessToken: env.NEXT_PUBLIC_MAPILLARY_CLIENT_ID,
      container,
      imageId: image,
    };

    const viewer = new Viewer(options);

    return () => {
      viewer.remove();
    };
  }, [image]);

  return <div ref={viewerRef} className='z-[1000] h-full w-full border'></div>;
};

export default StreetView;
