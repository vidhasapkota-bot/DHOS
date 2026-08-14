import React from 'react';
import {
  Users,
  Shield,
  Clock,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { StaffShift, SecurityIncident } from '../types/dhos';

interface WorkforceViewProps {
  shifts: StaffShift[];
  securityIncidents: SecurityIncident[];
  onAcknowledgeSecurityIncident: (incidentId: string) => void;
}

export const WorkforceView: React.FC<WorkforceViewProps> = ({
  shifts,
  securityIncidents,
  onAcknowledgeSecurityIncident
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Workforce Rostering, Nurse Ratios & Hospital Security (WF-311 - WF-330)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time nurse-to-patient ratio compliance (WF-312), shift roster management, security lock-down controls & panic button alarms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Active Staff Roster */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-3">
            <span>On-Duty Staff Roster & Ratios</span>
            <span className="text-purple-700 font-mono text-[11px] font-bold">{(shifts || []).length} Active Staff</span>
          </h3>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {(shifts || []).map((s) => (
              <div key={s.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{s.staffName}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-mono text-[10px] font-bold">
                    {s.role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Unit: <strong className="text-slate-900">{s.department}</strong></span>
                  <span>Hours: <strong className="text-slate-900">{s.shiftTime}</strong></span>
                </div>

                {s.assignedPatientCount !== undefined && s.recommendedRatio && (
                  <div className="flex items-center justify-between text-[10px] bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-600 font-medium">Assigned Patients: <strong className="text-slate-900 font-bold">{s.assignedPatientCount}</strong></span>
                    <span className="text-purple-800 font-bold">Recommended Ratio: {s.recommendedRatio}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Hospital Security & Panic Button Feed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="flex items-center gap-1.5 text-red-700 font-extrabold">
              <Shield className="w-4 h-4 text-red-600" /> Hospital Security & Access Control
            </span>
            <span className="text-red-700 font-mono text-[11px] font-bold">{(securityIncidents || []).length} Alerts</span>
          </h3>

          <div className="space-y-3">
            {(securityIncidents || []).map((inc) => (
              <div key={inc.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-extrabold text-red-800 text-sm flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      {inc.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">Location: {inc.location}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inc.resolved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                  }`}>
                    {inc.resolved ? 'RESOLVED' : 'ACTIVE INCIDENT'}
                  </span>
                </div>

                <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200 font-medium">
                  "{inc.description}"
                </p>

                {!inc.resolved && (
                  <button
                    onClick={() => onAcknowledgeSecurityIncident(inc.id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Dispatch Security Guard & Acknowledge (WF-325)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
