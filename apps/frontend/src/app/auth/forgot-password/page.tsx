'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

const forgotPasswordSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
}).refine((data) => (data.phoneNumber && data.phoneNumber.length > 0) || (data.email && data.email.length > 0), {
  message: 'Either phone number or email is required',
  path: ['phoneNumber'],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const requestBody: { phoneNumber?: string; email?: string } = {};
      if (contactMethod === 'phone' && data.phoneNumber) {
        requestBody.phoneNumber = data.phoneNumber;
        setContactValue(data.phoneNumber);
      } else if (contactMethod === 'email' && data.email) {
        requestBody.email = data.email;
        setContactValue(data.email);
      }

      console.log('Sending OTP request:', requestBody);
      
      try {
        const response = await apiClient.instance.post('/api/v1/auth/login/otp', requestBody);
        const responseData = response.data;
        console.log('Response data:', responseData);

        setOtpSent(true);
        const successMessage = contactMethod === 'phone' 
          ? 'OTP sent successfully to your phone number!'
          : 'OTP sent successfully to your email address!';
        setMessage({ type: 'success', text: successMessage });
      } catch (error: any) {
        console.error('OTP request error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check your connection and try again.';
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otpCode = formData.get('otp') as string;

    setIsLoading(true);
    setMessage(null);
    
    try {
      const requestBody: { phoneNumber?: string; email?: string; otpCode: string } = {
        otpCode: otpCode,
      };
      
      if (contactMethod === 'phone') {
        requestBody.phoneNumber = contactValue;
      } else {
        requestBody.email = contactValue;
      }

      console.log('Verifying OTP:', requestBody);
      
      try {
        const response = await apiClient.instance.post('/api/v1/auth/verify-otp', requestBody);
        const responseData = response.data;
        console.log('Response data:', responseData);

        // Extract tokens from response
        const tokens = responseData.data || responseData;
      const accessToken = tokens?.accessToken;
      const refreshToken = tokens?.refreshToken;

      if (accessToken && refreshToken) {
        try {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('Tokens saved successfully');
          setMessage({ type: 'success', text: 'OTP verified successfully! Redirecting to dashboard...' });
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } catch (storageError) {
          console.error('Error saving tokens:', storageError);
          setMessage({ type: 'error', text: 'OTP verified but failed to save tokens. Please try again.' });
        }
      } else {
          console.error('Unexpected response format:', JSON.stringify(responseData, null, 2));
          setMessage({ type: 'error', text: 'OTP verified but tokens not received. Please try again.' });
        }
      } catch (error: any) {
        console.error('OTP verification error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check your connection and try again.';
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold">Verify OTP</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to {contactValue}
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                required
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-500">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">Forgot Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Choose how you want to receive your OTP code
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-3">
              Choose contact method
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={contactMethod === 'phone'}
                  onChange={(e) => setContactMethod(e.target.value as 'phone' | 'email')}
                  className="mr-2"
                />
                <span>Phone Number</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={contactMethod === 'email'}
                  onChange={(e) => setContactMethod(e.target.value as 'phone' | 'email')}
                  className="mr-2"
                />
                <span>Email</span>
              </label>
            </div>
          </div>

          {contactMethod === 'phone' ? (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="+254712345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-500">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

