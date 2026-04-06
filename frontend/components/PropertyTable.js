'use client';

import {
  AlertTriangle, CheckCircle, ExternalLink, MapPin,
  Calendar, DollarSign, Activity, Eye, Info, TrendingUp,
  ArrowUpRight, Clock, Target, ShieldCheck
} from 'lucide-react';

export default function PropertyTable({ properties = [], viewMode = 'table' }) {
  if (properties.length === 0) {
    return (
      <div className="bg-dark-900/40 backdrop-blur-3xl rounded-[48px] border border-white/5 p-32 text-center animate-in zoom-in duration-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-600/10 blur-[100px] rounded-full"></div>
        <div className="relative">
          <div className="w-24 h-24 bg-dark-800 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/5 rotate-12 transition-transform hover:rotate-0 duration-500">
            <Target className="w-12 h-12 text-accent-500" />
          </div>
          <h3 className="text-4xl font-black text-white mb-6 tracking-tighter">Awaiting Mission Parameters</h3>
          <p className="text-dark-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
            Deploy your first virtual drive to begin harvesting distressed leads. Our neural network is standing by to analyze neighborhood topography.
          </p>
          <div className="mt-12 flex items-center justify-center gap-8">
             {[
               { icon: Clock, text: "2.4s Avg Analysis" },
               { icon: Activity, text: "98.2% AI Recall" },
               { icon: ShieldCheck, text: "Enterprise Secure" }
             ].map((b, i) => {
               const Icon = b.icon;
               return (
                 <div key={i} className="flex items-center gap-2">
                   <Icon className="w-4 h-4 text-accent-500" />
                   <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">{b.text}</span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {properties.map((prop, idx) => (
          <div
            key={idx}
            className="group bg-dark-900/80 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden hover:border-accent-600/30 transition-all hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.6)] flex flex-col relative"
          >
            {/* Image Section */}
            <div className="relative h-72 overflow-hidden">
              {prop.image_url ? (
                <img
                  src={prop.image_url}
                  alt={prop.address}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-dark-950 flex flex-col items-center justify-center gap-4">
                  <ImageIcon className="w-12 h-12 text-dark-800" />
                  <span className="text-dark-700 font-black uppercase tracking-widest text-[10px]">No Imagery Link</span>
                </div>
              )}
              
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-2 ${
                  prop.distressed ? 'bg-danger/60 text-white' : 'bg-success/60 text-white'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${prop.distressed ? 'bg-white' : 'bg-white'}`}></div>
                  {prop.distressed ? 'Distress Flagged' : 'Normal Asset'}
                </div>
              </div>

              <div className="absolute top-6 right-6">
                <button className="w-10 h-10 bg-dark-900/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-accent-600 transition-all shadow-2xl">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Neural Match</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{prop.confidence?.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      prop.confidence > 80 ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]' : prop.confidence > 60 ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    }`}
                    style={{ width: `${prop.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-6">
                <h4 className="text-2xl font-black text-white leading-tight mb-2 group-hover:text-accent-400 transition-colors tracking-tight">
                  {prop.address}
                </h4>
                <div className="flex items-center gap-2 text-dark-500 font-bold text-xs uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-accent-500" />
                  {prop.city || 'Miami Regional'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-dark-950/50 p-4 rounded-[24px] border border-white/5">
                    <p className="text-[9px] font-black text-dark-600 uppercase tracking-widest mb-1">Market Val</p>
                    <p className="text-xl font-black text-success tracking-tight">
                      {prop.zestimate ? `$${(prop.zestimate/1000).toFixed(0)}k` : 'N/A'}
                    </p>
                 </div>
                 <div className="bg-dark-950/50 p-4 rounded-[24px] border border-white/5">
                    <p className="text-[9px] font-black text-dark-600 uppercase tracking-widest mb-1">Structure</p>
                    <p className="text-xl font-black text-white tracking-tight">
                      {prop.yearBuilt || '1990s'}
                    </p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {prop.indicators?.length > 0 ? (
                  prop.indicators.map((ind, i) => (
                    <span key={i} className="px-4 py-1.5 bg-danger/5 text-danger border border-danger/20 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {ind}
                    </span>
                  ))
                ) : (
                  <span className="px-4 py-1.5 bg-dark-800 text-dark-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    No Visible Distress
                  </span>
                )}
              </div>

              <button className="w-full mt-auto py-4 bg-dark-800 hover:bg-dark-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3">
                <Eye className="w-4 h-4 text-accent-500" />
                Initialize Full Audit
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-dark-900/60 backdrop-blur-3xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter">Harvested Intelligence</h3>
          <p className="text-dark-500 font-bold uppercase tracking-widest text-xs mt-1">Matrix analysis of {properties.length} geographical nodes</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all">
             Export Matrix
           </button>
           <button className="px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent-600/20 transition-all flex items-center gap-2">
             <TrendingUp className="w-4 h-4" />
             Push to CRM
           </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-950/30 border-b border-white/5">
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em]">Node / Geo</th>
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em]">Visual Signature</th>
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em] text-center">Neural Match</th>
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em]">Distress Indicators</th>
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em]">Asset Value</th>
              <th className="px-10 py-6 text-[10px] font-black text-dark-600 uppercase tracking-[0.2em] text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {properties.map((prop, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-accent-600/20 group-hover:border-accent-600/30 transition-all">
                       <MapPin className="w-5 h-5 text-dark-400 group-hover:text-accent-400" />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg group-hover:text-accent-400 transition-colors tracking-tight">{prop.address}</p>
                      <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mt-1">{prop.city || 'Regional'} • {prop.yearBuilt || '1990s'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="relative w-36 h-20 rounded-2xl overflow-hidden border border-white/5 shadow-inner group/img">
                    {prop.image_url ? (
                      <img
                        src={prop.image_url}
                        alt={prop.address}
                        className="w-full h-full object-cover transition-transform group-hover/img:scale-125 duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-950 flex items-center justify-center">
                        <span className="text-[9px] text-dark-700 font-black uppercase">Offline</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-accent-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 bg-dark-950 rounded-full h-2 border border-white/5 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          prop.confidence > 80 ? 'bg-danger' : prop.confidence > 60 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${prop.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{prop.confidence?.toFixed(0)}% Match</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-wrap gap-2 max-w-[200px]">
                    {prop.indicators?.length > 0 ? (
                      prop.indicators.map((ind, i) => (
                        <span key={i} className="px-3 py-1 bg-danger/10 text-danger text-[9px] font-black uppercase tracking-widest rounded-md border border-danger/10">
                          {ind}
                        </span>
                      ))
                    ) : (
                      <span className="text-dark-600 text-[10px] font-black uppercase tracking-widest">Null Signature</span>
                    )}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-dark-500 mr-0.5">$</span>
                    <span className="text-white font-black text-2xl tracking-tighter">
                      {prop.zestimate ? prop.zestimate.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8 text-center">
                    {prop.distressed ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger border border-danger/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        FLAGGED
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">
                        <CheckCircle className="w-3.5 h-3.5" />
                        NORMAL
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
