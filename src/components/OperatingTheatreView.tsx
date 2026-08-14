import React, { useState } from 'react';
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck,
  RotateCcw,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { SurgicalCase } from '../types/dhos';

interface OperatingTheatreViewProps {
  cases: SurgicalCase[];
  onCompleteTimeout: (caseId: string) => void;
  onVerifyCounts: (caseId: string, instrumentsCorrect: boolean, swabsCorrect: boolean) => void;
}

export const OperatingTheatreView: React.FC<OperatingTheatreViewProps> = ({
  cases,
  onCompleteTimeout,
  onVerifyCounts
}) => {
  const [selectedCase, setSelectedCase] = useState<SurgicalCase | null>(cases?.[0] || null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-600" />
            Operating Theatre (OT) Suite & Recovery (WF-111 - WF-130)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Surgical schedule management, WHO Safety Time-Out (WF-117), live incision timing, instrument/swab counts & PACU recovery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: OT Schedule List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Today's Surgical Schedule</span>
            <span className="text-purple-700 font-mono text-[11px] font-bold">{(cases || []).length} Cases</span>
          </h3>

          <div className="space-y-3">
            {(cases || []).map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 text-xs ${
                  selectedCase?.id === c.id
                    ? 'bg-purple-50/80 border-purple-500 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{c.theatreName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'Incision Started' ? 'bg-purple-100 text-purple-800 border border-purple-300 animate-pulse' :
                    c.status === 'Pre-Op Cleared' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="font-bold text-purple-900">
                  {c.procedureName}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-medium">
                  <span>Patient: <strong className="text-slate-900">{c.patientName}</strong></span>
                  <span>Surgeon: <strong className="text-slate-900">{c.surgeonName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Surgical Case Monitor & WHO Time-Out Checklist */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs text-slate-900">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedCase.procedureName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-xs font-mono font-bold">
                      {selectedCase.theatreName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Patient: <strong className="text-slate-900">{selectedCase.patientName} ({selectedCase.patientMrn})</strong> | Specialty: <strong className="text-slate-900">{selectedCase.specialty}</strong>
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 font-medium">
                  <div>Surgeon: <strong className="text-slate-900">{selectedCase.surgeonName}</strong></div>
                  <div>Anaesthetist: <strong className="text-slate-900">{selectedCase.anaesthetistName}</strong></div>
                </div>
              </div>

              {/* WHO Surgical Safety Time-Out Panel (WF-117) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    WHO Surgical Safety Time-Out Verification (WF-117)
                  </h4>

                  {selectedCase.timeoutCompleted ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Time-Out Completed & Incision Started
                    </span>
                  ) : (
                    <button
                      onClick={() => onCompleteTimeout(selectedCase.id)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Confirm Time-Out & Record Incision Time
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium">
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.fastingVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Patient & Fasting Verified</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.consentVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Surgical Consent Signed</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.siteMarked ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Surgical Site Marked</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.allergiesVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Allergies Checked</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.timeoutCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Surgical Team Introductions</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${selectedCase.timeoutCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prophylactic Antibiotics Administered</span>
                  </div>
                </div>
              </div>

              {/* Instrument & Swab Count Verification (WF-120) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Post-Procedure Instrument & Swab Count Audit (WF-120)
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Instrument Count Status:</span>
                  <span className={`font-bold ${selectedCase.instrumentCountCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedCase.instrumentCountCorrect ? '100% Accounted & Verified' : 'Awaiting Post-Closure Count'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Surgical Swab Count Status:</span>
                  <span className={`font-bold ${selectedCase.swabCountCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedCase.swabCountCorrect ? '100% Accounted & Verified' : 'Awaiting Post-Closure Count'}
                  </span>
                </div>

                {selectedCase.status === 'Incision Started' && (
                  <button
                    onClick={() => onVerifyCounts(selectedCase.id, true, true)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Counts Correct & Transfer to PACU Recovery (WF-121)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              Select a surgical case from the schedule to monitor details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
