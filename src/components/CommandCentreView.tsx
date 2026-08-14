import React, { useState, useRef, useEffect } from 'react';
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
  Plus,
  ArrowUpRight,
  Layers,
  LayoutGrid,
  Bell,
  ChevronDown,
  ShieldAlert,
  Radio,
  FileCheck
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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'alerts' | 'decisions'>('overview');
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [isSurgeDropdownOpen, setIsSurgeDropdownOpen] = useState(false);
  const surgeDropdownRef = useRef<HTMLDivElement>(null);

  const [decisionTitle, setDecisionTitle] = useState('');
  const [rationale, setRationale] = useState('');
  const [approvingExec, setApprovingExec] = useState('Dr. Marcus Vance (CMO)');
  const [deptsText, setDeptsText] = useState('Emergency Department, Patient Flow, EVS');

  // Close surge dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (surgeDropdownRef.current && !surgeDropdownRef.current.contains(event.target as Node)) {
        setIsSurgeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const surgeLevels = [
    {
      code: 'Normal (Green)' as const,
      label: 'Normal Capacity (Green)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      icon: Activity,
      desc: 'Routine operations. Standard elective admissions and normal bed turnaround protocols active.'
    },
    {
      code: 'Capacity Pressure (Yellow)' as const,
      label: 'Capacity Pressure (Yellow)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: Activity,
      desc: 'Occupancy >85%. Accelerated discharge rounds, proactive bed cleans, and expedited diagnostic processing initiated.'
    },
    {
      code: 'Overcrowding (Orange)' as const,
      label: 'Overcrowding Protocol (Orange)',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
      icon: AlertTriangle,
      desc: 'Occupancy >92%. Non-urgent elective admissions paused, overflow surge beds opened, and rapid ED transfer protocols active.'
    },
    {
      code: 'Code Red Surge / Mass Casualty' as const,
      label: 'Code Red Surge / Mass Casualty',
      badgeClass: 'bg-red-50 text-red-700 border-red-300',
      icon: Flame,
      desc: 'Critical emergency surge. Hospital-wide disaster plan activated, all non-emergency procedures held, mandatory executive command.'
    }
  ];

  const currentSurge = surgeLevels.find(s => s.code === surgeStatus?.activeCode) || surgeLevels[0];
  const CurrentSurgeIcon = currentSurge.icon;

  return (
    <div className="space-y-5">
      {/* Top Calm Control Bar with Explicit Surge Protocol Escalation */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Command & Operations Centre
              <span className="text-[11px] px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                WF-351 Live Telemetry
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enterprise capacity monitoring, departmental throughput, and executive governance.
            </p>
          </div>
        </div>

        {/* Clear, Unambiguous Hospital Surge Status & Escalation Dropdown */}
        <div className="relative" ref={surgeDropdownRef}>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Hospital Surge Alert Level
              </div>
              <div className="text-xs font-semibold text-slate-600">
                {currentSurge.code.split(' ')[0]} Protocol
              </div>
            </div>

            <button
              onClick={() => setIsSurgeDropdownOpen(!isSurgeDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition shadow-2xs ${currentSurge.badgeClass}`}
              title="Click to escalate or change Hospital Surge Alert Level"
            >
              <CurrentSurgeIcon className="w-3.5 h-3.5" />
              <span>{currentSurge.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSurgeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Surge Protocol Escalation Popover */}
          {isSurgeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-100 mb-1">
                <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  Hospital Surge Escalation Matrix (WF-351)
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Select an operational protocol to reconfigure enterprise capacity rules:
                </div>
              </div>

              {surgeLevels.map((lvl) => {
                const isCurrent = surgeStatus?.activeCode === lvl.code;
                const Icon = lvl.icon;

                return (
                  <button
                    key={lvl.code}
                    onClick={() => {
                      onUpdateSurgeStatus(lvl.code);
                      setIsSurgeDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition space-y-1 ${
                      isCurrent
                        ? `${lvl.badgeClass} font-bold shadow-2xs`
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{lvl.label}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-white text-slate-900 shadow-2xs">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                      {lvl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clean Sub-View Tabs (No duplicate buttons) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Capacity & Flow</span>
          </button>
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'alerts'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-red-500" />
            <span>Safety Alerts</span>
            <span className="px-1.5 py-0.1 rounded-full text-[10px] bg-red-100 text-red-700">
              {alerts?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('decisions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'decisions'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            <span>Decision Log</span>
            <span className="px-1.5 py-0.1 rounded-full text-[10px] bg-blue-100 text-blue-700">
              {executiveDecisions?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* View 1: Capacity & Flow Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5">
          {/* Main KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div
              onClick={() => onNavigateTab('beds')}
              className="bg-white border border-slate-200/80 hover:border-blue-500 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">Occupancy</span>
                <BedDouble className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {kpis.occupancyPercent}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {kpis.occupiedBeds} / {kpis.totalBeds} Beds Occupied
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('emergency')}
              className="bg-white border border-slate-200/80 hover:border-red-400 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">ED Boarding</span>
                <Activity className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {kpis.edBoarding}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {kpis.edWaiting} in triage queue
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('theatre')}
              className="bg-white border border-slate-200/80 hover:border-blue-400 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">OT Active</span>
                <Stethoscope className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {kpis.otInProgress}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Surgical suites active
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('evs')}
              className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">Dirty Beds</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {kpis.dirtyBeds}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {kpis.pendingEVS} cleaning dispatches
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('pharmacy')}
              className="bg-white border border-slate-200/80 hover:border-emerald-400 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">Pharmacy</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {kpis.pendingPharmacyVerify}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Pending verification
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('diagnostics')}
              className="bg-white border border-slate-200/80 hover:border-red-500 p-4 rounded-xl cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">Alerts</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600">
                {kpis.criticalDiagnosticAlerts}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Critical results unack
              </div>
            </div>
          </div>

          {/* Department Quick Navigation Cards */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Departmental Workflows & Live Quick Jump
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('emergency')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Emergency (ED)</div>
                  <div className="text-[11px] text-slate-500">ATS Triage & Resuscitation</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </button>

              <button
                onClick={() => onNavigateTab('beds')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Bed Allocation</div>
                  <div className="text-[11px] text-slate-500">18 Enterprise Beds & Map</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </button>

              <button
                onClick={() => onNavigateTab('theatre')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Operating Theatre</div>
                  <div className="text-[11px] text-slate-500">WHO Safety & Surgical Suites</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </button>

              <button
                onClick={() => onNavigateTab('icu')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Critical Care (ICU)</div>
                  <div className="text-[11px] text-slate-500">Telemetry & Mechanical Vent</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Live Safety & Diagnostic Alerts */}
      {activeSubTab === 'alerts' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Active Clinical Alerts & Safety Ticker
              </h3>
              <p className="text-xs text-slate-500">
                Automated clinical exceptions, critical radiology alerts, and STAT medications requiring signoff.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(alerts || []).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No active safety anomalies or unacknowledged critical alerts.
              </div>
            ) : (
              (alerts || []).map((alert, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl flex items-start gap-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${
                    alert.type.includes('Diagnostic') ? 'bg-red-50 text-red-700 border-red-200' :
                    alert.type.includes('STAT') ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {alert.type}
                  </div>
                  <div className="flex-1 text-xs text-slate-800 font-medium">
                    {alert.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View 3: Executive Operational Decision Log */}
      {activeSubTab === 'decisions' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                Executive Operational Decision Log (WF-365)
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail of capacity surge actions, staffing reallocations, and bed expansions.
              </p>
            </div>
            {/* Single, unambiguous Log Decision button */}
            <button
              onClick={() => setShowDecisionModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Decision</span>
            </button>
          </div>

          <div className="space-y-3">
            {(executiveDecisions || []).map((dec) => (
              <div key={dec.id} className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{dec.decisionTitle}</span>
                  <span className="text-[11px] font-mono text-slate-500">{dec.implementationDate}</span>
                </div>
                <p className="text-xs text-slate-600 italic">"{dec.rationale}"</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 font-medium">
                  <span>Approver: <strong className="text-slate-800">{dec.approvingExecutive}</strong></span>
                  <span>Affected: <strong className="text-slate-800">{dec.affectedDepartments.join(', ')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Entry Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Affected Departments</label>
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
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
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
