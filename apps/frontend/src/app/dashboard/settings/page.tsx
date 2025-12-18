'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import { authApi } from '@/lib/api/auth';
import { uploadApi } from '@/lib/api/upload';
import { neighborhoodsApi } from '@/lib/api/neighborhoods';
import { marketplaceApi } from '@/lib/api/marketplace';
import { jobsApi } from '@/lib/api/jobs';

// Form Schemas
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  bio: z.string().max(150, 'Bio must be less than 150 characters').optional(),
  languagePreference: z.enum(['en', 'sw']),
  mpesaNumber: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

type SettingsSection = 
  | 'account' 
  | 'security' 
  | 'notifications' 
  | 'privacy' 
  | 'location' 
  | 'marketplace' 
  | 'saved' 
  | 'support' 
  | 'danger';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    marketplace: true,
    jobs: true,
    services: true,
    emergencyAlerts: true, // Always partially enabled
    communityPosts: true,
    email: true,
    push: true,
  });

  // Privacy preferences state
  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: false,
    allowMessages: 'everyone' as 'everyone' | 'neighbors' | 'none',
    profileVisibility: 'public' as 'public' | 'limited' | 'private',
  });

  // Marketplace preferences state
  const [marketplacePrefs, setMarketplacePrefs] = useState({
    preferredCategories: [] as string[],
    priceRange: { min: 0, max: 1000000 },
    hideSoldItems: true,
    savedSearches: [] as string[],
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
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
        setUser(userData);
        
        profileForm.reset({
          fullName: userData.fullName,
          username: userData.username,
          email: userData.email || '',
          bio: userData.bio || '',
          languagePreference: userData.languagePreference || 'en',
          mpesaNumber: userData.mpesaNumber || '',
        });

        // Fetch neighborhoods
        try {
          const neighborhoodsData = await neighborhoodsApi.getAll('Nairobi');
          setNeighborhoods(neighborhoodsData.neighborhoods || []);
        } catch (error) {
          console.error('Failed to fetch neighborhoods:', error);
        }

        // Fetch saved items and activity
        await loadSavedItems();
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, profileForm]);

  const loadSavedItems = async () => {
    try {
      // Load user's marketplace listings
      const listings = await marketplaceApi.getListings({ page: 1, limit: 20 });
      setMyListings(listings.listings || []);
      
      // Note: Saved items and applied jobs would need backend endpoints
      // For now, we'll show empty states
    } catch (error) {
      console.error('Failed to load saved items:', error);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfileImage(true);
    try {
      const url = await uploadApi.uploadImage(file);
      await usersApi.updateProfile({ profileImageUrl: url });
      const updatedUser = await authApi.getMe();
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload profile picture' });
    } finally {
      setUploadingProfileImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      setMessage(null);
      const updatedUser = await usersApi.updateProfile({
        fullName: data.fullName,
        username: data.username,
        email: data.email || undefined,
        bio: data.bio,
        languagePreference: data.languagePreference,
        mpesaNumber: data.mpesaNumber,
      });
      // Note: Phone number updates require verification and are handled separately
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      setMessage(null);
      await usersApi.updatePassword(data.oldPassword, data.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      passwordForm.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to log out of all devices? You will need to log in again.')) {
      return;
    }
    try {
      // This would require a backend endpoint to invalidate all refresh tokens
      await authApi.logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Failed to logout all devices:', error);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      return;
    }
    try {
      // This would require a backend endpoint
      setMessage({ type: 'success', text: 'Account deactivation requested. This feature will be available soon.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to deactivate account' });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Type "DELETE" to permanently delete your account. This action cannot be undone.');
    if (confirmText !== 'DELETE') {
      return;
    }
    if (!confirm('Are you absolutely sure? This will permanently delete all your data and cannot be undone.')) {
      return;
    }
    try {
      // This would require a backend endpoint
      setMessage({ type: 'error', text: 'Account deletion requested. This feature will be available soon.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'account' as SettingsSection, label: 'Account', icon: '👤' },
    { id: 'security' as SettingsSection, label: 'Security', icon: '🔒' },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: '🔔' },
    { id: 'privacy' as SettingsSection, label: 'Privacy', icon: '🛡️' },
    { id: 'location' as SettingsSection, label: 'Location', icon: '📍' },
    { id: 'marketplace' as SettingsSection, label: 'Marketplace', icon: '🛒' },
    { id: 'saved' as SettingsSection, label: 'Saved & Activity', icon: '💾' },
    { id: 'support' as SettingsSection, label: 'Support', icon: 'ℹ️' },
    { id: 'danger' as SettingsSection, label: 'Danger Zone', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>👤</span> Account Settings
                </h2>

                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden ring-4 ring-primary-200 dark:ring-primary-800">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    {uploadingProfileImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium">📷</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profile Photo</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                      {uploadingProfileImage ? '⏳ Uploading...' : '📸 Upload Photo'}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Supported formats: JPG, PNG, WebP. Maximum file size: 5MB
                    </p>
                    {user?.profileImageUrl && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to remove your profile photo?')) {
                            usersApi.updateProfile({ profileImageUrl: '' }).then(() => {
                              authApi.getMe().then(setUser);
                              setMessage({ type: 'success', text: 'Profile photo removed successfully!' });
                            }).catch((error: any) => {
                              setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to remove photo' });
                            });
                          }
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...profileForm.register('fullName')}
                        type="text"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {profileForm.formState.errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username *
                      </label>
                      <input
                        {...profileForm.register('username')}
                        type="text"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {profileForm.formState.errors.username && (
                        <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.username.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        {...profileForm.register('email')}
                        type="email"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user?.phoneNumber || ''}
                        disabled
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Phone number cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio (max 150 characters)
                    </label>
                    <textarea
                      {...profileForm.register('bio')}
                      rows={3}
                      maxLength={150}
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {profileForm.watch('bio')?.length || 0}/150 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language Preference
                      </label>
                      <select
                        {...profileForm.register('languagePreference')}
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        M-Pesa Number
                      </label>
                      <input
                        {...profileForm.register('mpesaNumber')}
                        type="tel"
                        placeholder="+254712345678"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🔒</span> Security Settings
                </h2>

                {/* Change Password */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        {...passwordForm.register('oldPassword')}
                        type="password"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {passwordForm.formState.errors.oldPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.oldPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        {...passwordForm.register('newPassword')}
                        type="password"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        {...passwordForm.register('confirmPassword')}
                        type="password"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Logout All Devices */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Sessions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Last login: {user?.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString() : 'Never'}
                  </p>
                  <button
                    onClick={handleLogoutAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Log Out of All Devices
                  </button>
                </div>

                {/* Two-Factor Authentication (Future) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add an extra layer of security to your account. Coming soon.
                  </p>
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Enable 2FA (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🔔</span> Notification Settings
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'marketplace', label: 'Marketplace Notifications', description: 'Get notified about new listings and messages' },
                    { key: 'jobs', label: 'Job Alerts', description: 'Receive alerts for new job postings' },
                    { key: 'services', label: 'Service Requests', description: 'Notifications for service bookings' },
                    { key: 'communityPosts', label: 'Community Post Updates', description: 'Updates on posts you follow' },
                    { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}

                  <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-yellow-900 dark:text-yellow-200">Emergency Alerts</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Critical safety alerts are always enabled</p>
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Always On</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Save notification preferences (would need backend endpoint)
                    setMessage({ type: 'success', text: 'Notification preferences saved!' });
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Privacy & Visibility */}
            {activeSection === 'privacy' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🛡️</span> Privacy & Visibility
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Show Phone Number</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your phone number</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.showPhone}
                        onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Show Email Address</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.showEmail}
                        onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Who Can Message You</h3>
                    <select
                      value={privacy.allowMessages}
                      onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.value as any })}
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="neighbors">Neighbors Only</option>
                      <option value="none">No One</option>
                    </select>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Profile Visibility</h3>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value as any })}
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="public">Public</option>
                      <option value="limited">Limited (Neighbors Only)</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Save privacy preferences (would need backend endpoint)
                    setMessage({ type: 'success', text: 'Privacy preferences saved!' });
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Location & Neighborhood */}
            {activeSection === 'location' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>📍</span> Location & Neighborhood
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Neighborhoods</h3>
                    {user?.userNeighborhoods?.length > 0 ? (
                      <div className="space-y-2">
                        {user.userNeighborhoods.map((un: any) => (
                          <div key={un.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {un.neighborhood?.name || 'Unknown'}
                              </span>
                              {un.isPrimary && (
                                <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                                  Primary
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No neighborhoods added yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Add Neighborhood</h3>
                    <select className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Select a neighborhood</option>
                      {neighborhoods.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name} - {n.city}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Add neighborhoods to see relevant content in your area
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Location-Based Filtering</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable location-based content</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Marketplace Preferences */}
            {activeSection === 'marketplace' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🛒</span> Marketplace Preferences
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preferred Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['FURNITURE', 'ELECTRONICS', 'CLOTHING', 'BOOKS', 'TOYS', 'APPLIANCES', 'VEHICLES', 'OTHER'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                          <input
                            type="checkbox"
                            checked={marketplacePrefs.preferredCategories.includes(cat)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMarketplacePrefs({
                                  ...marketplacePrefs,
                                  preferredCategories: [...marketplacePrefs.preferredCategories, cat],
                                });
                              } else {
                                setMarketplacePrefs({
                                  ...marketplacePrefs,
                                  preferredCategories: marketplacePrefs.preferredCategories.filter((c) => c !== cat),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Price Range (KES)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min</label>
                        <input
                          type="number"
                          value={marketplacePrefs.priceRange.min}
                          onChange={(e) =>
                            setMarketplacePrefs({
                              ...marketplacePrefs,
                              priceRange: { ...marketplacePrefs.priceRange, min: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max</label>
                        <input
                          type="number"
                          value={marketplacePrefs.priceRange.max}
                          onChange={(e) =>
                            setMarketplacePrefs({
                              ...marketplacePrefs,
                              priceRange: { ...marketplacePrefs.priceRange, max: parseInt(e.target.value) || 1000000 },
                            })
                          }
                          className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Hide Sold Items</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically hide sold items from listings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketplacePrefs.hideSoldItems}
                        onChange={(e) => setMarketplacePrefs({ ...marketplacePrefs, hideSoldItems: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMessage({ type: 'success', text: 'Marketplace preferences saved!' });
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Saved Items & Activity */}
            {activeSection === 'saved' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>💾</span> Saved Items & Activity
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Listings</h3>
                    {myListings.length > 0 ? (
                      <div className="space-y-2">
                        {myListings.slice(0, 5).map((listing: any) => (
                          <Link
                            key={listing.id}
                            href={`/marketplace/${listing.id}`}
                            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{listing.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {listing.isSold ? 'Sold' : 'Active'} • {new Date(listing.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-primary-600 dark:text-primary-400">→</span>
                            </div>
                          </Link>
                        ))}
                        {myListings.length > 5 && (
                          <Link
                            href="/marketplace"
                            className="block text-center text-primary-600 dark:text-primary-400 hover:underline mt-4"
                          >
                            View all {myListings.length} listings
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No listings yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Items</h3>
                    <p className="text-gray-500 dark:text-gray-400">No saved items yet. This feature will be available soon.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applied Jobs</h3>
                    <p className="text-gray-500 dark:text-gray-400">No job applications yet. This feature will be available soon.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Support & Information */}
            {activeSection === 'support' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>ℹ️</span> Support & Information
                </h2>

                <div className="space-y-4">
                  <Link
                    href="/about"
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">About MTAA</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Learn more about our platform</p>
                  </Link>

                  <Link
                    href="/legal"
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Privacy Policy</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How we protect your data</p>
                  </Link>

                  <Link
                    href="/legal"
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Terms & Conditions</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Terms of service</p>
                  </Link>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Contact Support</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Need help? Reach out to our support team</p>
                    <a
                      href="mailto:support@mtaa.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      support@mtaa.com
                    </a>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Report a Problem</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Found a bug or issue? Let us know</p>
                    <a
                      href="mailto:report@mtaa.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      report@mtaa.com
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <span>⚠️</span> Danger Zone
                </h2>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">Deactivate Account</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                      Temporarily disable your account. You can reactivate it by logging in again.
                    </p>
                    <button
                      onClick={handleDeactivateAccount}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Deactivate Account
                    </button>
                  </div>

                  <div className="p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-medium text-red-900 dark:text-red-200 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
