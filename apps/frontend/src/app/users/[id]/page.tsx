'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import { postsApi } from '@/lib/api/posts';
import { CardSkeleton, ListSkeleton } from '@/components/ui/LoadingSkeleton';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'listings' | 'services'>('posts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const [userData, postsData] = await Promise.all([
          usersApi.getUserById(userId),
          postsApi.getAll(1, 50, undefined, undefined, userId),
        ]);

        setUser(userData);
        setPosts(postsData.posts || []);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CardSkeleton />
          <div className="mt-6">
            <ListSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(p => p.type === 'GENERAL');
  const userListings = posts.filter(p => p.type === 'MARKETPLACE');
  const userServices = posts.filter(p => p.type === 'SERVICE');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.fullName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.fullName}
                </h1>
                {user.verificationStatus === 'VERIFIED' && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
                    ✓ Verified
                  </span>
                )}
                {user.role === 'NEIGHBORHOOD_LEAD' && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-full">
                    👑 Lead
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
              )}
              
              {/* User Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{userPosts.length}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{userListings.length}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Listings</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{userServices.length}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Services</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              {(user.address || user.phoneNumber) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {user.address && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      📍 {user.address}
                    </p>
                  )}
                  {user.phoneNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📞 {user.phoneNumber}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/messages?userId=${userId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                💬 Message
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Posts ({userPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'listings'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Marketplace ({userListings.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Services ({userServices.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {userPosts.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No posts yet
                  </p>
                ) : (
                  userPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/community`}
                      className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {post.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-4">
                {userListings.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No marketplace listings yet
                  </p>
                ) : (
                  userListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/marketplace/${listing.id}`}
                      className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {listing.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                {userServices.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No services yet
                  </p>
                ) : (
                  userServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services`}
                      className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {service.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

