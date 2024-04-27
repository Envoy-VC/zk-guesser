'use client';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import { Rnd as ResizableContainer } from 'react-rnd';

import { calculateDistance } from '~/lib/helpers/coordinates';

import { useNoir } from '~/lib/hooks';
import { useMapStore } from '~/lib/stores';

import { LatLng, Map } from 'leaflet';
import { polyline } from 'leaflet';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from '~/components/ui/alert-dialog';

import { Button } from '../ui/button';
import MiniMap from './MiniMap';
import StreetView from './StreetView';

import { LocationPoint } from '~/types/server';

interface Props {
  location: LocationPoint;
  currentRound: number;
  gameId: bigint;
}

const GuesserMap = ({ location, gameId, currentRound }: Props) => {
  const { generateProof } = useNoir();
  const { markers, updateMarker } = useMapStore();
  const mapRef = React.useRef<Map>(null);
  const containerRef = React.useRef<ResizableContainer>(null);

  const [isGuessing, setIsGuessing] = React.useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const addPolyline = () => {
    const points: LatLng[] = [];
    points.push(new LatLng(location.x, location.y));
    points.push(new LatLng(markers.guess[0], markers.guess[1]));
    updateMarker('answer', [location.x, location.y]);
    polyline(points, { color: 'red' }).addTo(mapRef.current!);
  };

  const onGuess = async () => {
    try {
      setIsGuessing(true);
      const proof = await generateProof(
        gameId,
        currentRound,
        [location.x, location.y],
        [markers.guess[0], markers.guess[1]]
      );

      if (!proof) {
        throw new Error('Something Went Wrong.');
      }

      addPolyline();
      setIsDialogOpen(true);
      setIsGuessing(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className='relative h-screen w-full'>
      <link
        href='https://unpkg.com/mapillary-js@4.1.2/dist/mapillary.css'
        rel='stylesheet'
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className='z-[200]'>
          <div className='flex w-full flex-col p-6 text-center'>
            <div>Your Guess was</div>
            <div className='text-5xl'>
              {calculateDistance(
                markers.answer?.[0] ?? 0,
                markers.answer?.[1] ?? 0,
                markers.guess[0],
                markers.guess[1]
              )}{' '}
              km
            </div>
            <div>Away</div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ResizableContainer
        ref={containerRef}
        default={{
          x: 0,
          y: 0,
          width: 480,
          height: 270,
        }}
        onResize={() => {
          mapRef.current?.invalidateSize();
        }}
        disableDragging
        lockAspectRatio={16 / 9}
        className='absolute left-0 top-0 z-[100] h-full w-full rounded-lg  bg-white pb-12 pt-1'
      >
        <div className='flex flex-row items-center justify-between px-2 pb-2'>
          <div className='flex flex-col text-sm'>
            <div className='flex flex-row items-center gap-1'>
              <div className='font-medium'>Coordinates:</div>
              {markers.guess[0].toFixed(3)}, {markers.guess[1].toFixed(3)}
            </div>
            <div className='flex flex-row items-center gap-1'>
              <div className='font-medium'>Current Round: </div>
              {currentRound + 1}
            </div>
          </div>
          <Button className='h-8' onClick={onGuess} disabled={isGuessing}>
            {isGuessing ? 'Guessing...' : 'Guess'}
          </Button>
        </div>
        <MapContainer
          ref={mapRef}
          center={[51.505, -0.09]}
          zoom={3}
          scrollWheelZoom={false}
          className='relative aspect-video h-full w-full rounded-lg'
        >
          <MiniMap />
        </MapContainer>
      </ResizableContainer>
      <StreetView location={location} />
    </div>
  );
};

export default GuesserMap;
