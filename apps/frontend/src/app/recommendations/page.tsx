'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { postsApi } from '@/lib/api/posts';

export default function RecommendationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'RECOMMENDATION',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const userData = await authApi.getMe();
        setUser(userData);

        // Fetch recommendation posts
        const postsData = await postsApi.getAll(1, 20, undefined, 'RECOMMENDATION');
        setPosts(postsData.posts || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get user's primary neighborhood
      const neighborhoodId = user?.neighborhoods?.[0]?.neighborhoodId || user?.neighborhoodId;
      
      if (!neighborhoodId) {
        alert('Please set your neighborhood in settings first');
        return;
      }

      await postsApi.create({
        title: formData.title,
        description: formData.description,
        neighborhoodId,
        category: formData.category,
        type: 'RECOMMENDATION',
      });

      // Refresh posts
      const postsData = await postsApi.getAll(1, 20, undefined, 'RECOMMENDATION');
      setPosts(postsData.posts || []);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'RECOMMENDATION',
      });
    } catch (error) {
      console.error('Failed to create recommendation:', error);
      alert('Failed to create recommendation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Recommendations</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Examples Section */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Example Service Requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Plumber Needed', desc: 'Looking for a reliable plumber in Kilimani', area: 'Kilimani' },
              { title: 'Electrician', desc: 'Need electrical repairs in Parklands', area: 'Parklands' },
              { title: 'Tutor', desc: 'Math tutor for high school student in Runda', area: 'Runda' },
              { title: 'Carpenter', desc: 'Custom furniture maker in Thindigua', area: 'Thindigua' },
            ].map((example, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setFormData({
                    title: example.title,
                    description: example.desc,
                    category: 'RECOMMENDATION',
                  });
                }}
              >
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                  {example.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {example.desc}
                </p>
                <span className="text-xs text-primary-600 dark:text-primary-400">
                  {example.area}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Create Recommendation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Request a Recommendation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ask your community for service recommendations. Click an example above to get started!
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Need a reliable plumber"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={4}
                    placeholder="Describe what service you're looking for... (e.g., 'Looking for a plumber to fix a leaking pipe in my kitchen. Available this weekend.')"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Post Request'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Recommendations List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    No recommendations yet. Be the first to request a service!
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Example Requests You Can Make:
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Plumber:</strong> "Need a reliable plumber in Kilimani to fix a burst pipe. Urgent!"
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Electrician:</strong> "Looking for an electrician in Parklands for home wiring"
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Tutor:</strong> "Math tutor needed in Runda for Grade 10 student"
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <strong>Carpenter:</strong> "Custom bookshelf maker in Thindigua area"
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>By {post.author?.fullName || post.author?.username || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{post.likeCount || 0} likes</span>
                      <span>•</span>
                      <span>{post.commentCount || 0} comments</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

