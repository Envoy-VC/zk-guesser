'use client';

import React from 'react';
import { MapContainer } from 'react-leaflet';

import { cn } from '~/lib/utils';

import { motion } from 'framer-motion';
import { Expand } from 'lucide-react';

import { Button } from '../ui/button';
import MiniMap from './MiniMap';
import StreetView from './StreetView';

import { LocationPoint } from '~/types/server';

interface Props {
  location: LocationPoint;
}

const GuesserMap = ({ location }: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);

  const [isFullSized, setIsFullSized] = React.useState<boolean>(true);

  const onResize = () => {
    setIsFullSized((prev) => !prev);
  };
  return (
    <div className='h-screen w-full'>
      <link
        href='https://unpkg.com/mapillary-js@4.1.2/dist/mapillary.css'
        rel='stylesheet'
      />
      <motion.div
        layout
        layoutId='map-container'
        className={cn(
          'absolute left-4 top-4 z-[100] flex aspect-video w-full flex-col rounded-lg bg-white',
          isFullSized ? 'max-w-screen-xl' : 'max-w-xl'
        )}
        ref={mapContainer}
      >
        <div className='flex justify-end'>
          <Button variant='ghost' size='icon' onClick={onResize}>
            <Expand size={16} />
          </Button>
        </div>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={3}
          scrollWheelZoom={false}
          className='relative h-full w-full rounded-lg'
        >
          <MiniMap />
        </MapContainer>
      </motion.div>
      <StreetView location={location} />
    </div>
  );
};

export default GuesserMap;
