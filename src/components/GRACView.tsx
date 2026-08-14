import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Plus,
  ShieldCheck,
  UserCheck,
  History,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { GovernanceIncident } from '../types/dhos';

interface GRACViewProps {
  incidents: GovernanceIncident[];
  onReportIncident: (incident: Partial<GovernanceIncident>) => void;
  currentUser?: { name?: string; role?: string };
  onNavigateToRBAC?: () => void;
}

export const GRACView: React.FC<GRACViewProps> = ({
  incidents,
  onReportIncident,
  currentUser,
  onNavigateToRBAC
}) => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'audit' | 'breakglass'>('incidents');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Clinical Operations');
  const [newSeverity, setNewSeverity] = useState<'Minor' | 'Moderate' | 'Major' | 'Catastrophic'>('Minor');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onReportIncident({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      severity: newSeverity,
      reporterRole: currentUser?.role || 'Staff Member'
    });
    setNewTitle('');
    setNewDesc('');
    setIsFormOpen(false);
  };

  const sampleBreakGlassLogs = [
    {
      id: 'BG-8092',
      user: 'Dr. Sarah Chen',
      role: 'Doctor',
      patient: 'Robert Jenkins (MRN-10492)',
      reason: 'Emergency Resuscitation - Access unconsented past cardiac history',
      time: '14 mins ago',
      status: 'Audited & Approved'
    },
    {
      id: 'BG-8088',
      user: 'RN Liam O’Connor',
      role: 'Nurse',
      patient: 'Emma Watson (MRN-20183)',
      reason: 'Anaphylaxis shock - STAT high-risk epinephrine administration override',
      time: '1 hour ago',
      status: 'Executive Review Pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Governance, Risk, Audit & Compliance (GRAC) (WF-411 - WF-430)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              ISO 27001 & Clinical RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            No-blame clinical incident reporting (WF-412), Root Cause Analysis (RCA), WHO surgical audit trails & Break-Glass access logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToRBAC && (
            <button
              onClick={onNavigateToRBAC}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              RBAC Matrix
            </button>
          )}

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Report Incident
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'incidents' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Clinical Incidents ({(incidents || []).length})
        </button>
        <button
          onClick={() => setActiveTab('breakglass')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'breakglass' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Break-Glass Audit Logs ({sampleBreakGlassLogs.length})
        </button>
      </div>

      {/* New Incident Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Submit New Clinical Incident (No-Blame Policy WF-412)</h3>
            <span className="text-xs text-slate-400">Reporting as: <strong className="text-slate-700">{currentUser?.role || 'Clinician'}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Incident Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Medication allergy check bypassed"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Clinical Operations">Clinical Operations</option>
                <option value="Medication Safety">Medication Safety</option>
                <option value="Infection Control">Infection Control</option>
                <option value="Patient Falls">Patient Falls</option>
                <option value="Security / Access">Security / Access</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Severity Rating</label>
              <select
                value={newSeverity}
                onChange={e => setNewSeverity(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Minor">Minor (Near Miss)</option>
                <option value="Moderate">Moderate</option>
                <option value="Major">Major</option>
                <option value="Catastrophic">Catastrophic (Sentinel Event)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Description & Contributing Factors</label>
            <textarea
              rows={2}
              required
              placeholder="Describe factual sequence of events and systemic safeguards..."
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
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
      )}

      {/* Break-Glass Tab */}
      {activeTab === 'breakglass' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Emergency Break-Glass Security Audit Trails</h3>
              <p className="text-xs text-slate-500 font-medium">All emergency privilege escalations are logged with cryptographic timestamps and executive review requirements.</p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-xs font-bold">
              Mandatory Review
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {sampleBreakGlassLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">{log.id}</span>
                    <strong className="text-slate-900">{log.user} ({log.role})</strong>
                    <span className="text-slate-400">• Target: {log.patient}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{log.time}</span>
                </div>
                <p className="text-slate-700 bg-amber-50/50 p-2 rounded border border-amber-100 font-medium">
                  <strong>Clinical Justification:</strong> {log.reason}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.status}
                  </span>
                  <button className="text-indigo-600 font-bold hover:underline">
                    View Complete Audit Log →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
