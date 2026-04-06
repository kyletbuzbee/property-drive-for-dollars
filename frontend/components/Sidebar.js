'use client';

import { Home, Map, Settings, Database, AlertTriangle, ChevronRight, User, Sparkles } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'scout', label: 'Virtual Drive', icon: Map },
  { id: 'leads', label: 'Leads Database', icon: Database },
  { id: 'alerts', label: 'Distress Alerts', icon: AlertTriangle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-[280px] bg-dark-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-accent-glow -z-10 pointer-events-none opacity-50"></div>
      
      <div className="p-10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-accent-600 rounded-[18px] flex items-center justify-center shadow-[0_0_24px_rgba(79,70,229,0.5)] rotate-3">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">
              PropertyDrive
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
              <p className="text-[10px] text-dark-400 font-bold uppercase tracking-[0.1em]">Intelligence v1.0</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-6 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] mb-4">Operations</p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden ${
                      isActive
                        ? 'bg-glass-gradient text-white border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.3)]'
                        : 'text-dark-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-accent-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                    )}
                    <div className="flex items-center gap-4">
                      <Icon className={`w-5 h-5 transition-all group-hover:scale-110 ${isActive ? 'text-accent-400' : 'text-dark-500'}`} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent-500 opacity-50" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4">
          <div className="bg-gradient-to-br from-dark-800/80 to-dark-900/80 rounded-3xl p-6 border border-white/5 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
               <Sparkles className="w-8 h-8 text-accent-400" />
             </div>
             <p className="text-[10px] text-accent-400 font-black uppercase tracking-widest mb-4">Pro Insight</p>
             <h4 className="text-white text-xs font-bold leading-relaxed mb-4">You have 24,640 requests remaining this month.</h4>
             <button className="w-full py-2.5 bg-accent-600 hover:bg-accent-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-accent-600/20 active:scale-[0.98]">
               Optimize Plan
             </button>
          </div>
        </div>
      </nav>

      <div className="p-8 border-t border-white/5 bg-dark-950/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[18px] border-2 border-white/5 p-0.5 bg-surface-gradient group cursor-pointer transition-all hover:border-accent-600/50">
              <div className="w-full h-full bg-dark-700 rounded-[14px] flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-dark-400 group-hover:text-accent-400" />
              </div>
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate tracking-tight">Lead Scout</p>
              <p className="text-[10px] text-dark-500 font-bold tracking-tight">Advanced Account</p>
           </div>
        </div>
      </div>
    </aside>
  );
}
