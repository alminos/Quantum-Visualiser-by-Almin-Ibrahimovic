import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs transition"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            Offline Mode Active: All quantum simulations, logic gate engines, and tutorial curricula are pre-cached and fully functional without an internet connection.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] opacity-90">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Local Engine Verified</span>
        </div>
      </div>
    </div>
  );
};
