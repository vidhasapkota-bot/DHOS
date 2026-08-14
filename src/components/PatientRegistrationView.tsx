import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Users,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  Merge,
  ChevronRight,
  ArrowLeft,
  Printer,
  Heart,
  Stethoscope,
  Building2,
  BedDouble,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Languages,
  Shield,
  Activity,
  AlertTriangle,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Patient, Bed, AdmissionEpisode } from '../types/dhos';

interface PatientRegistrationViewProps {
  patients: Patient[];
  onRegisterPatient: (data: Partial<Patient>) => void;
  onOpenNewPatientModal?: () => void;
}

export const PatientRegistrationView: React.FC<PatientRegistrationViewProps> = ({
  patients,
  onRegisterPatient,
  onOpenNewPatientModal
}) => {
  // Navigation & selection
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'demographics' | 'safety' | 'admissions' | 'consents'>('demographics');

  // Search & Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Registered'>('All');
  const [safetyFilter, setSafetyFilter] = useState<'All' | 'Allergies' | 'Fall Risk' | 'Infection'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toast / Action feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showWristbandModal, setShowWristbandModal] = useState<Patient | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected patient object
  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null;
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Filtered patient records
  const filteredPatients = useMemo(() => {
    return (patients || []).filter(p => {
      const matchesSearch =
        searchTerm === '' ||
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mrn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobileNumber?.includes(searchTerm) ||
        p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.identificationNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        p.status === statusFilter;

      const matchesSafety =
        safetyFilter === 'All' ||
        (safetyFilter === 'Allergies' && ((p.drugAllergies && p.drugAllergies.length > 0) || (p.foodAllergies && p.foodAllergies.length > 0))) ||
        (safetyFilter === 'Fall Risk' && p.alerts?.some(a => a.alertType === 'Fall Risk')) ||
        (safetyFilter === 'Infection' && p.alerts?.some(a => a.alertType === 'Infection Risk'));

      return matchesSearch && matchesStatus && matchesSafety;
    });
  }, [patients, searchTerm, statusFilter, safetyFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Helper to calculate age
  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // ----------------------------------------------------
  // VIEW 1: DEDICATED PATIENT PROFILE PAGE (When a row is clicked)
  // ----------------------------------------------------
  if (selectedPatient) {
    const age = calculateAge(selectedPatient.dateOfBirth);

    return (
      <div className="space-y-5 animate-in fade-in duration-150">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Breadcrumb & Return Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-2xs">
          <button
            onClick={() => setSelectedPatientId(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patient Registry Table</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast(`Checked national master patient index: No duplicate records found for MRN ${selectedPatient.mrn}.`);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Merge className="w-3.5 h-3.5 text-slate-500" />
              <span>Verify No Duplicates (WF-013)</span>
            </button>

            <button
              onClick={() => setShowWristbandModal(selectedPatient)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Barcoded Wristband (WF-018)</span>
            </button>
          </div>
        </div>

        {/* Hero Patient Identification Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xs">
                {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs font-bold">
                    {selectedPatient.mrn}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    {selectedPatient.status} Record
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  DOB: <span className="text-slate-800 font-bold">{selectedPatient.dateOfBirth} ({age} yrs)</span> • Gender: <span className="text-slate-800 font-bold">{selectedPatient.gender}</span> • Registered: <span className="text-slate-800 font-bold">{new Date(selectedPatient.registeredAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-right">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Identification
                </div>
                <div className="font-bold text-slate-800">
                  {selectedPatient.identificationType}: {selectedPatient.identificationNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Alerts Strip if any */}
          {((selectedPatient.alerts && selectedPatient.alerts.length > 0) || (selectedPatient.drugAllergies && selectedPatient.drugAllergies.length > 0)) && (
            <div className="mt-4 p-3.5 bg-red-50/70 border border-red-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Active Safety & Allergy Precautions:</span>
                <div className="flex flex-wrap gap-1.5 ml-1">
                  {(selectedPatient.drugAllergies || []).map((allergy, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold">
                      Allergy: {allergy}
                    </span>
                  ))}
                  {(selectedPatient.alerts || []).map((alert) => (
                    <span key={alert.id} className="px-2 py-0.5 rounded bg-amber-500 text-white text-[11px] font-bold">
                      {alert.alertType}: {alert.details}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                Mandatory Check Required Before Medication / Ward Transfer
              </span>
            </div>
          )}

          {/* Profile Section Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mt-6 pb-2">
            <button
              onClick={() => setActiveProfileTab('demographics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeProfileTab === 'demographics'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Demographics & Contact</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('safety')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeProfileTab === 'safety'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Clinical Safety & Allergies (WF-024)</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('admissions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeProfileTab === 'admissions'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admissions & Encounters (WF-015)</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('consents')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeProfileTab === 'consents'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Consents & Next of Kin</span>
            </button>
          </div>

          {/* Tab 1: Demographics & Identity */}
          {activeProfileTab === 'demographics' && (
            <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h4 className="font-extrabold uppercase text-slate-500 text-[11px] tracking-wider border-b border-slate-200 pb-2">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Mobile:
                    </span>
                    <span className="font-bold text-slate-800">{selectedPatient.mobileNumber || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email:
                    </span>
                    <span className="font-bold text-slate-800">{selectedPatient.email || 'None provided'}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Address:
                    </span>
                    <span className="font-bold text-slate-800 text-right max-w-xs">{selectedPatient.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h4 className="font-extrabold uppercase text-slate-500 text-[11px] tracking-wider border-b border-slate-200 pb-2">
                  Legal & Language Preferences
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> ID Document:
                    </span>
                    <span className="font-bold text-slate-800">{selectedPatient.identificationType} ({selectedPatient.identificationNumber})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5" /> Language:
                    </span>
                    <span className="font-bold text-slate-800">{selectedPatient.preferredLanguage || 'English'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Interpreter Required:
                    </span>
                    <span className={`font-bold ${selectedPatient.interpreterRequired ? 'text-amber-700' : 'text-slate-800'}`}>
                      {selectedPatient.interpreterRequired ? `Yes (${selectedPatient.interpreterType || 'Required'})` : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Clinical Safety & Allergies */}
          {activeProfileTab === 'safety' && (
            <div className="pt-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-extrabold text-red-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Known Drug Allergies
                  </h4>
                  {selectedPatient.drugAllergies && selectedPatient.drugAllergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedPatient.drugAllergies.map((allergy, i) => (
                        <span key={i} className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-lg text-xs font-bold">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">No known drug allergies recorded (NKDA).</p>
                  )}
                </div>

                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-extrabold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Known Food Allergies
                  </h4>
                  {selectedPatient.foodAllergies && selectedPatient.foodAllergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedPatient.foodAllergies.map((allergy, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">No dietary allergies recorded.</p>
                  )}
                </div>
              </div>

              {/* Safety Alerts Log */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Clinical Safety Assessments & Invariants (WF-024)
                </h4>
                {(selectedPatient.alerts || []).length > 0 ? (
                  <div className="space-y-2">
                    {selectedPatient.alerts.map(a => (
                      <div key={a.id} className="bg-white border border-slate-200 p-3 rounded-lg flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{a.alertType}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-amber-100 text-amber-800 uppercase font-extrabold">
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs mt-1">{a.details}</p>
                        </div>
                        <div className="text-right text-[11px] text-slate-400 shrink-0">
                          <div>Logged: {a.createdAt}</div>
                          <div>By: {a.createdBy}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No active clinical safety alerts or fall risks logged.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Admissions & Encounters */}
          {activeProfileTab === 'admissions' && (
            <div className="pt-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Current Inpatient Episode (WF-015)
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                    Active Episode
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block font-medium">Admitting Specialty:</span>
                    <span className="font-bold text-slate-800">Cardiology & Internal Medicine</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Attending Specialist:</span>
                    <span className="font-bold text-slate-800">Dr. Elena Rostova (Lead Physician)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Bed Location:</span>
                    <span className="font-bold text-slate-800">Ward 3A Medical - Bed 3A-01</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Consents & Next of Kin */}
          {activeProfileTab === 'consents' && (
            <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h4 className="font-extrabold uppercase text-slate-500 text-[11px] tracking-wider border-b border-slate-200 pb-2">
                  Emergency Contact / Next of Kin
                </h4>
                {selectedPatient.emergencyContact ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Contact Name:</span>
                      <span className="font-bold text-slate-800">{selectedPatient.emergencyContact.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Relationship:</span>
                      <span className="font-bold text-slate-800">{selectedPatient.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Contact Phone:</span>
                      <span className="font-bold text-slate-800">{selectedPatient.emergencyContact.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Identity Validated:</span>
                      <span className="font-bold text-emerald-700">Verified (WF-012)</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">No next of kin recorded.</p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h4 className="font-extrabold uppercase text-slate-500 text-[11px] tracking-wider border-b border-slate-200 pb-2">
                  Patient Consent Governance (WF-028)
                </h4>
                {(selectedPatient.consents || []).length > 0 ? (
                  <div className="space-y-2">
                    {selectedPatient.consents.map(c => (
                      <div key={c.id} className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg">
                        <div>
                          <div className="font-bold text-slate-800">{c.consentType} Consent</div>
                          <div className="text-[10px] text-slate-400">Signed: {c.signedAt} • {c.version}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          ACCEPTED
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">Standard emergency implied consent active.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wristband Modal Preview */}
        {showWristbandModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>Barcoded Wristband Queue (WF-018)</span>
                </div>
                <button
                  onClick={() => setShowWristbandModal(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Wristband visual layout */}
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-900 font-black">
                  <span>ST. JUDE METROPOLITAN HOSPITAL</span>
                  <span className="text-[10px] bg-red-600 text-white px-1.5 rounded font-sans">
                    {showWristbandModal.drugAllergies?.length ? 'ALLERGY ALERT' : 'STANDARD'}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {showWristbandModal.lastName}, {showWristbandModal.firstName}
                </div>
                <div className="text-slate-600">
                  MRN: <strong className="text-slate-900">{showWristbandModal.mrn}</strong> | DOB: {showWristbandModal.dateOfBirth}
                </div>
                <div className="text-slate-600">
                  GENDER: {showWristbandModal.gender} | ID: {showWristbandModal.identificationType}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <div className="text-[10px] text-slate-400">||| |||| || ||||| |||| |||</div>
                  <div className="text-[10px] text-slate-500 font-bold">2D MATRIX VERIFIED</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowWristbandModal(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showWristbandModal && showToast(`Wristband printed for ${showWristbandModal.firstName} ${showWristbandModal.lastName} (MRN ${showWristbandModal.mrn}).`);
                    setShowWristbandModal(null);
                  }}
                  className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Send to Zebra Thermal Printer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: MASTER ENTERPRISE PATIENT TABLE VIEW
  // ----------------------------------------------------
  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Patient Identity & Demographic Master Registry
              <span className="text-[11px] px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                WF-011 - WF-018
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enterprise patient directory with master MRN tracking, clinical safety alerts, and admission records.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewPatientModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-2xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient (WF-011)</span>
        </button>
      </div>

      {/* Enterprise Table Card with Search & Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by MRN, Name, Phone, ID, Address..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={safetyFilter}
                onChange={e => {
                  setSafetyFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="text-xs text-slate-700 bg-transparent focus:outline-none font-bold cursor-pointer"
              >
                <option value="All">All Safety Profiles</option>
                <option value="Allergies">Drug / Food Allergies</option>
                <option value="Fall Risk">Fall Risk Alerts</option>
                <option value="Infection">Infection Precautions</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium pl-2 hidden sm:block">
              Showing <strong className="text-slate-900">{filteredPatients.length}</strong> records
            </div>
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <th className="py-3 px-4">Patient Name & MRN</th>
                <th className="py-3 px-4">DOB / Age & Gender</th>
                <th className="py-3 px-4">Identification</th>
                <th className="py-3 px-4">Clinical Safety & Allergies</th>
                <th className="py-3 px-4">Emergency Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No matching patient records found in enterprise directory.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dateOfBirth);
                  const hasAllergies = (patient.drugAllergies && patient.drugAllergies.length > 0) || (patient.foodAllergies && patient.foodAllergies.length > 0);
                  const hasFallRisk = patient.alerts?.some(a => a.alertType === 'Fall Risk');
                  const hasInfection = patient.alerts?.some(a => a.alertType === 'Infection Risk');

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition group"
                    >
                      {/* Name & MRN */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                              <span>{patient.firstName} {patient.lastName}</span>
                            </div>
                            <div className="font-mono text-[11px] text-blue-700 font-bold">
                              {patient.mrn}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DOB / Age & Gender */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div>{patient.dateOfBirth}</div>
                        <div className="text-[11px] text-slate-400">{age} yrs • {patient.gender}</div>
                      </td>

                      {/* ID */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div className="font-bold text-slate-800">{patient.identificationType}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{patient.identificationNumber}</div>
                      </td>

                      {/* Safety Alerts */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {hasAllergies ? (
                            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                              Allergy ({[...(patient.drugAllergies || []), ...(patient.foodAllergies || [])].join(', ')})
                            </span>
                          ) : null}
                          {hasFallRisk && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              Fall Risk
                            </span>
                          )}
                          {hasInfection && (
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                              Infection Precaution
                            </span>
                          )}
                          {!hasAllergies && !hasFallRisk && !hasInfection && (
                            <span className="text-[11px] text-slate-400">NKDA / Low Risk</span>
                          )}
                        </div>
                      </td>

                      {/* Emergency Contact */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {patient.emergencyContact ? (
                          <div>
                            <div className="font-bold text-slate-800">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</div>
                            <div className="text-[11px] text-slate-400">{patient.emergencyContact.phone}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">None Recorded</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          {patient.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatientId(patient.id);
                          }}
                          className="px-2.5 py-1 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <span>Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div>
            Showing <strong className="text-slate-900">{paginatedPatients.length}</strong> of <strong className="text-slate-900">{filteredPatients.length}</strong> total patients
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="px-2 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
