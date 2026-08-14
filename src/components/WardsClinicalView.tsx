import React, { useState } from 'react';
import {
  FileText,
  Activity,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  Users,
  ShieldAlert
} from 'lucide-react';
import { WardHandover } from '../types/dhos';

interface WardsClinicalViewProps {
  handovers: WardHandover[];
  onAcknowledgeHandover: (handoverId: string) => void;
}

export const WardsClinicalView: React.FC<WardsClinicalViewProps> = ({
  handovers,
  onAcknowledgeHandover
}) => {
  const [activeTab, setActiveTab] = useState<'handovers' | 'mdt' | 'vitals'>('handovers');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Ward Clinical Care & Nursing Handovers (WF-091 - WF-110)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            SBAR structured shift handovers (WF-092), NEWS2 deteriorating patient escalations, and MDT daily ward rounds.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'handovers' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            SBAR Shift Handovers
          </button>
          <button
            onClick={() => setActiveTab('mdt')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'mdt' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            MDT Ward Round
          </button>
        </div>
      </div>

      {activeTab === 'handovers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(handovers || []).map((ho) => (
            <div key={ho.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{ho.patientName}</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[11px] font-bold">
                      Bed {ho.bedNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Outgoing Nurse: <strong className="text-slate-900">{ho.outgoingNurse}</strong> → Incoming Nurse: <strong className="text-slate-900">{ho.incomingNurse}</strong>
                  </div>
                </div>

                {ho.acknowledged ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Handover Acknowledged
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledgeHandover(ho.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition"
                  >
                    Acknowledge SBAR Handover (WF-092)
                  </button>
                )}
              </div>

              {/* SBAR Format Breakdown */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-blue-700 font-extrabold uppercase text-[10px] block">Situation</span>
                  <p className="text-slate-800 font-medium">{ho.sbarSituation}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-purple-700 font-extrabold uppercase text-[10px] block">Background</span>
                  <p className="text-slate-800 font-medium">{ho.sbarBackground}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-amber-700 font-extrabold uppercase text-[10px] block">Assessment</span>
                  <p className="text-slate-800 font-medium">{ho.sbarAssessment}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-emerald-700 font-extrabold uppercase text-[10px] block">Recommendation</span>
                  <p className="text-slate-800 font-medium">{ho.sbarRecommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mdt' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs shadow-xs text-slate-900">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Multidisciplinary Team (MDT) Ward Round Plan
          </h3>
          <p className="text-slate-500 font-medium">
            Includes Consultant Physician, Ward Sister, Clinical Pharmacist, Physiotherapist & Social Care Coordinator.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-slate-900">Bed 301 - Arthur Vance (81y M)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                Target Discharge: Tomorrow 11:00 AM
              </span>
            </div>
            <p className="text-slate-700 font-medium">
              Physiotherapy cleared for 1x mobility with frame. Pharmacy completed TTO medication reconciliation. Social worker confirmed domiciliary care package commencing tomorrow morning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
