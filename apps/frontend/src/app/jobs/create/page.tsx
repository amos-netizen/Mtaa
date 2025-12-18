'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { jobsApi } from '@/lib/api/jobs';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';

const jobSchema = z.object({
  neighborhoodId: z.string().min(1, 'Neighborhood is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  salary: z.string().optional(),
  jobType: z.string().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

const JOB_CATEGORIES = [
  { value: 'FULL_TIME', label: 'Full Time', icon: '💼' },
  { value: 'PART_TIME', label: 'Part Time', icon: '⏰' },
  { value: 'CONTRACT', label: 'Contract', icon: '📋' },
  { value: 'FREELANCE', label: 'Freelance', icon: '🖊️' },
  { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' },
  { value: 'TEMPORARY', label: 'Temporary', icon: '📅' },
];

const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'TEMPORARY', label: 'Temporary' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const userData = await authApi.getMe();
        const neighborhoodsData = await neighborhoodsApi.getAll('Nairobi');
        setNeighborhoods(neighborhoodsData.neighborhoods || []);

        const primaryNeighborhood = userData?.userNeighborhoods?.find((n: any) => n.isPrimary);
        if (primaryNeighborhood) {
          setValue('neighborhoodId', primaryNeighborhood.neighborhoodId);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, setValue]);

  const onSubmit = async (data: JobForm) => {
    setSubmitting(true);
    setMessage(null);

    try {
      await jobsApi.create({
        title: data.title,
        description: data.description,
        neighborhoodId: data.neighborhoodId,
        category: data.category,
        salary: data.salary,
        jobType: data.jobType || data.category, // Use category as jobType if not specified
      });

      setMessage({ type: 'success', text: 'Job posted successfully! Redirecting...' });
      setTimeout(() => {
        router.push('/jobs');
      }, 1500);
    } catch (error: any) {
      console.error('Job creation error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to post job. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/jobs" className="text-green-600 hover:text-green-700 flex items-center gap-2">
            ← Back to Jobs
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">💼 Post a Job</h1>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Neighborhood <span className="text-red-500">*</span>
              </label>
              <select
                {...register('neighborhoodId')}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select neighborhood</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} - {n.city}
                  </option>
                ))}
              </select>
              {errors.neighborhoodId && (
                <p className="mt-1 text-sm text-red-600">{errors.neighborhoodId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Software Developer, Marketing Manager"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the job requirements, responsibilities, and qualifications..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Type
                </label>
                <select
                  {...register('jobType')}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select job type</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary (Optional)
                </label>
                <input
                  {...register('salary')}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., KSh 50,000 - KSh 80,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category (Optional)
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {submitting ? 'Posting...' : 'Post Job'}
              </button>
              <Link
                href="/jobs"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

