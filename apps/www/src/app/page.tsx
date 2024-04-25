'use client';

import React from 'react';

import { useGameMenu } from '~/lib/stores';

import { GameMenu, HomeNavigation } from '~/components';
import Buildings from '~/screens/Buildings';

const Home = () => {
  const { isOpen } = useGameMenu();

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute top-0 h-full w-full'>
        <Buildings />
      </div>
      <div className='relative z-[100] mx-4 my-12 flex w-fit flex-col gap-12  text-white sm:mx-24 sm:my-24 sm:px-0'>
        <div className='font-pricedown text-[3.2rem] md:text-[5rem] '>
          MAPPING OUT ZK
        </div>
        <div className='relative min-w-[80vw]'>
          {isOpen ? <GameMenu /> : <HomeNavigation />}
        </div>
      </div>
    </div>
  );
};

export default Home;
