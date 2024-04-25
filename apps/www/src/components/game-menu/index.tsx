import React from 'react';

import { useGameMenu } from '~/lib/stores/game-menu';
import { navItems } from '~/lib/stores/game-menu';
import { cn } from '~/lib/utils';

import { motion } from 'framer-motion';

const GameMenu = () => {
  const { activeItem, setActiveItem } = useGameMenu();
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex max-w-2xl flex-row items-end gap-1'>
        {navItems.map((ele) => {
          return (
            <div
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
      <div className='my-4 w-full max-w-screen-2xl rounded-md border border-neutral-500 bg-neutral-600/20 p-12 backdrop-blur-sm'>
        GameMenu
      </div>
    </div>
  );
};

export default GameMenu;
