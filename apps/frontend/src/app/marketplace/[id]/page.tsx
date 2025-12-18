'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { marketplaceApi } from '@/lib/api/marketplace';
import { postsApi } from '@/lib/api/posts';
import { authApi } from '@/lib/api/auth';
import { messagesApi } from '@/lib/api/messages';
import { ReportButton } from '@/components/ui/ReportButton';
import { ReviewSection } from '@/components/ui/ReviewSection';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [listing, setListing] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch listing
        const listingData = await marketplaceApi.getListing(listingId);
        setListing(listingData);

        // Fetch comments
        if (listingData.post?.id) {
          const commentsData = await postsApi.getComments(listingData.post.id);
          setComments(commentsData.comments || []);
        }

        // Fetch current user
        const user = await authApi.getMe();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !listing?.post?.id) return;

    setSubmittingComment(true);
    try {
      const newComment = await postsApi.createComment(listing.post.id, commentContent);
      setComments([newComment, ...comments]);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (!listing?.post?.id) return;
    try {
      await postsApi.toggleLike(listing.post.id);
      // Refresh listing to get updated like count
      const updatedListing = await marketplaceApi.getListing(listingId);
      setListing(updatedListing);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const formatPrice = (price: number | null, isFree: boolean) => {
    if (isFree || !price) return 'Free';
    return `KES ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Listing not found</p>
          <Link href="/marketplace" className="text-primary-600 hover:text-primary-700">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(listing.images) 
    ? listing.images 
    : JSON.parse(listing.images || '[]');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/marketplace"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Images Gallery */}
          {images.length > 0 && (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden rounded-t-lg">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
                {listing.isSold && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
                    SOLD
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="px-4 pb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary-600 ring-2 ring-primary-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {selectedImageIndex + 1} of {images.length}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {listing.title}
                </h1>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(listing.price, listing.isFree)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{listing.category}</span>
              {listing.condition && <span>• {listing.condition}</span>}
              <span>• {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Item Information Section */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📋 Item Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                  <p className="text-gray-900 dark:text-white font-medium">{listing.category}</p>
                </div>
                {listing.condition && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Condition</p>
                    <p className="text-gray-900 dark:text-white font-medium">{listing.condition}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(listing.price, listing.isFree)}
                  </p>
                </div>
                {listing.deliveryAvailable && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery</p>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                      ✓ Delivery Available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>📍</span> Location
              </h2>
              {listing.pickupLocation ? (
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    {listing.pickupLocation}
                  </p>
                  {listing.neighborhood && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {listing.neighborhood.name} - {listing.neighborhood.city}
                    </p>
                  )}
                </div>
              ) : listing.neighborhood ? (
                <p className="text-gray-900 dark:text-white font-medium">
                  {listing.neighborhood.name} - {listing.neighborhood.city}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Location not specified</p>
              )}
              {listing.latitude && listing.longitude && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`, '_blank')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <span>🗺️</span> View on Map
                </button>
              )}
            </div>

            {/* Seller Info with Contact */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👤 Seller Information
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {listing.author?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {listing.author?.fullName}
                    </p>
                    <VerificationBadge
                      verificationStatus={listing.author?.verificationStatus}
                      trustedMemberBadge={listing.author?.trustedMemberBadge}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    @{listing.author?.username}
                  </p>
                  
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {listing.author?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">📞</span>
                        <a
                          href={`tel:${listing.author.phoneNumber.replace(/\s/g, '')}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {listing.author.phoneNumber}
                        </a>
                      </div>
                    )}
                    {listing.author?.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">✉️</span>
                        <a
                          href={`mailto:${listing.author.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {listing.author.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>❤️</span>
                <span>{listing.post?.likeCount || 0} Likes</span>
              </button>
              
              {/* Chat with Owner Button - Show for non-owners */}
              {listing.authorId !== currentUser?.id && (
                <button
                  onClick={async () => {
                    try {
                      // Get or create conversation with seller
                      const conversation = await messagesApi.getOrCreateConversation(listing.authorId);
                      // Navigate to messages page with conversation
                      router.push(`/messages?conversation=${conversation.id}`);
                    } catch (error: any) {
                      console.error('Failed to start conversation:', error);
                      alert(error.response?.data?.message || 'Failed to start conversation. Please try again.');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <span>💬</span>
                  Chat with Owner
                </button>
              )}
              
              {/* Buy Now Button - Show for non-owners and non-sold items */}
              {listing.authorId !== currentUser?.id && !listing.isSold && (
                <button
                  onClick={async () => {
                    if (confirm(`Buy "${listing.title}" for ${formatPrice(listing.price, listing.isFree)}?`)) {
                      try {
                        // Mark as sold and notify seller
                        await marketplaceApi.markAsSold(listingId);
                        alert('Purchase confirmed! Contact the seller to arrange pickup.');
                        const updated = await marketplaceApi.getListing(listingId);
                        setListing(updated);
                      } catch (error: any) {
                        alert(error.response?.data?.message || 'Failed to complete purchase');
                      }
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <span>🛒</span>
                  Buy Now
                </button>
              )}

              {/* Report Button - Show for non-owners */}
              {listing.authorId !== currentUser?.id && listing.post?.id && (
                <ReportButton postId={listing.post.id} postType="marketplace" />
              )}

              {/* Edit and Delete - Show for owner */}
              {listing.authorId === currentUser?.id && (
                <>
                  <button
                    onClick={() => router.push(`/marketplace/${listingId}/edit`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this listing?')) {
                        try {
                          await marketplaceApi.deleteListing(listingId);
                          alert('Listing deleted successfully');
                          router.push('/marketplace');
                        } catch (error: any) {
                          alert(error.response?.data?.message || 'Failed to delete listing');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Item
                  </button>
                  {!listing.isSold && (
                    <button
                      onClick={async () => {
                        if (confirm('Mark this item as sold?')) {
                          try {
                            await marketplaceApi.markAsSold(listingId);
                            const updated = await marketplaceApi.getListing(listingId);
                            setListing(updated);
                          } catch (error) {
                            console.error('Failed to mark as sold:', error);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Mark as Sold
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2"
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || submittingComment}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.author?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comment.author?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                        {comment.isEdited && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">(edited)</span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ReviewSection targetId={listingId} targetType="MARKETPLACE" />
        </div>
      </main>
    </div>
  );
}
