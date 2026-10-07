import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InstaQuote AI — Aesthetic Instagram Post Generator',
  description: 'Transform quotes into aesthetic, high-engagement Instagram posts with automated AI mood matching, typography pairing, and generative backgrounds.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload Google Fonts stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Mukta+Malar:wght@400;700&family=Noto+Sans+Tamil:wght@400;600;700;800&family=Hind+Madurai:wght@400;700&family=Catamaran:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-studio-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
