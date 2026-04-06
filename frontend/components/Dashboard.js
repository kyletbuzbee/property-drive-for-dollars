'use client';

import { useState } from 'react';
import {
  Search, Play, Loader2, AlertCircle, CheckCircle, DollarSign,
  Image as ImageIcon, LayoutGrid, List, MapPin, Building2, TrendingUp, HelpCircle,
  Zap, ArrowRight, ShieldCheck, Globe
} from 'lucide-react';
import PropertyTable from './PropertyTable';

export default function Dashboard() {
  const [inputType, setInputType] = useState('zip');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ scanned: 0, distressed: 0, totalValue: 0 });

  const handleStartScouting = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setProperties([]);
    setStats({ scanned: 0, distressed: 0, totalValue: 0 });
    try {
      const payload = inputType === 'zip'
        ? { zip_code: inputValue.trim() }
        : { addresses: inputValue.trim().split('\n').map(a => a.trim()).filter(Boolean) };
      const response = await fetch('http://localhost:8000/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Scouting failed');
      const data = await response.json();
      setProperties(data.properties || []);
      setStats({
        scanned: data.stats?.scanned || 0,
        distressed: data.stats?.distressed || 0,
        totalValue: data.stats?.totalValue || 0,
      });
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-accent-600/5 blur-[120px] rounded-full -mr-96 -mt-96 -z-10 animate-pulse-slow"></div>
      
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-24">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-accent-600/10 border border-accent-600/20 rounded-full flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                <span className="text-[10px] font-black text-accent-300 uppercase tracking-widest">Autonomous Agent</span>
              </div>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
              Real-Time Neighborhood <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-indigo-600">Intelligence</span>
            </h2>
            <p className="text-dark-400 text-lg font-medium max-w-2xl leading-relaxed">
              Leverage autonomous computer vision to identify off-market distressed real estate directly from Google's planetary scale imagery.
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-1.5 bg-dark-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-dark-700 text-white shadow-lg' : 'text-dark-500 hover:text-dark-300'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-dark-700 text-white shadow-lg' : 'text-dark-500 hover:text-dark-300'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-dark-900/60 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
              <div className="flex p-3 gap-2">
                <button
                  onClick={() => setInputType('zip')}
                  className={`flex-1 py-4 rounded-[28px] text-[13px] font-black uppercase tracking-widest transition-all ${
                    inputType === 'zip' ? 'bg-accent-600 text-white shadow-xl' : 'text-dark-500 hover:bg-white/5'
                  }`}
                >
                  Zip Code Scout
                </button>
                <button
                  onClick={() => setInputType('addresses')}
                  className={`flex-1 py-4 rounded-[28px] text-[13px] font-black uppercase tracking-widest transition-all ${
                    inputType === 'addresses' ? 'bg-accent-600 text-white shadow-xl' : 'text-dark-500 hover:bg-white/5'
                  }`}
                >
                  Custom Address List
                </button>
              </div>

              <div className="p-10 pt-4">
                {inputType === 'zip' ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Globe className="w-6 h-6 text-accent-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Target Zip Code (e.g., 33139)"
                        className="w-full pl-16 pr-6 py-7 bg-dark-950/50 border border-white/5 rounded-[32px] text-xl font-bold text-white placeholder-dark-600 focus:outline-none focus:ring-4 focus:ring-accent-600/10 focus:border-accent-600/50 transition-all shadow-inner"
                      />
                    </div>
                    <button
                      onClick={handleStartScouting}
                      disabled={loading || !inputValue}
                      className="w-full py-7 bg-white text-dark-950 hover:bg-dark-50 disabled:bg-dark-800 disabled:text-dark-600 rounded-[32px] text-xl font-black uppercase tracking-tighter flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-7 h-7 animate-spin" />
                          Booting Engine...
                        </>
                      ) : (
                        <>
                          Launch Global Scout
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Batch addresses (one per line)..."
                        rows={5}
                        className="w-full px-8 py-8 bg-dark-950/50 border border-white/5 rounded-[32px] text-lg font-bold text-white placeholder-dark-600 focus:outline-none focus:ring-4 focus:ring-accent-600/10 focus:border-accent-600/50 transition-all shadow-inner resize-none custom-scrollbar"
                      />
                    </div>
                    <button
                      onClick={handleStartScouting}
                      disabled={loading || !inputValue}
                      className="w-full py-7 bg-white text-dark-950 hover:bg-dark-50 disabled:bg-dark-800 disabled:text-dark-600 rounded-[32px] text-xl font-black uppercase tracking-tighter flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-7 h-7 animate-spin" />
                          Processing Batch...
                        </>
                      ) : (
                        <>
                          Analyze Address Matrix
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-surface-gradient rounded-[40px] border border-white/5 p-10 h-full flex flex-col justify-between shadow-2xl">
               <div>
                  <h4 className="text-2xl font-black text-white mb-6 tracking-tight">System Status</h4>
                  <div className="space-y-8">
                     {[
                       { label: 'Neural Network', value: 'v8.1.0 Ready', icon: ShieldCheck },
                       { label: 'API Connection', value: '28k Requests', icon: Globe },
                       { label: 'Scout Nodes', value: 'Active', icon: Zap }
                     ].map((row, i) => {
                       const Icon = row.icon;
                       return (
                         <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                              <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] mb-1">{row.label}</p>
                              <p className="text-sm font-bold text-white">{row.value}</p>
                            </div>
                            <div className="p-2 bg-success/10 rounded-xl">
                              <Icon className="w-4 h-4 text-success" />
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>
             </div>
          </div>
        </div>

        {stats.scanned > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Scans', value: stats.scanned, icon: Globe, color: 'text-accent-400' },
              { label: 'Distressed', value: stats.distressed, icon: AlertCircle, color: 'text-danger' },
              { label: 'Value', value: stats.totalValue.toLocaleString(), prefix: '$', icon: DollarSign, color: 'text-success' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-dark-900/60 backdrop-blur-xl rounded-[32px] border border-white/5 p-8 flex items-center justify-between shadow-2xl">
                  <div>
                    <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-1">
                      {stat.prefix && <span className="text-2xl font-black text-dark-400 mr-0.5">{stat.prefix}</span>}
                      <p className="text-4xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-dark-950 flex items-center justify-center border border-white/5 ${stat.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-50 bg-dark-950/60 backdrop-blur-xl rounded-[40px] flex flex-col items-center justify-center border border-white/5">
               <Loader2 className="w-12 h-12 text-accent-500 animate-spin mb-4" />
               <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase tracking-widest">AI Agent Active</h3>
            </div>
          )}
          <PropertyTable properties={properties} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
