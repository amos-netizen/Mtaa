'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { marketplaceApi } from '@/lib/api/marketplace';

const createListingSchema = z.object({
  neighborhoodId: z.string().min(1, 'Neighborhood is required'),
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0).optional(),
  isFree: z.boolean().default(false),
  condition: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(8, 'Maximum 8 images'),
  pickupLocation: z.string().optional(),
  deliveryAvailable: z.boolean().default(false),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

const CATEGORIES = [
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'BOOKS', label: 'Books' },
  { value: 'TOYS', label: 'Toys' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'VEHICLES', label: 'Vehicles' },
  { value: 'OTHER', label: 'Other' },
];

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      isFree: false,
      deliveryAvailable: false,
      images: [],
    },
  });

  const isFree = watch('isFree');

  const addImageField = () => {
    if (imageUrls.length < 8) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageField = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
    setValue('images', newUrls.filter(url => url.trim() !== ''));
  };

  const onSubmit = async (data: CreateListingForm) => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Filter out empty image URLs
      const validImages = imageUrls.filter(url => url.trim() !== '');
      
      if (validImages.length === 0) {
        setMessage({ type: 'error', text: 'At least one image URL is required' });
        setIsLoading(false);
        return;
      }

      const listingData = {
        ...data,
        images: validImages,
        price: data.isFree ? undefined : data.price,
      };

      await marketplaceApi.createListing(listingData);
      setMessage({ type: 'success', text: 'Listing created successfully! Redirecting...' });
      
      setTimeout(() => {
        router.push('/marketplace');
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create listing';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              ← Back to Marketplace
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Listing</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Example Listings */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Example Listings (Click to Use)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Vintage Coffee Table',
                description: 'Beautiful wooden coffee table, excellent condition. Perfect for living room.',
                category: 'FURNITURE',
                price: 5000,
                condition: 'GOOD',
                pickupLocation: 'Kilimani, Nairobi',
                imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
              },
              {
                title: 'iPhone 12 Pro',
                description: '64GB, well maintained, comes with charger and original box. No scratches.',
                category: 'ELECTRONICS',
                price: 45000,
                condition: 'LIKE_NEW',
                pickupLocation: 'Parklands, Nairobi',
                imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
              },
            ].map((example, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => {
                  setValue('title', example.title);
                  setValue('description', example.description);
                  setValue('category', example.category);
                  setValue('price', example.price);
                  setValue('condition', example.condition);
                  setValue('pickupLocation', example.pickupLocation);
                  setValue('isFree', false);
                  setImageUrls([example.imageUrl]);
                  setValue('images', [example.imageUrl]);
                }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{example.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{example.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{example.category}</span>
                  <span>KES {example.price.toLocaleString()}</span>
                  <span>•</span>
                  <span>{example.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Neighborhood ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register('neighborhoodId')}
              type="text"
              placeholder="Enter neighborhood ID (optional for now)"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.neighborhoodId && (
              <p className="mt-1 text-sm text-red-600">{errors.neighborhoodId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g., Vintage Coffee Table"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe your item..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register('isFree')}
              type="checkbox"
              id="isFree"
              className="rounded border-gray-300"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This item is free
            </label>
          </div>

          {!isFree && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (KES) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <select
              {...register('condition')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URLs <span className="text-red-500">*</span> (1-8 images)
            </label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {imageUrls.length < 8 && (
              <button
                type="button"
                onClick={addImageField}
                className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Add Image URL
              </button>
            )}
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pickup Location
            </label>
            <input
              {...register('pickupLocation')}
              type="text"
              placeholder="e.g., Kilimani, Nairobi"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register('deliveryAvailable')}
              type="checkbox"
              id="deliveryAvailable"
              className="rounded border-gray-300"
            />
            <label htmlFor="deliveryAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Delivery available
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </main>
    </div>
  );
}
