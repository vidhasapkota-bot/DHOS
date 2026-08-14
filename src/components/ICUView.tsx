import React from 'react';
import {
  Activity,
  HeartPulse,
  Wind,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ICUPatient } from '../types/dhos';

interface ICUViewProps {
  icuPatients: ICUPatient[];
  onUpdateWeaningStatus: (icuPatientId: string, status: 'Not Started' | 'In Progress' | 'Tolerated' | 'Failed') => void;
}

export const ICUView: React.FC<ICUViewProps> = ({
  icuPatients,
  onUpdateWeaningStatus
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600 animate-pulse" />
            Critical Care Unit (ICU / HDU 2C) Dashboard (WF-131 - WF-150)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Intensive care monitoring, mechanical ventilator weaning trials (WF-135), NEWS2 score tracking and step-down eligibility.
          </p>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(icuPatients || []).map((patient) => (
          <div key={patient.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{patient.patientName}</h3>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-xs font-mono font-bold">
                    Bed {patient.bedNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  MRN: {patient.patientMrn} | Consultant: <strong className="text-slate-900">{patient.consultantName}</strong>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                patient.acuityLevel.includes('3')
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {patient.acuityLevel}
              </span>
            </div>

            {/* Vital Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[10px] font-bold block">NEWS2 Score</span>
                <span className={`text-base font-extrabold ${patient.news2Score >= 7 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {patient.news2Score}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[10px] font-bold block">Ventilator</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-blue-600" />
                  {patient.ventilatorAssigned ? patient.ventilatorModel || 'Assigned' : 'Off Vent'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[10px] font-bold block">CRRT Dialysis</span>
                <span className="font-semibold text-slate-900">
                  {patient.dialysisAssigned ? 'Active CRRT' : 'None'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[10px] font-bold block">Step-Down Ready</span>
                <span className={`font-bold ${patient.stepDownCandidate ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {patient.stepDownCandidate ? 'Eligible (WF-141)' : 'In ICU Care'}
                </span>
              </div>
            </div>

            {/* Mechanical Ventilation Weaning Trial Controls (WF-135) */}
            {patient.ventilatorAssigned && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-blue-600" />
                    Mechanical Ventilation Weaning Protocol (WF-135)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Status: <strong className="text-slate-900 font-bold">{patient.weaningTrialStatus || 'Not Started'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onUpdateWeaningStatus(patient.id, 'In Progress')}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold transition"
                  >
                    Start SBT Trial
                  </button>

                  <button
                    onClick={() => onUpdateWeaningStatus(patient.id, 'Tolerated')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition shadow-xs"
                  >
                    Mark Tolerated (Extubate)
                  </button>

                  <button
                    onClick={() => onUpdateWeaningStatus(patient.id, 'Failed')}
                    className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 border border-red-200 rounded text-[11px] font-semibold transition"
                  >
                    Mark Failed (Escalate)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
