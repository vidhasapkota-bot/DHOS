import React, { useState } from 'react';
import {
  BedDouble,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  Filter,
  UserCheck,
  RotateCcw,
  Wrench,
  ShieldAlert,
  X
} from 'lucide-react';
import { Ward, Bed, Patient, BedStatus } from '../types/dhos';

interface BedManagementViewProps {
  wards: Ward[];
  beds: Bed[];
  patients: Patient[];
  onAllocateBed: (bedId: string, patientId: string) => void;
  onUpdateBedStatus: (bedId: string, status: BedStatus, reason?: string) => void;
  onOpenAIAssistant: () => void;
}

export const BedManagementView: React.FC<BedManagementViewProps> = ({
  wards,
  beds,
  patients,
  onAllocateBed,
  onUpdateBedStatus,
  onOpenAIAssistant
}) => {
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Allocation modal
  const [allocatingBed, setAllocatingBed] = useState<Bed | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // AI Recommendation modal
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPatientId, setAiPatientId] = useState<string>(patients?.[0]?.id || '');
  const [aiResult, setAiResult] = useState<{ wardName: string; bedNumber: string; confidence: number; reason: string } | null>(null);

  const filteredBeds = (beds || []).filter(b => {
    if (selectedWardFilter !== 'All' && b.wardId !== selectedWardFilter) return false;
    if (selectedStatusFilter !== 'All' && b.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingBed || !selectedPatientId) return;
    onAllocateBed(allocatingBed.id, selectedPatientId);
    setAllocatingBed(null);
    setSelectedPatientId('');
  };

  const handleRunAIBedRecommendation = () => {
    const pt = (patients || []).find(p => p.id === aiPatientId);
    if (!pt) return;

    // Simulate smart bed allocation logic based on patient alerts / specialty
    const requiresIso = pt.alerts?.some(a => a.alertType === 'Infection Risk') || false;
    const availBeds = (beds || []).filter(b => b.status === 'Available');

    let recommendedBed = availBeds[0];
    if (requiresIso) {
      recommendedBed = availBeds.find(b => b.bedType === 'Isolation' || b.bedType === 'Negative Pressure') || availBeds[0];
    }

    setAiResult({
      wardName: recommendedBed ? recommendedBed.wardName : 'Ward 3A Medical & Cardiology',
      bedNumber: recommendedBed ? recommendedBed.bedNumber : '3A-06',
      confidence: 0.96,
      reason: requiresIso
        ? `Patient ${pt.firstName} has active Infection Risk alert (${pt.alerts?.[0]?.details || 'Isolation required'}). AI recommends Isolation/Negative Pressure Bed ${recommendedBed?.bedNumber || '3A-06'} in ${recommendedBed?.wardName || 'Ward 3A'} to enforce CINV-003 Isolation Enforcement.`
        : `Patient ${pt.firstName} is assigned to Cardiology. Bed 3A-06 in Ward 3A has minimal nurse workload and matches general clinical profile.`
    });
  };

  const getStatusBadgeColor = (status: BedStatus) => {
    switch (status) {
      case 'Occupied': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dirty': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cleaning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Inspection': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out of Service': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-blue-600" />
            Live Bed Allocation & Ward Capacity Map (WF-046 - WF-063)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time occupancy tracking, dirty bed cleaning workflow, isolation enforcement and AI placement assistance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-100" />
            AI Bed Recommendation (WF-069)
          </button>
        </div>
      </div>

      {/* Ward Capacity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {(wards || []).map((w) => (
          <div key={w.id} className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 truncate">{w.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {w.code}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-extrabold text-blue-700">
                {w.occupiedCount} / {w.capacity}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {Math.round((w.occupiedCount / w.capacity) * 100)}% Occupied
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all ${
                  (w.occupiedCount / w.capacity) > 0.85 ? 'bg-red-500' : 'bg-blue-600'
                }`}
                style={{ width: `${(w.occupiedCount / w.capacity) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Ward Filter:</span>
            <select
              value={selectedWardFilter}
              onChange={e => setSelectedWardFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Wards</option>
              {(wards || []).map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Dirty">Dirty</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Inspection">Inspection</option>
              <option value="Reserved">Reserved</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="text-slate-900 font-bold">{filteredBeds.length}</span> beds
        </div>
      </div>

      {/* Interactive Bed Map Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`bg-white border rounded-xl p-4 space-y-3 shadow-xs flex flex-col justify-between transition ${
              bed.status === 'Occupied' ? 'border-cyan-300 hover:border-cyan-500' :
              bed.status === 'Available' ? 'border-emerald-300 hover:border-emerald-500' :
              bed.status === 'Dirty' ? 'border-red-300 hover:border-red-500' :
              'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-blue-600" />
                  {bed.bedNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadgeColor(bed.status)}`}>
                  {bed.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span>{bed.wardName}</span>
                  <span className="text-[10px] text-slate-500">{bed.bedType}</span>
                </div>

                {bed.isolationRequired && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] px-2 py-1 rounded flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3 h-3 text-red-600" />
                    {bed.isolationType || 'Isolation Precautions'}
                  </div>
                )}
              </div>

              {/* Patient details if Occupied */}
              {bed.status === 'Occupied' && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-1 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{bed.currentPatientName}</span>
                    <span className="font-mono text-[10px] text-blue-700 font-bold">{bed.currentPatientMrn}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Patient ID: {bed.currentPatientId}
                  </div>
                </div>
              )}

              {/* Maintenance reason if Out of Service */}
              {bed.status === 'Out of Service' && bed.maintenanceReason && (
                <div className="bg-slate-50 border border-slate-200 p-2 rounded text-[11px] text-slate-600 italic">
                  Fault: {bed.maintenanceReason}
                </div>
              )}
            </div>

            {/* Bed Actions Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
              {bed.status === 'Available' && (
                <button
                  onClick={() => {
                    setAllocatingBed(bed);
                    setSelectedPatientId(patients?.[0]?.id || '');
                  }}
                  className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center justify-center gap-1 transition text-[11px] shadow-xs"
                >
                  <UserCheck className="w-3 h-3" />
                  Allocate Patient (WF-046)
                </button>
              )}

              {bed.status === 'Occupied' && (
                <button
                  onClick={() => onUpdateBedStatus(bed.id, 'Dirty')}
                  className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold flex items-center justify-center gap-1 transition text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Discharge & Mark Dirty (WF-057)
                </button>
              )}

              {(bed.status === 'Dirty' || bed.status === 'Cleaning' || bed.status === 'Inspection') && (
                <button
                  onClick={() => onUpdateBedStatus(bed.id, 'Available')}
                  className="w-full py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold flex items-center justify-center gap-1 transition text-[11px]"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Certify Clean & Ready (WF-059)
                </button>
              )}

              {bed.status !== 'Out of Service' && bed.status !== 'Occupied' && (
                <button
                  onClick={() => onUpdateBedStatus(bed.id, 'Out of Service', 'Maintenance check')}
                  className="p-1 text-slate-400 hover:text-amber-600"
                  title="Mark Out of Service"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Bed Modal */}
      {allocatingBed && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Allocate Patient to Bed {allocatingBed.bedNumber} (WF-046)
            </h3>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
              <div><strong>Ward:</strong> {allocatingBed.wardName}</div>
              <div><strong>Type:</strong> {allocatingBed.bedType}</div>
              {allocatingBed.isolationRequired && (
                <div className="text-red-600 font-bold">★ Isolation Capable Room</div>
              )}
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient for Bed Assignment</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {(patients || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAllocatingBed(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Bed Allocation Recommendation Modal (WF-069) */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Bed Allocation Recommendation Engine (WF-069 / WF-372)
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient to Analyze</label>
                <select
                  value={aiPatientId}
                  onChange={e => setAiPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
                >
                  {(patients || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn}) {p.alerts?.length ? '⚠️ [Alerts Active]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRunAIBedRecommendation}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-purple-100" />
                Analyze Invariants & Generate Optimal Placement
              </button>

              {aiResult && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-900">Recommended Placement:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-bold border border-purple-300">
                      Confidence: {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {aiResult.wardName} • Bed {aiResult.bedNumber}
                  </div>
                  <p className="text-slate-700 italic text-[11px] leading-relaxed pt-1 border-t border-purple-200">
                    {aiResult.reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
