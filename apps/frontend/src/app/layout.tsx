import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mtaa - Hyperlocal Kenyan Neighborhood Social Network',
  description: 'Connect with your neighborhood',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <OfflineIndicator />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}



