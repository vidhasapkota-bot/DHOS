import React, { useState } from 'react';
import {
  initialHospitalConfig,
  initialSurgeStatus,
  initialExecutiveDecisions,
  initialBeds,
  initialWards,
  initialPatients,
  initialEDEncounters,
  initialICUPatients,
  initialSurgicalCases,
  initialDiagnosticOrders,
  initialPrescriptions,
  initialMealOrders,
  initialEVSCleaningJobs,
  initialPorterTasks,
  initialMedicalAssets,
  initialSupplyInventory,
  initialStaffShifts,
  initialSecurityIncidents,
  initialGovernanceIncidents,
  initialHandovers
} from './data/dhosSeedData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandCentreView } from './components/CommandCentreView';
import { PatientRegistrationView } from './components/PatientRegistrationView';
import { BedManagementView } from './components/BedManagementView';
import { EmergencyDepartmentView } from './components/EmergencyDepartmentView';
import { OperatingTheatreView } from './components/OperatingTheatreView';
import { ICUView } from './components/ICUView';
import { WardsClinicalView } from './components/WardsClinicalView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { PharmacyView } from './components/PharmacyView';
import { NutritionView } from './components/NutritionView';
import { EVSView } from './components/EVSView';
import { LogisticsView } from './components/LogisticsView';
import { FacilitiesBiomedicalView } from './components/FacilitiesBiomedicalView';
import { SupplyChainView } from './components/SupplyChainView';
import { WorkforceView } from './components/WorkforceView';
import { GRACView } from './components/GRACView';

import { AIAssistantModal } from './components/AIAssistantModal';
import { BreakGlassModal } from './components/BreakGlassModal';

