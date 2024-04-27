'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { config, zkGuesserContract } from '~/lib/viem';

import { toast } from 'sonner';
import { toHex } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { readContract } from 'wagmi/actions';

import { Input } from '~/components/ui/input';

import { Button } from '../ui/button';

const Play = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const router = useRouter();

  const [id, setId] = React.useState<string>('');
  const [id2, setId2] = React.useState<string>('');
  const [isJoining, setIsJoining] = React.useState<boolean>(false);
  const checks = async (id: string) => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }
    if (!id) {
      throw new Error('Invalid Game Id');
    }
    const [gameId, totalRounds, totalPlayers] = await readContract(config, {
      ...zkGuesserContract,
      functionName: '_games',
      args: [BigInt(parseInt(id))],
    });

    if (Number(totalPlayers) === 0) {
      throw new Error('Game not found');
    }

    return gameId;
  };

  const onJoin = async () => {
    try {
      setIsJoining(true);
      const gameId = await checks(id);
      await writeContractAsync({
        ...zkGuesserContract,
        functionName: 'joinGame',
        args: [gameId],
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsJoining(false);
    }
  };

  const onGoToGame = async () => {
    try {
      const gameId = await checks(id2);
      const playerIndex = await readContract(config, {
        ...zkGuesserContract,
        functionName: 'getPlayerIndex',
        args: [address!, gameId],
      });

      if (playerIndex === 8) {
        throw new Error('You must join the game first');
      }

      router.push(toHex(Number(id2)));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
    }
  };
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col'>
        <div className='font-pricedown text-4xl'>Join Game</div>
        <div className='flex flex-row items-center gap-2'>
          <Input
            placeholder='Game ID'
            className='my-6 max-w-xs'
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Button onClick={onJoin} disabled={isJoining}>
            {isJoining ? 'Joining...' : 'Join'}
          </Button>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='font-pricedown text-4xl'>Go to Game</div>
        <div className='flex flex-row items-center gap-2'>
          <Input
            placeholder='Game ID'
            className='my-6 max-w-xs'
            value={id2}
            onChange={(e) => setId2(e.target.value)}
          />
          <Button onClick={onGoToGame}>Go</Button>
        </div>
      </div>
    </div>
  );
};

export default Play;
