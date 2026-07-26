'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../context/AuthContext';
import { 
  Sparkles, ShieldCheck, Compass, Code2, Database, Layers, RotateCw,
  ArrowRight, Landmark, Zap, ShieldAlert, Cpu, CheckCircle2 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCTAAction = () => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      
      {/* 🌌 HERO HEADER SEGMENT */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.12),transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-bold text-purple-300 tracking-wide uppercase">
            <Cpu size={14} className="animate-spin-slow" /> Production Build v1.2.0 Operational
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-purple-300">
            MoonVoyage Operations
          </h1>
          
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            An advanced B2C travel ecosystem integrating deterministic JSON schema pipelines using Gemini 2.5 Flash, full-stack state isolation, and embedded cryptographic Razorpay ledger manifests.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={handleCTAAction}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 group uppercase tracking-wider"
            >
              <span>Initialize App Environment</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#architecture" 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider"
            >
              Read Systems Blueprint
            </a>
          </div>
        </div>
      </section>

      {/* 📊 FUNCTIONAL SCOPE SYSTEM GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* SECTION 1: SYSTEM CAPABILITIES */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Platform Architectural Scope</h2>
            <p className="text-xs text-gray-400 font-semibold">What this full-stack automation system processes out of the box.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:border-purple-200 transition-colors">
              <div className="p-2.5 bg-purple-50 rounded-xl w-fit text-purple-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900">Deterministic Generative Planning</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Normal users configure travel coordinates (destination, budget slider tier, chronological range, target interests) to force an integrated Gemini pipeline to compile pristine schedule matrices matching rigorous JSON verification layers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:border-purple-200 transition-colors">
              <div className="p-2.5 bg-amber-50 rounded-xl w-fit text-amber-600">
                <RotateCw size={20} className="animate-spin-slow" />
              </div>
              <h3 className="text-sm font-black text-gray-900">Dynamic AI Subgrid Re-engineering</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Enables users to select a single isolated date vector node and execute contextual overrides with natural language instructions ("Change to indoor cafes due to rain"), leaving the rest of the database model untouched.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:border-purple-200 transition-colors">
              <div className="p-2.5 bg-emerald-50 rounded-xl w-fit text-emerald-600">
                <Landmark size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900">Embedded Payment Gateways</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Integrates direct client-side checkout interactions via Razorpay script overlays. Validates transaction authenticity using server-side HMAC-SHA256 signature calculations to manage real-time seat capacities.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE TWIN PERMISSIONS MATRIX */}
        <section id="architecture" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* USER CAPABILITIES */}
          <div className="bg-gradient-to-br from-white to-purple-50/20 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Compass className="text-purple-600" size={22} />
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">User Dashboard Operations</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Standard client identities operate in a localized personal sandbox environment to test travel ideas with live budget metrics.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-600 font-semibold">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-purple-600 shrink-0 mt-0.5" /> <span>Invoke customized AI generations matching targeted budget categories.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-purple-600 shrink-0 mt-0.5" /> <span>Manually inject or evict custom itinerary nodes interactively.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-purple-600 shrink-0 mt-0.5" /> <span>Access separate feeds containing global commercial recommendations or direct private assignments.</span></li>
              </ul>
            </div>
          </div>

          {/* ADMIN ADMINISTRATIVE GOVERNANCE */}
          <div className="bg-gradient-to-br from-white to-amber-50/20 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <ShieldAlert className="text-amber-600" size={22} />
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Admin Console Matrix</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Administrators deploy global pre-built packages or allocate personal custom itineraries down to users.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-600 font-semibold">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" /> <span>Review global platform metrics, budget stats, and financial volumes.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" /> <span>Manage user access permissions or execute cascading account wipes.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" /> <span>Audit live billing logs and monitor global seat capacity balances.</span></li>
              </ul>
            </div>
          </div>

        </section>

        {/* SECTION 3: TECH STACK BLUEPRINT */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
            <Code2 size={20} className="text-purple-600" />
            <h3 className="text-base font-black uppercase tracking-tight">The Modern MERN Architecture Stack</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-xs font-semibold text-gray-600">
            <div className="space-y-2">
              <h4 className="text-gray-900 font-black flex items-center gap-1.5"><Layers size={14} className="text-purple-500"/> Core Frontend</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Next.js 15 Client Component views compiled via Turbopack. Integrates absolute paths (`@/`) and persistent authentication contexts via Tailwind UI design blocks.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-gray-900 font-black flex items-center gap-1.5"><Cpu size={14} className="text-purple-500"/> AI Engine</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Native `@google/genai` integration passing rigorous `responseSchema` structures directly into `gemini-2.5-flash` runtimes to guarantee error-free JSON generation.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-gray-900 font-black flex items-center gap-1.5"><Zap size={14} className="text-purple-500"/> Backend Server</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Express.js API routing engines isolated via JWT security barriers. Contains dedicated administrative intercept middleware configurations.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-gray-900 font-black flex items-center gap-1.5"><Database size={14} className="text-purple-500"/> Storage Layer</h4>
              <p className="text-gray-500 font-medium leading-relaxed">MongoDB schemas managed by Mongoose ODM. Features nested arrays (`bookingManifest`) to record purchase data directly inside trips with zero relational query overhead.</p>
            </div>
          </div>
        </section>

      </main>

      {/* 🧾 GLOBAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center border-t border-slate-800 text-[11px] font-mono font-bold tracking-wide">
        &copy; 2026 MoonVoyage Systems • Full-Stack AI Itinerary Emulation Platform
      </footer>

    </div>
  );
}
