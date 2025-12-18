'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { jobsApi } from '@/lib/api/jobs';
import { postsApi } from '@/lib/api/posts';
import { authApi } from '@/lib/api/auth';
import { messagesApi } from '@/lib/api/messages';
import { ReportButton } from '@/components/ui/ReportButton';
import { ReviewSection } from '@/components/ui/ReviewSection';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyData, setApplyData] = useState({ coverLetter: '', resumeUrl: '' });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch job
        const jobData = await jobsApi.getOne(jobId);
        setJob(jobData);

        // Fetch comments
        if (jobData.post?.id) {
          const commentsData = await postsApi.getComments(jobData.post.id);
          setComments(commentsData.comments || []);
        }

        // Fetch current user
        const user = await authApi.getMe();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !job?.post?.id) return;

    setSubmittingComment(true);
    try {
      const newComment = await postsApi.createComment(job.post.id, commentContent);
      setComments([newComment, ...comments]);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (!job?.post?.id) return;
    try {
      await postsApi.toggleLike(job.post.id);
      // Refresh job to get updated like count
      const updatedJob = await jobsApi.getOne(jobId);
      setJob(updatedJob);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyData.coverLetter.trim()) {
      alert('Please fill in the cover letter');
      return;
    }

    setSubmittingApplication(true);
    try {
      await jobsApi.apply(jobId, applyData);
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyData({ coverLetter: '', resumeUrl: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsApi.delete(jobId);
      alert('Job deleted successfully');
      router.push('/jobs');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Job not found</p>
          <Link href="/jobs" className="text-green-600 hover:text-green-700">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/jobs"
            className="text-green-600 hover:text-green-700 dark:text-green-400 flex items-center gap-1 mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{job.category || 'General'}</span>
                  {job.jobType && <span>• {job.jobType}</span>}
                  {job.salary && <span>• {job.salary}</span>}
                  <span>• {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📝 Job Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Job Information Section */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💼 Job Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.category && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <p className="text-gray-900 dark:text-white font-medium">{job.category}</p>
                  </div>
                )}
                {job.jobType && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Job Type</p>
                    <p className="text-gray-900 dark:text-white font-medium">{job.jobType}</p>
                  </div>
                )}
                {job.salary && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Salary</p>
                    <p className="text-gray-900 dark:text-white font-medium">{job.salary}</p>
                  </div>
                )}
                {job.neighborhood && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {job.neighborhood.name} {job.neighborhood.city ? `- ${job.neighborhood.city}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Employer Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👤 Employer Information
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {job.author?.fullName?.charAt(0)?.toUpperCase() || 'E'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {job.author?.fullName}
                    </p>
                    <VerificationBadge
                      verificationStatus={job.author?.verificationStatus}
                      trustedMemberBadge={job.author?.trustedMemberBadge}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    @{job.author?.username}
                  </p>
                  
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {job.author?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">📞</span>
                        <a
                          href={`tel:${job.author.phoneNumber.replace(/\s/g, '')}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {job.author.phoneNumber}
                        </a>
                      </div>
                    )}
                    {job.author?.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">✉️</span>
                        <a
                          href={`mailto:${job.author.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {job.author.email}
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
                <span>{job.post?.likeCount || 0} Likes</span>
              </button>
              
              {/* Chat with Employer Button - Show for non-owners */}
              {job.authorId !== currentUser?.id && (
                <button
                  onClick={async () => {
                    try {
                      // Get or create conversation with employer
                      const conversation = await messagesApi.getOrCreateConversation(job.authorId);
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
                  Chat with Employer
                </button>
              )}
              
              {/* Apply Button - Show for non-owners */}
              {job.authorId !== currentUser?.id && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <span>📝</span>
                  Apply for Job
                </button>
              )}

              {/* Report Button - Show for non-owners */}
              {job.authorId !== currentUser?.id && job.post?.id && (
                <ReportButton postId={job.post.id} postType="job" />
              )}

              {/* Edit and Delete - Show for owner */}
              {job.authorId === currentUser?.id && (
                <>
                  <button
                    onClick={() => router.push(`/jobs/${jobId}/edit`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Job
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Apply for: {job.title}
              </h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={applyData.coverLetter}
                    onChange={(e) => setApplyData({ ...applyData, coverLetter: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Write your cover letter explaining why you're a good fit for this position..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={applyData.resumeUrl}
                    onChange={(e) => setApplyData({ ...applyData, resumeUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submittingApplication}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submittingApplication ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
          <ReviewSection targetId={jobId} targetType="JOB_EMPLOYER" />
        </div>
      </main>
    </div>
  );
}

