import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SyncBoard',
  description: 'A modern, real-time collaborative notes application with rich text editing and seamless team collaboration.',
  keywords: ['collaborative', 'notes', 'real-time', 'editor', 'team', 'SyncBoard'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
