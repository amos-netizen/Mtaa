'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { servicesApi } from '@/lib/api/services';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';

const serviceSchema = z.object({
  neighborhoodId: z.string().min(1, 'Neighborhood is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  price: z.string().optional(),
  serviceType: z.string().optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

const SERVICE_CATEGORIES = [
  { value: 'PLUMBING', label: 'Plumbing', icon: '🔧' },
  { value: 'ELECTRICAL', label: 'Electrical', icon: '⚡' },
  { value: 'CLEANING', label: 'Cleaning', icon: '🧹' },
  { value: 'GARDENING', label: 'Gardening', icon: '🌳' },
  { value: 'PAINTING', label: 'Painting', icon: '🎨' },
  { value: 'CARPENTRY', label: 'Carpentry', icon: '🪚' },
  { value: 'TUTORING', label: 'Tutoring', icon: '📚' },
  { value: 'BEAUTY', label: 'Beauty & Salon', icon: '💅' },
  { value: 'FITNESS', label: 'Fitness & Training', icon: '💪' },
  { value: 'PHOTOGRAPHY', label: 'Photography', icon: '📷' },
  { value: 'CATERING', label: 'Catering', icon: '🍽️' },
  { value: 'DELIVERY', label: 'Delivery', icon: '🚚' },
  { value: 'OTHER', label: 'Other', icon: '🔨' },
];

const SERVICE_TYPES = [
  { value: 'HOURLY', label: 'Hourly Rate' },
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'QUOTE', label: 'Quote Based' },
  { value: 'FREE', label: 'Free Service' },
];

export default function CreateServicePage() {
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
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
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

  const onSubmit = async (data: ServiceForm) => {
    setSubmitting(true);
    setMessage(null);

    try {
      await servicesApi.create({
        title: data.title,
        description: data.description,
        neighborhoodId: data.neighborhoodId,
        category: data.category,
        price: data.price ? parseFloat(data.price) : undefined,
        serviceType: data.serviceType,
      });

      setMessage({ type: 'success', text: 'Service posted successfully! Redirecting...' });
      setTimeout(() => {
        router.push('/services');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to create service:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to post service. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a Service</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Neighborhood */}
          <div>
            <label htmlFor="neighborhoodId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Neighborhood <span className="text-red-500">*</span>
            </label>
            <select
              id="neighborhoodId"
              {...register('neighborhoodId')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a neighborhood</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
            {errors.neighborhoodId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.neighborhoodId.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              placeholder="e.g., Professional Plumbing Services"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={6}
              placeholder="Describe your service in detail..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category (optional)</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pricing Type
            </label>
            <select
              id="serviceType"
              {...register('serviceType')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select pricing type (optional)</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (KES)
            </label>
            <input
              type="number"
              id="price"
              {...register('price')}
              placeholder="e.g., 5000"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Leave empty if pricing is quote-based or free
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Posting Service...' : 'Post Service'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/services')}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

