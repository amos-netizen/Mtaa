'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import { postsApi } from '@/lib/api/posts';
import { authApi } from '@/lib/api/auth';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { ReviewSection } from '@/components/ui/ReviewSection';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const [userData, currentUserData, postsData] = await Promise.all([
          usersApi.getUserById(userId),
          authApi.getMe().catch(() => null),
          usersApi.getUserPosts(userId, 1, 10),
        ]);

        setUser(userData);
        setCurrentUser(currentUserData);
        setPosts(postsData.posts || []);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">User not found</p>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h1>
                <VerificationBadge
                  verificationStatus={user.verificationStatus}
                  trustedMemberBadge={user.trustedMemberBadge}
                  size="md"
                />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.userNeighborhoods?.length > 0 && (
                  <div>
                    <span className="font-medium">Neighborhoods: </span>
                    {user.userNeighborhoods.map((un: any, idx: number) => (
                      <span key={un.id}>
                        {un.neighborhood?.name || 'Unknown'}
                        {un.isPrimary && ' (Primary)'}
                        {idx < user.userNeighborhoods.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
                <div>
                  <span className="font-medium">Member since: </span>
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No posts yet
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section - Only show for non-own profile */}
        {!isOwnProfile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ReviewSection targetId={userId} targetType="PROVIDER" />
          </div>
        )}
      </main>
    </div>
  );
}
