'use client';

import { useState, useEffect, use } from 'react';
import { useAuthStore } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import Script from 'next/script';
import { 
  Compass, Clock, Wallet, MapPin, Sparkles, ArrowLeft, 
  Loader2, Plus, Trash2, RotateCw, AlertTriangle
} from 'lucide-react';

export default function TripDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  // Hydration safety gate shield
  const [hasMounted, setHasMounted] = useState(false);

  // Layout View Data Target Vectors
  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive Single Day Regeneration Modal parameters state
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Activity insertion state
  const [newActivityTime, setNewActivityTime] = useState('09:00 - 10:00');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityCost, setNewActivityCost] = useState('0');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Auth gate checks validation loop
  useEffect(() => {
    if (hasMounted && !authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, hasMounted, router]);

  // Pull down detailed data from MongoDB using parameter tokens
  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${params.id}`);
      setTrip(response.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed pulling target travel file entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted && user) {
      fetchTripDetails();
    }
  }, [hasMounted, user, params.id]);

  // 💳 🛠️ FRONTEND PURCHASE ACTION ADJUSTMENT
  const handlePackagePurchase = async () => {
    try {
      // 1. Initialize custom payment session tokens from your exact endpoint -> POST /api/trips/:id/payment
      const orderResponse = await api.post(`/trips/${trip._id}/payment`);
      const orderData = orderResponse.data;

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_public_id",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MoonVoyage Operations",
        description: `Booking Manifest: ${trip.destination}`,
        order_id: orderData.id,
        handler: async function (paymentSuccessPayload) {
          try {
            // 2. Transmit signature verification data to exact endpoint -> POST /api/trips/:id/payment/verify
            const verifyResponse = await api.post(`/trips/${trip._id}/payment/verify`, paymentSuccessPayload);
            if (verifyResponse.data.success) {
              alert("🎉 Package purchase completed successfully!");
              setTrip(verifyResponse.data.trip); // Update layout state reactively
            }
          } catch (err) {
            alert(err.response?.data?.error || "Payment verification routine check failed.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        theme: { color: "#7c3aed" } // Purple branding matrix
      };

      const paymentWindowInstance = new window.Razorpay(razorpayOptions);
      paymentWindowInstance.open();
    } catch (error) {
      alert(error.response?.data?.error || "Failed initiating payment transaction module.");
    }
  };

  // Handle addition of standard structured activities into schema layers
  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityDesc.trim()) return;

    try {
      const payload = {
        action: 'ADD',
        dayNumber: activeDay,
        activityText: {
          time: newActivityTime,
          description: newActivityDesc.trim(),
          cost: Number(newActivityCost) || 0
        }
      };

      const response = await api.put(`/trips/${params.id}/activity`, payload);
      setTrip(response.data);
      setNewActivityDesc('');
      setNewActivityCost('0');
    } catch (err) {
      alert(err.response?.data?.error || 'Could not insert activity entry variables.');
    }
  };

  // Remove individual activity instances
  const handleRemoveActivity = async (activityObj) => {
    try {
      const payload = {
        action: 'REMOVE',
        dayNumber: activeDay,
        activityText: activityObj
      };

      const response = await api.put(`/trips/${params.id}/activity`, payload);
      setTrip(response.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Eviction pipeline rejected update request.');
    }
  };

  // Dispatch individual day prompt adjustments back up to AI engine blocks
  const handleRegenerateDaySubmit = async (e) => {
    e.preventDefault();
    if (!regenPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await api.post(`/trips/${params.id}/regenerate-day`, {
        dayNumber: activeDay,
        prompt: regenPrompt.trim()
      });
      setTrip(response.data);
      setShowRegenModal(false);
      setRegenPrompt('');
    } catch (err) {
      alert(err.response?.data?.error || 'AI day engine processing error encountered.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasMounted || authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-500 font-mono">Parsing travel manifest schema vectors...</p>
      </div>
    );
  }

  if (errorMessage || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertTriangle className="text-red-500 mb-2" size={32} />
        <p className="text-sm font-bold text-gray-700">{errorMessage || 'Travel document entry not found.'}</p>
        <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"><ArrowLeft size={14}/> Back to Workspace</button>
      </div>
    );
  }

  const currentDayData = trip.itinerary?.find(d => d.day === activeDay) || { title: 'Rest Period', activities: [] };
  const isUserBooked = trip.bookingManifest?.some(log => log.userId === user?._id);
  const showPurchaseBtn = trip.isPublic || (trip.assignedTo === user?._id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🚀 Ensures Razorpay global scripts inject perfectly without stalling Next.js */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Action Breadcrumb Ribbon */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Travel Manifest Files
        </button>

        {/* Executive Theme Presentation Banner */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100 uppercase tracking-wider">{trip.budgetType}</span>
              <h1 className="text-2xl font-black text-gray-900 mt-1.5 flex items-center gap-2">
                <MapPin className="text-purple-600" size={24} />
                <span>{trip.destination} Exploration Matrix</span>
              </h1>
            </div>
            <div className="text-xs font-mono font-bold text-gray-400 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 shrink-0 h-fit">
              Duration Scope: <span className="text-gray-900">{trip.duration} Total Days</span>
            </div>
          </div>
          
          <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            {trip.summary || 'No narrative overview generated.'}
          </p>

          {/* Aggregate Financial Audit Subgrid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
            {Object.entries(trip.budgetBreakdown || {}).map(([key, value]) => (
              <div key={key} className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs">
                <span className="capitalize font-bold text-gray-400 block tracking-wide">{key}</span>
                <span className="font-mono font-black text-gray-900 mt-0.5 block text-sm">
                  ${value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* 💵 PURCHASE ACTION PANEL LINK */}
          {showPurchaseBtn && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400 font-medium">
                {trip.isPublic 
                  ? `Public Tour Package — ${trip.totalSeats - (trip.seatsAllotted || 0)} Seats Available` 
                  : "Direct Custom Admin Allocation File"}
              </div>
              
              <button
                onClick={handlePackagePurchase}
                disabled={trip.isPurchased || isUserBooked || (trip.isPublic && trip.seatsAllotted >= trip.totalSeats)}
                className={`px-6 py-2.5 text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider ${
                  trip.isPurchased || isUserBooked
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed shadow-none"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                }`}
              >
                {trip.isPurchased || isUserBooked ? "✓ Package Secured" : `Purchase Package ($${trip.price || 299})`}
              </button>
            </div>
          )}
        </div>

        {/* 🏨 BONUS FEATURE VIEW: Curated AI Hotel Recommendations Subgrid */}
        {trip.hotels && trip.hotels.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
              <Sparkles className="text-amber-500 fill-amber-500" size={18} />
              <h3 className="text-sm font-black tracking-tight">AI Curated Hotel Accommodations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trip.hotels.map((hotel, index) => (
                <div key={index} className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-gray-900 text-sm truncate">{hotel.name}</h4>
                      <span className="shrink-0 font-mono font-bold text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-md">
                        ⭐ {hotel.rating}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">{hotel.description}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold">
                    <div className="text-gray-400">
                      Est. Rate: <span className="text-gray-900 font-mono font-black text-xs">${hotel.pricePerNight}</span>/night
                    </div>
                    <div className="text-purple-600 italic bg-purple-50 px-2 py-0.5 rounded-md text-[10px] max-w-[130px] truncate">
                      {hotel.whyBookIt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Multi-day Grid Management Board Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Day Selector Navigation Column */}
          <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider px-1">Schedule Vector Index</h3>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
              {trip.itinerary?.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border shrink-0 lg:shrink ${
                    activeDay === d.day
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-gray-50/70 text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>Day {d.day} Overview</span>
                  <Clock size={12} className={activeDay === d.day ? 'text-white' : 'text-gray-400'} />
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Operations Board Column Display */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              
              {/* Context Day Action Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                <div>
                  <h2 className="text-base font-black text-gray-900">Day {activeDay}: {currentDayData.title}</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Mapped operations logged below.</p>
                </div>
                
                <button
                  onClick={() => setShowRegenModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-all"
                >
                  <RotateCw size={13} /> Re-engineer Day with AI
                </button>
              </div>

              {/* Dynamic Activities Mapping Display Blocks */}
              <div className="space-y-3">
                {(!currentDayData.activities || currentDayData.activities.length === 0) ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center border border-dashed border-gray-200 rounded-xl">No activities mapped inside this date vector frame.</p>
                ) : (
                  currentDayData.activities.map((act, index) => (
                    <div key={index} className="p-4 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all flex items-start gap-4 justify-between group">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md text-[10px]">{act.time || 'Schedule'}</span>
                          {act.cost > 0 && <span className="font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md text-[10px]">${act.cost}</span>}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">{act.description}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveActivity(act)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 lg:opacity-0 lg:group-hover:opacity-100"
                        title="Evict entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Manual Entry Form Injection Panel */}
              <form onSubmit={handleAddActivity} className="pt-4 border-t border-gray-100 space-y-3.5">
                <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5"><Plus size={16} className="text-purple-600"/> Append Custom Activity Node</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-semibold">
                  <div className="sm:col-span-1">
                    <label className="block text-gray-400 mb-1 font-bold">Time Window</label>
                    <input type="text" required className="w-full p-2 border border-gray-200 bg-gray-50 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newActivityTime} onChange={(e) => setNewActivityTime(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 mb-1 font-bold">Activity Description</label>
                    <input type="text" required placeholder="Describe the structural plan..." className="w-full p-2 border border-gray-200 bg-gray-50 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none" value={newActivityDesc} onChange={(e) => setNewActivityDesc(e.target.value)} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-gray-400 mb-1 font-bold">Cost ($)</label>
                    <input type="number" min="0" className="w-full p-2 border border-gray-200 bg-gray-50 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono" value={newActivityCost} onChange={(e) => setNewActivityCost(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all">Append Action</button>
              </form>

            </div>
          </div>
        </div>

        {/* DYNAMIC MODAL LAYER: AI VECTOR RE-ENGINEERING PANEL */}
        {showRegenModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5"><Sparkles className="text-amber-500" size={18} /> Re-engineer Day {activeDay} Schedule</h3>
                <button onClick={() => setShowRegenModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
              </div>

              <form onSubmit={handleRegenerateDaySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-bold mb-1.5">What changes would you like to make to this day?</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="e.g. Change all outdoor actions to museums because of heavy rain, or swap lunch for a budget vegan ramen cafe..."
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
                    value={regenPrompt}
                    onChange={(e) => setRegenPrompt(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowRegenModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Cancel</button>
                  <button type="submit" disabled={isGenerating} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:bg-purple-400">
                    {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <RotateCw size={14}/>}
                    <span>{isGenerating ? "Processing Matrix..." : "Rewrite Matrix"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}