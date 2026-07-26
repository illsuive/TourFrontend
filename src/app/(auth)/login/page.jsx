'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../context/AuthContext.js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('butolagautam721@gmail.com');
  const [password, setPassword] = useState('qwerty@123');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearError, user } = useAuthStore();
  const router = useRouter();

  // Route protection gate: Redirect to dashboard if session state is already active
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
    return () => clearError(); // Flush validation errors on unmount
  }, [user, router, clearError]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const result = await login(email, password);
  //   if (result.success) {
  //     router.push('/dashboard');
  //   }
  // };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(email, password);
  if (result.success) {
    router.push('/dashboard');
    window.location.href = '/dashboard/admin';
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
        
        {/* Header Block */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your customized AI travel itineraries.
          </p>
        </div>

        {/* Dynamic Server Error Feedback */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            <div className="flex">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Email Address Input Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input Box with dynamic Visibility Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action Control */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        {/* Redirection Link */}
        <p className="text-center text-sm text-gray-600">
          New to the planner?{' '}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}