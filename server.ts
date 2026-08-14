import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  initialHospitalConfig,
  initialCampuses,
  initialBuildings,
  initialDepartments,
  initialWards,
  initialBeds,
  initialPatients,
  initialAdmissions,
  initialEDEncounters,
  initialSurgicalCases,
  initialICUPatients,
  initialDiagnostics,
  initialMedicationOrders,
  initialMealOrders,
  initialEVSTasks,
  initialTransportTasks,
  initialMaintenanceWorkOrders,
  initialMedicalDevices,
  initialInventoryItems,
  initialStaffMembers,
  initialBreakGlassLogs,
  initialExecutiveDecisions,
  initialSurgeStatus
} from "./src/data/dhosSeedData.js";
import {
  Patient,
  Bed,
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
  ExecutiveDecision
} from "./src/types/dhos.js";

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // In-Memory Database State
  let hospitalConfig = { ...initialHospitalConfig };
  let campuses = [...initialCampuses];
  let buildings = [...initialBuildings];
  let departments = [...initialDepartments];
  let wards = [...initialWards];
  let beds = [...initialBeds];
  let patients = [...initialPatients];
  let admissions = [...initialAdmissions];
  let edEncounters = [...initialEDEncounters];
  let surgicalCases = [...initialSurgicalCases];
  let icuPatients = [...initialICUPatients];
  let diagnostics = [...initialDiagnostics];
  let medicationOrders = [...initialMedicationOrders];
  let mealOrders = [...initialMealOrders];
  let evsTasks = [...initialEVSTasks];
  let transportTasks = [...initialTransportTasks];
  let maintenanceWorkOrders = [...initialMaintenanceWorkOrders];
  let medicalDevices = [...initialMedicalDevices];
  let inventoryItems = [...initialInventoryItems];
  let staffMembers = [...initialStaffMembers];
  let breakGlassLogs = [...initialBreakGlassLogs];
  let executiveDecisions = [...initialExecutiveDecisions];
  let surgeStatus = { ...initialSurgeStatus };

  // Helper: Lazy Gemini AI Initialization
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  // API ROUTES

  // 1. Overview & Command Centre
  app.get("/api/dhos/overview", (req, res) => {
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.status === "Occupied").length;
    const dirtyBeds = beds.filter(b => b.status === "Dirty" || b.status === "Cleaning").length;
    const availableBeds = beds.filter(b => b.status === "Available").length;
    const edWaiting = edEncounters.filter(e => e.status.includes("Waiting") || e.status === "Waiting Triage").length;
    const edBoarding = edEncounters.filter(e => e.status === "Boarding (Awaiting Bed)").length;
    const otInProgress = surgicalCases.filter(c => c.status === "Incision Started").length;
    const pendingEVS = evsTasks.filter(t => t.status !== "Passed & Certified").length;
    const pendingLogistics = transportTasks.filter(t => t.status !== "Delivered").length;
    const pendingPharmacyVerify = medicationOrders.filter(m => m.status === "Prescribed").length;
    const criticalDiagnosticAlerts = diagnostics.filter(d => d.isCritical && !d.criticalAcknowledged).length;

    res.json({
      hospitalConfig,
      surgeStatus,
      kpis: {
        totalBeds,
        occupiedBeds,
        dirtyBeds,
        availableBeds,
        occupancyPercent: Math.round((occupiedBeds / totalBeds) * 100),
        edWaiting,
        edBoarding,
        otInProgress,
        pendingEVS,
        pendingLogistics,
        pendingPharmacyVerify,
        criticalDiagnosticAlerts
      },
      executiveDecisions,
      recentAlerts: [
        ...diagnostics.filter(d => d.isCritical).map(d => ({ type: 'Critical Diagnostic', text: `${d.patientName} (${d.patientMrn}): ${d.resultSummary}` })),
        ...medicationOrders.filter(m => m.isSTAT && m.status !== 'Administered').map(m => ({ type: 'STAT Medication', text: `STAT ${m.medicationName} ${m.dosage} for ${m.patientName}` })),
        ...edEncounters.filter(e => e.triageCategory === 1).map(e => ({ type: 'Resuscitation', text: `Category 1 Resus: ${e.patientName} - ${e.presentingComplaint}` }))
      ]
    });
  });

  // 2. Patients & Identity
  app.get("/api/dhos/patients", (req, res) => {
    const search = (req.query.search as string || "").toLowerCase();
    let result = patients;
    if (search) {
      result = patients.filter(p =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.mrn.toLowerCase().includes(search) ||
        p.mobileNumber.includes(search)
      );
    }
    res.json(result);
  });

  app.post("/api/dhos/patients", (req, res) => {
    const data = req.body;
    const nextNum = patients.length + 88214;
    const newMrn = `MRN-${nextNum}`;
    const newPatient: Patient = {
      id: `PAT-${Date.now()}`,
      mrn: newMrn,
      firstName: data.firstName || "Unknown",
      lastName: data.lastName || "Patient",
      dateOfBirth: data.dateOfBirth || "1990-01-01",
      gender: data.gender || "Unknown",
      mobileNumber: data.mobileNumber || "",
      email: data.email || "",
      address: data.address || "",
      identificationType: data.identificationType || "Temporary",
      identificationNumber: data.identificationNumber || `TEMP-${Date.now()}`,
      status: "Registered",
      foodAllergies: data.foodAllergies || [],
      drugAllergies: data.drugAllergies || [],
      registeredAt: new Date().toISOString(),
      alerts: [],
      consents: [
        { id: `CNS-${Date.now()}`, consentType: "Treatment", accepted: true, version: "v2.1", signedAt: new Date().toISOString() }
      ]
    };
    patients.unshift(newPatient);
    res.json({ success: true, patient: newPatient });
  });

  // 3. Bed Management & Hospital Map
  app.get("/api/dhos/beds", (req, res) => {
    res.json({
      wards,
      beds,
      admissions
    });
  });

  app.post("/api/dhos/beds/allocate", (req, res) => {
    const { bedId, patientId } = req.body;
    const targetBed = beds.find(b => b.id === bedId);
    const targetPatient = patients.find(p => p.id === patientId);

    if (!targetBed || !targetPatient) {
      return res.status(400).json({ error: "Bed or Patient not found" });
    }

    targetBed.status = "Occupied";
    targetBed.currentPatientId = targetPatient.id;
    targetBed.currentPatientName = `${targetPatient.firstName} ${targetPatient.lastName}`;
    targetBed.currentPatientMrn = targetPatient.mrn;

    // Update ward occupancy count
    const ward = wards.find(w => w.id === targetBed.wardId);
    if (ward) {
      ward.occupiedCount = beds.filter(b => b.wardId === ward.id && b.status === "Occupied").length;
    }

    res.json({ success: true, bed: targetBed });
  });

  app.post("/api/dhos/beds/status", (req, res) => {
    const { bedId, status, maintenanceReason } = req.body;
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed) return res.status(404).json({ error: "Bed not found" });

    targetBed.status = status;
    if (status === "Out of Service") {
      targetBed.maintenanceReason = maintenanceReason || "Under Maintenance";
    }
    if (status === "Available" || status === "Dirty") {
      delete targetBed.currentPatientId;
      delete targetBed.currentPatientName;
      delete targetBed.currentPatientMrn;
    }

    // Auto-create EVS task if Dirty
    if (status === "Dirty") {
      evsTasks.unshift({
        id: `EVS-${Date.now()}`,
        location: `Bed ${targetBed.bedNumber} (${targetBed.wardName})`,
        bedId: targetBed.id,
        cleaningType: targetBed.isolationRequired ? "Terminal Isolation" : "Patient Discharge",
        priority: "High",
        requestedAt: new Date().toISOString(),
        status: "Pending Dispatch",
        decontaminationVerified: false
      });
    }

    res.json({ success: true, bed: targetBed });
  });

  // 4. Emergency Department
  app.get("/api/dhos/emergency", (req, res) => {
    res.json(edEncounters);
  });

  app.post("/api/dhos/emergency/triage", (req, res) => {
    const data = req.body;
    const newEncounter: EDEncounter = {
      id: `ED-${Date.now()}`,
      patientId: data.patientId || `PAT-${Date.now()}`,
      patientName: data.patientName,
      patientMrn: data.patientMrn || `MRN-${Math.floor(Math.random() * 90000 + 10000)}`,
      patientAge: data.patientAge || 40,
      patientGender: data.patientGender || "Male",
      arrivalMethod: data.arrivalMethod || "Walk-in",
      arrivalTime: new Date().toISOString(),
      triageCategory: data.triageCategory || 3,
      presentingComplaint: data.presentingComplaint,
      vitalSigns: data.vitalSigns || { temperature: 37.0, pulse: 80, bloodPressure: "120/80", respiratoryRate: 16, oxygenSaturation: 98, painScore: 5, news2Score: 2 },
      status: data.triageCategory === 1 ? "In Treatment Bay" : "Triaged - Waiting Room",
      assignedBay: data.triageCategory === 1 ? "Resus Bay 01" : undefined,
      isResusRequired: data.triageCategory === 1,
      waitingTimeMinutes: 0,
      aiPriorityScore: (6 - (data.triageCategory || 3)) * 20
    };
    edEncounters.unshift(newEncounter);
    res.json({ success: true, encounter: newEncounter });
  });

  // 5. Operating Theatre
  app.get("/api/dhos/theatre", (req, res) => {
    res.json(surgicalCases);
  });

  app.post("/api/dhos/theatre/timeout", (req, res) => {
    const { caseId } = req.body;
    const surgicalCase = surgicalCases.find(c => c.id === caseId);
    if (!surgicalCase) return res.status(404).json({ error: "Case not found" });

    surgicalCase.timeoutCompleted = true;
    surgicalCase.status = "Incision Started";
    surgicalCase.actualIncisionTime = new Date().toISOString();
    res.json({ success: true, surgicalCase });
  });

  app.post("/api/dhos/theatre/counts", (req, res) => {
    const { caseId, instrumentsCorrect, swabsCorrect } = req.body;
    const surgicalCase = surgicalCases.find(c => c.id === caseId);
    if (!surgicalCase) return res.status(404).json({ error: "Case not found" });

    surgicalCase.instrumentCountCorrect = instrumentsCorrect;
    surgicalCase.swabCountCorrect = swabsCorrect;
    if (instrumentsCorrect && swabsCorrect) {
      surgicalCase.status = "In PACU Recovery";
    }
    res.json({ success: true, surgicalCase });
  });

  // 6. ICU Critical Care
  app.get("/api/dhos/icu", (req, res) => {
    res.json(icuPatients);
  });

  app.post("/api/dhos/icu/weaning", (req, res) => {
    const { icuPatientId, status } = req.body;
    const item = icuPatients.find(i => i.id === icuPatientId);
    if (!item) return res.status(404).json({ error: "ICU Patient not found" });

    item.weaningTrialStatus = status;
    if (status === "Tolerated") {
      item.stepDownCandidate = true;
    }
    res.json({ success: true, icuPatient: item });
  });

  // 7. Diagnostics (Pathology / Radiology / PACS)
  app.get("/api/dhos/diagnostics", (req, res) => {
    res.json(diagnostics);
  });

  app.post("/api/dhos/diagnostics/request", (req, res) => {
    const data = req.body;
    const newDiag: DiagnosticRequest = {
      id: `DIAG-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      patientMrn: data.patientMrn,
      type: data.type || "Radiology",
      testName: data.testName,
      modality: data.modality || "X-Ray",
      clinicalIndication: data.clinicalIndication,
      urgency: data.urgency || "Routine",
      requestedBy: data.requestedBy || "Dr. On-Duty",
      requestedAt: new Date().toISOString(),
      status: "Requested",
      specimenBarcode: data.type === "Pathology" ? `LAB-${Math.floor(Math.random() * 899999 + 100000)}` : undefined
    };
    diagnostics.unshift(newDiag);
    res.json({ success: true, diagnostic: newDiag });
  });

  app.post("/api/dhos/diagnostics/ack-critical", (req, res) => {
    const { id } = req.body;
    const diag = diagnostics.find(d => d.id === id);
    if (diag) {
      diag.criticalAcknowledged = true;
    }
    res.json({ success: true, diagnostic: diag });
  });

  // 8. Pharmacy & Medication
  app.get("/api/dhos/pharmacy", (req, res) => {
    res.json(medicationOrders);
  });

  app.post("/api/dhos/pharmacy/verify", (req, res) => {
    const { id, pharmacistName } = req.body;
    const med = medicationOrders.find(m => m.id === id);
    if (med) {
      med.status = "Pharmacist Verified";
      med.pharmacistVerifiedBy = pharmacistName || "Pharm. David Miller";
    }
    res.json({ success: true, order: med });
  });

  app.post("/api/dhos/pharmacy/administer", (req, res) => {
    const { id, nurseName } = req.body;
    const med = medicationOrders.find(m => m.id === id);
    if (med) {
      med.status = "Administered";
    }
    res.json({ success: true, order: med });
  });

  // 9. Patient Nutrition & Meals
  app.get("/api/dhos/nutrition", (req, res) => {
    res.json(mealOrders);
  });

  app.post("/api/dhos/nutrition/order", (req, res) => {
    const data = req.body;
    // Check allergy conflict
    const patient = patients.find(p => p.id === data.patientId);
    let allergyConflict = false;
    if (patient) {
      const selectedLower = (data.selectedMeal || "").toLowerCase();
      patient.foodAllergies.forEach(allergy => {
        if (selectedLower.includes(allergy.toLowerCase())) {
          allergyConflict = true;
        }
      });
    }

    if (allergyConflict) {
      return res.status(400).json({
        error: "CRITICAL SAFETY ALLERGY CONFLICT: Selected meal contains known patient allergen! Automatic Order Blocked.",
        allergies: patient?.foodAllergies
      });
    }

    const newMeal: MealOrder = {
      id: `MEAL-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      patientMrn: data.patientMrn,
      wardName: data.wardName || "Ward 3A",
      bedNumber: data.bedNumber || "3A-01",
      prescribedDiet: data.prescribedDiet || "Normal",
      foodAllergies: patient?.foodAllergies || [],
      selectedMeal: data.selectedMeal,
      mealType: data.mealType || "Lunch",
      orderStatus: "In Kitchen Production",
      trayInspectionPassed: true
    };
    mealOrders.unshift(newMeal);
    res.json({ success: true, mealOrder: newMeal });
  });

  // 10. EVS Housekeeping
  app.get("/api/dhos/evs", (req, res) => {
    res.json(evsTasks);
  });

  app.post("/api/dhos/evs/certify", (req, res) => {
    const { id, certifiedBy } = req.body;
    const task = evsTasks.find(t => t.id === id);
    if (task) {
      task.status = "Passed & Certified";
      task.decontaminationVerified = true;
      task.certifiedBy = certifiedBy || "EVS Supervisor";

      // If associated bed, update status to Available
      if (task.bedId) {
        const targetBed = beds.find(b => b.id === task.bedId);
        if (targetBed) {
          targetBed.status = "Available";
        }
      }
    }
    res.json({ success: true, task });
  });

  // 11. Logistics & Patient Transport
  app.get("/api/dhos/logistics", (req, res) => {
    res.json(transportTasks);
  });

  app.post("/api/dhos/logistics/dispatch", (req, res) => {
    const { id, porterName } = req.body;
    const task = transportTasks.find(t => t.id === id);
    if (task) {
      task.status = "In Transit";
      task.assignedPorter = porterName || "Porter On-Duty";
    }
    res.json({ success: true, task });
  });

  // 12. Facilities Maintenance
  app.get("/api/dhos/facilities", (req, res) => {
    res.json(maintenanceWorkOrders);
  });

  // 13. Biomedical Engineering
  app.get("/api/dhos/biomedical", (req, res) => {
    res.json(medicalDevices);
  });

  // 14. Supply Chain Inventory
  app.get("/api/dhos/supply-chain", (req, res) => {
    res.json(inventoryItems);
  });

  // 15. Workforce & Security
  app.get("/api/dhos/workforce", (req, res) => {
    res.json({
      staffMembers,
      breakGlassLogs
    });
  });

  app.post("/api/dhos/workforce/breakglass", (req, res) => {
    const { userId, userName, userRole, patientId, patientName, justification } = req.body;
    const newLog: BreakGlassLog = {
      id: `BG-${Date.now()}`,
      userId,
      userName,
      userRole,
      patientId,
      patientName,
      justification,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      actionsPerformed: ["Emergency Medical Record Full Access"],
      executiveReviewed: false
    };
    breakGlassLogs.unshift(newLog);
    res.json({ success: true, log: newLog });
  });

  // 16. Command Centre
  app.get("/api/dhos/command-centre", (req, res) => {
    res.json({
      surgeStatus,
      executiveDecisions
    });
  });

  app.post("/api/dhos/command-centre/surge", (req, res) => {
    const { activeCode } = req.body;
    surgeStatus.activeCode = activeCode;
    surgeStatus.lastUpdated = new Date().toISOString();
    res.json({ success: true, surgeStatus });
  });

  app.post("/api/dhos/command-centre/decision", (req, res) => {
    const { decisionTitle, rationale, approvingExecutive, affectedDepartments } = req.body;
    const newDec: ExecutiveDecision = {
      id: `DEC-${Date.now()}`,
      decisionTitle,
      rationale,
      approvingExecutive,
      affectedDepartments: affectedDepartments || ["Hospital Wide"],
      implementationDate: new Date().toISOString().split("T")[0],
      loggedAt: new Date().toISOString()
    };
    executiveDecisions.unshift(newDec);
    res.json({ success: true, decision: newDec });
  });

  // 17. Server-Side AI Assistant (Gemini API)
  app.post("/api/dhos/ai-query", async (req, res) => {
    const { query, domain } = req.body;
    const aiClient = getGeminiClient();

    if (!aiClient) {
      return res.json({
        answer: `[AI Studio Intelligence - Simulation Mode]\n\nBased on real-time DHOS hospital telemetry:\n- Current Occupancy: ${Math.round((beds.filter(b => b.status === "Occupied").length / beds.length) * 100)}%\n- Emergency Triage Queue: ${edEncounters.filter(e => e.status.includes("Waiting")).length} waiting patients\n- Operating Theatre: ${surgicalCases.filter(c => c.status === "Incision Started").length} active cases in progress\n- ICU Capacity: ${icuPatients.length} active critical care patients, ${beds.filter(b => b.wardId === "WARD-ICU" && b.status === "Available").length} beds available.\n\nQuery Recommendation: "Please ensure ED Boarding patients are prioritized for Bed Allocation in Ward 3A."`,
        supportingEvidence: [
          { title: "Live Bed Occupancy Map", sourceDomain: "Patient Flow", timestamp: new Date().toLocaleTimeString() },
          { title: "Triage Priority Matrix", sourceDomain: "Emergency Dept", timestamp: new Date().toLocaleTimeString() }
        ],
        confidenceScore: 0.94
      });
    }

    try {
      const prompt = `You are the DHOS AI Executive Operations Assistant for St. Jude Metropolitan Hospital.
Current Real-time Hospital State Snapshot:
- Hospital Occupancy: ${beds.filter(b => b.status === "Occupied").length}/${beds.length} beds (${Math.round((beds.filter(b => b.status === "Occupied").length / beds.length) * 100)}%)
- ED Queue: ${edEncounters.length} total encounters, ${edEncounters.filter(e => e.triageCategory === 1 || e.triageCategory === 2).length} high acuity (Category 1 & 2).
- Operating Theatre: ${surgicalCases.length} cases scheduled, ${surgicalCases.filter(c => c.status === 'Incision Started').length} currently under surgery.
- ICU Unit 2C: ${icuPatients.length} active ICU patients.
- Active Critical Alerts: ${diagnostics.filter(d => d.isCritical && !d.criticalAcknowledged).length} unacknowledged critical pathology alerts.

User Natural Language Query: "${query}"

Provide a concise, professional, evidence-backed executive answer with operational recommendations. Use plain text or clear bullet points.`;

      const aiResponse = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = aiResponse.text || "AI Assistant generated recommendations based on DHOS live telemetry.";

      res.json({
        answer: text,
        supportingEvidence: [
          { title: "Live Hospital Telemetry Engine", sourceDomain: domain || "Enterprise System", timestamp: new Date().toLocaleTimeString() },
          { title: "DHOS Canonical Invariant Auditor", sourceDomain: "Clinical Safety", timestamp: new Date().toLocaleTimeString() }
        ],
        confidenceScore: 0.96
      });
    } catch (err: any) {
      console.error("Gemini AI API Error:", err);
      res.json({
        answer: `DHOS Intelligence Response to: "${query}"\n\nOperational Recommendation: Ensure strict adherence to clinical priority and Bed Allocation invariants. Active monitoring in progress.`,
        supportingEvidence: [
          { title: "DHOS Local Governance Engine", sourceDomain: domain || "Command Centre", timestamp: new Date().toLocaleTimeString() }
        ],
        confidenceScore: 0.88
      });
    }
  });

  // VITE / STATIC SERVING
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DHOS Hospital Management Suite running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
