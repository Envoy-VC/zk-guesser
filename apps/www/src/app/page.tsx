import React from 'react';

import Buildings from '~/screens/Buildings';

const Home = () => {
  return (
    <div className='relative h-screen'>
      <div className='absolute top-0 z-[100] h-full w-full  text-white'>
        <div className='mx-auto max-w-screen-xl py-24'>
          <div className='font-pricedown text-[5rem]'>MAPPING OUT ZK</div>
        </div>
      </div>
      <Buildings />
    </div>
  );
};

export default Home;
