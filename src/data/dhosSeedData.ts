import {
  HospitalConfig,
  Campus,
  Building,
  Ward,
  Bed,
  Department,
  ClinicalUnit,
  Patient,
  AdmissionEpisode,
  EDEncounter,
  SurgicalCase,
  ICUPatient,
  DiagnosticRequest,
  MedicationOrder,
  MealOrder,
  EVSTask,
  TransportTask,
  MaintenanceWorkOrder,
  MedicalDevice,
  InventoryItem,
  StaffMember,
  BreakGlassLog,
  ExecutiveDecision,
  HospitalSurgeStatus
} from '../types/dhos';

export const initialHospitalConfig: HospitalConfig = {
  id: 'HOSP-001',
  name: 'St. Jude Metropolitan Hospital',
  code: 'SJMH-AU',
  financialYear: '2026-2027',
  timeZone: 'Australia/Sydney (AEST/AEDT)',
  publicHolidays: ['2026-01-01', '2026-01-26', '2026-04-03', '2026-04-06', '2026-04-25', '2026-12-25'],
  workingWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  securityPolicy: {
    mfaRequired: true,
    sessionTimeoutMinutes: 30,
    passwordExpiryDays: 90,
  },
  aiSettings: {
    enabled: true,
    modelAlias: 'gemini-3.6-flash',
    autoAssist: true,
  }
};

export const initialCampuses: Campus[] = [
  {
    id: 'CAMP-01',
    hospitalId: 'HOSP-001',
    name: 'Main City Central Campus',
    code: 'MCC',
    address: '100 Healthcare Boulevard, Metro City',
    status: 'Active',
    buildingsCount: 3,
    totalBedCapacity: 450,
  },
  {
    id: 'CAMP-02',
    hospitalId: 'HOSP-001',
    name: 'West Wing Specialist Centre',
    code: 'WWSC',
    address: '45 Specialty Way, Westside',
    status: 'Active',
    buildingsCount: 2,
    totalBedCapacity: 180,
  }
];

export const initialBuildings: Building[] = [
  { id: 'BLD-A', campusId: 'CAMP-01', name: 'Tower A Clinical Inpatient Block', code: 'TWR-A', floors: 8, hasLiftAccess: true },
  { id: 'BLD-B', campusId: 'CAMP-01', name: 'Surgical & Critical Care Block B', code: 'SURG-B', floors: 5, hasLiftAccess: true },
  { id: 'BLD-C', campusId: 'CAMP-01', name: 'Emergency & Trauma Pavilion C', code: 'EMRG-C', floors: 3, hasLiftAccess: true },
];

export const initialDepartments: Department[] = [
  { id: 'DEP-ED', name: 'Emergency Department', code: 'ED', manager: 'Dr. Sarah Jenkins', workingHours: '24/7 Continuous', escalationRule: 'Escalate to ED Director if wait time > 60m', hospitalId: 'HOSP-001' },
  { id: 'DEP-ICU', name: 'Intensive Care & Critical Care', code: 'ICU', manager: 'Dr. Marcus Vance', workingHours: '24/7 Continuous', escalationRule: 'Escalate to Intensivist Consultant on 100% bed occupancy', hospitalId: 'HOSP-001' },
  { id: 'DEP-SURG', name: 'Surgical Services & Operating Theatres', code: 'OT', manager: 'Dr. Robert Chen', workingHours: '07:00 - 23:00 + 24/7 On-Call', escalationRule: 'Escalate to OT Coordinator if delay > 30m', hospitalId: 'HOSP-001' },
  { id: 'DEP-MED', name: 'General Medicine & Cardiology', code: 'MED', manager: 'Dr. Elena Rostova', workingHours: '24/7 Continuous', escalationRule: 'Escalate to Bed Manager if ward full', hospitalId: 'HOSP-001' },
  { id: 'DEP-PHARM', name: 'Pharmacy & Therapeutics', code: 'PHARM', manager: 'Pharm. David Miller', workingHours: '07:30 - 21:00 + STAT On-Call', escalationRule: 'Escalate STAT orders unverified after 15m', hospitalId: 'HOSP-001' },
  { id: 'DEP-DIAG', name: 'Pathology & Diagnostic Imaging', code: 'DIAG', manager: 'Dr. Aris Thorne', workingHours: '24/7 Continuous', escalationRule: 'Critical value alert requires immediate phone call within 10m', hospitalId: 'HOSP-001' },
  { id: 'DEP-EVS', name: 'Environmental Services & Housekeeping', code: 'EVS', manager: 'Maria Santos', workingHours: '24/7 Shifted', escalationRule: 'Escalate discharge bed clean overdue > 45m', hospitalId: 'HOSP-001' },
  { id: 'DEP-LOG', name: 'Patient Transport & Logistics', code: 'LOG', manager: 'James Wilson', workingHours: '24/7 Continuous', escalationRule: 'Escalate urgent transport wait > 20m', hospitalId: 'HOSP-001' },
  { id: 'DEP-BIOMED', name: 'Biomedical Engineering', code: 'BIOMED', manager: 'Eng. Alex Patel', workingHours: '08:00 - 18:00 + On-Call', escalationRule: 'Escalate ventilator/defibrillator failure immediately', hospitalId: 'HOSP-001' },
  { id: 'DEP-SUPPLY', name: 'Supply Chain & Warehouse', code: 'SUPPLY', manager: 'Karen Smith', workingHours: '06:00 - 18:00', escalationRule: 'Reorder alert triggered on critical shortage', hospitalId: 'HOSP-001' },
];

