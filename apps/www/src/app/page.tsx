'use client';

import React from 'react';

import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const Home = () => {
  const c = useConnect();

  return (
    <div>
      <button onClick={() => c.connect({ connector: injected() })}>
        Connect
      </button>
    </div>
  );
};

export default Home;
