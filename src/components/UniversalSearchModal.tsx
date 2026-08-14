import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  BedDouble
} from 'lucide-react';
import { Patient, Bed, Ward } from '../types/dhos';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  beds: Bed[];
  wards: Ward[];
  onNavigateTab: (tab: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  beds,
  wards,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmedQuery = query.toLowerCase().trim();

  // Search Patients
  const matchingPatients = (patients || []).filter(p =>
    p.firstName.toLowerCase().includes(trimmedQuery) ||
    p.lastName.toLowerCase().includes(trimmedQuery) ||
    p.mrn.toLowerCase().includes(trimmedQuery) ||
    (p.primaryDiagnosis && p.primaryDiagnosis.toLowerCase().includes(trimmedQuery))
  ).slice(0, 4);

  // Search Beds
  const matchingBeds = (beds || []).filter(b =>
    b.bedNumber.toLowerCase().includes(trimmedQuery) ||
    b.wardName.toLowerCase().includes(trimmedQuery) ||
    b.status.toLowerCase().includes(trimmedQuery)
  ).slice(0, 4);

  // Search System Modules
  const systemModules = [
    { id: 'command-centre', name: 'Command & Operations Centre', desc: 'Enterprise telemetry, surge levels, decision log', code: 'WF-351' },
    { id: 'patient-registration', name: 'Patient Registration & Admissions', desc: 'PMI, Medicare verification, wristband generation', code: 'WF-041' },
    { id: 'bed-management', name: 'Live Bed Allocation & Ward Capacity', desc: 'Bed matrix, cleaning turnaround, isolation enforcement', code: 'WF-046' },
    { id: 'emergency', name: 'Emergency Department (ATS 1-5)', desc: 'Triage queue, resuscitation bays, boarding telemetry', code: 'WF-071' },
    { id: 'theatre', name: 'Operating Theatres & Surgical Suites', desc: 'Surgical schedule, WHO safety checklist, PACU', code: 'WF-091' },
    { id: 'icu', name: 'Intensive Care Unit (ICU / HDU / CCU)', desc: 'Telemetry, APACHE II, mechanical ventilation, SOFA', code: 'WF-121' },
    { id: 'wards', name: 'Wards & Clinical Care Handovers', desc: 'SBAR handovers, vital signs, clinical tasks, rounding', code: 'WF-141' },
    { id: 'diagnostics', name: 'Pathology & Radiology Diagnostics', desc: 'LIS / RIS / PACS, critical alerts, turnaround tracking', code: 'WF-231' },
    { id: 'pharmacy', name: 'Pharmacy & Medication Safety', desc: 'eMAR, 5-Rights dispensing, unit-dose verification', code: 'WF-171' },
    { id: 'nutrition', name: 'Clinical Nutrition & Dietetics', desc: 'Dietary textures, allergen flags, meal distribution', code: 'WF-201' },
    { id: 'evs', name: 'Environmental Services & Bed Cleaning', desc: 'Cleaning dispatch, biohazard isolation disinfection', code: 'WF-261' },
    { id: 'logistics', name: 'Portering & Patient Logistics', desc: 'Patient transfers, specimen runs, blood bank escorts', code: 'WF-281' },
    { id: 'facilities', name: 'Facilities & Biomedical Engineering', desc: 'Medical asset maintenance, calibration, alarms', code: 'WF-301' },
    { id: 'supply-chain', name: 'Supply Chain & Par-Level Restock', desc: 'Sterile stores, stock reorder, inventory count', code: 'WF-321' },
    { id: 'workforce', name: 'Workforce & Clinical Rosters', desc: 'Shift scheduling, nurse-patient ratios, overtime', code: 'WF-381' },
    { id: 'grac', name: 'Governance, Risk & Compliance (GRAC)', desc: 'Incident reporting, RCA, Break-Glass audit logs', code: 'WF-411' },
    { id: 'campus-config', name: 'Enterprise Campus Configuration', desc: 'Campuses, buildings, departments, beds setup', code: 'WF-001' }
  ];

  const matchingModules = systemModules.filter(m =>
    m.name.toLowerCase().includes(trimmedQuery) ||
    m.desc.toLowerCase().includes(trimmedQuery) ||
    m.code.toLowerCase().includes(trimmedQuery) ||
    m.id.toLowerCase().includes(trimmedQuery)
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-900">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients (MRN, name), beds, or system modules (WF-001...)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 divide-y divide-slate-100">
          {/* Quick Modules */}
          {matchingModules.length > 0 && (
            <div className="space-y-2 pt-2 first:pt-0">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                <span>System Modules & Workflows</span>
                <span>{matchingModules.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingModules.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigateTab(m.id);
                      onClose();
                    }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 font-mono text-[10px] font-bold shrink-0">
                      {m.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {m.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients Results */}
          {matchingPatients.length > 0 && (
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                <span>Registered Patients</span>
                <span>{matchingPatients.length}</span>
              </div>
              <div className="space-y-1.5">
                {matchingPatients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigateTab('beds');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {p.firstName} {p.lastName} <span className="font-mono text-emerald-700 font-semibold ml-1">({p.mrn})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.gender}, {p.age}y • Diagnosis: {p.primaryDiagnosis || 'Under investigation'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <span>View Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bed Map Results */}
          {matchingBeds.length > 0 && (
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                <span>Beds & Capacity Units</span>
                <span>{matchingBeds.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingBeds.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onNavigateTab('beds');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/40 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-cyan-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Bed {b.bedNumber} <span className="text-[10px] text-slate-500 font-normal">({b.wardName})</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Type: {b.bedType}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                      b.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      b.status === 'Occupied' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {b.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {trimmedQuery && matchingModules.length === 0 && matchingPatients.length === 0 && matchingBeds.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching hospital records or modules found for "<span className="font-bold text-slate-800">{query}</span>".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">↑↓</span>
            <span>Navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">Enter</span>
            <span>Select</span>
          </div>
          <span>Digital Hospital Operating System • Universal Index</span>
        </div>
      </div>
    </div>
  );
};
