'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import axios from 'axios';

const registerSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').trim(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').trim(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform((val) => val.toLowerCase().trim()),
  neighborhoodId: z.string().optional().transform((val) => val?.trim() || undefined),
  address: z.string().optional().transform((val) => val?.trim() || undefined),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Prepare registration data
      const registrationData = {
        fullName: data.fullName.trim(),
        username: data.username.trim().toLowerCase(),
        email: data.email.trim(),
        password: data.password,
        phoneNumber: data.phoneNumber.trim(),
      };
      
      console.log('Submitting registration with data:', { ...registrationData, password: '***' });
      
      // Use Axios to send POST request to backend
      const response = await axios.post(
        'http://localhost:3001/api/v1/auth/register',
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Registration response:', response.data);
      
      // Extract tokens from response
      // Backend returns: { data: { accessToken, refreshToken, user }, statusCode }
      const responseData = response.data;
      const tokens = responseData.data || responseData;
      const accessToken = tokens?.accessToken;
      const refreshToken = tokens?.refreshToken;
      
      if (accessToken && refreshToken) {
        // Save tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Tokens saved successfully');
        
        // Display success message
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Redirecting to dashboard...' 
        });
        
        // Redirect to dashboard after 1-2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        // If tokens are missing, still show success but redirect to login
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Please login to continue.' 
        });
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error: any) {
      // Handle errors with Axios
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data;
        
        if (responseData.message) {
          errorMessage = Array.isArray(responseData.message) 
            ? responseData.message.join(', ') 
            : responseData.message;
        } else if (responseData.error) {
          errorMessage = Array.isArray(responseData.error)
            ? responseData.error.join(', ')
            : typeof responseData.error === 'string'
            ? responseData.error
            : responseData.error.message || errorMessage;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend is running on http://localhost:3001';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join your neighborhood on Mtaa
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' && (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {message.type === 'error' && (
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('fullName')}
              type="text"
              required
              autoComplete="name"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              {...register('username')}
              type="text"
              required
              autoComplete="username"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="johndoe"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              {...register('password')}
              type="password"
              required
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Minimum 6 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phoneNumber')}
              type="tel"
              required
              autoComplete="tel"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+254712345678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="neighborhoodId" className="block text-sm font-medium">
              Neighborhood ID (Optional)
            </label>
            <input
              {...register('neighborhoodId')}
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Leave blank if not applicable"
            />
            {errors.neighborhoodId && (
              <p className="mt-1 text-sm text-red-600">{errors.neighborhoodId.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Address (Optional)
            </label>
            <input
              {...register('address')}
              type="text"
              autoComplete="street-address"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="123 Main Street (optional)"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary-600 py-3 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}



