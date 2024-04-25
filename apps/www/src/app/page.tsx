'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { cn } from '~/lib/utils';

import Buildings from '~/screens/Buildings';

const navItems = [
  {
    label: 'Play',
    link: '/',
  },
  {
    label: 'Create Game',
    link: '/create-game',
  },
  {
    label: 'Settings',
    link: '/settings',
  },
] as const;

const Home = () => {
  const pathName = usePathname();
  const [hovered, setHovered] =
    React.useState<(typeof navItems)[number]['link']>('/');
  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute top-0 h-full w-full'>
        <Buildings />
      </div>
      <div className='relative z-[100] mx-4 my-12 flex w-fit flex-col gap-12  text-white sm:mx-24 sm:my-24 sm:px-0'>
        <div className='font-pricedown text-[3.2rem] md:text-[5rem] '>
          MAPPING OUT ZK
        </div>
        <div className='flex w-fit flex-col py-6 font-pricedown text-5xl text-neutral-400'>
          {navItems.map((ele) => {
            return (
              <div
                className={cn(
                  'cursor-pointer py-2 transition-all duration-200 ease-in-out hover:text-6xl hover:text-white',
                  hovered === ele.link && 'text-6xl text-white'
                )}
                onMouseEnter={() => setHovered(ele.link)}
                onMouseLeave={() => setHovered('/')}
              >
                {ele.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
