'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../context/AuthContext.js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import api from '../../../../services/api.js'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const { user, clearError } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
    return () => clearError();
  }, [user, router, clearError]);

  // Handle requesting the OTP code
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    setSuccessMessage(null);

    try {
      // Direct post to your auth router setup
      await api.post('/auth/forgot-password', { email });
      setSuccessMessage('A secure 6-digit OTP code has been dispatched to your inbox.');
      setStep(2);
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Failed to initialize password recovery.');
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP and updating the password document
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMessage('Password successfully updated! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Invalid OTP code validation sequence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
        
        {/* Navigation back helper link */}
        <div className="flex items-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Sign In
          </Link>
        </div>

        {/* Header Block */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 ? 'Recover Password' : 'Reset Credentials'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? 'Enter your account email to receive a temporary validation OTP code.' 
              : 'Provide the 6-digit code along with your custom new password choice.'
            }
          </p>
        </div>

        {/* Feedback Messages */}
        {localError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            <span>{localError}</span>
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic Multi-Step Form Execution */}
        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Registered Email Address
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

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Sending Code...
                </>
              ) : (
                'Generate Recovery OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
            {/* OTP Token Block */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 tracking-widest placeholder-tracking-normal placeholder-gray-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* New Password Parameter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Define New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Updating System Entry...
                </>
              ) : (
                'Finalize Password Reset'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}