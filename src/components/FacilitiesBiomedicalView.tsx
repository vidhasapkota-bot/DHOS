import React from 'react';
import {
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { MedicalAsset } from '../types/dhos';

interface FacilitiesBiomedicalViewProps {
  assets: MedicalAsset[];
  onCompleteMaintenance: (assetId: string) => void;
}

export const FacilitiesBiomedicalView: React.FC<FacilitiesBiomedicalViewProps> = ({
  assets,
  onCompleteMaintenance
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Facilities & Biomedical Engineering Maintenance (WF-251 - WF-290)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Biomedical device safety calibration, ventilator maintenance logs, HVAC airflow checks & emergency power generator testing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(assets || []).map((asset) => (
          <div key={asset.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{asset.assetName}</h3>
                <span className="text-[10px] font-mono font-bold text-slate-500">{asset.id} • {asset.category}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                asset.status === 'In Service' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                asset.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {asset.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] font-medium">Current Location: <strong className="text-slate-900 font-bold">{asset.location}</strong></div>
                <div className="text-slate-500 text-[10px] font-medium">Next Calibration Due: <strong className="text-blue-700 font-bold">{asset.nextCalibrationDate}</strong></div>
              </div>

              {asset.maintenanceNotes && (
                <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 italic font-medium">
                  "{asset.maintenanceNotes}"
                </p>
              )}
            </div>

            {asset.status !== 'In Service' && (
              <button
                onClick={() => onCompleteMaintenance(asset.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Certify Safety Calibration & Return to Service
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
