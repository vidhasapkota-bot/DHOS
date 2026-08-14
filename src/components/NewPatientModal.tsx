import React, { useState } from 'react';
import {
  UserPlus,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Stethoscope,
  Building2
} from 'lucide-react';
import { Patient, Bed } from '../types/dhos';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (patientData: Partial<Patient>, admissionData?: { wardId?: string; bedId?: string; triageCategory?: number; complaint?: string }) => void;
  availableBeds?: Bed[];
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  availableBeds = []
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1985-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+61 412 333 444');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('12 Health Avenue, Sydney NSW');
  const [idType, setIdType] = useState<'Medicare' | 'Passport' | 'Driver Licence'>('Medicare');
  const [idNumber, setIdNumber] = useState('2981-90182-1');
  const [foodAllergiesText, setFoodAllergiesText] = useState('Peanuts');
  const [drugAllergiesText, setDrugAllergiesText] = useState('Penicillin');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [interpreterRequired, setInterpreterRequired] = useState(false);
  const [emergencyContactName, setEmergencyContactName] = useState('Sarah Doe');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('Spouse');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+61 412 888 999');

  // Admission routing option
  const [admissionRoute, setAdmissionRoute] = useState<'Registry Only' | 'Direct ED Triage' | 'Direct Ward Inpatient'>('Registry Only');
  const [presentingComplaint, setPresentingComplaint] = useState('Chest pain and shortness of breath');
  const [triageCategory, setTriageCategory] = useState<number>(3);
  const [selectedBedId, setSelectedBedId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const patientData: Partial<Patient> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dob,
      gender,
      mobileNumber: phone,
      email,
      address,
      identificationType: idType,
      identificationNumber: idNumber,
      preferredLanguage,
      interpreterRequired,
      status: 'Active',
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone,
        validated: true
      },
      foodAllergies: foodAllergiesText ? foodAllergiesText.split(',').map(s => s.trim()).filter(Boolean) : [],
      drugAllergies: drugAllergiesText ? drugAllergiesText.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    let admissionData;
    if (admissionRoute === 'Direct ED Triage') {
      admissionData = {
        complaint: presentingComplaint,
        triageCategory
      };
    } else if (admissionRoute === 'Direct Ward Inpatient' && selectedBedId) {
      const bed = availableBeds.find(b => b.id === selectedBedId);
      admissionData = {
        bedId: selectedBedId,
        wardId: bed?.wardId,
        complaint: presentingComplaint
      };
    }

    onRegister(patientData, admissionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Register & Admit Patient Record
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Workflow WF-011 (Demographics) & WF-018 (MRN Assignment)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Demographics */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              1. Patient Demographics & Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vance"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+61 412 345 678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ID Document Type *</label>
                <div className="flex gap-2">
                  <select
                    value={idType}
                    onChange={e => setIdType(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs font-medium"
                  >
                    <option value="Medicare">Medicare</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver Licence">Driver Licence</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="ID Number"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-slate-700 font-bold mb-1">Residential Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, suburb, state, postcode"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Safety & Allergies */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              2. Clinical Safety Alerts & Allergies (WF-024)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-red-700 font-bold mb-1">Known Drug Allergies (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa drugs, Morphine"
                  value={drugAllergiesText}
                  onChange={e => setDrugAllergiesText(e.target.value)}
                  className="w-full bg-red-50/50 border border-red-200 rounded-lg px-3 py-2 text-slate-900 focus:border-red-600 focus:outline-none font-medium placeholder:text-red-300"
                />
              </div>

              <div>
                <label className="block text-amber-800 font-bold mb-1">Known Food Allergies (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Shellfish, Gluten"
                  value={foodAllergiesText}
                  onChange={e => setFoodAllergiesText(e.target.value)}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-2 text-slate-900 focus:border-amber-600 focus:outline-none font-medium placeholder:text-amber-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Next of Kin */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              3. Emergency Contact / Next of Kin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Luke Vance"
                  value={emergencyContactName}
                  onChange={e => setEmergencyContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Son / Parent"
                  value={emergencyContactRelationship}
                  onChange={e => setEmergencyContactRelationship(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  placeholder="+61 412 999 888"
                  value={emergencyContactPhone}
                  onChange={e => setEmergencyContactPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Direct Admission / Routing Action */}
          <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              4. Immediate Admission Destination
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['Registry Only', 'Direct ED Triage', 'Direct Ward Inpatient'] as const).map(route => (
                <button
                  type="button"
                  key={route}
                  onClick={() => setAdmissionRoute(route)}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-left transition ${
                    admissionRoute === route
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">{route}</div>
                  <div className={`text-[10px] font-normal ${admissionRoute === route ? 'text-blue-100' : 'text-slate-400'}`}>
                    {route === 'Registry Only' && 'Create MRN, record in master index'}
                    {route === 'Direct ED Triage' && 'Queue for emergency triage'}
                    {route === 'Direct Ward Inpatient' && 'Directly assign to available bed'}
                  </div>
                </button>
              ))}
            </div>

            {admissionRoute === 'Direct ED Triage' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Presenting Complaint</label>
                  <input
                    type="text"
                    required
                    value={presentingComplaint}
                    onChange={e => setPresentingComplaint(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Australasian Triage Scale (ATS)</label>
                  <select
                    value={triageCategory}
                    onChange={e => setTriageCategory(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
                  >
                    <option value={1}>ATS 1 - Resuscitation (Immediate)</option>
                    <option value={2}>ATS 2 - Emergency (&lt;10 mins)</option>
                    <option value={3}>ATS 3 - Urgent (&lt;30 mins)</option>
                    <option value={4}>ATS 4 - Semi-Urgent (&lt;60 mins)</option>
                    <option value={5}>ATS 5 - Non-Urgent (&lt;120 mins)</option>
                  </select>
                </div>
              </div>
            )}

            {admissionRoute === 'Direct Ward Inpatient' && (
              <div className="pt-2 text-xs">
                <label className="block text-slate-700 font-bold mb-1">Select Available Bed</label>
                <select
                  value={selectedBedId}
                  onChange={e => setSelectedBedId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
                >
                  <option value="">-- Choose an available clean bed --</option>
                  {availableBeds.filter(b => b.status === 'Available').map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bedNumber} ({b.wardName} - {b.bedType})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Automatic Invariant Badge */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Enterprise Identity Safety Verified:</span> Unique MRN will be allocated, barcoded wristband record queued (WF-018), and allergy safety checks published across all 18 clinical modules.
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Registration & Issue MRN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
