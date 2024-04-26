'use client';

import React from 'react';

import { useGameMenu } from '~/lib/stores/game-menu';
import { navItems } from '~/lib/stores/game-menu';
import { cn } from '~/lib/utils';

import { motion } from 'framer-motion';

import ConnectButton from '../connect-button';
import { Button } from '../ui/button';

const GameMenu = () => {
  const { activeItem, setActiveItem } = useGameMenu();
  return (
    <div className='flex w-full min-w-[80dvw] flex-col gap-3'>
      <div className='flex w-full flex-col items-start justify-between lg:flex-row'>
        <div className='flex w-full max-w-xl flex-row items-end gap-1'>
          {navItems.map((ele) => {
            return (
              <div
                key={ele.key}
                onClick={() => setActiveItem(ele.key)}
                className='relative flex w-full cursor-pointer'
              >
                {activeItem === ele.key && (
                  <motion.div
                    layoutId='underline'
                    className='absolute top-0 z-[100] flex w-full flex-col'
                  >
                    <div className='h-[5px] bg-[#ABEDAB]'></div>
                    <div className='h-8 bg-white  sm:h-12'></div>
                  </motion.div>
                )}

                <div className='mt-[6px] flex h-8 w-full items-center justify-center bg-black/50 px-6 py-2 text-2xl backdrop-blur-sm sm:h-12'></div>
                <div
                  className={cn(
                    'duration-50 absolute top-0 z-[101] flex h-full w-full items-center justify-center !text-sm transition-all ease-linear sm:!text-xl',
                    activeItem === ele.key ? 'text-black' : 'text-white'
                  )}
                >
                  {ele.label.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
        <ConnectButton />
      </div>
      <div className='my-4 w-full max-w-screen-2xl rounded-md border border-neutral-500 bg-neutral-600/20 p-12 backdrop-blur-sm'>
        <Button variant='secondary'>Generate Proof</Button>
      </div>
    </div>
  );
};

export default GameMenu;
