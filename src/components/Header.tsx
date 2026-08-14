import React, { useState } from 'react';
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
  Menu,
  Search,
  Flame
} from 'lucide-react';
import { HospitalConfig, HospitalSurgeStatus } from '../types/dhos';

interface HeaderProps {
  config: HospitalConfig;
  hospitals?: HospitalConfig[];
  onSelectHospital?: (hospitalId: string) => void;
  surgeStatus: HospitalSurgeStatus;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewPatient: () => void;
  onOpenBreakGlass: () => void;
  onOpenAIAssistant: () => void;
  onOpenSearch: () => void;
  onOpenMobileSidebar?: () => void;
  criticalAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  hospitals,
  onSelectHospital,
  surgeStatus,
  activeTab,
  setActiveTab,
  onOpenNewPatient,
  onOpenBreakGlass,
  onOpenAIAssistant,
  onOpenSearch,
  onOpenMobileSidebar,
  criticalAlertsCount = 0
}) => {
  const getSurgeBadge = (code?: string) => {
    if (!code) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Normal (Green)', icon: Activity };
    if (code.includes('Red')) return { bg: 'bg-red-50 text-red-700 border-red-200', label: 'Code Red Surge', icon: Flame };
    if (code.includes('Orange')) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Overcrowding', icon: AlertTriangle };
    if (code.includes('Yellow')) return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Capacity Pressure', icon: Activity };
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Normal', icon: Activity };
  };

  const surge = getSurgeBadge(surgeStatus?.activeCode);
  const SurgeIcon = surge.icon;

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      {/* Sleek Calm Single-Layer Main Nav Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand, Campus & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('command-centre')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs group-hover:bg-blue-700 transition">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  DHOS
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Campus Selector (Clean & Unobtrusive) */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-3">
            {hospitals && hospitals.length > 1 && onSelectHospital ? (
              <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={config?.id}
                  onChange={e => onSelectHospital(e.target.value)}
                  className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('campus-config')}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-semibold transition"
                title="Campus Setup"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[140px] lg:max-w-[200px]">{config?.name || 'St. Jude Metropolitan'}</span>
              </button>
            )}
          </div>

          {/* Surge Status Indicator */}
          <div className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${surge.bg}`}>
            <SurgeIcon className="w-3 h-3" />
            <span>{surge.label}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-sm mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 transition shadow-2xs group"
          >
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              <span className="truncate">Search patients, beds, modules...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action Controls & Role Persona Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Critical Alerts Counter */}
          {criticalAlertsCount > 0 && (
            <button
              onClick={() => setActiveTab('command-centre')}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition"
              title="Critical diagnostic and triage alerts"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{criticalAlertsCount}</span>
            </button>
          )}

          {/* Live Beds Shortcut */}
          <button
            onClick={() => setActiveTab('beds')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
              activeTab === 'beds' || activeTab === 'bed-management'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5 text-blue-600" />
            <span>Beds</span>
          </button>

          {/* Patient Quick Admission */}
          <button
            onClick={onOpenNewPatient}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admit</span>
          </button>

          {/* AI Decision Support */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition"
            title="Clinical Decision Support & Capacity Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Assist</span>
          </button>

          {/* Break Glass (Calmer emergency button) */}
          <button
            onClick={onOpenBreakGlass}
            className="p-1.5 sm:px-2 sm:py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition"
            title="Emergency Break-Glass Override (WF-420)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden xl:inline ml-1 text-red-700 font-bold">Break-Glass</span>
          </button>
        </div>
      </div>
    </header>
  );
};
