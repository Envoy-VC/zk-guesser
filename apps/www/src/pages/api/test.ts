import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { rpc: true };

export async function getName(code: string) {
  return `${code}-name`;
}

type ResponseData = {
  message: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(req.body);
  res.status(200).json({ message: 'Hello from Next.js!' });
}