import {
  Bed,
  Ward,
  Patient,
  EDEncounter,
  ICUPatient,
  SurgicalCase,
  DiagnosticOrder,
  MedicationPrescription,
  MealOrder,
  EVSCleaningJob,
  PorterTask,
  MedicalAsset,
  SupplyInventoryItem,
  StaffShift,
  SecurityIncident,
  GovernanceIncident,
  WardHandover,
  HospitalSurgeStatus,
  ExecutiveDecision
} from './types/dhos';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('command-centre');

  // Application Domain States
  const [surgeStatus, setSurgeStatus] = useState<HospitalSurgeStatus>(initialSurgeStatus);
  const [executiveDecisions, setExecutiveDecisions] = useState<ExecutiveDecision[]>(initialExecutiveDecisions);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [wards, setWards] = useState<Ward[]>(initialWards);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [edEncounters, setEdEncounters] = useState<EDEncounter[]>(initialEDEncounters);
  const [icuPatients, setIcuPatients] = useState<ICUPatient[]>(initialICUPatients);
  const [surgicalCases, setSurgicalCases] = useState<SurgicalCase[]>(initialSurgicalCases);
  const [diagnosticOrders, setDiagnosticOrders] = useState<DiagnosticOrder[]>(initialDiagnosticOrders);
  const [prescriptions, setPrescriptions] = useState<MedicationPrescription[]>(initialPrescriptions);
  const [mealOrders, setMealOrders] = useState<MealOrder[]>(initialMealOrders);
  const [evsJobs, setEvsJobs] = useState<EVSCleaningJob[]>(initialEVSCleaningJobs);
  const [porterTasks, setPorterTasks] = useState<PorterTask[]>(initialPorterTasks);
  const [medicalAssets, setMedicalAssets] = useState<MedicalAsset[]>(initialMedicalAssets);
  const [inventory, setInventory] = useState<SupplyInventoryItem[]>(initialSupplyInventory);
  const [staffShifts, setStaffShifts] = useState<StaffShift[]>(initialStaffShifts);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(initialSecurityIncidents);
  const [governanceIncidents, setGovernanceIncidents] = useState<GovernanceIncident[]>(initialGovernanceIncidents);
  const [handovers, setHandovers] = useState<WardHandover[]>(initialHandovers);

  // Modal & Navigation Drawer States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBreakGlassModalOpen, setIsBreakGlassModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [breakGlassActive, setBreakGlassActive] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState<string | null>(null);

  // Handler Functions

  // Bed Management Actions
  const handleAssignBed = (bedId: string, patientName: string, patientMrn: string, specialty: string) => {
    setBeds(prev => prev.map(b => b.id === bedId ? {
      ...b,
      status: 'Occupied',
      assignedPatientName: patientName,
      assignedPatientMrn: patientMrn,
      assignedSpecialty: specialty,
      isClean: true
    } : b));
  };

  const handleDischargeBed = (bedId: string) => {
    setBeds(prev => prev.map(b => b.id === bedId ? {
      ...b,
      status: 'Dirty / Pending Clean',
      assignedPatientName: undefined,
      assignedPatientMrn: undefined,
      assignedSpecialty: undefined,
      isClean: false
    } : b));

    // Also trigger EVS Job
    const targetBed = beds.find(b => b.id === bedId);
    if (targetBed) {
      const newEvsJob: EVSCleaningJob = {
        id: `EVS-${Math.floor(100 + Math.random() * 900)}`,
        bedNumber: targetBed.bedNumber,
        wardName: targetBed.wardName,
        cleanType: 'Terminal Clean (WF-213)',
        requestedTime: 'Just Now',
        status: 'Requested',
        priority: 'High'
      };
      setEvsJobs(prev => [newEvsJob, ...prev]);
    }
  };

  // ED Actions
  const handleAddTriageEncounter = (data: Partial<EDEncounter>) => {
    const newEncounter: EDEncounter = {
      id: `ED-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientMrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: data.patientName || 'Unknown Patient',
      patientAge: data.patientAge || 30,
      patientGender: data.patientGender || 'Male',
      arrivalMethod: data.arrivalMethod || 'Walk-in',
      triageCategory: data.triageCategory || 3,
      presentingComplaint: data.presentingComplaint || 'Chest pain / Shortness of breath',
      arrivalTime: 'Just Now',
      waitingTimeMinutes: 0,
      status: 'Waiting Triage',
      aiPriorityScore: 8.5
    };
    setEdEncounters(prev => [newEncounter, ...prev]);
  };

  // OT Actions
  const handleCompleteTimeout = (caseId: string) => {
    setSurgicalCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      timeoutCompleted: true,
      status: 'Incision Started',
      incisionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : c));
  };

  const handleVerifyCounts = (caseId: string, instruments: boolean, swabs: boolean) => {
    setSurgicalCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      instrumentCountCorrect: instruments,
      swabCountCorrect: swabs,
      status: 'Post-Op PACU Recovery'
    } : c));
  };

  // ICU Actions
  const handleUpdateWeaningStatus = (id: string, status: 'Not Started' | 'In Progress' | 'Tolerated' | 'Failed') => {
    setIcuPatients(prev => prev.map(p => p.id === id ? { ...p, weaningTrialStatus: status } : p));
  };

  // Ward Actions
  const handleAcknowledgeHandover = (id: string) => {
    setHandovers(prev => prev.map(h => h.id === id ? { ...h, acknowledged: true } : h));
  };

  // Diagnostics Actions
  const handleOrderDiagnostic = (order: Partial<DiagnosticOrder>) => {
    const newOrder: DiagnosticOrder = {
      id: `DX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: order.patientName || 'Patient',
      patientMrn: order.patientMrn || 'MRN-00000',
      testName: order.testName || 'Full Blood Count',
      category: order.category || 'Pathology',
      urgency: order.urgency || 'Routine',
      orderedTime: 'Just Now',
      status: 'Ordered'
    };
    setDiagnosticOrders(prev => [newOrder, ...prev]);
  };

  const handleFlagCriticalResult = (id: string) => {
    setDiagnosticOrders(prev => prev.map(o => o.id === id ? { ...o, isCriticalResult: true } : o));
  };

  // Pharmacy Actions
  const handleAdministerMedication = (id: string, nurse1: string, nurse2?: string) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? {
      ...p,
      administered: true,
      administeredByNurse1: nurse1,
      administeredByNurse2: nurse2,
      lastAdministeredTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : p));
  };

  const handleVerifyPharmacy = (id: string, pharmacist: string) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, verifiedByPharmacist: pharmacist } : p));
  };

  // Nutrition Actions
  const handleDeliverMeal = (orderId: string) => {
    setMealOrders(prev => prev.map(m => m.id === orderId ? { ...m, status: 'Delivered' } : m));
  };

  // EVS Actions
  const handleCompleteEvsJob = (jobId: string) => {
    setEvsJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Completed' } : j));
  };

  // Porter Actions
  const handleCompletePorterTask = (taskId: string) => {
    setPorterTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
  };

  // Facilities Actions
  const handleCompleteMaintenance = (assetId: string) => {
    setMedicalAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'In Service' } : a));
  };

  // Supply Chain Actions
  const handleRestockItem = (itemId: string) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, currentStock: i.parLevel + 20 } : i));
  };

  // Security Actions
  const handleAcknowledgeSecurityIncident = (incidentId: string) => {
    setSecurityIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, resolved: true } : i));
  };

  // Governance / Break-Glass
  const handleExecuteBreakGlass = (reason: string, userRole: string) => {
    setBreakGlassActive(true);
    setBreakGlassReason(reason);
    const newIncident: GovernanceIncident = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      title: 'EMERGENCY BREAK-GLASS SYSTEM OVERRIDE EXECUTED',
      category: 'Information Governance',
      severity: 'Major',
      status: 'Under Investigation',
      description: `Break-Glass Override executed by ${userRole}. Justification: "${reason}".`,
      reporterRole: userRole,
      timestamp: new Date().toLocaleTimeString()
    };
    setGovernanceIncidents(prev => [newIncident, ...prev]);
  };

  const kpis = {
    totalBeds: (beds || []).length,
    occupiedBeds: (beds || []).filter(b => b.status === 'Occupied').length,
    dirtyBeds: (beds || []).filter(b => b.status === 'Dirty / Pending Clean' || b.status === 'Cleaning').length,
    availableBeds: (beds || []).filter(b => b.status === 'Available').length,
    occupancyPercent: Math.round((((beds || []).filter(b => b.status === 'Occupied').length) / ((beds || []).length || 1)) * 100),
    edWaiting: (edEncounters || []).filter(e => e.status?.includes('Waiting')).length,
    edBoarding: (edEncounters || []).filter(e => e.status === 'Boarding (Awaiting Bed)').length,
    otInProgress: (surgicalCases || []).filter(c => c.status === 'Incision Started' || c.status === 'In PACU').length,
    pendingEVS: (evsJobs || []).filter(j => j.status !== 'Completed' && j.status !== 'Passed & Certified').length,
    pendingLogistics: (porterTasks || []).filter(p => p.status !== 'Completed').length,
    pendingPharmacyVerify: (prescriptions || []).filter(p => !p.verifiedByPharmacist).length,
    criticalDiagnosticAlerts: (diagnosticOrders || []).filter(d => d.isCriticalResult).length
  };

  const commandAlerts = [
    ...(diagnosticOrders || []).filter(d => d.isCriticalResult).map(d => ({ type: 'Critical Diagnostic Alert', text: `${d.patientName} (${d.patientMrn}): ${d.testName} - ${d.resultSummary}` })),
    ...(securityIncidents || []).filter(s => !s.resolved).map(s => ({ type: 'Security Alert', text: `${s.type} at ${s.location}: ${s.description}` })),
    ...(kpis.occupancyPercent > 85 ? [{ type: 'Capacity Warning', text: 'Hospital Bed Occupancy exceeds 85% threshold. Consider initiating Surge Discharge Protocol.' }] : [])
  ];

  const handleUpdateSurgeStatus = (code: 'Normal (Green)' | 'Capacity Pressure (Yellow)' | 'Overcrowding (Orange)' | 'Code Red Surge / Mass Casualty') => {
    setSurgeStatus(prev => ({ ...prev, activeCode: code }));
  };

  const handleLogDecision = (title: string, rationale: string, exec: string, depts: string[]) => {
    const newDecision: ExecutiveDecision = {
      id: `DEC-${Math.floor(100 + Math.random() * 900)}`,
      decisionTitle: title,
      rationale,
      approvingExecutive: exec,
      affectedDepartments: depts,
      implementationDate: new Date().toISOString().split('T')?.[0] || '',
      loggedAt: new Date().toISOString()
    };
    setExecutiveDecisions(prev => [newDecision, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header & Operational Bar */}
      <Header
        config={initialHospitalConfig}
        surgeStatus={surgeStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPatient={() => setActiveTab('patients')}
        onOpenBreakGlass={() => setIsBreakGlassModalOpen(true)}
        onOpenAIAssistant={() => setIsAiModalOpen(true)}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        criticalAlertsCount={
          (diagnosticOrders || []).filter(d => d.isCriticalResult).length +
          (securityIncidents || []).filter(s => !s.resolved).length
        }
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          criticalAlertsCount={
            (diagnosticOrders || []).filter(d => d.isCriticalResult).length +
            (securityIncidents || []).filter(s => !s.resolved).length
          }
        />

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 max-w-[1600px] mx-auto p-4 sm:p-6 overflow-y-auto">
        {(activeTab === 'command-centre' || activeTab === 'command') && (
          <CommandCentreView
            kpis={kpis}
            surgeStatus={surgeStatus}
            executiveDecisions={executiveDecisions}
            alerts={commandAlerts}
            onUpdateSurgeStatus={handleUpdateSurgeStatus}
            onLogDecision={handleLogDecision}
            onNavigateTab={setActiveTab}
          />
        )}

        {(activeTab === 'patient-registration' || activeTab === 'patients') && (
          <PatientRegistrationView
            patients={patients}
            onRegisterPatient={(pData) => {
              // Auto assign to ED or Ward
              handleAddTriageEncounter({
                patientName: pData.patientName,
                patientAge: pData.patientAge,
                patientGender: pData.gender,
                arrivalMethod: 'Walk-in',
                presentingComplaint: pData.presentingComplaint,
                triageCategory: 4
              });
              setActiveTab('emergency');
            }}
          />
        )}

        {(activeTab === 'bed-management' || activeTab === 'beds') && (
          <BedManagementView
            wards={wards}
            beds={beds}
            patients={patients}
            onAssignBed={handleAssignBed}
            onDischargeBed={handleDischargeBed}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyDepartmentView
            encounters={edEncounters}
            onAddTriageEncounter={handleAddTriageEncounter}
          />
        )}

        {(activeTab === 'operating-theatre' || activeTab === 'theatre') && (
          <OperatingTheatreView
            cases={surgicalCases}
            onCompleteTimeout={handleCompleteTimeout}
            onVerifyCounts={handleVerifyCounts}
          />
        )}

        {activeTab === 'icu' && (
          <ICUView
            icuPatients={icuPatients}
            onUpdateWeaningStatus={handleUpdateWeaningStatus}
          />
        )}

        {(activeTab === 'wards-clinical' || activeTab === 'wards') && (
          <WardsClinicalView
            handovers={handovers}
            onAcknowledgeHandover={handleAcknowledgeHandover}
          />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticsView
            orders={diagnosticOrders}
            onOrderDiagnostic={handleOrderDiagnostic}
            onFlagCriticalResult={handleFlagCriticalResult}
          />
        )}

        {activeTab === 'pharmacy' && (
          <PharmacyView
            prescriptions={prescriptions}
            onAdministerMedication={handleAdministerMedication}
            onVerifyPharmacy={handleVerifyPharmacy}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            mealOrders={mealOrders}
            onDeliverMeal={handleDeliverMeal}
          />
        )}

        {activeTab === 'evs' && (
          <EVSView
            cleaningJobs={evsJobs}
            onCompleteJob={handleCompleteEvsJob}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsView
            porterTasks={porterTasks}
            onCompletePorterTask={handleCompletePorterTask}
          />
        )}

        {(activeTab === 'facilities-biomedical' || activeTab === 'facilities') && (
          <FacilitiesBiomedicalView
            assets={medicalAssets}
            onCompleteMaintenance={handleCompleteMaintenance}
          />
        )}

        {(activeTab === 'supply-chain' || activeTab === 'supply') && (
          <SupplyChainView
            inventory={inventory}
            onRestockItem={handleRestockItem}
          />
        )}

        {activeTab === 'workforce' && (
          <WorkforceView
            shifts={staffShifts}
            securityIncidents={securityIncidents}
            onAcknowledgeSecurityIncident={handleAcknowledgeSecurityIncident}
          />
        )}

        {activeTab === 'grac' && (
          <GRACView
            incidents={governanceIncidents}
            onReportIncident={(inc) => {
              const newIncident: GovernanceIncident = {
                id: `INC-${Math.floor(100 + Math.random() * 900)}`,
                title: inc.title || 'Reported Incident',
                category: inc.category || 'Clinical Operations',
                severity: inc.severity || 'Minor',
                status: 'Under Investigation',
                description: inc.description || 'No additional details.',
                reporterRole: 'Registered Nurse',
                timestamp: new Date().toLocaleTimeString()
              };
              setGovernanceIncidents(prev => [newIncident, ...prev]);
            }}
          />
        )}
      </main>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        hospitalDataSummary={{
          totalBeds: (beds || []).length,
          occupiedBeds: (beds || []).filter(b => b.status === 'Occupied').length,
          edWaiting: (edEncounters || []).filter(e => e.status?.includes('Waiting')).length,
          activeSurgeries: (surgicalCases || []).filter(c => c.status === 'Incision Started').length,
          highRiskMedsDue: (prescriptions || []).filter(p => !p.administered && p.highRiskCategory).length
        }}
      />

      {/* Break Glass Modal */}
      <BreakGlassModal
        isOpen={isBreakGlassModalOpen}
        onClose={() => setIsBreakGlassModalOpen(false)}
        onExecuteBreakGlass={handleExecuteBreakGlass}
      />
    </div>
  );
}
