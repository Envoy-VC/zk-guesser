import React from 'react';

import Buildings from './Buildings';

interface Props {
  message?: string;
}
const ErrorScreen = ({ message = 'Something Went Wrong!' }: Props) => {
  return (
    <div className='flex h-screen w-full text-white'>
      <div className='absolute left-1/2 top-1/2 z-[100] w-fit -translate-x-1/2 -translate-y-[100%] text-center font-pricedown text-5xl md:text-7xl'>
        {message}
      </div>
      <Buildings />
    </div>
  );
};

export default ErrorScreen;
