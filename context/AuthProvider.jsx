'use client';

import { useEffect } from 'react';
import { useAuthStore } from './AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '../src/app/components/Navbar';
import { Loader2 } from 'lucide-react';

export default function AuthProvider({ children }) {
  const { user, isLoading, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const sanitizedPath = pathname?.replace(/\/$/, '') || '/';
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAdminRoute = sanitizedPath.startsWith('/dashboard/admin');
  const isProtectedRoute = sanitizedPath.startsWith('/dashboard') || sanitizedPath.startsWith('/trips');

  useEffect(() => {
    if (isLoading) return; // Keep security checks locked until hydration finishes

    if (!user && isProtectedRoute) {
      router.push('/login');
    } else if (user && authRoutes.includes(sanitizedPath)) {
      // Smoothly forward them straight out of public authentication screens
      router.push(user.role === 'admin' ? '/dashboard/admin' : '/dashboard');
    } else if (user && isAdminRoute && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoading, sanitizedPath, isProtectedRoute, isAdminRoute, router]);

  if (isLoading && (isProtectedRoute || authRoutes.includes(sanitizedPath))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-500 font-mono">Verifying authorization parameters...</p>
      </div>
    );
  }

  const showNavbar = !authRoutes.includes(sanitizedPath);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}