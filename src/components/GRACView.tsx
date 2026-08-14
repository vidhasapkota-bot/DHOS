import React from 'react';
import {
  ShieldAlert,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Plus
} from 'lucide-react';
import { GovernanceIncident } from '../types/dhos';

interface GRACViewProps {
  incidents: GovernanceIncident[];
  onReportIncident: (incident: Partial<GovernanceIncident>) => void;
}

export const GRACView: React.FC<GRACViewProps> = ({
  incidents,
  onReportIncident
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Governance, Risk, Audit & Compliance (GRAC) (WF-411 - WF-430)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            No-blame clinical incident reporting (WF-412), Root Cause Analysis (RCA), WHO surgical audit trails & Break-Glass access logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(incidents || []).map((inc) => (
          <div key={inc.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{inc.title}</h3>
                <span className="text-[10px] font-mono font-bold text-slate-500">{inc.id} • Category: {inc.category}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                inc.severity === 'Major' || inc.severity === 'Catastrophic' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                inc.severity === 'Moderate' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {inc.severity}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200 font-medium">
                "{inc.description}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>Reporter: <strong className="text-slate-900">{inc.reporterRole}</strong></span>
                <span>Status: <strong className="text-indigo-700 font-bold">{inc.status}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
