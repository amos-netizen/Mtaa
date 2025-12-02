import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Mtaa</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
          Hyperlocal Kenyan Neighborhood Social Network
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

