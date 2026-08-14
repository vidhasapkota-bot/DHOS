import React, { useState } from 'react';
import {
  FlaskConical,
  FileScan,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Sparkles,
  FileText
} from 'lucide-react';
import { DiagnosticOrder } from '../types/dhos';

interface DiagnosticsViewProps {
  orders: DiagnosticOrder[];
  onOrderDiagnostic: (order: Partial<DiagnosticOrder>) => void;
  onFlagCriticalResult: (orderId: string) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  orders,
  onOrderDiagnostic,
  onFlagCriticalResult
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pathology' | 'Radiology'>('All');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [patientName, setPatientName] = useState('Arthur Vance');
  const [testName, setTestName] = useState('CT Pulmonary Angiogram (CTPA)');
  const [category, setCategory] = useState<'Pathology' | 'Radiology'>('Radiology');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Stat / Emergency'>('Urgent');

  const filteredOrders = (orders || []).filter(o => selectedCategory === 'All' || o.category === selectedCategory);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderDiagnostic({
      patientName,
      patientMrn: 'MRN-88201',
      testName,
      category,
      urgency,
      status: 'Ordered'
    });
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-600" />
            Diagnostics, Pathology & PACS Radiology Hub (WF-151 - WF-170)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Pathology lab speciman tracking, DICOM PACS radiology viewer integration & critical result escalation protocols (WF-159).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            {(['All', 'Pathology', 'Radiology'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition ${selectedCategory === cat ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowOrderModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Order Diagnostic (WF-152)
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Order ID & Patient</th>
                <th className="p-3.5">Test Name & Category</th>
                <th className="p-3.5">Urgency</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Diagnostic Findings & DICOM</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              {(filteredOrders || []).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <div className="font-extrabold text-slate-900">{ord.patientName}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-bold">{ord.id} • {ord.patientMrn}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-amber-900">{ord.testName}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {ord.category}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.urgency === 'Stat / Emergency' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                      ord.urgency === 'Urgent' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {ord.urgency}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      ord.status === 'Completed' ? 'text-emerald-800 bg-emerald-100' :
                      ord.status === 'In Progress' ? 'text-amber-800 bg-amber-100' :
                      'text-slate-600 bg-slate-100'
                    }`}>
                      {ord.status}
                    </span>
                  </td>

                  <td className="p-3.5 max-w-xs">
                    {ord.resultSummary ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-800 font-medium line-clamp-2">{ord.resultSummary}</p>
                        {ord.pacsImageUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-mono font-bold underline cursor-pointer">
                            <Eye className="w-3 h-3 text-blue-600" /> DICOM PACS Study Ready
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Pending Analysis...</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    {ord.isCriticalResult ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-extrabold flex items-center gap-1 justify-end animate-pulse">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-600" /> CRITICAL RESULT ESCALATED
                      </span>
                    ) : ord.status === 'Completed' ? (
                      <button
                        onClick={() => onFlagCriticalResult(ord.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[10px] font-semibold transition"
                      >
                        Flag Critical Result (WF-159)
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">In Specimen Line</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              Order Diagnostic Test (WF-152)
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="Radiology">Radiology / PACS Imaging</option>
                  <option value="Pathology">Pathology / Blood Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Urgency Level *</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Stat / Emergency">Stat / Emergency</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
