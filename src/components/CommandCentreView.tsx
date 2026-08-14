import React, { useState } from 'react';
import {
  Activity,
  BedDouble,
  AlertTriangle,
  Flame,
  Stethoscope,
  Sparkles,
  ClipboardList,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  Plus
} from 'lucide-react';
import { HospitalSurgeStatus, ExecutiveDecision } from '../types/dhos';

interface CommandCentreViewProps {
  kpis: {
    totalBeds: number;
    occupiedBeds: number;
    dirtyBeds: number;
    availableBeds: number;
    occupancyPercent: number;
    edWaiting: number;
    edBoarding: number;
    otInProgress: number;
    pendingEVS: number;
    pendingLogistics: number;
    pendingPharmacyVerify: number;
    criticalDiagnosticAlerts: number;
  };
  surgeStatus: HospitalSurgeStatus;
  executiveDecisions: ExecutiveDecision[];
  alerts: { type: string; text: string }[];
  onUpdateSurgeStatus: (code: 'Normal (Green)' | 'Capacity Pressure (Yellow)' | 'Overcrowding (Orange)' | 'Code Red Surge / Mass Casualty') => void;
  onLogDecision: (title: string, rationale: string, exec: string, depts: string[]) => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandCentreView: React.FC<CommandCentreViewProps> = ({
  kpis,
  surgeStatus,
  executiveDecisions,
  alerts,
  onUpdateSurgeStatus,
  onLogDecision,
  onNavigateTab
}) => {
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionTitle, setDecisionTitle] = useState('');
  const [rationale, setRationale] = useState('');
  const [approvingExec, setApprovingExec] = useState('Dr. Marcus Vance (CMO)');
  const [deptsText, setDeptsText] = useState('Emergency Department, Patient Flow, EVS');

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTitle.trim()) return;
    onLogDecision(
      decisionTitle,
      rationale,
      approvingExec,
      deptsText.split(',').map(s => s.trim())
    );
    setDecisionTitle('');
    setRationale('');
    setShowDecisionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Surge Code Banner Control */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Hospital Operations Command Centre
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                WF-351 / WF-364 Active Command
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Live enterprise capacity monitoring, code surge protocols, and executive decision tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Surge Level:</span>
          {(['Normal (Green)', 'Capacity Pressure (Yellow)', 'Overcrowding (Orange)', 'Code Red Surge / Mass Casualty'] as const).map((code) => (
            <button
              key={code}
              onClick={() => onUpdateSurgeStatus(code)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition border ${
                surgeStatus?.activeCode === code
                  ? code.includes('Red')
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : code.includes('Orange')
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : code.includes('Yellow')
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-xs'
                    : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {code?.split(' ')?.[0] || code}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigateTab('beds')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hospital Occupancy</span>
            <BedDouble className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {kpis.occupancyPercent}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {kpis.occupiedBeds} / {kpis.totalBeds} Beds Occupied
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('emergency')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">ED Boarding</span>
            <Activity className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {kpis.edBoarding} <span className="text-xs font-bold text-red-600 uppercase">Boarding</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {kpis.edWaiting} in triage queue
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('theatre')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">OT Active</span>
            <Stethoscope className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {kpis.otInProgress} <span className="text-xs font-bold text-blue-600 uppercase">Active</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Across 2 Operating Theatres
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('evs')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">EVS Bed Cleans</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {kpis.dirtyBeds} <span className="text-xs font-bold text-amber-600 uppercase">Dirty</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {kpis.pendingEVS} tasks in progress
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('pharmacy')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pharmacy Verif</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {kpis.pendingPharmacyVerify} <span className="text-xs font-bold text-emerald-600 uppercase">Pending</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Awaiting pharmacist check
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('diagnostics')}
          className="bg-white border border-slate-200 hover:border-blue-600 p-4 rounded-xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform animate-bounce" />
          </div>
          <div className="text-2xl font-black text-red-600 mb-1">
            {kpis.criticalDiagnosticAlerts} <span className="text-xs font-bold text-red-600 uppercase">Unack</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Radiology critical findings
          </div>
        </div>
      </div>

      {/* Two Column Layout: Critical Alerts Ticker & Executive Decision Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts & AI Telemetry Ticker */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Live Hospital Telemetry & Safety Ticker
            </h3>
            <span className="text-xs text-slate-500 font-medium">Automated Real-Time Feed</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {(alerts || []).length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                No active critical alerts recorded.
              </div>
            ) : (
              (alerts || []).map((alert, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-3">
                  <div className={`p-1 px-2 rounded text-[10px] font-extrabold uppercase shrink-0 border ${
                    alert.type.includes('Diagnostic') ? 'bg-red-50 text-red-600 border-red-200' :
                    alert.type.includes('STAT') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    {alert.type}
                  </div>
                  <div className="flex-1 text-xs text-slate-800 leading-relaxed font-medium">
                    {alert.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Executive Decision Log (WF-365) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Executive Operational Decision Log
            </h3>
            <button
              onClick={() => setShowDecisionModal(true)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Decision
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {(executiveDecisions || []).map((dec) => (
              <div key={dec.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600">{dec.decisionTitle}</span>
                  <span className="text-[11px] font-mono text-slate-500">{dec.implementationDate}</span>
                </div>
                <p className="text-xs text-slate-600 italic">"{dec.rationale}"</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-medium">
                  <span>Approver: <strong className="text-slate-800">{dec.approvingExecutive}</strong></span>
                  <span>Depts: <strong className="text-slate-800">{dec.affectedDepartments.join(', ')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Entry Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Log Executive Operational Decision (WF-365)
            </h3>

            <form onSubmit={handleCreateDecision} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Decision Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Open Ward 1I Isolation Beds for ED Overflow"
                  value={decisionTitle}
                  onChange={e => setDecisionTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical / Operational Rationale</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe reasons, thresholds breached, or capacity pressure..."
                  value={rationale}
                  onChange={e => setRationale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approving Executive</label>
                <input
                  type="text"
                  required
                  value={approvingExec}
                  onChange={e => setApprovingExec(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Affected Departments (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={deptsText}
                  onChange={e => setDeptsText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDecisionModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save & Log Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
