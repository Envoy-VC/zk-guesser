'use client';

import React from 'react';

import { NavItemType, navItems, useGameMenu } from '~/lib/stores/game-menu';
import { cn } from '~/lib/utils';

const HomeNavigation = () => {
  const [hovered, setHovered] = React.useState<NavItemType>('play');

  const { setOpen } = useGameMenu();

  return (
    <div className='flex w-fit flex-col py-6 font-pricedown text-4xl text-neutral-400 sm:text-5xl'>
      {navItems.map((ele) => {
        return (
          <div
            className={cn(
              'cursor-pointer py-2 transition-all duration-200 ease-in-out hover:text-5xl hover:text-white sm:hover:text-6xl',
              hovered === ele.key && 'text-5xl text-white sm:text-6xl'
            )}
            onMouseEnter={() => setHovered(ele.key)}
            onMouseLeave={() => setHovered('play')}
            onClick={() => {
              setOpen(true, ele.key);
            }}
          >
            {ele.label}
          </div>
        );
      })}
    </div>
  );
};

export default HomeNavigation;
