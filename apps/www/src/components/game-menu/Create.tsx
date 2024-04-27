'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import {
  GameRegions,
  getGameLocations,
} from '~/lib/helpers/generateCoordinates';

import { storeGameLocations } from '~/lib/server';
import { config, zkGuesserContract } from '~/lib/viem';

import { toast } from 'sonner';
import { useAccount, useWriteContract } from 'wagmi';
import { readContract } from 'wagmi/actions';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';

import { Button } from '../ui/button';

const CreateGame = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);

  const [isCreating, setIsCreating] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const createGame = async () => {
    try {
      if (!address) {
        throw new Error('Please connect your wallet');
      }

      setIsCreating(true);
      const nextGameId = await readContract(config, {
        ...zkGuesserContract,
        functionName: '_nextGameId',
        args: [],
      });

      const region = GameRegions[current - 1]?.value!;
      const locations = getGameLocations(region);

      console.log(locations);

      await writeContractAsync({
        ...zkGuesserContract,
        functionName: 'createGame',
      });

      await storeGameLocations(Number(nextGameId), locations);
      toast.success(`Game created successfully`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='flex flex-col gap-12'>
      <div className='font-pricedown text-5xl'>Select Game Mode</div>
      <Carousel setApi={setApi} className='mx-6 aspect-video max-w-sm'>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='flex max-w-sm flex-col items-center justify-center'
            >
              <img
                src={GameRegions[index]?.image}
                alt={GameRegions[index]?.name}
                className='aspect-video h-full w-full rounded-xl object-cover'
              />
              <div className='py-1 text-lg font-medium'>
                {GameRegions[index]?.name}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='dark translate-x-4' />
        <CarouselNext className='dark -translate-x-4' />
      </Carousel>
      <Button
        onClick={createGame}
        disabled={isCreating}
        className='mx-6 my-6 max-w-sm'
        variant='secondary'
      >
        Create Game
      </Button>
    </div>
  );
};

export default CreateGame;
