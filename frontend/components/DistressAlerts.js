'use client';

import { AlertTriangle } from 'lucide-react';

export default function DistressAlerts() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Distress Alerts</h2>
        <p className="text-dark-400 mt-1">Real-time alerts for newly detected distressed properties</p>
      </header>

      <div className="bg-dark-900 rounded-xl border border-dark-700 p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-400">Distress Alerts</h3>
        <p className="text-dark-500 mt-1">Alerts will appear here when new distressed properties are found</p>
      </div>
    </div>
  );
}
