'use client';

import { Map } from 'lucide-react';

export default function VirtualDrive() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Virtual Drive</h2>
        <p className="text-dark-400 mt-1">Drive neighborhoods virtually and find distressed properties with AI</p>
      </header>

      <div className="bg-dark-900 rounded-xl border border-dark-700 p-12 text-center">
        <Map className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-400">Virtual Drive</h3>
        <p className="text-dark-500 mt-1">Use the Dashboard to start scouting properties</p>
      </div>
    </div>
  );
}
