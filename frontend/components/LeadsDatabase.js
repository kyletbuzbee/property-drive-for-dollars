'use client';

import { Database } from 'lucide-react';

export default function LeadsDatabase() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Leads Database</h2>
        <p className="text-dark-400 mt-1">View and manage all flagged distressed properties synced to Google Sheets</p>
      </header>

      <div className="bg-dark-900 rounded-xl border border-dark-700 p-12 text-center">
        <Database className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-400">Leads Database</h3>
        <p className="text-dark-500 mt-1">Flagged properties from virtual drives will appear here</p>
      </div>
    </div>
  );
}
