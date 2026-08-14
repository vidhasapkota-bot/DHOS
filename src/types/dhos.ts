/**
 * @license
 * Digital Hospital Operating System (DHOS) Enterprise Data Models & Interfaces
 */

// Enterprise Foundation
export interface HospitalConfig {
  id: string;
  name: string;
  code: string;
  financialYear: string;
  timeZone: string;
  publicHolidays: string[];
  workingWeek: string[];
  securityPolicy: {
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordExpiryDays: number;
  };
  aiSettings: {
    enabled: boolean;
    modelAlias: string;
    autoAssist: boolean;
  };
}

export interface Campus {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  address: string;
  status: 'Draft' | 'Configured' | 'Active' | 'Inactive';
  buildingsCount: number;
  totalBedCapacity: number;
}

export interface Building {
  id: string;
  campusId: string;
  name: string;
  code: string;
  floors: number;
  hasLiftAccess: boolean;
}

export interface Ward {
  id: string;
  buildingId: string;
  departmentId: string;
  name: string;
  code: string;
  wardType: 'Medical' | 'Surgical' | 'ICU' | 'HDU' | 'Paediatric' | 'Maternity' | 'Oncology' | 'Mental Health' | 'Rehabilitation' | 'Emergency Observation';
  capacity: number;
  occupiedCount: number;
  nurseStationPhone: string;
  isolationRoomsCount: number;
  wardManager: string;
}

export type BedStatus = 'Available' | 'Occupied' | 'Dirty' | 'Cleaning' | 'Inspection' | 'Reserved' | 'Out of Service' | 'Blocked';

export type BedType = 'General' | 'ICU' | 'HDU' | 'Isolation' | 'Negative Pressure' | 'Paediatric' | 'Maternity' | 'Mental Health' | 'Emergency' | 'Day Surgery';

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  buildingName: string;
  bedType: BedType;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientMrn?: string;
  isolationRequired?: boolean;
  isolationType?: string;
  cleaningPriority?: 'Low' | 'Medium' | 'High' | 'Emergency';
  cleaningAssignedTo?: string;
  reservedForPatientId?: string;
  maintenanceReason?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  manager: string;
  workingHours: string;
  escalationRule: string;
  hospitalId: string;
}

export interface ClinicalUnit {
  id: string;
  departmentId: string;
  name: string;
  leadDoctor: string;
  assignedBedsCount: number;
  specialty: string;
}

// Patient Registration & Identity
export type PatientGender = 'Male' | 'Female' | 'Other' | 'Unknown';
export type PatientStatus = 'Draft' | 'Registered' | 'Verified' | 'Active' | 'Deactivated' | 'Archived';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
  validated: boolean;
}

export interface PatientInsurance {
  fundingType: 'Medicare' | 'Private Insurance' | 'Workers Compensation' | 'Veterans Affairs' | 'Overseas Insurance' | 'Self-funded' | 'Government Scheme';
  providerName: string;
  policyNumber: string;
  membershipNumber: string;
  validated: boolean;
}

export interface PatientAlert {
  id: string;
  alertType: 'Fall Risk' | 'Allergy' | 'Infection Risk' | 'Violence Risk' | 'Wandering Risk' | 'Suicide Risk' | 'Special Needs' | 'Behaviour Alert';
  details: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  createdBy: string;
}

export interface PatientConsent {
  id: string;
  consentType: 'Treatment' | 'Privacy' | 'Research' | 'Photography' | 'Telehealth' | 'Data Sharing' | 'Organ Donation' | 'Blood Products';
  accepted: boolean;
  version: string;
  signedAt: string;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: PatientGender;
  mobileNumber: string;
  email: string;
  address: string;
  identificationType: 'Medicare' | 'Passport' | 'Driver Licence' | 'National ID' | 'Temporary';
  identificationNumber: string;
  status: PatientStatus;
  isUnknown?: boolean;
  isOverseas?: boolean;
  passportNumber?: string;
  visaType?: string;
  preferredLanguage?: string;
  interpreterRequired?: boolean;
  interpreterType?: string;
  nextOfKin?: EmergencyContact;
  emergencyContact?: EmergencyContact;
  insurance?: PatientInsurance;
  alerts: PatientAlert[];
  consents: PatientConsent[];
  foodAllergies: string[];
  drugAllergies: string[];
  registeredAt: string;
}

