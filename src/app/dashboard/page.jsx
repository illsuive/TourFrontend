'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { 
  Compass, Wallet, Sparkles, LogOut, Loader2, 
  MapPin, Clock, ArrowRight, PlusCircle, History
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const router = useRouter();

  // Hydration safety gate shield
  const [hasMounted, setHasMounted] = useState(false);

  // Core Generation Input States
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3');
  const [budgetTier, setBudgetTier] = useState('2'); // 1 = Budget, 2 = Mid-Range, 3 = Luxury
  const [interests, setInterests] = useState('');
  
  // Platform Data Lists & UI Controls
  const [pastTrips, setPastTrips] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Establish structural layout mounting point
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. Client-side SPA route security firewall rules
  useEffect(() => {
    if (hasMounted && !authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, hasMounted, router]);

  // 3. Fetch past generated itinerary vectors cleanly on mount
  useEffect(() => {
    if (hasMounted && user) {
      const fetchUserTrips = async () => {
        try {
          // Hits GET /api/trips mapping out of your tripRoutes file
          const response = await api.get('/trips');
          setPastTrips(response.data || []);
        } catch (error) {
          console.error('Failed bringing down travel manifest archives:', error);
        }
      };
      fetchUserTrips();
    }
  }, [hasMounted, user]);

  // Maps slider values to structural payload categories
  const getBudgetLabel = (tierValue) => {
    if (tierValue === '1') return 'Budget';
    if (tierValue === '3') return 'Luxury';
    return 'Mid-Range';
  };

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const payload = {
        destination: destination.trim(),
        duration: Number(duration),
        budgetType: getBudgetLabel(budgetTier),
        interests: interests.split(',').map(i => i.trim()).filter(Boolean)
      };

      // Hits the exact route we mapped -> POST /api/trips/generate
      const response = await api.post('/trips/generate', payload);
      
      if (response.data && response.data._id) {
        router.push(`/trips/${response.data._id}`);
      } else {
        throw new Error('System saved the package but failed passing back target token identifiers.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || 'AI pipeline connection failure.');
      setIsGenerating(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  // 🛠️ DYNAMIC FEED COMPILATION MATRIX
  // Filters out personal sandboxes, admin assignments, and public marketplace options
  const personalSandboxes = pastTrips.filter(t => t.userId === user?._id && !t.isPublic);
  const globalPublicPackages = pastTrips.filter(t => t.isPublic === true);
  const assignedPersonalTrips = pastTrips.filter(t => t.assignedTo === user?._id);

  // Safe layout render fallback barrier
  if (!hasMounted || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-500 font-mono">Synchronizing workspace components...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Parameters Form Input Desk */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              <span>AI Engine Command</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Configure your variables to generate a custom itinerary.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleGenerateItinerary} className="space-y-4 text-xs font-semibold text-gray-700">
            <div>
              <label className="block text-gray-500 mb-1.5 flex items-center gap-1">
                <MapPin size={14} className="text-purple-500" /> Target Destination
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Tokyo, Amsterdam, Goa" 
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5 flex items-center gap-1">
                <Clock size={14} className="text-purple-500" /> Duration ({duration} Days)
              </label>
              <input 
                type="range" 
                min="1" 
                max="14" 
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>1 Day</span>
                <span>7 Days</span>
                <span>14 Days</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5 flex items-center gap-1">
                <Wallet size={14} className="text-purple-500" /> Budget Tier: <span className="text-purple-700 font-bold ml-0.5">{getBudgetLabel(budgetTier)}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>Budget</span>
                <span>Mid-Range</span>
                <span>Luxury</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5">Specific Hobbies or Interests</label>
              <input 
                type="text" 
                placeholder="e.g. Cafes, Hiking, Photography, History" 
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 font-medium mt-1 pl-0.5">Separate multiple entries with commas.</p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-6 disabled:bg-purple-400 disabled:cursor-not-allowed text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Invoking AI Models...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Generate AI Package</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Columns: User Panel Analytics Feed Board */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Context Card Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest font-mono text-purple-300 font-bold">Workspace Platform</div>
              <h1 className="text-2xl font-black tracking-tight">Welcome Back, {user?.name || 'Explorer'}!</h1>
              <p className="text-xs text-purple-200/90 font-medium">Ready to explore or synthesize custom travel matrix packages?</p>
            </div>
            
            <button 
              onClick={handleLogoutClick}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 flex items-center justify-center text-white"
              title="Terminate Authentication Session"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* 🎁 CATEGORY 1: Direct Personal Allocations from Admin (Ready to Buy) */}
          {assignedPersonalTrips.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/5 via-indigo-900/5 to-white rounded-2xl border border-purple-200/60 p-6 space-y-4 shadow-sm">
              <div className="border-b border-purple-100 pb-3 flex items-center gap-2">
                <Sparkles className="text-purple-600 fill-purple-100" size={18} />
                <h3 className="text-base font-black text-purple-950">Assigned Personal Packages</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignedPersonalTrips.map((trip) => (
                  <div 
                    key={trip._id} 
                    onClick={() => router.push(`/trips/${trip._id}`)}
                    className="p-4 border border-purple-100 bg-white rounded-xl hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">Custom For You</span>
                        <span className={trip.isPurchased ? "text-emerald-600" : "text-amber-600"}>
                          {trip.isPurchased ? "✓ Secured" : "⚡ Unlock Now"}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900 mt-2">{trip.destination}</h4>
                    </div>
                    <div className="text-xs font-mono font-black text-purple-700 mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                      <span>${trip.price || 299}</span>
                      <span className="text-[11px] font-sans text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Review Plan <ArrowRight size={12}/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🌟 CATEGORY 2: Global Pre-Built Tour Packages (Marketplace) */}
          {globalPublicPackages.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200/60 p-6 space-y-4 shadow-sm">
              <div className="border-b border-amber-200/60 pb-3 flex items-center gap-2">
                <Compass className="text-amber-600 fill-amber-500 animate-spin-slow" size={18} />
                <h3 className="text-base font-black text-amber-950">Featured Tour Packages</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {globalPublicPackages.map((trip) => {
                  const slotsRemaining = trip.totalSeats - trip.seatsAllotted;
                  const isUserBooked = trip.bookingManifest?.some(log => log.userId === user?._id);

                  return (
                    <div 
                      key={trip._id} 
                      onClick={() => router.push(`/trips/${trip._id}`)}
                      className="p-4 border border-amber-200 bg-white rounded-xl hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">Official Package</span>
                          <span className={isUserBooked ? "text-emerald-600" : "text-gray-400 font-mono"}>
                            {isUserBooked ? "✓ Booked" : `${slotsRemaining > 0 ? slotsRemaining : 0} Seats Left`}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mt-2">{trip.destination} ({trip.duration} Days)</h4>
                      </div>
                      <div className="text-xs font-mono font-black text-amber-700 mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span>${trip.price || 399}</span>
                        <span className="text-[11px] font-sans text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Book Tour <ArrowRight size={12}/>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 3: Standard Personal Generative Workspace Sandboxes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
              <History size={18} className="text-purple-600" />
              <h3 className="text-base font-black">Your Generative Workspaces</h3>
            </div>

            {personalSandboxes.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl space-y-2">
                <Compass className="mx-auto text-gray-300" size={36} />
                <p className="text-xs font-bold text-gray-400 italic">No historical itineraries mapped. Use the generator panel to create one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalSandboxes.map((trip) => (
                  <div 
                    key={trip._id} 
                    onClick={() => router.push(`/trips/${trip._id}`)}
                    className="p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition-all cursor-pointer bg-gray-50/50 hover:bg-white flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                          {trip.budgetType || 'Mid-Range'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {trip.duration} Days
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-purple-600 transition-colors pt-1">
                        {trip.destination}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mt-4 pt-3 border-t border-gray-100/70">
                      <span className="truncate max-w-[140px]">
                        {trip.interests?.join(', ') || 'General Sightseeing'}
                      </span>
                      <span className="text-purple-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Open File <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}