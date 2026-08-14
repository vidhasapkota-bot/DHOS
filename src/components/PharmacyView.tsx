import React, { useState } from 'react';
import {
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCheck,
  Plus,
  Sparkles,
  Search
} from 'lucide-react';
import { MedicationPrescription } from '../types/dhos';

interface PharmacyViewProps {
  prescriptions: MedicationPrescription[];
  onAdministerMedication: (id: string, nurse1: string, nurse2?: string) => void;
  onVerifyPharmacy: (id: string, pharmacist: string) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  prescriptions,
  onAdministerMedication,
  onVerifyPharmacy
}) => {
  const [nurse1, setNurse1] = useState('Nurse Sarah Jenkins, RN');
  const [nurse2, setNurse2] = useState('Nurse Michael Chang, RN');
  const [selectedPrescription, setSelectedPrescription] = useState<MedicationPrescription | null>(prescriptions?.[0] || null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            eMAR Pharmacy & Closed-Loop Medication Administration (WF-171 - WF-190)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Electronic Medication Administration Record (eMAR), dual nurse sign-off for high-risk drugs (WF-174), controlled drug vault auditing & TTO discharge med reconciliation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: eMAR Prescription Worklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Active eMAR Prescriptions</span>
            <span className="text-emerald-700 font-mono text-[11px] font-bold">{(prescriptions || []).length} Orders</span>
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {(prescriptions || []).map((rx) => (
              <div
                key={rx.id}
                onClick={() => setSelectedPrescription(rx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 text-xs ${
                  selectedPrescription?.id === rx.id
                    ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{rx.patientName}</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold">Bed {rx.bedNumber}</span>
                </div>

                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" />
                  {rx.medicationName} ({rx.dosage})
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-medium">
                  <span>Route: <strong className="text-slate-900">{rx.route}</strong></span>
                  <span>Freq: <strong className="text-slate-900">{rx.frequency}</strong></span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  {rx.highRiskCategory ? (
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-extrabold">
                      High-Risk: {rx.highRiskCategory}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Standard Med</span>
                  )}

                  <span className={`font-bold ${rx.administered ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {rx.administered ? 'Administered' : 'Due Now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Drug Administration & Dual Sign-Off Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs text-slate-900">
          {selectedPrescription ? (
            <div className="space-y-6 text-xs">
              {/* Rx Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedPrescription.medicationName}</h3>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold">
                      {selectedPrescription.dosage}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium mt-1">
                    Patient: <strong className="text-slate-900">{selectedPrescription.patientName} (Bed {selectedPrescription.bedNumber})</strong> | Prescriber: <strong className="text-slate-900">{selectedPrescription.prescribingDoctor}</strong>
                  </p>
                </div>

                <div className="text-right font-medium text-slate-500">
                  <div>Route: <strong className="text-slate-900">{selectedPrescription.route}</strong></div>
                  <div>Frequency: <strong className="text-slate-900">{selectedPrescription.frequency}</strong></div>
                </div>
              </div>

              {/* Pharmacy Clinical Verification Status (WF-172) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Clinical Pharmacy Verification (WF-172)
                  </span>

                  {selectedPrescription.verifiedByPharmacist ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified by {selectedPrescription.verifiedByPharmacist}
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerifyPharmacy(selectedPrescription.id, 'PharmD Marcus Vance')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition shadow-xs"
                    >
                      Complete Clinical Pharmacy Check
                    </button>
                  )}
                </div>

                {selectedPrescription.highRiskCategory && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-900 space-y-1">
                    <div className="font-extrabold flex items-center gap-1.5 text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      HIGH-RISK MEDICATION WARNING ({selectedPrescription.highRiskCategory})
                    </div>
                    <p className="text-[11px] text-red-800 font-medium">
                      Mandatory Dual Nurse Independent Double-Check required at bedside prior to administration (WF-174).
                    </p>
                  </div>
                )}
              </div>

              {/* Administration & Dual Sign-Off Controls */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  eMAR Bedside Administration Sign-Off
                </h4>

                {selectedPrescription.administered ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                    <div className="font-extrabold text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Medication Administered & Recorded in eMAR
                    </div>
                    <div className="text-xs text-emerald-800 font-medium">
                      Primary Nurse: {selectedPrescription.administeredByNurse1}
                      {selectedPrescription.administeredByNurse2 && ` | Secondary Nurse Witness: ${selectedPrescription.administeredByNurse2}`}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Primary Nurse Sign-Off *</label>
                        <input
                          type="text"
                          value={nurse1}
                          onChange={e => setNurse1(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      {selectedPrescription.highRiskCategory && (
                        <div>
                          <label className="block text-red-700 font-bold mb-1">Secondary Nurse Witness (WF-174) *</label>
                          <input
                            type="text"
                            value={nurse2}
                            onChange={e => setNurse2(e.target.value)}
                            className="w-full bg-white border border-red-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-red-600"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAdministerMedication(
                        selectedPrescription.id,
                        nurse1,
                        selectedPrescription.highRiskCategory ? nurse2 : undefined
                      )}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Sign eMAR & Confirm Administration
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              Select a prescription from the eMAR list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