// Admissions & Encounters
export type EncounterType = 'Emergency' | 'Planned Inpatient' | 'Direct Ward' | 'ICU' | 'Day Surgery' | 'Outpatient' | 'Readmission';
export type EncounterStatus = 'Scheduled' | 'Checked In' | 'Triage' | 'Active Inpatient' | 'In Surgery' | 'In PACU' | 'Discharging' | 'Discharged' | 'Left AMA' | 'LWBS' | 'Cancelled';

export interface AdmissionEpisode {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  encounterType: EncounterType;
  status: EncounterStatus;
  admittedAt: string;
  admittingDoctor: string;
  specialty: string;
  primaryDiagnosis: string;
  wardId?: string;
  wardName?: string;
  bedId?: string;
  bedNumber?: string;
  isVIP?: boolean;
  isIsolationRequired?: boolean;
  isolationReason?: string;
  targetDischargeDate?: string;
  readmissionRiskScore?: number; // 0-100
}

// Emergency Department
export type TriageCategory = 1 | 2 | 3 | 4 | 5; // 1: Resuscitation (Immediate), 2: Emergency (10m), 3: Urgent (30m), 4: Semi-Urgent (60m), 5: Non-Urgent (120m)

export interface EDEncounter {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  patientGender: PatientGender;
  arrivalMethod: 'Ambulance' | 'Walk-in' | 'GP Referral' | 'Police' | 'Inter-Hospital Transfer' | 'Retrieval Service';
  arrivalTime: string;
  triageCategory?: TriageCategory;
  presentingComplaint?: string;
  vitalSigns?: {
    temperature: number;
    pulse: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
    painScore: number;
    news2Score: number;
  };
  assignedBay?: string;
  assignedDoctor?: string;
  assignedNurse?: string;
  status: 'Waiting Triage' | 'Triaged - Waiting Room' | 'In Treatment Bay' | 'Under Observation' | 'Boarding (Awaiting Bed)' | 'Discharged' | 'Admitted' | 'LWBS' | 'LAMA' | 'Deceased';
  isResusRequired?: boolean;
  ambulanceHandoverNotes?: string;
  waitingTimeMinutes: number;
  aiPriorityScore?: number;
}

// Operating Theatre
export interface SurgicalCase {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  procedureName: string;
  specialty: string;
  surgeonName: string;
  anaesthetistName: string;
  theatreName: string;
  scheduledStartTime: string;
  estimatedDurationMinutes: number;
  actualIncisionTime?: string;
  status: 'Scheduled' | 'Pre-Op Cleared' | 'In Theatre' | 'Incision Started' | 'In PACU Recovery' | 'Returned to Ward' | 'Cancelled' | 'Delayed';
  fastingVerified: boolean;
  consentVerified: boolean;
  allergiesVerified: boolean;
  siteMarked: boolean;
  timeoutCompleted: boolean;
  instrumentCountCorrect?: boolean;
  swabCountCorrect?: boolean;
  delayReason?: string;
}

// Critical Care (ICU)
export interface ICUPatient {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  bedId: string;
  bedNumber: string;
  consultantName: string;
  acuityLevel: 'ICU Level 3' | 'HDU Level 2' | 'CCU';
  ventilatorAssigned: boolean;
  ventilatorModel?: string;
  weaningTrialStatus?: 'Not Started' | 'In Progress' | 'Tolerated' | 'Failed';
  ecmoAssigned: boolean;
  dialysisAssigned: boolean;
  news2Score: number;
  dailyReviewCompletedToday: boolean;
  stepDownCandidate: boolean;
  familyMeetingScheduledAt?: string;
}

