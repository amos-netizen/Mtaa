'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { marketplaceApi } from '@/lib/api/marketplace';
import { authApi } from '@/lib/api/auth';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';
import { uploadApi } from '@/lib/api/upload';

const updateListingSchema = z.object({
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

type UpdateListingForm = z.infer<typeof updateListingSchema>;

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

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateListingForm>({
    resolver: zodResolver(updateListingSchema),
    defaultValues: {
      isFree: false,
      deliveryAvailable: false,
      images: [],
    },
  });

  const isFree = watch('isFree');

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

        // Check if user owns this listing
        const userData = await authApi.getMe();
        if (listingData.authorId !== userData.id) {
          alert('You can only edit your own listings');
          router.push(`/marketplace/${listingId}`);
          return;
        }

        // Fetch neighborhoods
        const neighborhoodsData = await neighborhoodsApi.getAll('Nairobi');
        setNeighborhoods(neighborhoodsData.neighborhoods || []);

        // Pre-fill form with existing data
        const images = Array.isArray(listingData.images) 
          ? listingData.images 
          : JSON.parse(listingData.images || '[]');
        
        setImageUrls(images.length > 0 ? images : ['']);
        setImagePreviews(images);
        setValue('neighborhoodId', listingData.neighborhoodId);
        setValue('category', listingData.category);
        setValue('title', listingData.title);
        setValue('description', listingData.description);
        setValue('price', listingData.price || undefined);
        setValue('isFree', listingData.isFree || false);
        setValue('condition', listingData.condition || '');
        setValue('images', images);
        setValue('pickupLocation', listingData.pickupLocation || '');
        setValue('deliveryAvailable', listingData.deliveryAvailable || false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load listing data. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [listingId, router, setValue]);

  const addImageField = () => {
    if (imageUrls.length < 8) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageField = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    const newImages = imageUrls.filter((_, i) => i !== index);
    setValue('images', newImages.filter(url => url.trim() !== ''));
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
    setValue('images', newUrls.filter(url => url.trim() !== ''));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 8) {
      setMessage({ type: 'error', text: 'Maximum 8 images allowed' });
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(file => uploadApi.uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newUrls = [...imageUrls.filter(url => url), ...uploadedUrls];
      const newPreviews = [...imagePreviews, ...uploadedUrls];
      
      setImageUrls(newUrls.slice(0, 8));
      setImagePreviews(newPreviews.slice(0, 8));
      setValue('images', newUrls.slice(0, 8));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload images' });
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: UpdateListingForm) => {
    setSubmitting(true);
    setMessage(null);

    try {
      await marketplaceApi.updateListing(listingId, {
        title: data.title,
        description: data.description,
        price: data.isFree ? undefined : data.price,
        isFree: data.isFree,
        condition: data.condition,
        images: data.images,
        pickupLocation: data.pickupLocation,
        deliveryAvailable: data.deliveryAvailable,
      });

      setMessage({ type: 'success', text: 'Listing updated successfully! Redirecting...' });
      setTimeout(() => {
        router.push(`/marketplace/${listingId}`);
      }, 1500);
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to update listing. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/marketplace/${listingId}`} className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            ← Back to Listing
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">✏️ Edit Listing</h1>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Neighborhood <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('neighborhoodId')}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
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
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Vintage Coffee Table"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your item..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    {...register('isFree')}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Item</span>
                </label>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    min="0"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition
                </label>
                <select
                  {...register('condition')}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images <span className="text-red-500">*</span> (1-8 images)
              </label>
              <div className="space-y-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    + Add Image URL
                  </button>
                )}
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Location
              </label>
              <input
                {...register('pickupLocation')}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Westlands, Nairobi"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('deliveryAvailable')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Available</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {submitting ? 'Updating...' : 'Update Listing'}
              </button>
              <Link
                href={`/marketplace/${listingId}`}
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