export const initialWards: Ward[] = [
  { id: 'WARD-3A', buildingId: 'BLD-A', departmentId: 'DEP-MED', name: 'Ward 3A Medical & Cardiology', code: 'W3A', wardType: 'Medical', capacity: 10, occupiedCount: 7, nurseStationPhone: 'x3100', isolationRoomsCount: 2, wardManager: 'Sr. Rachel Green' },
  { id: 'WARD-4B', buildingId: 'BLD-A', departmentId: 'DEP-SURG', name: 'Ward 4B Surgical Ortho', code: 'W4B', wardType: 'Surgical', capacity: 8, occupiedCount: 5, nurseStationPhone: 'x4200', isolationRoomsCount: 1, wardManager: 'Sr. Thomas Lee' },
  { id: 'WARD-ICU', buildingId: 'BLD-B', departmentId: 'DEP-ICU', name: 'Intensive Care Unit 2C', code: 'ICU2C', wardType: 'ICU', capacity: 6, occupiedCount: 4, nurseStationPhone: 'x2000', isolationRoomsCount: 2, wardManager: 'Nurse Mgr. Angela Davis' },
  { id: 'WARD-ED-OBS', buildingId: 'BLD-C', departmentId: 'DEP-ED', name: 'ED Observation & Short Stay', code: 'EDOBS', wardType: 'Emergency Observation', capacity: 6, occupiedCount: 4, nurseStationPhone: 'x1100', isolationRoomsCount: 1, wardManager: 'Charge Nurse Brian Cox' },
  { id: 'WARD-ISO', buildingId: 'BLD-A', departmentId: 'DEP-MED', name: 'Ward 1I Negative Pressure Isolation', code: 'W1I', wardType: 'Medical', capacity: 4, occupiedCount: 2, nurseStationPhone: 'x1050', isolationRoomsCount: 4, wardManager: 'Sr. Clara Oswald' },
];

