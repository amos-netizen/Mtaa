'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { postsApi } from '@/lib/api/posts';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';
import { useRealtimePolling } from '@/lib/hooks/useRealtimePolling';
import { ListSkeleton } from '@/components/ui/LoadingSkeleton';

// Example neighborhoods for Nairobi
const EXAMPLE_NEIGHBORHOODS = [
  { name: 'Thindigua', city: 'Nairobi', description: 'Residential area in Kiambu County' },
  { name: 'Kilimani', city: 'Nairobi', description: 'Upscale residential neighborhood' },
  { name: 'Parklands', city: 'Nairobi', description: 'Historic residential area' },
  { name: 'Runda', city: 'Nairobi', description: 'Exclusive gated community' },
];

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [postType, setPostType] = useState<'GENERAL' | 'SAFETY_ALERT'>('GENERAL');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DISCUSSION',
  });

  const fetchPosts = async () => {
    try {
      const postsData = await postsApi.getAll(1, 20, selectedNeighborhood || undefined);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  // Real-time polling for community posts (every 30 seconds)
  useRealtimePolling({
    enabled: !loading && !!user,
    interval: 30000,
    onPoll: fetchPosts,
    immediate: false,
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

        // Fetch neighborhoods
        try {
          const neighborhoodsData = await neighborhoodsApi.getAll('Nairobi');
          setNeighborhoods(neighborhoodsData.neighborhoods || []);
          
          // Set default neighborhood to user's primary neighborhood
          const primaryNeighborhood = userData?.userNeighborhoods?.find((n: any) => n.isPrimary);
          if (primaryNeighborhood) {
            setSelectedNeighborhood(primaryNeighborhood.neighborhoodId);
          }
        } catch (error) {
          console.error('Failed to fetch neighborhoods:', error);
        }

        // Initial fetch
        await fetchPosts();
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Refetch when neighborhood changes
  useEffect(() => {
    if (!loading && user) {
      fetchPosts();
    }
  }, [selectedNeighborhood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Use selected neighborhood or user's primary neighborhood
      const neighborhoodId = selectedNeighborhood || 
        user?.userNeighborhoods?.[0]?.neighborhoodId || 
        user?.neighborhoodId;
      
      if (!neighborhoodId) {
        alert('Please select a neighborhood first');
        return;
      }

      await postsApi.create({
        title: formData.title,
        description: formData.description,
        neighborhoodId,
        category: formData.category,
        type: postType,
      });

      // Refresh posts
      await fetchPosts();

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'DISCUSSION',
      });
      setPostType('GENERAL');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNeighborhoodChange = async (neighborhoodId: string) => {
    setSelectedNeighborhood(neighborhoodId);
    try {
      const postsData = await postsApi.getAll(1, 20, neighborhoodId);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Posts</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Neighborhood Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Neighborhood:
            </label>
            <select
              value={selectedNeighborhood}
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Neighborhoods</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name} - {neighborhood.city}
                </option>
              ))}
            </select>
            {neighborhoods.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Example neighborhoods in Nairobi:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_NEIGHBORHOODS.map((nb, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      {nb.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Create Post */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Share with Community
              </h2>
              
              {/* Post Type Toggle */}
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('GENERAL')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    postType === 'GENERAL'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  General Post
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('SAFETY_ALERT')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    postType === 'SAFETY_ALERT'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  🚨 Alert
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {postType === 'SAFETY_ALERT' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Safety Alert:</strong> Share important safety information with your community. 
                      This will be prominently displayed to help keep everyone safe.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {postType === 'SAFETY_ALERT' ? 'Alert Title' : 'Post Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={postType === 'SAFETY_ALERT' ? 'e.g., Road closure on Thika Road' : 'Post title'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {postType === 'SAFETY_ALERT' ? 'Alert Details' : 'Content'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={4}
                    placeholder={postType === 'SAFETY_ALERT' ? 'Describe the safety concern or alert...' : "What's on your mind?"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Neighborhood
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select neighborhood</option>
                    {neighborhoods.map((neighborhood) => (
                      <option key={neighborhood.id} value={neighborhood.id}>
                        {neighborhood.name} - {neighborhood.city}
                      </option>
                    ))}
                  </select>
                  {neighborhoods.length === 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Popular: Thindigua, Kilimani, Parklands, Runda
                    </p>
                  )}
                </div>
                {postType === 'GENERAL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="DISCUSSION">Discussion</option>
                      <option value="NEWS">News</option>
                      <option value="QUESTION">Question</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    postType === 'SAFETY_ALERT' ? 'bg-red-600' : 'bg-primary-600'
                  }`}
                >
                  {submitting ? 'Posting...' : postType === 'SAFETY_ALERT' ? '🚨 Share Alert' : 'Post'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Posts List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No posts yet. Be the first to post!
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className={`rounded-lg shadow p-6 ${
                      post.type === 'SAFETY_ALERT'
                        ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {post.type === 'SAFETY_ALERT' && (
                          <span className="text-2xl">🚨</span>
                        )}
                        <h3 className={`text-lg font-semibold ${
                          post.type === 'SAFETY_ALERT'
                            ? 'text-red-900 dark:text-red-200'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {post.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`mb-4 ${
                      post.type === 'SAFETY_ALERT'
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>By {post.author?.fullName || post.author?.username || 'Anonymous'}</span>
                      {post.neighborhood && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                            {post.neighborhood.name}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={async () => {
                          try {
                            await postsApi.toggleLike(post.id);
                            const postsData = await postsApi.getAll(1, 20, selectedNeighborhood || undefined);
                            setPosts(postsData.posts || []);
                          } catch (error) {
                            console.error('Failed to toggle like:', error);
                          }
                        }}
                        className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <span>👍</span>
                        <span>{post.likeCount || 0}</span>
                      </button>
                      <span>💬 {post.commentCount || 0} comments</span>
                      {post.category && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {post.category}
                        </span>
                      )}
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

