import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Users,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  Merge,
  ChevronRight
} from 'lucide-react';
import { Patient } from '../types/dhos';

interface PatientRegistrationViewProps {
  patients: Patient[];
  onRegisterPatient: (data: Partial<Patient>) => void;
}

export const PatientRegistrationView: React.FC<PatientRegistrationViewProps> = ({
  patients,
  onRegisterPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients?.[0] || null);

  // New Patient Form state
  const [showNewModal, setShowNewModal] = useState(false);
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

  const filteredPatients = (patients || []).filter(p =>
    p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mobileNumber?.includes(searchTerm)
  );

  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    onRegisterPatient({
      firstName,
      lastName,
      dateOfBirth: dob,
      gender,
      mobileNumber: phone,
      email,
      address,
      identificationType: idType,
      identificationNumber: idNumber,
      foodAllergies: foodAllergiesText ? foodAllergiesText.split(',').map(s => s.trim()) : [],
      drugAllergies: drugAllergiesText ? drugAllergiesText.split(',').map(s => s.trim()) : []
    });

    setFirstName('');
    setLastName('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Patient Identity & Demographic Registry (WF-011 - WF-018)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enterprise Medical Record Number (MRN) management, verification, allergy alerts and consent compliance.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          Register New Patient (WF-011)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Search List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search MRN, Name, Phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                  selectedPatient?.id === p.id
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {p.firstName} {p.lastName}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 font-mono font-bold">
                      {p.mrn}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    DOB: {p.dateOfBirth} • {p.gender}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Patient Profile */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                      {selectedPatient.mrn}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                      Status: {selectedPatient.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    DOB: <span className="text-slate-900 font-semibold">{selectedPatient.dateOfBirth}</span> | Gender: <span className="text-slate-900 font-semibold">{selectedPatient.gender}</span> | Registered: <span className="text-slate-900 font-semibold">{new Date(selectedPatient.registeredAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded text-xs font-semibold border border-slate-200">
                    ID: {selectedPatient.identificationType} ({selectedPatient.identificationNumber})
                  </span>
                </div>
              </div>

              {/* Safety Alerts Banner */}
              {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Active Patient Safety Alerts (WF-024)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPatient.alerts.map((alt) => (
                      <div key={alt.id} className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs">
                        <div className="font-bold text-amber-900 flex items-center justify-between">
                          <span>{alt.alertType}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 uppercase font-extrabold">
                            {alt.severity}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px] font-medium mt-1">{alt.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-extrabold text-red-600 uppercase tracking-wider">
                    Known Drug Allergies
                  </h4>
                  {selectedPatient.drugAllergies && selectedPatient.drugAllergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.drugAllergies.map((a, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-bold">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">No known drug allergies recorded.</p>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
                    Known Food Allergies
                  </h4>
                  {selectedPatient.foodAllergies && selectedPatient.foodAllergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.foodAllergies.map((a, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-bold">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">No known food allergies recorded.</p>
                  )}
                </div>
              </div>

              {/* Contact & Legal Information */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-2">
                  Contact & Emergency Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                  <div>
                    <span className="text-slate-500 block font-medium">Mobile Phone:</span>
                    <span className="font-bold text-slate-900">{selectedPatient.mobileNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Residential Address:</span>
                    <span className="font-bold text-slate-900">{selectedPatient.address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Emergency Contact (Next of Kin):</span>
                    <span className="font-bold text-slate-900">
                      {selectedPatient.emergencyContact ? `${selectedPatient.emergencyContact.name || ''} (${selectedPatient.emergencyContact.relationship || ''}) - ${selectedPatient.emergencyContact.phone || ''}` : 'None Recorded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Language & Interpreter:</span>
                    <span className="font-bold text-slate-900">
                      {selectedPatient.preferredLanguage || 'English'} {selectedPatient.interpreterRequired ? '(Interpreter Required)' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              Select a patient from the list to view profile.
            </div>
          )}
        </div>
      </div>

      {/* New Patient Registration Modal (WF-011) */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto text-slate-900">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              Register New Patient Record (WF-011)
            </h3>

            <form onSubmit={handleSubmitNewPatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
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
                  <label className="block text-slate-700 font-bold mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ID Type & Number *</label>
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
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-red-600 font-bold mb-1">Drug Allergies (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Penicillin, Sulfa"
                    value={drugAllergiesText}
                    onChange={e => setDrugAllergiesText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-amber-700 font-bold mb-1">Food Allergies (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Peanuts, Shellfish, Lactose"
                    value={foodAllergiesText}
                    onChange={e => setFoodAllergiesText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
                <span className="font-bold text-emerald-700">Automatic Invariant Checks:</span> Duplicate MRN/Identity search will be performed. Unique Medical Record Number (MRN) will be automatically generated.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Complete Registration & Issue MRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
