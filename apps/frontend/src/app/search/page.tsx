'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { postsApi } from '@/lib/api/posts';
import { marketplaceApi } from '@/lib/api/marketplace';
import { jobsApi } from '@/lib/api/jobs';
import { servicesApi } from '@/lib/api/services';
import { usersApi } from '@/lib/api/users';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

type SearchResult = {
  type: 'post' | 'marketplace' | 'job' | 'service' | 'user';
  id: string;
  title: string;
  description?: string;
  author?: { id: string; fullName: string; username: string };
  url: string;
  metadata?: any;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'marketplace' | 'jobs' | 'services' | 'users'>('all');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const allResults: SearchResult[] = [];

      // Search Posts
      if (activeTab === 'all' || activeTab === 'posts') {
        try {
          const postsData = await postsApi.getAll(1, 20);
          const matchingPosts = (postsData.posts || []).filter(
            (post: any) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          matchingPosts.forEach((post: any) => {
            allResults.push({
              type: 'post',
              id: post.id,
              title: post.title,
              description: post.description,
              author: post.author,
              url: `/community`,
              metadata: { type: post.type },
            });
          });
        } catch (error) {
          console.error('Error searching posts:', error);
        }
      }

      // Search Marketplace
      if (activeTab === 'all' || activeTab === 'marketplace') {
        try {
          const listingsData = await marketplaceApi.getListings({ search: searchTerm });
          (listingsData.listings || []).forEach((listing: any) => {
            allResults.push({
              type: 'marketplace',
              id: listing.id,
              title: listing.title,
              description: listing.description,
              author: listing.author,
              url: `/marketplace/${listing.id}`,
              metadata: { price: listing.price, category: listing.category },
            });
          });
        } catch (error) {
          console.error('Error searching marketplace:', error);
        }
      }

      // Search Jobs
      if (activeTab === 'all' || activeTab === 'jobs') {
        try {
          const jobsData = await jobsApi.getAll(1, 20, undefined, searchTerm);
          (jobsData.jobs || []).forEach((job: any) => {
            allResults.push({
              type: 'job',
              id: job.id,
              title: job.title,
              description: job.description,
              author: job.author,
              url: `/jobs/${job.id}`,
              metadata: { type: job.type, salary: job.salary },
            });
          });
        } catch (error) {
          console.error('Error searching jobs:', error);
        }
      }

      // Search Services
      if (activeTab === 'all' || activeTab === 'services') {
        try {
          const servicesData = await servicesApi.getAll(1, 20, undefined, searchTerm);
          (servicesData.services || []).forEach((service: any) => {
            allResults.push({
              type: 'service',
              id: service.id,
              title: service.title,
              description: service.description,
              author: service.author,
              url: `/services`,
              metadata: { category: service.category },
            });
          });
        } catch (error) {
          console.error('Error searching services:', error);
        }
      }

      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'marketplace':
        return '🛒';
      case 'job':
        return '💼';
      case 'service':
        return '🔧';
      case 'user':
        return '👤';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return 'Post';
      case 'marketplace':
        return 'Marketplace';
      case 'job':
        return 'Job';
      case 'service':
        return 'Service';
      case 'user':
        return 'User';
      default:
        return 'Item';
    }
  };

  const filteredResults = activeTab === 'all' ? results : results.filter(r => r.type === activeTab.slice(0, -1));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, marketplace, jobs, services..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Tabs */}
        {query && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {(['all', 'posts', 'marketplace', 'jobs', 'services', 'users'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab === 'all' ? 'All Results' : tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : query ? (
          filteredResults.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {filteredResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getTypeIcon(result.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {result.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      {result.author && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          <Link
                            href={`/users/${result.author.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                          >
                            👤 {result.author.fullName}
                          </Link>
                          {result.metadata?.price && (
                            <span>💰 KSh {result.metadata.price}</span>
                          )}
                          {result.metadata?.category && (
                            <span>📁 {result.metadata.category}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try different keywords or check your spelling
              </p>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Enter a search term above to find posts, marketplace items, jobs, and services
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

