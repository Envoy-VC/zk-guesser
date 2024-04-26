import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_MAPILLARY_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_ANKR_RPC_URL: z.string().min(1),
    NEXT_PUBLIC_OPERATOR_PRIVATE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MAPILLARY_CLIENT_ID:
      process.env.NEXT_PUBLIC_MAPILLARY_CLIENT_ID,
    NEXT_PUBLIC_ANKR_RPC_URL: process.env.NEXT_PUBLIC_ANKR_RPC_URL,
    NEXT_PUBLIC_OPERATOR_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_OPERATOR_PRIVATE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