// Diagnostics (Pathology & Radiology)
export interface DiagnosticRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  type: 'Pathology' | 'Radiology' | 'Cardiology' | 'Endoscopy';
  testName: string;
  modality?: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound' | 'ECG' | 'Echo' | 'Blood Gas' | 'CBC' | 'Metabolic Panel';
  clinicalIndication: string;
  urgency: 'Routine' | 'Urgent' | 'STAT / Emergency';
  requestedBy: string;
  requestedAt: string;
  status: 'Requested' | 'Specimen Collected' | 'In Processing' | 'Image Available' | 'Reported' | 'Critical Result Alert';
  specimenBarcode?: string;
  resultSummary?: string;
  isCritical?: boolean;
  criticalAcknowledged?: boolean;
  pacsStudyInstanceUid?: string;
}

// Pharmacy & Medication Operations
export interface MedicationOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  medicationName: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'IM' | 'SC' | 'Inhalation' | 'Topical';
  frequency: string;
  durationDays: number;
  prescribedBy: string;
  prescribedAt: string;
  isSTAT: boolean;
  isControlledDrug: boolean;
  isHighRisk: boolean;
  isChemotherapy: boolean;
  status: 'Prescribed' | 'Pharmacist Verified' | 'Dispensed' | 'Delivered to Ward' | 'Administered' | 'Missed' | 'Refused' | 'Queried';
  pharmacistVerifiedBy?: string;
  dualAuthWitnessBy?: string;
  missedReason?: string;
  allergyWarning?: string;
}

// Nutrition & Meal Operations
export interface MealOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  wardName: string;
  bedNumber: string;
  prescribedDiet: string; // e.g. 'Diabetic', 'Low Sodium', 'Pureed', 'Halal'
  fluidRestrictionMl?: number;
  foodAllergies: string[];
  selectedMeal: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  orderStatus: 'Ordered' | 'Approved' | 'In Kitchen Production' | 'Tray Quality Inspected' | 'Out for Delivery' | 'Delivered' | 'Missed';
  trayInspectionPassed: boolean;
  intakePercentage?: number; // 0, 25, 50, 75, 100
  deliveredAt?: string;
}

// Environmental Services (EVS)
export interface EVSTask {
  id: string;
  location: string;
  bedId?: string;
  cleaningType: 'Routine' | 'Patient Discharge' | 'Terminal Isolation' | 'Emergency Spill' | 'Operating Theatre' | 'Public Area';
  priority: 'Routine' | 'Medium' | 'High' | 'Emergency';
  requestedAt: string;
  assignedStaff?: string;
  status: 'Pending Dispatch' | 'In Progress' | 'Awaiting Inspection' | 'Passed & Certified' | 'Failed - Rework Required';
  decontaminationVerified: boolean;
  certifiedBy?: string;
}

// Logistics & Patient Transport
export interface TransportTask {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  originLocation: string;
  destinationLocation: string;
  transportType: 'Wheelchair' | 'Stretcher' | 'Bed' | 'ICU Escort' | 'Emergency Porter' | 'Specimen' | 'Blood Product' | 'Equipment';
  priority: 'Routine' | 'Urgent' | 'Emergency';
  requestedBy: string;
  requestedAt: string;
  assignedPorter?: string;
  status: 'Queued' | 'Porter Dispatched' | 'In Transit' | 'Delivered' | 'Cancelled';
  receivingStaffSignoff?: string;
  etaMinutes?: number;
}

// Facilities Maintenance
export interface MaintenanceWorkOrder {
  id: string;
  location: string;
  assetName: string;
  issueDescription: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Building' | 'Doors/Windows' | 'Fire Systems' | 'Medical Gas';
  priority: 'Routine' | 'Medium' | 'High' | 'Emergency Outage';
  requestedBy: string;
  requestedAt: string;
  assignedTechnician?: string;
  status: 'Submitted' | 'Approved' | 'In Repair' | 'Quality Tested' | 'Closed';
  estimatedCost?: number;
  downtimeHours?: number;
}

