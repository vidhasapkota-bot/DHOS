import React, { useState } from 'react';
import { Lock, ShieldAlert, AlertTriangle, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BreakGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteBreakGlass: (reason: string, userRole: string) => void;
}

export const BreakGlassModal: React.FC<BreakGlassModalProps> = ({
  isOpen,
  onClose,
  onExecuteBreakGlass
}) => {
  const [reason, setReason] = useState('Immediate Resuscitation Life-Threatening Emergency');
  const [userRole, setUserRole] = useState('Consultant Emergency Physician');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteBreakGlass(reason, userRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white border-2 border-red-500 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                Emergency Break-Glass Override
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                WF-420 Security Escalation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs space-y-1.5 text-red-900">
          <div className="font-bold flex items-center gap-1.5 text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            MANDATORY GOVERNANCE AUDIT NOTICE
          </div>
          <p className="text-red-700 leading-relaxed font-medium">
            Executing a Break-Glass Override bypasses standard RBAC access control restrictions across all 16 clinical modules. This transaction will be immutably recorded in the GRAC Audit Log (WF-420) and flagged to the Chief Medical Officer and Caldicott Guardian.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Your Authorized Staff Role *</label>
            <input
              type="text"
              required
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Clinical Justification Reason *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <Lock className="w-4 h-4" />
              Confirm Emergency Break-Glass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
