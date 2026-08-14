import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  RotateCcw,
  Plus
} from 'lucide-react';
import { EVSCleaningJob } from '../types/dhos';

interface EVSViewProps {
  cleaningJobs: EVSCleaningJob[];
  onCompleteJob: (jobId: string) => void;
}

export const EVSView: React.FC<EVSViewProps> = ({
  cleaningJobs,
  onCompleteJob
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Environmental Services (EVS) & Housekeeping (WF-211 - WF-230)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Terminal discharge bed sanitation (WF-213), ATP bioluminescence hygiene clearance & isolation room decontamination.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(cleaningJobs || []).map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Bed {job.bedNumber}</h3>
                <span className="text-[11px] text-slate-500 font-medium">Ward: {job.wardName}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                job.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                job.status === 'In Progress' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Clean Type</span>
                <span className="font-bold text-teal-900">{job.cleanType}</span>
              </div>

              {job.infectionPrecaution && (
                <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg text-red-900 font-extrabold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Precaution: {job.infectionPrecaution}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>Assigned: <strong className="text-slate-900">{job.assignedStaff || 'Unassigned'}</strong></span>
                <span>Requested: {job.requestedTime}</span>
              </div>
            </div>

            {job.status !== 'Completed' && (
              <button
                onClick={() => onCompleteJob(job.id)}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Clean & Release Bed to Pool
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
