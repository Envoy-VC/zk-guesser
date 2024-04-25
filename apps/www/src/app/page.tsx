import React from 'react';

import Buildings from '~/screens/Buildings';

const Home = () => {
  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute top-0 h-full w-full'>
        <Buildings />
      </div>
      <div className='relative z-[10000] mx-4 my-12 w-fit text-white sm:mx-24 sm:my-24 sm:px-0'>
        <div className='font-pricedown text-[3.2rem] md:text-[5rem]'>
          MAPPING OUT ZK
        </div>
      </div>
    </div>
  );
};

export default Home;
