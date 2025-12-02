import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}


