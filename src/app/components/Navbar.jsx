'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../context/AuthContext.js'; 
import { useRouter } from 'next/navigation';
import { Compass, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // 🛠️ THE HYDRATION PROTECTOR: 
  // Forces the navigation links to wait until browser mounting stabilizes
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Element */}
        <Link href={hasMounted && user ? "/dashboard" : "/"} className="flex items-center gap-2 text-purple-600 font-black text-lg">
          <Compass className="animate-pulse" size={22} />
          <span>MoonVoyage</span>
        </Link>

        {/* Links Matrix */}
        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
          {/* 🛠️ Don't evaluate the user state on the server branch until hasMounted is true */}
          {!hasMounted ? (
            <>
              <div className="w-12 h-4 bg-gray-100 animate-pulse rounded-md" />
              <div className="w-16 h-8 bg-gray-100 animate-pulse rounded-xl" />
            </>
          ) : user ? (
            <>
              {/* Dynamic admin indicator element */}
              {user.role === 'admin' && (
                <Link 
                  href="/dashboard/admin" 
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <ShieldCheck size={14} />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">Dashboard</Link>
              
              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                <span className="text-gray-900 font-extrabold">{user.name}</span>
                <button 
                  onClick={handleLogoutClick}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-purple-600 transition-colors">Sign In</Link>
              <Link 
                href="/signup" 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}