import localFont from 'next/font/local';
import { headers } from 'next/headers';

import { config } from '~/lib/viem';

import { Metadata, Viewport } from 'next';
import { cookieToInitialState } from 'wagmi';
import { Web3Provider } from '~/providers';
import '~/styles/globals.css';

import { Toaster } from '~/components/ui/sonner';

const chaletFont = localFont({
  src: '../../public/fonts/chalet.ttf',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zk-guesser.vercel.app/'),
  title: 'ZK Guesser',
  description:
    'Geo guessing with a twist! Prove your location guesses without revealing them using zero-knowledge proofs. Can you travel the world...cryptographically?',
  applicationName: 'ZK Guesser',
  keywords: [
    'GeoGuesser',
    'ZK Guesser',
    'Zero Knowledge Proofs',
    'Blockchain',
    'Scroll Blockchain',
  ],
  creator: 'Vedant Chainani',
  publisher: 'Vedant Chainani',
  icons: [
    { rel: 'icon', url: '/icon.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title: 'ZK Guesser - Mapping Out ZK',
    description:
      'Geo guessing with a twist! Prove your location guesses without revealing them using zero-knowledge proofs. Can you travel the world...cryptographically?',
    creator: '@Envoy_1084',
    images: [
      {
        url: `/og.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `ZK Guesser - Mapping Out ZK`,
      },
    ],
  },
  openGraph: {
    title: 'ZK Guesser - Mapping Out ZK',
    description:
      'Geo guessing with a twist! Prove your location guesses without revealing them using zero-knowledge proofs. Can you travel the world...cryptographically?',
    type: 'website',
    locale: 'en_US',
    url: 'https://zk-guesser.vercel.app/',
    images: [
      {
        url: `/og.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `ZK Guesser - Mapping Out ZK`,
      },
    ],
  },
  other: {
    'msapplication-tap-highlight': 'no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Gymkhana Technical',
    'msapplication-TileColor': '#fff',
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'));

  return (
    <html lang='en'>
      <Web3Provider initialState={initialState}>
        <body className={`font-sans ${chaletFont.variable}`}>
          {children}
          <Toaster />
        </body>
      </Web3Provider>
    </html>
  );
}
