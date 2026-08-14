import React from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  UserCheck,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { PorterTask } from '../types/dhos';

interface LogisticsViewProps {
  porterTasks: PorterTask[];
  onCompletePorterTask: (taskId: string) => void;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  porterTasks,
  onCompletePorterTask
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Internal Logistics, Porters & Patient Transport (WF-231 - WF-250)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time patient transfer dispatch, oxygen cylinder transport, specimen courier runs & bed movements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(porterTasks || []).map((task) => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{task.patientName || task.taskType}</h3>
                <span className="text-[10px] font-mono font-bold text-slate-500">{task.id}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                task.status === 'In Transit' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse' :
                'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between font-bold">
                <span className="text-slate-800">{task.originLocation}</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-900">{task.destinationLocation}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>Porter: <strong className="text-slate-900">{task.assignedPorter}</strong></span>
                <span>Priority: <strong className="text-indigo-700 font-bold">{task.priority}</strong></span>
              </div>
            </div>

            {task.status !== 'Completed' && (
              <button
                onClick={() => onCompletePorterTask(task.id)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Transport Completion
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
