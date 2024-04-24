import { hashMessage, toBytes } from 'viem';

const hash = hashMessage('1-4');
console.log(hash);

// [72, 124, 60, 126, 19, 237, 122, 212, 246, 164, 136, 133, 94, 136, 206, 195, 54, 101, 100, 167, 26, 34, 9, 28, 24, 146, 25, 235, 220, 36, 22, 113]
