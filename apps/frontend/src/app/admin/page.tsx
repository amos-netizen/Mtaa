'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reportsApi } from '@/lib/api/reports';
import { authApi } from '@/lib/api/auth';

type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>('ALL');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const user = await authApi.getMe();
        setCurrentUser(user);

        // Check if user is admin
        if (user.role !== 'ADMIN') {
          alert('Access denied. Admin privileges required.');
          router.push('/dashboard');
          return;
        }

        await loadReports();
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const loadReports = async () => {
    try {
      const status = filterStatus === 'ALL' ? undefined : filterStatus;
      const data = await reportsApi.getAllReports(status);
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadReports();
    }
  }, [filterStatus, currentUser]);

  const handleResolveReport = async (reportId: string, action: 'warn' | 'ban' | 'dismiss') => {
    const actionText = action === 'warn' ? 'warn the user' : action === 'ban' ? 'ban the user' : 'dismiss this report';
    if (!confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    try {
      await reportsApi.resolveReport(reportId, action);
      alert(`Report ${action === 'dismiss' ? 'dismissed' : 'resolved'} successfully`);
      await loadReports();
      setSelectedReport(null);
    } catch (error: any) {
      console.error('Failed to resolve report:', error);
      alert(error.response?.data?.message || 'Failed to resolve report');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as: {currentUser?.fullName}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Reports</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {reports.filter((r) => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {reports.filter((r) => r.status === 'RESOLVED').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Dismissed</h3>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {reports.filter((r) => r.status === 'DISMISSED').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Reports</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reports Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.post?.title || 'Unknown Post'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Type: {report.post?.type || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                          {report.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {report.reportedBy?.fullName || report.reportedBy?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            report.status === 'PENDING'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              : report.status === 'RESOLVED'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : report.status === 'DISMISSED'
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            View
                          </button>
                          {report.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleResolveReport(report.id, 'warn')}
                                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                              >
                                Warn
                              </button>
                              <button
                                onClick={() => handleResolveReport(report.id, 'ban')}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                Ban
                              </button>
                              <button
                                onClick={() => handleResolveReport(report.id, 'dismiss')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reported Post</h3>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedReport.post?.title || 'Unknown'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reason</h3>
                  <span className="px-2 py-1 text-sm font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    {selectedReport.reason}
                  </span>
                </div>

                {selectedReport.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                    <p className="text-gray-900 dark:text-white">{selectedReport.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reported By</h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.reportedBy?.fullName || selectedReport.reportedBy?.username || 'Unknown'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded-full ${
                      selectedReport.status === 'PENDING'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : selectedReport.status === 'RESOLVED'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {selectedReport.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedReport.status === 'PENDING' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'warn')}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Warn User
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'ban')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Ban User
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'dismiss')}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