// Biomedical Engineering
export interface MedicalDevice {
  id: string;
  assetId: string;
  equipmentId: string;
  name: string;
  category: 'Ventilator' | 'Infusion Pump' | 'ECG' | 'Patient Monitor' | 'Defibrillator' | 'Ultrasound' | 'Smart Bed';
  manufacturer: string;
  model: string;
  serialNumber: string;
  udi: string;
  assignedDepartment: string;
  currentLocation: string;
  status: 'Active Clinical' | 'Awaiting Commissioning' | 'In Calibration' | 'In Repair' | 'Quarantined / Recall' | 'Retired';
  lastCalibratedAt: string;
  nextCalibrationDue: string;
  safetyTestPassed: boolean;
  hasActiveRecall: boolean;
  aiFailureRiskScore?: number; // 0-100
}

// Supply Chain & Inventory
export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'Medical Consumables' | 'Surgical Supplies' | 'PPE' | 'Laboratory Supplies' | 'Pharmaceuticals' | 'Kitchen Supplies' | 'Engineering Parts';
  storageLocation: string;
  currentStock: number;
  reorderLevel: number;
  maximumStock: number;
  unitPrice: number;
  batchNumber?: string;
  expiryDate?: string;
  isConsignmentStock: boolean;
  status: 'In Stock' | 'Low Stock Alert' | 'Critical Shortage' | 'Expired Quarantined' | 'Recalled';
}

// Workforce & Staff Operations
export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  role: 'Enterprise Administrator' | 'Hospital Administrator' | 'Doctor' | 'Nurse' | 'Bed Manager' | 'Triage Nurse' | 'Pharmacist' | 'EVS Supervisor' | 'Porter' | 'Biomedical Engineer' | 'Dietitian';
  department: string;
  clinicalUnit?: string;
  assignedWard?: string;
  credentialsVerified: boolean;
  licenceExpiryDate: string;
  mandatoryTrainingCompliant: boolean;
  currentShiftStatus: 'Off Duty' | 'Clocked In' | 'On Break' | 'Redeployed' | 'On Leave';
  activeShiftType?: 'Morning' | 'Afternoon' | 'Night' | 'On Call';
  weeklyHoursLogged: number;
  fatigueRiskAlert?: boolean;
}

export interface BreakGlassLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  patientId: string;
  patientName: string;
  justification: string;
  activatedAt: string;
  expiresAt: string;
  actionsPerformed: string[];
  executiveReviewed: boolean;
}

// Command Centre & AI Decision Intelligence
export interface ExecutiveDecision {
  id: string;
  decisionTitle: string;
  rationale: string;
  approvingExecutive: string;
  affectedDepartments: string[];
  implementationDate: string;
  loggedAt: string;
}

export interface HospitalSurgeStatus {
  activeCode: 'Normal (Green)' | 'Capacity Pressure (Yellow)' | 'Overcrowding (Orange)' | 'Code Red Surge / Mass Casualty';
  hospitalOccupancyPercent: number;
  edBoardingCount: number;
  icuAvailableBeds: number;
  diversionActive: boolean;
  lastUpdated: string;
}

export interface AIQueryResponse {
  query: string;
  answer: string;
  supportingEvidence: {
    title: string;
    sourceDomain: string;
    timestamp: string;
  }[];
  confidenceScore: number;
}

// Component Interface Aliases
export type DiagnosticOrder = any;
export type MedicationPrescription = any;
export type EVSCleaningJob = any;
export type PorterTask = any;
export type MedicalAsset = any;
export type SupplyInventoryItem = InventoryItem | any;
export type StaffShift = any;
export type SecurityIncident = any;
export type GovernanceIncident = any;
export type WardHandover = any;

