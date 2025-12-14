import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-primary-600">Mtaa</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with your neighborhood. Share alerts, find services, and build your local community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-lg border-2 border-primary-600"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Safety Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share important safety information with your community. Get instant alerts about road closures, security issues, and emergencies.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              <strong>Example:</strong> &quot;Road closure on Thika Road near Thindigua - use alternative route&quot;
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Marketplace
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Buy and sell items locally. Find great deals in your neighborhood from trusted neighbors.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              <strong>Example:</strong> &quot;Selling furniture in Kilimani - coffee table, KES 5,000&quot;
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community Posts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with neighbors. Share news, ask questions, and stay informed about what's happening in your area.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              <strong>Example:</strong> &quot;Community cleanup event in Parklands this Saturday&quot;
            </p>
          </div>
        </div>

        {/* Neighborhood Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Active Neighborhoods
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Thindigua', city: 'Nairobi', posts: '45', alerts: '3' },
              { name: 'Kilimani', city: 'Nairobi', posts: '128', alerts: '7' },
              { name: 'Parklands', city: 'Nairobi', posts: '92', alerts: '2' },
              { name: 'Runda', city: 'Nairobi', posts: '67', alerts: '1' },
            ].map((neighborhood, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">{neighborhood.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{neighborhood.city}</p>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  <p>{neighborhood.posts} posts</p>
                  <p>{neighborhood.alerts} alerts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Use Cases */}
        <div className="mt-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Share Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Post safety alerts that are immediately visible to your neighborhood. Examples:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• &quot;Water shortage in Thindigua - tankers available&quot;</li>
                <li>• &quot;Power outage in Kilimani - expected back by 6 PM&quot;</li>
                <li>• &quot;Security alert: Suspicious activity in Parklands&quot;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🏘️ Connect Locally</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Engage with your community through posts and discussions. Examples:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• &quot;Looking for a reliable plumber in Runda&quot;</li>
                <li>• &quot;Community meeting in Kilimani this weekend&quot;</li>
                <li>• &quot;Lost dog found in Parklands - please contact&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

