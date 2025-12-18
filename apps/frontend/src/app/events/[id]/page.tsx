'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { eventsApi, Event } from '@/lib/api/events';
import { postsApi } from '@/lib/api/posts';
import { authApi } from '@/lib/api/auth';

const EVENT_CATEGORIES = [
  { value: 'COMMUNITY_MEETING', label: 'Community Meeting', icon: '🏘️' },
  { value: 'GARAGE_SALE', label: 'Garage Sale', icon: '🏪' },
  { value: 'SPORTS', label: 'Sports', icon: '⚽' },
  { value: 'CLASSES', label: 'Classes', icon: '📚' },
  { value: 'SOCIAL_GATHERING', label: 'Social Gathering', icon: '🎉' },
  { value: 'OTHER', label: 'Other', icon: '📅' },
];

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'GOING' | 'INTERESTED' | 'CANT_GO' | null>(null);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch event (using postId)
        const eventData = await eventsApi.getOne(eventId);
        setEvent(eventData);

        // Fetch comments
        if (eventData.postId) {
          const commentsData = await postsApi.getComments(eventData.postId);
          setComments(commentsData.comments || []);
        }

        // Fetch current user
        const user = await authApi.getMe();
        setCurrentUser(user);

        // Check if user has RSVP'd
        if (eventData.rsvps) {
          const userRsvp = eventData.rsvps.find((r: any) => r.userId === user.id);
          if (userRsvp) {
            setRsvpStatus(userRsvp.status);
          }
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !event?.postId) return;

    setSubmittingComment(true);
    try {
      const newComment = await postsApi.createComment(event.postId, commentContent);
      setComments([newComment, ...comments]);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (!event?.postId) return;
    try {
      await postsApi.toggleLike(event.postId);
      // Refresh event to get updated like count
      const updatedEvent = await eventsApi.getOne(eventId);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleRsvp = async (status: 'GOING' | 'INTERESTED' | 'CANT_GO') => {
    if (!event) return;
    setSubmittingRsvp(true);
    try {
      await eventsApi.rsvp(event.postId, status);
      setRsvpStatus(status);
      // Refresh event to get updated RSVP count
      const updatedEvent = await eventsApi.getOne(eventId);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to RSVP:', error);
      alert('Failed to RSVP. Please try again.');
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Event not found</p>
          <Link href="/events" className="text-purple-600 hover:text-purple-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = EVENT_CATEGORIES.find(c => c.value === event.category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="text-purple-100 hover:text-white transition-colors flex items-center gap-1 mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{categoryInfo?.icon || '📅'}</span>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{categoryInfo?.label || event.category}</span>
                  <span>•</span>
                  <span>{event.neighborhood.name} - {event.neighborhood.city}</span>
                  <span>•</span>
                  <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📝 Event Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Information */}
            <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📅 Event Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Start Date & Time</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(event.startDate)}</p>
                </div>
                {event.endDate && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">End Date & Time</p>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(event.endDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{event.location}</p>
                </div>
                {event.isRecurring && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recurring</p>
                    <p className="text-gray-900 dark:text-white font-medium">Yes</p>
                  </div>
                )}
              </div>
              {event.latitude && event.longitude && (
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2"
                  >
                    <span>📍</span>
                    View on Map
                  </a>
                </div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👤 Organizer Information
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {event.author?.fullName?.charAt(0)?.toUpperCase() || 'O'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {event.author?.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    @{event.author?.username}
                  </p>
                </div>
              </div>
            </div>

            {/* RSVP Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ✋ RSVP ({event.rsvpCount || 0} going)
              </h3>
              {currentUser && event.authorId !== currentUser.id && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleRsvp('GOING')}
                    disabled={submittingRsvp}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      rsvpStatus === 'GOING'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    ✓ Going
                  </button>
                  <button
                    onClick={() => handleRsvp('INTERESTED')}
                    disabled={submittingRsvp}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      rsvpStatus === 'INTERESTED'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    ? Interested
                  </button>
                  <button
                    onClick={() => handleRsvp('CANT_GO')}
                    disabled={submittingRsvp}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      rsvpStatus === 'CANT_GO'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    ✗ Can't Go
                  </button>
                </div>
              )}
              {rsvpStatus && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your RSVP: <span className="font-medium">{rsvpStatus}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>❤️</span>
                <span>Like</span>
              </button>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

