'use client';

import { useState } from 'react';
import { reportsApi } from '@/lib/api/reports';

interface ReportButtonProps {
  postId: string;
  postType?: 'post' | 'marketplace' | 'job' | 'service';
  onReported?: () => void;
}

const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam', icon: '🚫' },
  { value: 'HARASSMENT', label: 'Harassment', icon: '😡' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content', icon: '⚠️' },
  { value: 'FAKE_NEWS', label: 'Fake News', icon: '📰' },
  { value: 'SCAM', label: 'Scam', icon: '💸' },
  { value: 'OTHER', label: 'Other', icon: '📝' },
];

export function ReportButton({ postId, postType = 'post', onReported }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setMessage({ type: 'error', text: 'Please select a reason' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await reportsApi.create({
        postId,
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      setMessage({ type: 'success', text: 'Report submitted successfully. Thank you for helping keep MTAA safe!' });
      setTimeout(() => {
        setShowModal(false);
        setSelectedReason('');
        setDescription('');
        setMessage(null);
        onReported?.();
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit report. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
      >
        <span>🚩</span>
        <span>Report</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report Content</h2>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {!message?.type && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Reporting *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {REPORT_REASONS.map((reason) => (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => setSelectedReason(reason.value)}
                        className={`p-3 border-2 rounded-lg text-left transition-colors ${
                          selectedReason === reason.value
                            ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{reason.icon}</span>
                          <span className="text-sm font-medium">{reason.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide more context about why you're reporting this..."
                    className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !selectedReason}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedReason('');
                      setDescription('');
                      setMessage(null);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {message?.type === 'success' && (
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedReason('');
                  setDescription('');
                  setMessage(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

