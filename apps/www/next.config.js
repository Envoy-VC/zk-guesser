import withRpc from 'next-rpc';

await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {};

export default withRpc()(config);
