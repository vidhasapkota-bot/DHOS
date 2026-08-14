import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Siren,
  Clock,
  UserCheck,
  Plus,
  Sparkles,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { EDEncounter, TriageCategory } from '../types/dhos';

interface EmergencyDepartmentViewProps {
  encounters: EDEncounter[];
  onAddTriageEncounter: (data: Partial<EDEncounter>) => void;
}

export const EmergencyDepartmentView: React.FC<EmergencyDepartmentViewProps> = ({
  encounters,
  onAddTriageEncounter
}) => {
  const [showTriageModal, setShowNewTriageModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState(42);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [arrivalMethod, setArrivalMethod] = useState<'Walk-in' | 'Ambulance' | 'GP Referral'>('Ambulance');
  const [triageCategory, setTriageCategory] = useState<TriageCategory>(2);
  const [complaint, setComplaint] = useState('Severe shortness of breath & wheezing');

  const handleSubmitTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    onAddTriageEncounter({
      patientName,
      patientAge: age,
      patientGender: gender,
      arrivalMethod,
      triageCategory,
      presentingComplaint: complaint
    });

    setPatientName('');
    setShowNewTriageModal(false);
  };

  const getTriageColor = (cat: TriageCategory) => {
    switch (cat) {
      case 1: return 'bg-red-600 text-white border-red-500 shadow-xs shadow-red-200 animate-pulse';
      case 2: return 'bg-amber-600 text-white border-amber-500';
      case 3: return 'bg-yellow-500 text-slate-900 border-yellow-400 font-bold';
      case 4: return 'bg-emerald-600 text-white border-emerald-500';
      case 5: return 'bg-blue-600 text-white border-blue-500';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-600" />
            Emergency Department Operations Wallboard (WF-071 - WF-090)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time Australasian Triage Scale (Category 1-5), Resuscitation Bays, Ambulance Handovers & ED Boarding.
          </p>
        </div>

        <button
          onClick={() => setShowNewTriageModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Perform Triage Assessment (WF-073)
        </button>
      </div>

      {/* Triage Urgency Wallboard Columns (Categories 1 - 5) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((catNum) => {
          const catEncounters = (encounters || []).filter(e => e.triageCategory === catNum);
          return (
            <div key={catNum} className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getTriageColor(catNum as TriageCategory)}`}>
                  Cat {catNum}
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold">
                  {catEncounters.length} Patients
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {catEncounters.length === 0 ? (
                  <div className="p-3 text-center text-slate-400 text-[11px] italic font-medium">
                    No active Category {catNum} patients.
                  </div>
                ) : (
                  (catEncounters || []).map((enc) => (
                    <div
                      key={enc.id}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-lg space-y-2 text-xs transition shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            {enc.patientName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {enc.patientAge}y • {enc.patientGender} • {enc.arrivalMethod}
                          </div>
                        </div>

                        {enc.aiPriorityScore && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-bold" title="AI Prioritisation Score">
                            AI: {enc.aiPriorityScore}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-800 text-[11px] bg-white p-2 rounded border border-slate-200 font-semibold">
                        "{enc.presentingComplaint}"
                      </p>

                      {enc.vitalSigns && (
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 pt-1 border-t border-slate-200 font-medium">
                          <span>BP: <strong className="text-slate-900">{enc.vitalSigns.bloodPressure}</strong></span>
                          <span>SpO2: <strong className="text-slate-900">{enc.vitalSigns.oxygenSaturation}%</strong></span>
                          <span>HR: <strong className="text-slate-900">{enc.vitalSigns.pulse} bpm</strong></span>
                          <span>NEWS2: <strong className="text-red-600 font-extrabold">{enc.vitalSigns.news2Score}</strong></span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Wait: {enc.waitingTimeMinutes}m
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                          {enc.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Triage Modal (WF-073) */}
      {showTriageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Siren className="w-5 h-5 text-red-600" />
              Perform ED Triage Assessment (WF-073)
            </h3>

            <form onSubmit={handleSubmitTriage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Approx. Age *</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Arrival Method *</label>
                  <select
                    value={arrivalMethod}
                    onChange={e => setArrivalMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="Ambulance">Ambulance</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="GP Referral">GP Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Triage Urgency Category (ATS 1-5) *</label>
                <select
                  value={triageCategory}
                  onChange={e => setTriageCategory(Number(e.target.value) as TriageCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                >
                  <option value={1}>Category 1 - Resuscitation (Immediate Life Threat)</option>
                  <option value={2}>Category 2 - Emergency (10 Minutes Target)</option>
                  <option value={3}>Category 3 - Urgent (30 Minutes Target)</option>
                  <option value={4}>Category 4 - Semi-Urgent (60 Minutes Target)</option>
                  <option value={5}>Category 5 - Non-Urgent (120 Minutes Target)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Presenting Complaint *</label>
                <textarea
                  rows={2}
                  required
                  value={complaint}
                  onChange={e => setComplaint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewTriageModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Complete Triage & Add to Wallboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
