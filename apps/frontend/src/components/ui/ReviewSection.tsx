'use client';

import { useState, useEffect } from 'react';
import { reviewsApi } from '@/lib/api/reviews';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified?: boolean;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}
import { authApi } from '@/lib/api/auth';
import { StarRating } from './StarRating';

interface ReviewSectionProps {
  targetId: string;
  targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER';
  showWriteReview?: boolean;
}

export function ReviewSection({ targetId, targetType, showWriteReview = true }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<{ averageRating: number; totalReviews: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, ratingData, user] = await Promise.all([
          reviewsApi.getReviews(targetId, targetType),
          reviewsApi.getAverageRating(targetId, targetType),
          authApi.getMe().catch(() => null),
        ]);

        setReviews(reviewsData.reviews || []);
        setAverageRating(ratingData);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetId, targetType]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.rating) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.createReview({
        targetId,
        targetType,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      // Refresh reviews
      const [reviewsData, ratingData] = await Promise.all([
        reviewsApi.getReviews(targetId, targetType),
        reviewsApi.getAverageRating(targetId, targetType),
      ]);

      setReviews(reviewsData.reviews || []);
      setAverageRating(ratingData);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {averageRating && averageRating.totalReviews > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating.averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating.averageRating} size="lg" />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {averageRating.totalReviews} {averageRating.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div className="flex-1">
              {/* Rating Distribution */}
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.rating === stars).length;
                  const percentage = averageRating.totalReviews > 0 ? (count / averageRating.totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 dark:bg-yellow-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {showWriteReview && currentUser && (
        <div>
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating *
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                  interactive
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.author?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {review.author?.fullName}
                      </span>
                      <StarRating rating={review.rating} size="sm" />
                      {review.isVerified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    {review.comment && (
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

