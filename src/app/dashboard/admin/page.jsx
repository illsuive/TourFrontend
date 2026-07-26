'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { 
  Shield, Users, Compass, DollarSign, Sparkles, PlusCircle, Globe,
  UserCheck, Trash2, Power, RefreshCw, BarChart3, Receipt, Eye , Loader2, MapPin, Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | create | packages | users | payments

  // --- Platform State Stores ---
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // --- Form Parameters States ---
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3');
  const [budgetType, setBudgetType] = useState('Mid-Range');
  const [interests, setInterests] = useState('');
  const [price, setPrice] = useState('299');
  const [totalSeats, setTotalSeats] = useState('50');
  const [category, setCategory] = useState('Group Tour');
  const [isPublic, setIsPublic] = useState(true);
  const [assignedToEmail, setAssignedToEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Strict Admin Firewall Verification Gate
  useEffect(() => {
    if (hasMounted && !authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, hasMounted, router]);

  // Fetch all administrative reporting data vectors
  const fetchAllAdminData = async () => {
    try {
      setLoadingMetrics(true);
      const [statsRes, tripsRes, usersRes, paymentsRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/trips'),
        api.get('/admin/users'),
        api.get('/admin/payments').catch(() => ({ data: [] })) // Fallback if no payments table logs yet
      ]);
      
      setStats(statsRes.data);
      setTrips(tripsRes.data || []);
      setUsersList(usersRes.data || []);
      setPaymentsList(paymentsRes.data || []);
    } catch (err) {
      console.error("Admin data synchronization fault:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (hasMounted && user?.role === 'admin') {
      fetchAllAdminData();
    }
  }, [hasMounted, user]);

  // Handle commercial travel pack creation pipeline
  const handleDeployPackage = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = {
        destination: destination.trim(),
        duration: Number(duration),
        budgetType,
        interests: interests.split(',').map(i => i.trim()).filter(Boolean),
        price: Number(price) || 299,
        totalSeats: Number(totalSeats) || 50,
        category,
        isPublic,
        assignedToEmail: !isPublic ? assignedToEmail.trim() : null
      };

      await api.post('/admin/trips', payload);
      setFeedback({ type: 'success', text: `🎉 Commercial tour package to ${destination} successfully deployed!` });
      
      // Clean states
      setDestination('');
      setInterests('');
      setAssignedToEmail('');
      fetchAllAdminData(); // Refresh metrics registers
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle user active state boolean
  const handleToggleAccess = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-access`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Access state modification rejected.');
    }
  };

  // Delete User cascading account purge
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to purge this user? This will remove all their personal trips cascadingly.")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Account eviction failed.');
    }
  };

  // Delete Trip listing frame
  const handleDeleteTrip = async (tripId) => {
    if (!confirm("Remove this travel package from the platform database logs permanently?")) return;
    try {
      await api.delete(`/admin/web-trips-purge-route/${tripId}`); // Hits DELETE /admin/trips/:id
      fetchAllAdminData();
    } catch (err) {
      try {
        await api.delete(`/admin/trips/${tripId}`);
        fetchAllAdminData();
      } catch (innerErr) {
        alert('Package removal routine rejected.');
      }
    }
  };

  if (!hasMounted || authLoading || loadingMetrics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-500 font-mono">Synchronizing Platform Administration Engines...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 🛡️ Master Global Navigation Control Bar Banner */}
      <header className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-purple-400 fill-purple-900/40" size={26} />
          <div>
            <h1 className="text-lg font-black tracking-tight">MoonVoyage Operations Administration Dashboard</h1>
            <p className="text-[11px] text-purple-300 font-medium">Global Governance Privileges Enabled</p>
          </div>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-xs font-bold bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-all text-white"
        >
          Exit Control Desk
        </button>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Side Control Tab Dashboard Links Column Selector */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-sm">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 size={16} /> Platform Metrics
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PlusCircle size={16} /> Deploy Packages
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'packages' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Compass size={16} /> Package Matrix
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={16} /> User Accounts
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'payments' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Receipt size={16} /> Financial Audits
          </button>
          <button 
            onClick={fetchAllAdminData}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all border border-amber-100 mt-4"
          >
            <RefreshCw size={14} /> Re-sync Database
          </button>
        </div>

        {/* Right Side Core Content Working Dashboard Pane */}
        <div className="lg:col-span-4 min-h-[500px]">
          
          {/* TAB FRAME 1: ANALYTICS INTERFACE SUBPANEL */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Active Customers</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">{stats?.metrics?.totalUsers || 0} Users</span>
                  </div>
                  <Users className="text-purple-600 bg-purple-50 p-2 rounded-xl" size={40} />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Deployed Itineraries</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">{stats?.metrics?.totalTrips || 0} Matrices</span>
                  </div>
                  <Compass className="text-indigo-600 bg-indigo-50 p-2 rounded-xl" size={40} />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Platform Managed Capital</span>
                    <span className="text-2xl font-black text-emerald-600 mt-1 block">${(stats?.metrics?.overallEstimatedBudget || 0).toLocaleString()}</span>
                  </div>
                  <DollarSign className="text-emerald-600 bg-emerald-50 p-2 rounded-xl" size={40} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Package Distribution Budget Profiles</h3>
                <div className="space-y-3">
                  {stats?.budgetDistribution?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-bold text-gray-600 p-2 bg-gray-50 rounded-xl">
                      <span className="capitalize">{item._id || 'Generative Sightseeing'}</span>
                      <span className="font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">{item.count} Active Logs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB FRAME 2: AI PACKAGE INGESTION & DEPLOYMENT MANAGEMENT FORM */}
          {activeTab === 'create' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="text-purple-600" size={18} /> Ingest Commercial Tour Parameters
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Hydrate fields to direct Gemini models to create pre-seeded global inventories.</p>
              </div>

              {feedback.text && (
                <div className={`p-3 rounded-xl text-xs font-bold border ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {feedback.text}
                </div>
              )}

              <form onSubmit={handleDeployPackage} className="space-y-4 text-xs font-bold text-gray-700">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1.5 flex items-center gap-1"><Globe size={14} className="text-purple-500" /> Allocation Target Scope</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsPublic(true)} className={`flex-1 py-2 rounded-lg font-black transition-all border ${isPublic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}>Global Marketplace</button>
                      <button type="button" onClick={() => setIsPublic(false)} className={`flex-1 py-2 rounded-lg font-black transition-all border ${!isPublic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}>User Assignment</button>
                    </div>
                  </div>
                  {!isPublic && (
                    <div className="animate-fadeIn">
                      <label className="block text-gray-500 mb-1.5 flex items-center gap-1"><UserCheck size={14} className="text-purple-500" /> Target User Account Email</label>
                      <input type="email" required placeholder="customer@example.com" className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" value={assignedToEmail} onChange={(e) => setTargetUserEmail(e.target.value || e.target.value)} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-500 mb-1.5"><MapPin size={12} className="inline text-purple-500 mr-0.5" /> Destination Target</label>
                    <input type="text" required placeholder="e.g. Tokyo, Paris, Goa" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none" value={destination} onChange={(e) => setDestination(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1.5"><Clock size={12} className="inline text-purple-500 mr-0.5" /> Duration (Days)</label>
                    <input type="number" required min="1" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none font-mono" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1.5">Budget Profile Grade</label>
                    <select className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none" value={budgetType} onChange={(e) => setBudgetType(e.target.value)}>
                      <option value="Budget">Budget Tier</option>
                      <option value="Mid-Range">Mid-Range Tier</option>
                      <option value="Luxury">Luxury Tier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1.5">Listing Ticket Price ($)</label>
                    <input type="number" required min="0" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none font-mono" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1.5">Max Seating Capacity</label>
                    <input type="number" required min="1" disabled={!isPublic} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none font-mono disabled:opacity-50" value={isPublic ? totalSeats : '1'} onChange={(e) => setTotalSeats(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 mb-1.5">Specific Hobbies or Focus Areas</label>
                  <input type="text" placeholder="e.g. Photography, Cafes, History, Hiking" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none" value={interests} onChange={(e) => setInterests(e.target.value)} />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 mt-4 text-xs uppercase tracking-wider disabled:bg-purple-400">
                  {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <PlusCircle size={14} />}
                  <span>{isSubmitting ? "Invoking AI Generations..." : "Deploy Live Package"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB FRAME 3: PACKAGE MANIFEST LIST DATA TABLES */}
          {activeTab === 'packages' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn overflow-x-auto">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Active Inventory Records Mapping</h3>
              <table className="w-full text-left border-collapse text-xs font-semibold text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                    <th className="p-3">Destination</th>
                    <th className="p-3">Tier / Scope</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Attendance Capacity</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((tripItem) => (
                    <tr key={tripItem._id} className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 font-black text-gray-900">{tripItem.destination} <span className="block text-[10px] text-gray-400 font-medium font-mono">{tripItem.duration} Days</span></td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${tripItem.isPublic ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>{tripItem.isPublic ? "Global Tour" : "Assigned"}</span></td>
                      <td className="p-3 font-mono font-black text-gray-900">${tripItem.price || 299}</td>
                      <td className="p-3 font-mono">{tripItem.isPublic ? `${tripItem.seatsAllotted || 0}/${tripItem.totalSeats || 50} Seats` : (tripItem.isPurchased ? "✓ Secured" : "Unpaid")}</td>
                      <td className="p-3 text-right space-x-2 shrink-0">
                        <button onClick={() => router.push(`/trips/${tripItem._id}`)} className="p-1.5 text-gray-400 hover:text-purple-600 inline-block" title="View file"><Eye size={14}/></button>
                        <button onClick={() => handleDeleteTrip(tripItem._id)} className="p-1.5 text-gray-400 hover:text-red-500 inline-block" title="Purge itinerary listing"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB FRAME 4: CUSTOMER GOVERNANCE ACCOUNTS PORTAL */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn overflow-x-auto">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">User Directory Management Console</h3>
              <table className="w-full text-left border-collapse text-xs font-semibold text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                    <th className="p-3">Name Profile</th>
                    <th className="p-3">Email Reference</th>
                    <th className="p-3">Clearance Access Status</th>
                    <th className="p-3 text-right">Actions Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 font-black text-gray-900">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3"><span className={`font-mono text-[10px] font-bold uppercase ${u.isAccountActive !== false ? 'text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100' : 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100'}`}>{u.isAccountActive !== false ? 'ACTIVE' : 'SUSPENDED'}</span></td>
                      <td className="p-3 text-right space-x-1.5 shrink-0">
                        <button onClick={() => handleToggleAccess(u._id)} className="p-1.5 text-gray-400 hover:text-amber-600 inline-block" title="Toggle active permissions"><Power size={14}/></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-gray-400 hover:text-red-500 inline-block" title="Purge account records"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB FRAME 5: GLOBAL FINANCIAL TRANSACTION RECEIPTS TABLE */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fadeIn overflow-x-auto">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Gateway Transaction Audit Archives</h3>
              {paymentsList.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-8">No standalone payment transaction log objects registered in the system index yet.</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-semibold text-gray-600">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">User Buyer</th>
                      <th className="p-3">Target Tour</th>
                      <th className="p-3">Amount Capture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.map((pay) => (
                      <tr key={pay._id} className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-900">{pay.razorpayPaymentId || pay._id}</td>
                        <td className="p-3">{pay.userId?.name || 'Unknown User'}<span className="block text-[10px] text-gray-400 font-mono">{pay.userId?.email}</span></td>
                        <td className="p-3 font-black text-gray-700">{pay.tripId?.destination || 'Deleted Location'}</td>
                        <td className="p-3 font-mono font-black text-emerald-600">${pay.amountPaid || pay.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}