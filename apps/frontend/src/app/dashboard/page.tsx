'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Use direct fetch to ensure proper error handling
        const response = await fetch('http://localhost:3001/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const responseData = await response.json();
        const userData = responseData.data || responseData;
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p>Name: {user.fullName}</p>
            <p>Username: {user.username}</p>
            <p>Phone: {user.phoneNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
