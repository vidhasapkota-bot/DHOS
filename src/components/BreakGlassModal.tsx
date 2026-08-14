import React, { useState } from 'react';
import { Lock, ShieldAlert, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-rose-950/90 border border-rose-800/90 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-rose-100">
        <div className="flex items-center justify-between border-b border-rose-800/80 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-400 animate-pulse" />
            EMERGENCY BREAK-GLASS OVERRIDE (WF-420)
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-rose-900/40 border border-rose-800/80 p-3 rounded-xl text-xs space-y-2">
          <div className="font-bold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            MANDATORY GOVERNANCE AUDIT NOTICE
          </div>
          <p className="text-rose-200/90">
            Executing a Break-Glass Override bypasses standard RBAC access control restrictions across all 14 clinical modules. This transaction will be immutably recorded in the GRAC Audit Log (WF-420) and flagged to the Chief Medical Officer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-rose-200 font-semibold mb-1">Your Authorised Staff Role *</label>
            <input
              type="text"
              required
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
              className="w-full bg-slate-950 border border-rose-800/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-rose-200 font-semibold mb-1">Justification Reason *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-rose-800/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-rose-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-lg flex items-center gap-1.5 shadow-lg animate-pulse"
            >
              <Lock className="w-4 h-4" />
              CONFIRM EMERGENCY BREAK-GLASS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
