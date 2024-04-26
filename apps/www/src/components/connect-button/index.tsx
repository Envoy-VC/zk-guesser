'use client';

import React from 'react';

import { useAccount, useConnect, useEnsAvatar, useEnsName } from 'wagmi';

import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';

const ConnectButton = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
    chainId: 1,
  });

  const {
    data: ensAvatar,
    isLoading: ensAvatarLoading,
    isFetched,
  } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
  });

  const onConnect = async () => {
    try {
      await connectAsync({
        chainId: 534351,
        connector: connectors[0]!,
      });
    } catch (error) {}
  };

  const getDay = () => {
    const date = new Date();
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const day = days[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}, ${hours}:${minutes}`;
  };

  return (
    <div>
      {!isConnected && (
        <Button variant='secondary' onClick={onConnect}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
      {isConnected && (
        <div className='flex flex-row items-start gap-3'>
          <div className='flex flex-col text-lg font-medium items-end uppercase'>
            {ensNameLoading && !ensName ? (
              <Skeleton className='mt-1 h-[20px] w-[200px] rounded-md' />
            ) : (
              <div>{ensName}</div>
            )}
            <div>{getDay()}</div>
            <div>$324</div>
          </div>
          <div className='aspect-square w-24'>
            {isFetched && ensAvatar && (
              <div className=' rounded-xl bg-white/50 p-[3px]'>
                <img
                  src={ensAvatar}
                  className='h-full w-full rounded-lg object-cover'
                />
              </div>
            )}
            {ensAvatarLoading && !ensAvatar && (
              <Skeleton className='h-full w-full rounded-lg' />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
