'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { marketplaceApi } from '@/lib/api/marketplace';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'BOOKS', label: 'Books' },
  { value: 'TOYS', label: 'Toys' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'VEHICLES', label: 'Vehicles' },
  { value: 'OTHER', label: 'Other' },
];

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const data = await marketplaceApi.getListings({
          category: category || undefined,
          search: search || undefined,
          page: 1,
          limit: 20,
        });

        setListings(data.listings || []);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    router.push(`/marketplace?${params.toString()}`);
    
    // Refetch with search
    marketplaceApi.getListings({
      category: category || undefined,
      search: search || undefined,
      page: 1,
      limit: 20,
    }).then(data => {
      setListings(data.listings || []);
      setPagination(data.pagination);
    });
  };

  const formatPrice = (price: number | null, isFree: boolean) => {
    if (isFree || !price) return 'Free';
    return `KES ${price.toLocaleString()}`;
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/marketplace/create"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sell Item
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search items..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="w-48">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">No listings found</p>
            <Link
              href="/marketplace/create"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mb-8"
            >
              Be the first to list an item!
            </Link>
            
            {/* Example Listings */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-left max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Example Items You Can Sell:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Vintage Coffee Table', price: 'KES 5,000', category: 'FURNITURE', area: 'Kilimani', desc: 'Beautiful wooden coffee table, excellent condition' },
                  { title: 'iPhone 12 Pro', price: 'KES 45,000', category: 'ELECTRONICS', area: 'Parklands', desc: '64GB, well maintained, comes with charger' },
                  { title: 'Designer Sofa Set', price: 'KES 25,000', category: 'FURNITURE', area: 'Runda', desc: '3-seater + 2 armchairs, leather, like new' },
                  { title: 'Textbooks Collection', price: 'KES 2,500', category: 'BOOKS', area: 'Thindigua', desc: 'University textbooks, various subjects' },
                ].map((example, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{example.title}</h4>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{example.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{example.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{example.category}</span>
                      <span>•</span>
                      <span>{example.area}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => {
              const images = Array.isArray(listing.images) 
                ? listing.images 
                : JSON.parse(listing.images || '[]');
              const firstImage = images[0] || '/placeholder-image.jpg';

              return (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={firstImage}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                    {listing.isSold && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        SOLD
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {formatPrice(listing.price, listing.isFree)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{listing.category}</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  marketplaceApi.getListings({
                    category: category || undefined,
                    search: search || undefined,
                    page,
                    limit: 20,
                  }).then(data => {
                    setListings(data.listings || []);
                    setPagination(data.pagination);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  });
                }}
                className={`px-4 py-2 rounded-lg ${
                  page === pagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