export const initialBeds: Bed[] = [
  // Ward 3A
  { id: 'BED-3A-01', bedNumber: '3A-01', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Occupied', currentPatientId: 'PAT-1001', currentPatientName: 'Eleanor Vance', currentPatientMrn: 'MRN-88201' },
  { id: 'BED-3A-02', bedNumber: '3A-02', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Occupied', currentPatientId: 'PAT-1002', currentPatientName: 'Arthur Pendelton', currentPatientMrn: 'MRN-88202' },
  { id: 'BED-3A-03', bedNumber: '3A-03', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Dirty', cleaningPriority: 'High', cleaningAssignedTo: 'Housekeeper John' },
  { id: 'BED-3A-04', bedNumber: '3A-04', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Cleaning' },
  { id: 'BED-3A-05', bedNumber: '3A-05', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Inspection' },
  { id: 'BED-3A-06', bedNumber: '3A-06', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Available' },
  { id: 'BED-3A-07', bedNumber: '3A-07', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Reserved', reservedForPatientId: 'PAT-1005' },
  { id: 'BED-3A-08', bedNumber: '3A-08', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Occupied', currentPatientId: 'PAT-1003', currentPatientName: 'Sophia Martinez', currentPatientMrn: 'MRN-88203' },
  { id: 'BED-3A-09', bedNumber: '3A-09', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'Isolation', status: 'Occupied', currentPatientId: 'PAT-1004', currentPatientName: 'Marcus Brodie', currentPatientMrn: 'MRN-88204', isolationRequired: true, isolationType: 'MRSA Contact Precautions' },
  { id: 'BED-3A-10', bedNumber: '3A-10', wardId: 'WARD-3A', wardName: 'Ward 3A Medical & Cardiology', buildingName: 'Tower A', bedType: 'General', status: 'Out of Service', maintenanceReason: 'Telemetry Monitor Sensor Repair' },

  // Ward 4B
  { id: 'BED-4B-01', bedNumber: '4B-01', wardId: 'WARD-4B', wardName: 'Ward 4B Surgical Ortho', buildingName: 'Tower A', bedType: 'Day Surgery', status: 'Occupied', currentPatientId: 'PAT-1005', currentPatientName: 'David Kim', currentPatientMrn: 'MRN-88205' },
  { id: 'BED-4B-02', bedNumber: '4B-02', wardId: 'WARD-4B', wardName: 'Ward 4B Surgical Ortho', buildingName: 'Tower A', bedType: 'General', status: 'Occupied', currentPatientId: 'PAT-1006', currentPatientName: 'Chloe Bennett', currentPatientMrn: 'MRN-88206' },
  { id: 'BED-4B-03', bedNumber: '4B-03', wardId: 'WARD-4B', wardName: 'Ward 4B Surgical Ortho', buildingName: 'Tower A', bedType: 'General', status: 'Available' },
  { id: 'BED-4B-04', bedNumber: '4B-04', wardId: 'WARD-4B', wardName: 'Ward 4B Surgical Ortho', buildingName: 'Tower A', bedType: 'General', status: 'Available' },

  // ICU
  { id: 'BED-ICU-01', bedNumber: 'ICU-01', wardId: 'WARD-ICU', wardName: 'Intensive Care Unit 2C', buildingName: 'Surgical Block B', bedType: 'ICU', status: 'Occupied', currentPatientId: 'PAT-1007', currentPatientName: 'Gordon Ramsay', currentPatientMrn: 'MRN-88207' },
  { id: 'BED-ICU-02', bedNumber: 'ICU-02', wardId: 'WARD-ICU', wardName: 'Intensive Care Unit 2C', buildingName: 'Surgical Block B', bedType: 'ICU', status: 'Occupied', currentPatientId: 'PAT-1008', currentPatientName: 'Amelia Watson', currentPatientMrn: 'MRN-88208' },
  { id: 'BED-ICU-03', bedNumber: 'ICU-03', wardId: 'WARD-ICU', wardName: 'Intensive Care Unit 2C', buildingName: 'Surgical Block B', bedType: 'Negative Pressure', status: 'Occupied', currentPatientId: 'PAT-1009', currentPatientName: 'Harrison Ford', currentPatientMrn: 'MRN-88209', isolationRequired: true, isolationType: 'Airborne Covid-19' },
  { id: 'BED-ICU-04', bedNumber: 'ICU-04', wardId: 'WARD-ICU', wardName: 'Intensive Care Unit 2C', buildingName: 'Surgical Block B', bedType: 'ICU', status: 'Available' },

  // ED Obs
  { id: 'BED-ED-01', bedNumber: 'ED-OBS-01', wardId: 'WARD-ED-OBS', wardName: 'ED Observation', buildingName: 'Emergency Pavilion C', bedType: 'Emergency', status: 'Occupied', currentPatientId: 'PAT-1010', currentPatientName: 'James Carter', currentPatientMrn: 'MRN-88210' },
  { id: 'BED-ED-02', bedNumber: 'ED-OBS-02', wardId: 'WARD-ED-OBS', wardName: 'ED Observation', buildingName: 'Emergency Pavilion C', bedType: 'Emergency', status: 'Occupied', currentPatientId: 'PAT-1011', currentPatientName: 'Linda O\'Connor', currentPatientMrn: 'MRN-88211' },
  { id: 'BED-ED-03', bedNumber: 'ED-OBS-03', wardId: 'WARD-ED-OBS', wardName: 'ED Observation', buildingName: 'Emergency Pavilion C', bedType: 'Emergency', status: 'Available' },
];

export const initialPatients: Patient[] = [
  {
    id: 'PAT-1001',
    mrn: 'MRN-88201',
    firstName: 'Eleanor',
    lastName: 'Vance',
    dateOfBirth: '1965-04-12',
    gender: 'Female',
    mobileNumber: '+61 412 345 678',
    email: 'eleanor.vance@example.com',
    address: '42 Wallaby Way, Sydney NSW',
    identificationType: 'Medicare',
    identificationNumber: '2983-10293-1',
    status: 'Active',
    preferredLanguage: 'English',
    foodAllergies: ['Peanuts', 'Shellfish'],
    drugAllergies: ['Penicillin'],
    registeredAt: '2026-08-10T08:30:00Z',
    emergencyContact: { name: 'Luke Vance', relationship: 'Son', phone: '+61 412 999 888', validated: true },
    alerts: [
      { id: 'ALT-1', alertType: 'Allergy', details: 'Severe Anaphylaxis to Penicillin & Shellfish', severity: 'Critical', createdAt: '2026-08-10', createdBy: 'Dr. Jenkins' },
      { id: 'ALT-2', alertType: 'Fall Risk', details: 'Post-dizziness fall history, Morse Fall Score 65', severity: 'High', createdAt: '2026-08-11', createdBy: 'RN Taylor' }
    ],
    consents: [
      { id: 'CNS-1', consentType: 'Treatment', accepted: true, version: 'v2.1', signedAt: '2026-08-10' },
      { id: 'CNS-2', consentType: 'Privacy', accepted: true, version: 'v1.0', signedAt: '2026-08-10' }
    ]
  },
  {
    id: 'PAT-1002',
    mrn: 'MRN-88202',
    firstName: 'Arthur',
    lastName: 'Pendelton',
    dateOfBirth: '1952-11-20',
    gender: 'Male',
    mobileNumber: '+61 419 888 777',
    email: 'arthur.p@example.com',
    address: '15 Park Avenue, Metro City',
    identificationType: 'Medicare',
    identificationNumber: '9921-00213-2',
    status: 'Active',
    foodAllergies: ['Lactose'],
    drugAllergies: ['Sulfa drugs'],
    registeredAt: '2026-08-11T10:15:00Z',
    emergencyContact: { name: 'Mary Pendelton', relationship: 'Spouse', phone: '+61 419 111 222', validated: true },
    alerts: [
      { id: 'ALT-3', alertType: 'Special Needs', details: 'Requires hearing aid, Left ear prosthesis', severity: 'Medium', createdAt: '2026-08-11', createdBy: 'Dr. Rostova' }
    ],
    consents: [
      { id: 'CNS-3', consentType: 'Treatment', accepted: true, version: 'v2.1', signedAt: '2026-08-11' }
    ]
  },
  {
    id: 'PAT-1003',
    mrn: 'MRN-88203',
    firstName: 'Sophia',
    lastName: 'Martinez',
    dateOfBirth: '1988-03-05',
    gender: 'Female',
    mobileNumber: '+61 422 100 300',
    email: 'sophia.m@example.com',
    address: '88 Victoria Road, Chatswood NSW',
    identificationType: 'Passport',
    identificationNumber: 'PA9820192',
    status: 'Active',
    preferredLanguage: 'Spanish',
    interpreterRequired: true,
    interpreterType: 'Spanish Medical Certified Interpreter',
    foodAllergies: [],
    drugAllergies: ['Aspirin'],
    registeredAt: '2026-08-12T14:20:00Z',
    alerts: [
      { id: 'ALT-4', alertType: 'Infection Risk', details: 'Previous ESBL positive, Contact Precautions', severity: 'High', createdAt: '2026-08-12', createdBy: 'Infection Control' }
    ],
    consents: [
      { id: 'CNS-4', consentType: 'Treatment', accepted: true, version: 'v2.1', signedAt: '2026-08-12' }
    ]
  },
  {
    id: 'PAT-1004',
    mrn: 'MRN-88204',
    firstName: 'Marcus',
    lastName: 'Brodie',
    dateOfBirth: '1974-09-18',
    gender: 'Male',
    mobileNumber: '+61 433 987 654',
    email: 'marcus.b@example.com',
    address: '12 George Street, Parramatta',
    identificationType: 'Medicare',
    identificationNumber: '4410-98123-1',
    status: 'Active',
    foodAllergies: ['Gluten'],
    drugAllergies: [],
    registeredAt: '2026-08-09T16:00:00Z',
    alerts: [
      { id: 'ALT-5', alertType: 'Infection Risk', details: 'MRSA Positive Sputum, Single Isolation Room Required', severity: 'High', createdAt: '2026-08-09', createdBy: 'Microbiology' }
    ],
    consents: []
  },
  {
    id: 'PAT-1005',
    mrn: 'MRN-88205',
    firstName: 'David',
    lastName: 'Kim',
    dateOfBirth: '1992-07-24',
    gender: 'Male',
    mobileNumber: '+61 401 555 333',
    email: 'david.kim@example.com',
    address: '30 Pitt Street, Sydney',
    identificationType: 'Driver Licence',
    identificationNumber: 'DL-908123A',
    status: 'Active',
    foodAllergies: [],
    drugAllergies: ['Codeine'],
    registeredAt: '2026-08-12T07:45:00Z',
    alerts: [],
    consents: [
      { id: 'CNS-5', consentType: 'Treatment', accepted: true, version: 'v2.1', signedAt: '2026-08-12' }
    ]
  },
  {
    id: 'PAT-1007',
    mrn: 'MRN-88207',
    firstName: 'Gordon',
    lastName: 'Ramsay',
    dateOfBirth: '1966-11-08',
    gender: 'Male',
    mobileNumber: '+61 400 111 222',
    email: 'g.ramsay@example.com',
    address: '1 Star Way, Darling Harbour',
    identificationType: 'Passport',
    identificationNumber: 'GB-881920',
    status: 'Active',
    foodAllergies: [],
    drugAllergies: ['Morphine'],
    registeredAt: '2026-08-08T02:10:00Z',
    alerts: [
      { id: 'ALT-6', alertType: 'Fall Risk', details: 'Sedated ICU patient', severity: 'Critical', createdAt: '2026-08-08', createdBy: 'ICU Team' }
    ],
    consents: []
  }
];

export const initialAdmissions: AdmissionEpisode[] = [
  {
    id: 'ADM-2001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-88201',
    encounterType: 'Planned Inpatient',
    status: 'Active Inpatient',
    admittedAt: '2026-08-10T09:00:00Z',
    admittingDoctor: 'Dr. Elena Rostova',
    specialty: 'Cardiology',
    primaryDiagnosis: 'Acute Coronary Syndrome / Non-STEMI',
    wardId: 'WARD-3A',
    wardName: 'Ward 3A Medical & Cardiology',
    bedId: 'BED-3A-01',
    bedNumber: '3A-01',
    isVIP: false,
    targetDischargeDate: '2026-08-14',
    readmissionRiskScore: 32
  },
  {
    id: 'ADM-2002',
    patientId: 'PAT-1002',
    patientName: 'Arthur Pendelton',
    patientMrn: 'MRN-88202',
    encounterType: 'Direct Ward',
    status: 'Active Inpatient',
    admittedAt: '2026-08-11T11:00:00Z',
    admittingDoctor: 'Dr. Marcus Vance',
    specialty: 'General Medicine',
    primaryDiagnosis: 'Exacerbation of COPD',
    wardId: 'WARD-3A',
    wardName: 'Ward 3A Medical & Cardiology',
    bedId: 'BED-3A-02',
    bedNumber: '3A-02',
    targetDischargeDate: '2026-08-15',
    readmissionRiskScore: 58
  },
  {
    id: 'ADM-2003',
    patientId: 'PAT-1005',
    patientName: 'David Kim',
    patientMrn: 'MRN-88205',
    encounterType: 'Planned Inpatient',
    status: 'In Surgery',
    admittedAt: '2026-08-12T08:00:00Z',
    admittingDoctor: 'Dr. Robert Chen',
    specialty: 'Orthopaedics',
    primaryDiagnosis: 'Right Anterior Cruciate Ligament Tear',
    wardId: 'WARD-4B',
    wardName: 'Ward 4B Surgical Ortho',
    bedId: 'BED-4B-01',
    bedNumber: '4B-01',
    targetDischargeDate: '2026-08-13'
  },
  {
    id: 'ADM-2004',
    patientId: 'PAT-1007',
    patientName: 'Gordon Ramsay',
    patientMrn: 'MRN-88207',
    encounterType: 'ICU',
    status: 'Active Inpatient',
    admittedAt: '2026-08-08T03:00:00Z',
    admittingDoctor: 'Dr. Marcus Vance',
    specialty: 'Intensive Care',
    primaryDiagnosis: 'Septic Shock secondary to Perforated Appendicitis',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit 2C',
    bedId: 'BED-ICU-01',
    bedNumber: 'ICU-01',
    isVIP: true,
    readmissionRiskScore: 78
  }
];

export const initialEDEncounters: EDEncounter[] = [
  {
    id: 'ED-3001',
    patientId: 'PAT-1010',
    patientName: 'James Carter',
    patientMrn: 'MRN-88210',
    patientAge: 45,
    patientGender: 'Male',
    arrivalMethod: 'Ambulance',
    arrivalTime: '2026-08-13T01:15:00Z',
    triageCategory: 1,
    presentingComplaint: 'Crushing Substernal Chest Pain & Diaphoresis',
    vitalSigns: { temperature: 36.8, pulse: 125, bloodPressure: '85/50', respiratoryRate: 28, oxygenSaturation: 91, painScore: 10, news2Score: 9 },
    assignedBay: 'Resus Bay 01',
    assignedDoctor: 'Dr. Sarah Jenkins',
    assignedNurse: 'RN Michael',
    status: 'In Treatment Bay',
    isResusRequired: true,
    ambulanceHandoverNotes: 'GTN x2 given pre-hospital, persistent hypotension, ST elevation V1-V4 on ECG',
    waitingTimeMinutes: 5,
    aiPriorityScore: 98
  },
  {
    id: 'ED-3002',
    patientId: 'PAT-1011',
    patientName: 'Linda O\'Connor',
    patientMrn: 'MRN-88211',
    patientAge: 68,
    patientGender: 'Female',
    arrivalMethod: 'Walk-in',
    arrivalTime: '2026-08-13T01:40:00Z',
    triageCategory: 2,
    presentingComplaint: 'Acute Stroke Symptoms - Right Sided Facial Droop & Hemiparesis',
    vitalSigns: { temperature: 37.1, pulse: 88, bloodPressure: '160/95', respiratoryRate: 18, oxygenSaturation: 97, painScore: 2, news2Score: 5 },
    assignedBay: 'Acute Bay 04',
    assignedDoctor: 'Dr. Frank Castle',
    assignedNurse: 'RN Sarah',
    status: 'In Treatment Bay',
    waitingTimeMinutes: 12,
    aiPriorityScore: 89
  },
  {
    id: 'ED-3003',
    patientId: 'PAT-1012',
    patientName: 'Timothy Vance',
    patientMrn: 'MRN-88212',
    patientAge: 29,
    patientGender: 'Male',
    arrivalMethod: 'Walk-in',
    arrivalTime: '2026-08-13T01:50:00Z',
    triageCategory: 3,
    presentingComplaint: 'Right Lower Quadrant Abdominal Pain, Nausea',
    vitalSigns: { temperature: 38.2, pulse: 96, bloodPressure: '128/78', respiratoryRate: 16, oxygenSaturation: 99, painScore: 7, news2Score: 3 },
    status: 'Triaged - Waiting Room',
    waitingTimeMinutes: 25,
    aiPriorityScore: 62
  },
  {
    id: 'ED-3004',
    patientId: 'PAT-1013',
    patientName: 'Hannah Abbott',
    patientMrn: 'MRN-88213',
    patientAge: 21,
    patientGender: 'Female',
    arrivalMethod: 'Walk-in',
    arrivalTime: '2026-08-13T02:00:00Z',
    triageCategory: 4,
    presentingComplaint: 'Laceration to Right Forearm, Bleeding Controlled',
    vitalSigns: { temperature: 36.6, pulse: 72, bloodPressure: '118/72', respiratoryRate: 14, oxygenSaturation: 100, painScore: 4, news2Score: 0 },
    status: 'Triaged - Waiting Room',
    waitingTimeMinutes: 15,
    aiPriorityScore: 30
  }
];

export const initialSurgicalCases: SurgicalCase[] = [
  {
    id: 'SURG-4001',
    patientId: 'PAT-1005',
    patientName: 'David Kim',
    patientMrn: 'MRN-88205',
    procedureName: 'Arthroscopic Right ACL Reconstruction & Meniscal Repair',
    specialty: 'Orthopaedics',
    surgeonName: 'Dr. Robert Chen',
    anaesthetistName: 'Dr. Claire Underwood',
    theatreName: 'Operating Theatre 02',
    scheduledStartTime: '2026-08-13T08:30:00Z',
    estimatedDurationMinutes: 120,
    actualIncisionTime: '2026-08-13T08:45:00Z',
    status: 'Incision Started',
    fastingVerified: true,
    consentVerified: true,
    allergiesVerified: true,
    siteMarked: true,
    timeoutCompleted: true,
    instrumentCountCorrect: true,
    swabCountCorrect: true
  },
  {
    id: 'SURG-4002',
    patientId: 'PAT-1006',
    patientName: 'Chloe Bennett',
    patientMrn: 'MRN-88206',
    procedureName: 'Laparoscopic Cholecystectomy',
    specialty: 'General Surgery',
    surgeonName: 'Dr. Gregory House',
    anaesthetistName: 'Dr. Claire Underwood',
    theatreName: 'Operating Theatre 01',
    scheduledStartTime: '2026-08-13T10:30:00Z',
    estimatedDurationMinutes: 90,
    status: 'Pre-Op Cleared',
    fastingVerified: true,
    consentVerified: true,
    allergiesVerified: true,
    siteMarked: true,
    timeoutCompleted: false
  }
];

export const initialICUPatients: ICUPatient[] = [
  {
    id: 'ICU-P-01',
    patientId: 'PAT-1007',
    patientName: 'Gordon Ramsay',
    patientMrn: 'MRN-88207',
    bedId: 'BED-ICU-01',
    bedNumber: 'ICU-01',
    consultantName: 'Dr. Marcus Vance',
    acuityLevel: 'ICU Level 3',
    ventilatorAssigned: true,
    ventilatorModel: 'Puritan Bennett 980',
    weaningTrialStatus: 'In Progress',
    ecmoAssigned: false,
    dialysisAssigned: true,
    news2Score: 7,
    dailyReviewCompletedToday: true,
    stepDownCandidate: false,
    familyMeetingScheduledAt: '2026-08-13T14:00:00Z'
  },
  {
    id: 'ICU-P-02',
    patientId: 'PAT-1008',
    patientName: 'Amelia Watson',
    patientMrn: 'MRN-88208',
    bedId: 'BED-ICU-02',
    bedNumber: 'ICU-02',
    consultantName: 'Dr. Marcus Vance',
    acuityLevel: 'HDU Level 2',
    ventilatorAssigned: false,
    ecmoAssigned: false,
    dialysisAssigned: false,
    news2Score: 3,
    dailyReviewCompletedToday: true,
    stepDownCandidate: true
  }
];

export const initialDiagnostics: DiagnosticRequest[] = [
  {
    id: 'DIAG-5001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-88201',
    type: 'Pathology',
    testName: 'Troponin I & Cardiac Enzymes Serial',
    modality: 'Blood Gas',
    clinicalIndication: 'Chest pain, rule out re-infarction',
    urgency: 'STAT / Emergency',
    requestedBy: 'Dr. Elena Rostova',
    requestedAt: '2026-08-13T01:30:00Z',
    status: 'Critical Result Alert',
    specimenBarcode: 'LAB-9920182-A',
    resultSummary: 'Troponin I = 14.8 ng/mL (CRITICAL HIGH - Normal <0.04 ng/mL)',
    isCritical: true,
    criticalAcknowledged: false
  },
  {
    id: 'DIAG-5002',
    patientId: 'PAT-1011',
    patientName: 'Linda O\'Connor',
    patientMrn: 'MRN-88211',
    type: 'Radiology',
    testName: 'CT Brain Non-Contrast & CT Perfusion Stroke Protocol',
    modality: 'CT',
    clinicalIndication: 'Acute onset focal neurological deficit <3h',
    urgency: 'STAT / Emergency',
    requestedBy: 'Dr. Frank Castle',
    requestedAt: '2026-08-13T01:45:00Z',
    status: 'Image Available',
    pacsStudyInstanceUid: '1.2.840.113619.2.55.3.2831192.8812',
    resultSummary: 'No acute intracranial hemorrhage. Left MCA territory early ischemic changes noted.'
  }
];

export const initialMedicationOrders: MedicationOrder[] = [
  {
    id: 'MED-6001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-88201',
    medicationName: 'Aspirin Dispersible',
    dosage: '300mg',
    route: 'Oral',
    frequency: 'Once STAT',
    durationDays: 1,
    prescribedBy: 'Dr. Elena Rostova',
    prescribedAt: '2026-08-13T01:35:00Z',
    isSTAT: true,
    isControlledDrug: false,
    isHighRisk: false,
    isChemotherapy: false,
    status: 'Delivered to Ward'
  },
  {
    id: 'MED-6002',
    patientId: 'PAT-1007',
    patientName: 'Gordon Ramsay',
    patientMrn: 'MRN-88207',
    medicationName: 'Fentanyl IV Infusion',
    dosage: '50 mcg/hr',
    route: 'IV',
    frequency: 'Continuous Infusion',
    durationDays: 3,
    prescribedBy: 'Dr. Marcus Vance',
    prescribedAt: '2026-08-12T18:00:00Z',
    isSTAT: false,
    isControlledDrug: true,
    isHighRisk: true,
    isChemotherapy: false,
    status: 'Administered',
    pharmacistVerifiedBy: 'Pharm. David Miller',
    dualAuthWitnessBy: 'RN Angela Davis'
  }
];

export const initialMealOrders: MealOrder[] = [
  {
    id: 'MEAL-7001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-88201',
    wardName: 'Ward 3A Medical',
    bedNumber: '3A-01',
    prescribedDiet: 'Low Sodium Cardiac',
    foodAllergies: ['Peanuts', 'Shellfish'],
    selectedMeal: 'Steamed Barramundi with Roasted Pumpkin & Green Beans (No Shellfish/Peanuts)',
    mealType: 'Lunch',
    orderStatus: 'Out for Delivery',
    trayInspectionPassed: true
  },
  {
    id: 'MEAL-7002',
    patientId: 'PAT-1002',
    patientName: 'Arthur Pendelton',
    patientMrn: 'MRN-88202',
    wardName: 'Ward 3A Medical',
    bedNumber: '3A-02',
    prescribedDiet: 'Diabetic Soft Diet',
    foodAllergies: ['Lactose'],
    selectedMeal: 'Lactose-Free Chicken Stew with Pureed Carrots & Brown Rice',
    mealType: 'Lunch',
    orderStatus: 'Delivered',
    trayInspectionPassed: true,
    intakePercentage: 75,
    deliveredAt: '2026-08-13T12:15:00Z'
  }
];

export const initialEVSTasks: EVSTask[] = [
  {
    id: 'EVS-8001',
    location: 'Bed 3A-03 (Ward 3A)',
    bedId: 'BED-3A-03',
    cleaningType: 'Patient Discharge',
    priority: 'High',
    requestedAt: '2026-08-13T01:00:00Z',
    assignedStaff: 'Housekeeper John',
    status: 'In Progress',
    decontaminationVerified: true
  },
  {
    id: 'EVS-8002',
    location: 'Isolation Room 1I-02',
    cleaningType: 'Terminal Isolation',
    priority: 'Emergency',
    requestedAt: '2026-08-13T01:45:00Z',
    status: 'Pending Dispatch',
    decontaminationVerified: false
  }
];

export const initialTransportTasks: TransportTask[] = [
  {
    id: 'TRN-9001',
    patientId: 'PAT-1011',
    patientName: 'Linda O\'Connor',
    patientMrn: 'MRN-88211',
    originLocation: 'Emergency Acute Bay 04',
    destinationLocation: 'CT Scanner 01 (Radiology Block B)',
    transportType: 'Stretcher',
    priority: 'Emergency',
    requestedBy: 'Dr. Frank Castle',
    requestedAt: '2026-08-13T01:42:00Z',
    assignedPorter: 'Porter Sam',
    status: 'In Transit',
    etaMinutes: 3
  }
];

export const initialMaintenanceWorkOrders: MaintenanceWorkOrder[] = [
  {
    id: 'WO-101',
    location: 'Ward 3A Nurse Station',
    assetName: 'Air Conditioning Duct Unit 3A',
    issueDescription: 'Temperature gauge reporting 28°C, cooling malfunction',
    category: 'HVAC',
    priority: 'High',
    requestedBy: 'Sr. Rachel Green',
    requestedAt: '2026-08-12T22:00:00Z',
    assignedTechnician: 'Tech Mark',
    status: 'In Repair',
    estimatedCost: 350
  }
];

export const initialMedicalDevices: MedicalDevice[] = [
  {
    id: 'DEV-201',
    assetId: 'AST-VENT-09',
    equipmentId: 'EQ-8812',
    name: 'Puritan Bennett 980 ICU Ventilator',
    category: 'Ventilator',
    manufacturer: 'Medtronic',
    model: 'PB980',
    serialNumber: 'SN-981200192',
    udi: '(01)008829102931(21)SN981200192',
    assignedDepartment: 'Intensive Care Unit',
    currentLocation: 'ICU Bed 01',
    status: 'Active Clinical',
    lastCalibratedAt: '2026-06-15',
    nextCalibrationDue: '2026-12-15',
    safetyTestPassed: true,
    hasActiveRecall: false,
    aiFailureRiskScore: 12
  },
  {
    id: 'DEV-202',
    assetId: 'AST-DEFIB-03',
    equipmentId: 'EQ-3310',
    name: 'ZOLL X Series Defibrillator',
    category: 'Defibrillator',
    manufacturer: 'ZOLL Medical',
    model: 'X Series Advanced',
    serialNumber: 'SN-331092',
    udi: '(01)0033109281(21)SN331092',
    assignedDepartment: 'Emergency Department',
    currentLocation: 'ED Resus Bay 01',
    status: 'Active Clinical',
    lastCalibratedAt: '2026-05-01',
    nextCalibrationDue: '2026-08-20',
    safetyTestPassed: true,
    hasActiveRecall: false,
    aiFailureRiskScore: 68
  }
];

export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'INV-301',
    itemCode: 'SKU-PPE-N95',
    name: 'N95 Respirator Masks Particulate (Box of 50)',
    category: 'PPE',
    storageLocation: 'Central Store Shelf A-12',
    currentStock: 120,
    reorderLevel: 50,
    maximumStock: 500,
    unitPrice: 45.00,
    isConsignmentStock: false,
    status: 'In Stock'
  },
  {
    id: 'INV-302',
    itemCode: 'SKU-IV-CATH-20G',
    name: 'Safety IV Catheter 20G Pink (Box of 100)',
    category: 'Medical Consumables',
    storageLocation: 'Central Store Shelf B-04',
    currentStock: 18,
    reorderLevel: 25,
    maximumStock: 200,
    unitPrice: 85.00,
    isConsignmentStock: false,
    status: 'Low Stock Alert'
  }
];

export const initialStaffMembers: StaffMember[] = [
  {
    id: 'STF-501',
    employeeId: 'EMP-9001',
    name: 'Dr. Sarah Jenkins',
    role: 'Doctor',
    department: 'Emergency Department',
    credentialsVerified: true,
    licenceExpiryDate: '2027-12-31',
    mandatoryTrainingCompliant: true,
    currentShiftStatus: 'Clocked In',
    activeShiftType: 'Night',
    weeklyHoursLogged: 36
  },
  {
    id: 'STF-502',
    employeeId: 'EMP-9002',
    name: 'Rachel Green',
    role: 'Nurse',
    department: 'General Medicine & Cardiology',
    assignedWard: 'Ward 3A Medical',
    credentialsVerified: true,
    licenceExpiryDate: '2027-06-30',
    mandatoryTrainingCompliant: true,
    currentShiftStatus: 'Clocked In',
    activeShiftType: 'Night',
    weeklyHoursLogged: 40
  },
  {
    id: 'STF-503',
    employeeId: 'EMP-9003',
    name: 'David Miller',
    role: 'Pharmacist',
    department: 'Pharmacy & Therapeutics',
    credentialsVerified: true,
    licenceExpiryDate: '2027-10-15',
    mandatoryTrainingCompliant: true,
    currentShiftStatus: 'Clocked In',
    activeShiftType: 'Night',
    weeklyHoursLogged: 38
  }
];

export const initialBreakGlassLogs: BreakGlassLog[] = [
  {
    id: 'BG-701',
    userId: 'STF-501',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'ED Consultant Doctor',
    patientId: 'PAT-1010',
    patientName: 'James Carter',
    justification: 'Emergency STEMI resuscitation in progress - immediate access to unlinked historical EMR medical records required to check anti-platelet contraindications.',
    activatedAt: '2026-08-13T01:20:00Z',
    expiresAt: '2026-08-13T03:20:00Z',
    actionsPerformed: ['Viewed Historical Cardiology Notes', 'Checked Allergy Profile', 'Reviewed prior Angiogram Report'],
    executiveReviewed: true
  }
];

export const initialExecutiveDecisions: ExecutiveDecision[] = [
  {
    id: 'DEC-801',
    decisionTitle: 'Activate ED Overflow Protocol & Open Surge Beds Ward 1I',
    rationale: 'ED Occupancy breached 92% threshold with 3 Category 1/2 arrivals in 30 minutes.',
    approvingExecutive: 'Dr. Marcus Vance (Chief Medical Officer / Command Centre Chair)',
    affectedDepartments: ['Emergency Department', 'Patient Flow', 'EVS', 'Pharmacy'],
    implementationDate: '2026-08-13',
    loggedAt: '2026-08-13T01:50:00Z'
  }
];

export const initialSurgeStatus: HospitalSurgeStatus = {
  activeCode: 'Normal (Green)',
  hospitalOccupancyPercent: 78,
  edBoardingCount: 2,
  icuAvailableBeds: 2,
  diversionActive: false,
  lastUpdated: '2026-08-13T02:15:00Z'
};

// Component Seed Aliases
export const initialDiagnosticOrders: any[] = [
  {
    id: 'DX-5001',
    patientName: 'Eleanor Vance',
    patientMrn: 'MRN-88201',
    testName: 'Troponin I & Cardiac Enzymes Serial',
    category: 'Pathology',
    urgency: 'Stat / Emergency',
    orderedTime: '01:30',
    status: 'Completed',
    resultSummary: 'Troponin I = 14.8 ng/mL (CRITICAL HIGH - Normal <0.04 ng/mL)',
    isCriticalResult: true
  },
  {
    id: 'DX-5002',
    patientName: 'Linda O\'Connor',
    patientMrn: 'MRN-88211',
    testName: 'CT Brain Non-Contrast & CT Perfusion',
    category: 'Radiology',
    urgency: 'Stat / Emergency',
    orderedTime: '01:45',
    status: 'Completed',
    resultSummary: 'No acute intracranial hemorrhage. Left MCA territory early ischemic changes.',
    pacsImageUrl: 'PACS-CT-8812'
  }
];

export const initialPrescriptions: any[] = [
  {
    id: 'RX-6001',
    patientName: 'Eleanor Vance',
    bedNumber: '3A-01',
    medicationName: 'Aspirin Dispersible',
    dosage: '300mg',
    route: 'Oral',
    frequency: 'Once STAT',
    prescribingDoctor: 'Dr. Elena Rostova',
    administered: false
  },
  {
    id: 'RX-6002',
    patientName: 'Gordon Ramsay',
    bedNumber: 'ICU-01',
    medicationName: 'Fentanyl IV Infusion',
    dosage: '50 mcg/hr',
    route: 'IV Continuous',
    frequency: 'Q24H',
    prescribingDoctor: 'Dr. Marcus Vance',
    highRiskCategory: 'Schedule 8 Controlled Drug',
    verifiedByPharmacist: 'Pharm. David Miller',
    administered: true,
    administeredByNurse1: 'RN Sarah Jenkins',
    administeredByNurse2: 'RN Michael Chang'
  }
];

export const initialEVSCleaningJobs: any[] = [
  {
    id: 'EVS-8001',
    bedNumber: '3A-03',
    wardName: 'Ward 3A Medical',
    cleanType: 'Terminal Clean (WF-213)',
    requestedTime: '01:00 AM',
    assignedStaff: 'Housekeeper John',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 'EVS-8002',
    bedNumber: '1I-02',
    wardName: 'Ward 1I Negative Pressure',
    cleanType: 'Terminal Isolation Clean',
    requestedTime: '01:45 AM',
    status: 'Requested',
    priority: 'Emergency',
    infectionPrecaution: 'Airborne Covid-19'
  }
];

export const initialPorterTasks: any[] = [
  {
    id: 'TRN-9001',
    patientName: 'Linda O\'Connor',
    taskType: 'Patient Transport',
    originLocation: 'Emergency Bay 04',
    destinationLocation: 'CT Scanner 01',
    priority: 'Stat',
    assignedPorter: 'Porter Sam',
    status: 'In Transit'
  }
];

export const initialMedicalAssets: any[] = [
  {
    id: 'AST-201',
    assetName: 'Puritan Bennett 980 ICU Ventilator',
    category: 'Biomedical / Ventilator',
    location: 'ICU Bed 01',
    status: 'In Service',
    nextCalibrationDate: '2026-12-15'
  },
  {
    id: 'AST-202',
    assetName: 'ZOLL X Series Defibrillator',
    category: 'Biomedical / Resus',
    location: 'ED Resus Bay 01',
    status: 'Under Maintenance',
    nextCalibrationDate: '2026-08-20',
    maintenanceNotes: 'Annual safety calibration in progress'
  }
];

export const initialSupplyInventory: any[] = [
  {
    id: 'INV-301',
    itemName: 'N95 Particulate Masks (Box 50)',
    category: 'PPE',
    location: 'Central Store A-12',
    currentStock: 120,
    parLevel: 50,
    unit: 'Boxes'
  },
  {
    id: 'INV-302',
    itemName: 'Safety IV Catheter 20G Pink',
    category: 'Medical Consumables',
    location: 'Ward 3A Utility Room',
    currentStock: 18,
    parLevel: 25,
    unit: 'Boxes'
  }
];

export const initialStaffShifts: any[] = [
  {
    id: 'STF-501',
    staffName: 'Dr. Sarah Jenkins',
    role: 'ED Consultant Physician',
    department: 'Emergency Department',
    shiftTime: '22:00 - 08:00 (Night)'
  },
  {
    id: 'STF-502',
    staffName: 'RN Rachel Green',
    role: 'Ward Sister',
    department: 'Ward 3A Medical',
    shiftTime: '22:00 - 07:00 (Night)',
    assignedPatientCount: 5,
    recommendedRatio: '1:4'
  }
];

export const initialSecurityIncidents: any[] = [
  {
    id: 'SEC-101',
    type: 'Emergency Panic Alarm Triggered',
    location: 'ED Triage Desk',
    description: 'Aggressive visitor demanding immediate non-urgent consultation.',
    resolved: false
  }
];

export const initialGovernanceIncidents: any[] = [
  {
    id: 'INC-801',
    title: 'Near Miss: Drug Allergen Warning Triggered',
    category: 'Medication Safety',
    severity: 'Minor',
    status: 'Under Review',
    description: 'eMAR prevented administration of Penicillin to patient with documented allergy.',
    reporterRole: 'Clinical Pharmacist',
    timestamp: '01:40 AM'
  }
];

export const initialHandovers: any[] = [
  {
    id: 'HO-01',
    patientName: 'Eleanor Vance',
    bedNumber: '3A-01',
    outgoingNurse: 'RN Michael (Evening)',
    incomingNurse: 'RN Sarah (Night)',
    sbarSituation: '81y F admitted with ACS / Non-STEMI. Chest pain resolved with GTN & Aspirin.',
    sbarBackground: 'Past history of Hypertension & Type 2 Diabetes.',
    sbarAssessment: 'Vitals stable. BP 130/80, HR 72, SpO2 98% on room air. Troponin serial pending.',
    sbarRecommendation: 'Repeat ECG at 04:00. Fasting for Diagnostic Angiogram tomorrow morning.',
    acknowledged: false
  }
];

