import React from 'react';
import {
  Building2,
  Activity,
  AlertTriangle,
  UserPlus,
  BedDouble,
  ShieldAlert,
  Clock,
  Stethoscope,
  Sparkles,
  Menu
} from 'lucide-react';
import { HospitalConfig, HospitalSurgeStatus } from '../types/dhos';

interface HeaderProps {
  config: HospitalConfig;
  surgeStatus: HospitalSurgeStatus;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewPatient: () => void;
  onOpenBreakGlass: () => void;
  onOpenAIAssistant: () => void;
  onOpenMobileSidebar?: () => void;
  criticalAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  surgeStatus,
  activeTab,
  setActiveTab,
  onOpenNewPatient,
  onOpenBreakGlass,
  onOpenAIAssistant,
  onOpenMobileSidebar,
  criticalAlertsCount = 0
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Utility & Code Alert Banner */}
      <div className="bg-blue-600 text-white px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold">
            <Building2 className="w-3.5 h-3.5" />
            {config?.name || 'ST. JUDE METROPOLITAN HOSPITAL'}
          </span>
          <span className="hidden sm:inline text-white/80 border-l border-white/20 pl-3">
            TZ: <span className="text-white font-semibold">{config?.timeZone || 'AUSTRALIA/SYDNEY'}</span>
          </span>
          <span className="hidden md:inline text-white/80 border-l border-white/20 pl-3">
            FY: <span className="text-white font-semibold">{config?.financialYear || '2026-2027'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-0.5 rounded font-bold text-[11px] flex items-center gap-1 uppercase ${
            surgeStatus?.activeCode?.includes('Red')
              ? 'bg-red-700 text-white border border-red-400 animate-pulse'
              : 'bg-white/20 text-white border-none'
          }`}>
            <Activity className="w-3 h-3" />
            SURGE: {surgeStatus?.activeCode || 'NORMAL'}
          </div>

          {criticalAlertsCount > 0 && (
            <div className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 uppercase">
              <AlertTriangle className="w-3 h-3" />
              {criticalAlertsCount} ALERTS
            </div>
          )}

          <div className="hidden sm:flex text-white/90 items-center gap-1 pl-2 border-l border-white/20 text-[11px]">
            <Clock className="w-3 h-3" />
            <span>2026-08-13 AEST</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Row */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              DHOS Enterprise Suite
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                v4.8 Clinical OS
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Digital Hospital Operating System • Clinical, Logistics & Decision Intelligence</p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenNewPatient}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register Patient</span>
            <span className="sm:hidden">Patient</span>
          </button>

          <button
            onClick={() => setActiveTab('beds')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition shadow-xs"
          >
            <BedDouble className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Live Bed Map</span>
            <span className="sm:hidden">Beds</span>
          </button>

          <button
            onClick={onOpenBreakGlass}
            className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            title="Emergency Security Access Overrides"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Break Glass Access</span>
            <span className="sm:hidden">Break Glass</span>
          </button>

          <button
            onClick={onOpenAIAssistant}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-100" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};

