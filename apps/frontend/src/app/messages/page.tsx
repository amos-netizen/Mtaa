// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from 'react';
import MessagesClient from './messages-client';

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesClient />
    </Suspense>
  );
}















