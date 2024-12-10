import { Metadata } from 'next';

const title = 'Free Online File Converter - Convert Images & Videos';
const description = 'Free online tool to convert and optimize images and videos. Support for WebP, PNG, JPEG, MP4, and MOV files. No signup required, process files directly in your browser.';

const keywords = [
  'file converter',
  'image converter',
  'video converter',
  'webp to png',
  'png to webp',
  'png optimizer',
  'jpeg optimizer',
  'mp4 to mp3',
  'mov to mp4',
  'online converter',
  'free converter',
  'image compression',
  'video compression',
  'bulk conversion',
  'batch processing'
];

export const metadata: Metadata = {
  title,
  description,
  keywords: keywords.join(', '),
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'File Converter',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};