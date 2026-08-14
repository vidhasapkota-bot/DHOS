import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Layers,
  Shield,
  Sliders,
  BedDouble,
  DoorOpen,
  Hash,
  Phone,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  Check,
  X,
  Hospital,
  ChevronRight,
  Globe,
  Settings,
  Lock
} from 'lucide-react';
import { Campus, Building, Department, Ward, Bed, HospitalConfig } from '../types/dhos';

interface EnterpriseManagementViewProps {
  config: HospitalConfig;
  hospitals: HospitalConfig[];
  campuses: Campus[];
  buildings: Building[];
  departments: Department[];
  wards: Ward[];
  beds: Bed[];
  onSelectHospital: (hospitalId: string) => void;
  onAddHospital: (newHospital: HospitalConfig) => void;
  onAddCampus: (newCampus: Campus) => void;
  onAddBuilding: (newBuilding: Building) => void;
  onAddDepartment: (newDepartment: Department) => void;
  onAddWard: (newWard: Ward) => void;
  onAddBed: (newBed: Bed) => void;
  onUpdateCampusStatus: (campusId: string, status: Campus['status']) => void;
  onUpdateHospitalConfig: (updatedConfig: Partial<HospitalConfig>) => void;
  onUpdateDepartmentEscalation: (depId: string, manager: string, escalationRule: string) => void;
}

export const CampusConfigView: React.FC<EnterpriseManagementViewProps> = ({
  config,
  hospitals,
  campuses,
  buildings,
  departments,
  wards,
  beds,
  onSelectHospital,
  onAddHospital,
  onAddCampus,
  onAddBuilding,
  onAddDepartment,
  onAddWard,
  onAddBed,
  onUpdateCampusStatus,
  onUpdateHospitalConfig,
  onUpdateDepartmentEscalation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'hospitals' | 'campuses' | 'buildings' | 'departments' | 'wards' | 'beds' | 'settings'>('overview');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(config?.id || 'HOSP-001');
  const [selectedCampusId, setSelectedCampusId] = useState<string>(campuses[0]?.id || 'CAMP-01');
  const [selectedWardId, setSelectedWardId] = useState<string>(wards[0]?.id || 'WARD-3A');

  // Modal Visibility States
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [showAddCampusModal, setShowAddCampusModal] = useState(false);
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showAddWardModal, setShowAddWardModal] = useState(false);
  const [showAddBedModal, setShowAddBedModal] = useState(false);

  // Department Editing
  const [editingDepId, setEditingDepId] = useState<string | null>(null);
  const [editDepManager, setEditDepManager] = useState('');
  const [editDepRule, setEditDepRule] = useState('');

  // New Hospital Form
  const [newHospName, setNewHospName] = useState('');
  const [newHospCode, setNewHospCode] = useState('');
  const [newHospTimezone, setNewHospTimezone] = useState('Australia/Sydney (AEST/AEDT)');
  const [newHospFY, setNewHospFY] = useState('2026-2027');
  const [newHospMfa, setNewHospMfa] = useState(true);
  const [newHospTimeout, setNewHospTimeout] = useState(30);

  // New Campus Form
  const [newCampusName, setNewCampusName] = useState('');
  const [newCampusCode, setNewCampusCode] = useState('');
  const [newCampusAddress, setNewCampusAddress] = useState('');
  const [newCampusBeds, setNewCampusBeds] = useState(250);
  const [newCampusBuildings, setNewCampusBuildings] = useState(2);
  const [newCampusHospitalId, setNewCampusHospitalId] = useState(config?.id || 'HOSP-001');

  // New Building Form
  const [newBldName, setNewBldName] = useState('');
  const [newBldCode, setNewBldCode] = useState('');
  const [newBldFloors, setNewBldFloors] = useState(6);
  const [newBldLift, setNewBldLift] = useState(true);
  const [newBldCampusId, setNewBldCampusId] = useState(campuses[0]?.id || 'CAMP-01');

  // New Department Form
  const [newDepName, setNewDepName] = useState('');
  const [newDepCode, setNewDepCode] = useState('');
  const [newDepManager, setNewDepManager] = useState('');
  const [newDepHours, setNewDepHours] = useState('24/7 Continuous');
  const [newDepRule, setNewDepRule] = useState('Escalate to Department Director if wait time > 45m');

  // New Ward Form
  const [newWardName, setNewWardName] = useState('');
  const [newWardCode, setNewWardCode] = useState('');
  const [newWardType, setNewWardType] = useState<Ward['wardType']>('Medical');
  const [newWardBldId, setNewWardBldId] = useState(buildings[0]?.id || 'BLD-A');
  const [newWardDepId, setNewWardDepId] = useState(departments[0]?.id || 'DEP-MED');
  const [newWardCapacity, setNewWardCapacity] = useState(12);
  const [newWardManager, setNewWardManager] = useState('');
  const [newWardPhone, setNewWardPhone] = useState('x3200');
  const [newWardIsoCount, setNewWardIsoCount] = useState(2);

  // New Bed Form
  const [newBedNumber, setNewBedNumber] = useState('');
  const [newBedWardId, setNewBedWardId] = useState(wards[0]?.id || 'WARD-3A');
  const [newBedType, setNewBedType] = useState<Bed['bedType']>('General');

  // Submission Handlers
  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName || !newHospCode) return;

    const nextNum = (hospitals?.length || 1) + 1;
    const formattedId = `HOSP-00${nextNum}`;

    const newHosp: HospitalConfig = {
      id: formattedId,
      name: newHospName,
      code: newHospCode.toUpperCase(),
      financialYear: newHospFY || '2026-2027',
      timeZone: newHospTimezone || 'Australia/Sydney (AEST/AEDT)',
      publicHolidays: ['2026-01-01', '2026-01-26', '2026-04-03', '2026-04-06', '2026-04-25', '2026-12-25'],
      workingWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      securityPolicy: {
        mfaRequired: newHospMfa,
        sessionTimeoutMinutes: Number(newHospTimeout) || 30,
        passwordExpiryDays: 90,
      },
      aiSettings: {
        enabled: true,
        modelAlias: 'gemini-3.6-flash',
        autoAssist: true,
      }
    };

    onAddHospital(newHosp);
    setShowAddHospitalModal(false);
    setNewHospName('');
    setNewHospCode('');
  };

  const handleCreateCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampusName || !newCampusCode) return;

    const newCampus: Campus = {
      id: `CAMP-0${campuses.length + 1}`,
      hospitalId: newCampusHospitalId || config.id || 'HOSP-001',
      name: newCampusName,
      code: newCampusCode.toUpperCase(),
      address: newCampusAddress || 'Health Precinct, Metro District',
      status: 'Active',
      buildingsCount: Number(newCampusBuildings) || 1,
      totalBedCapacity: Number(newCampusBeds) || 100,
    };

    onAddCampus(newCampus);
    setShowAddCampusModal(false);
    setNewCampusName('');
    setNewCampusCode('');
    setNewCampusAddress('');
  };

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBldName || !newBldCode) return;

    const newBld: Building = {
      id: `BLD-${String.fromCharCode(65 + buildings.length)}`,
      campusId: newBldCampusId,
      name: newBldName,
      code: newBldCode.toUpperCase(),
      floors: Number(newBldFloors) || 1,
      hasLiftAccess: Boolean(newBldLift),
    };

    onAddBuilding(newBld);
    setShowAddBuildingModal(false);
    setNewBldName('');
    setNewBldCode('');
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName || !newDepCode) return;

    const newDep: Department = {
      id: `DEP-${newDepCode.toUpperCase()}`,
      name: newDepName,
      code: newDepCode.toUpperCase(),
      manager: newDepManager || 'Appointed Director',
      workingHours: newDepHours || '24/7 Continuous',
      escalationRule: newDepRule || 'Immediate notification on capacity threshold breach',
      hospitalId: config.id || 'HOSP-001',
    };

    onAddDepartment(newDep);
    setShowAddDepartmentModal(false);
    setNewDepName('');
    setNewDepCode('');
    setNewDepManager('');
  };

  const handleCreateWard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardName || !newWardCode) return;

    const newWard: Ward = {
      id: `WARD-${newWardCode.toUpperCase()}`,
      buildingId: newWardBldId,
      departmentId: newWardDepId,
      name: newWardName,
      code: newWardCode.toUpperCase(),
      wardType: newWardType,
      capacity: Number(newWardCapacity) || 10,
      occupiedCount: 0,
      nurseStationPhone: newWardPhone || 'x3000',
      isolationRoomsCount: Number(newWardIsoCount) || 0,
      wardManager: newWardManager || 'Charge Nurse',
    };

    onAddWard(newWard);
    setShowAddWardModal(false);
    setNewWardName('');
    setNewWardCode('');
    setNewWardManager('');
  };

  const handleCreateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedNumber) return;

    const targetWard = wards.find(w => w.id === newBedWardId);
    const targetBld = buildings.find(b => b.id === targetWard?.buildingId);

    const newBed: Bed = {
      id: `BED-${newBedNumber.replace(/\s+/g, '-').toUpperCase()}`,
      bedNumber: newBedNumber.toUpperCase(),
      wardId: newBedWardId,
      wardName: targetWard?.name || 'General Ward',
      buildingName: targetBld?.name || 'Inpatient Block',
      bedType: newBedType,
      status: 'Available',
    };

    onAddBed(newBed);
    setShowAddBedModal(false);
    setNewBedNumber('');
  };

  const handleStartEditDepartment = (dep: Department) => {
    setEditingDepId(dep.id);
    setEditDepManager(dep.manager);
    setEditDepRule(dep.escalationRule);
  };

  const handleSaveDepartment = (depId: string) => {
    onUpdateDepartmentEscalation(depId, editDepManager, editDepRule);
    setEditingDepId(null);
  };

  const filteredBuildings = buildings.filter(b => b.campusId === selectedCampusId);
  const selectedCampus = campuses.find(c => c.id === selectedCampusId);
  const filteredBeds = beds.filter(b => b.wardId === selectedWardId);
  const selectedWard = wards.find(w => w.id === selectedWardId);

  return (
    <div className="space-y-6">
      {/* Top Enterprise Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Hospital className="w-5 h-5 text-blue-600" />
              Multi-Hospital & Enterprise Hierarchy Config (WF-001 - WF-040)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
              {hospitals?.length || 1} Hospitals Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Enterprise structure control: configure parent hospitals/health authorities, multi-site campuses, clinical buildings, departments, wards, and beds.
          </p>
        </div>

        {/* Quick Action Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddHospitalModal(true)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Hospital
          </button>
          <button
            onClick={() => setShowAddCampusModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Campus
          </button>
          <button
            onClick={() => setShowAddBuildingModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Building
          </button>
          <button
            onClick={() => setShowAddDepartmentModal(true)}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Department
          </button>
          <button
            onClick={() => setShowAddWardModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Ward
          </button>
          <button
            onClick={() => setShowAddBedModal(true)}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bed
          </button>
        </div>
      </div>

      {/* Structural Hierarchy Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveSubTab('hospitals')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'hospitals' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">1. Hospitals</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600">{hospitals?.length || 1}</strong>
            <span className="text-[10px] font-bold text-blue-600">Entities</span>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('campuses')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'campuses' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">2. Campuses</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600">{campuses.length}</strong>
            <span className="text-[10px] font-bold text-blue-600">Sites</span>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('buildings')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'buildings' ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">3. Buildings</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600">{buildings.length}</strong>
            <span className="text-[10px] font-bold text-indigo-600">Blocks</span>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('departments')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'departments' ? 'border-violet-600 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">4. Departments</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-violet-600">{departments.length}</strong>
            <span className="text-[10px] font-bold text-violet-600">Units</span>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('wards')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'wards' ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">5. Inpatient Wards</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600">{wards.length}</strong>
            <span className="text-[10px] font-bold text-emerald-600">Wards</span>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('beds')}
          className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition group ${
            activeSubTab === 'beds' ? 'border-teal-600 ring-2 ring-teal-100' : 'border-slate-200 hover:border-teal-500'
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">6. Bed Inventory</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-xl font-extrabold text-slate-900 group-hover:text-teal-600">{beds.length}</strong>
            <span className="text-[10px] font-bold text-teal-600">Beds</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 sm:px-4 rounded-xl shadow-xs overflow-x-auto scrollbar-thin">
        {[
          { id: 'overview', label: 'Hierarchy Map', icon: Layers },
          { id: 'hospitals', label: `Hospitals (${hospitals?.length || 1})`, icon: Hospital },
          { id: 'campuses', label: `Campuses (${campuses.length})`, icon: Building2 },
          { id: 'buildings', label: `Buildings (${buildings.length})`, icon: Layers },
          { id: 'departments', label: `Departments (${departments.length})`, icon: Sliders },
          { id: 'wards', label: `Wards & Units (${wards.length})`, icon: DoorOpen },
          { id: 'beds', label: `Bed Allocations (${beds.length})`, icon: BedDouble },
          { id: 'settings', label: 'Organization & Policies', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/40 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 0: Enterprise Hierarchy Tree Map */}
      {activeSubTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Enterprise Multi-Hospital Hierarchy Map</h3>
              <p className="text-xs text-slate-500">Live operational tree view from health network hospitals down to individual beds.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Active Hospital:</span>
              <select
                value={config.id}
                onChange={e => onSelectHospital(e.target.value)}
                className="bg-blue-50 border border-blue-300 text-blue-900 font-bold text-xs rounded-lg px-3 py-1.5"
              >
                {hospitals?.map(h => (
                  <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {/* Hospitals Node */}
            <div className="border-2 border-blue-600 bg-blue-50/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Selected Operating Hospital ({config.id})
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{config.name}</h4>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-700">Timezone: {config.timeZone}</span>
                  <span className="block text-[11px] text-slate-500 font-semibold">FY: {config.financialYear}</span>
                </div>
              </div>
            </div>

            {/* Campus Level */}
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
              <span className="text-xs font-bold uppercase text-slate-400">Level 2: Campuses & Sites ({campuses.filter(c => c.hospitalId === config.id).length} Sites)</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campuses.filter(c => c.hospitalId === config.id).map(camp => {
                  const campBuildings = buildings.filter(b => b.campusId === camp.id);
                  return (
                    <div key={camp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 font-mono">
                            {camp.code} • {camp.id}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm mt-1">{camp.name}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{camp.address}</p>

                      {/* Buildings in Campus */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Buildings / Pavilions:</span>
                        <div className="space-y-1.5">
                          {campBuildings.map(bld => {
                            const bldWards = wards.filter(w => w.buildingId === bld.id);
                            return (
                              <div key={bld.id} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs">
                                <div className="flex justify-between font-bold text-slate-800">
                                  <span>🏢 {bld.name} ({bld.code})</span>
                                  <span className="text-slate-500 font-normal">{bld.floors} Floors</span>
                                </div>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {bldWards.map(w => (
                                    <span key={w.id} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold">
                                      {w.name} ({beds.filter(b => b.wardId === w.id).length} Beds)
                                    </span>
                                  ))}
                                  {bldWards.length === 0 && (
                                    <span className="text-[10px] text-slate-400 italic">No wards configured yet</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Hospitals & Health Authorities */}
      {activeSubTab === 'hospitals' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Hospitals & Health Networks (WF-001)</h3>
              <p className="text-xs text-slate-500">Configure multiple licensed hospital organizations under the health service network.</p>
            </div>
            <button
              onClick={() => setShowAddHospitalModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Add New Hospital (WF-001)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hospitals?.map((hosp) => {
              const isCurrent = hosp.id === config.id;
              const hospCampuses = campuses.filter(c => c.hospitalId === hosp.id);
              return (
                <div
                  key={hosp.id}
                  className={`bg-white border rounded-xl p-5 space-y-4 shadow-xs transition relative ${
                    isCurrent ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 font-mono">
                          {hosp.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{hosp.id}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{hosp.name}</h4>
                    </div>
                    {isCurrent ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                        ACTIVE HOSPITAL
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectHospital(hosp.id)}
                        className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        Switch To This Hospital
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Timezone</span>
                      <strong className="text-slate-800">{hosp.timeZone}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Financial Year</span>
                      <strong className="text-slate-800">{hosp.financialYear}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Campuses Configured</span>
                      <strong className="text-slate-800">{hospCampuses.length} Campuses</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Security Governance</span>
                      <strong className="text-emerald-700">{hosp.securityPolicy?.mfaRequired ? 'MFA Required' : 'Standard'}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Campuses & Sites */}
      {activeSubTab === 'campuses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campuses.map((camp) => (
              <div
                key={camp.id}
                className={`bg-white border rounded-xl p-5 space-y-4 shadow-xs transition relative ${
                  selectedCampusId === camp.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 font-mono border border-slate-200">
                      {camp.code}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">{camp.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    camp.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{camp.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Bed Capacity</span>
                      <strong className="text-slate-900 font-extrabold text-sm">{camp.totalBedCapacity} Beds</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Buildings</span>
                      <strong className="text-slate-900 font-extrabold text-sm">{camp.buildingsCount} Blocks</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedCampusId(camp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedCampusId === camp.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedCampusId === camp.id ? 'Selected Campus' : 'Inspect Campus'}
                  </button>

                  <button
                    onClick={() => onUpdateCampusStatus(camp.id, camp.status === 'Active' ? 'Draft' : 'Active')}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Toggle {camp.status === 'Active' ? 'Maintenance' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Buildings & Blocks */}
      {activeSubTab === 'buildings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Buildings & Wings for: <span className="text-blue-600">{selectedCampus?.name || 'Selected Campus'}</span>
              </h3>
              <p className="text-xs text-slate-500">Physical ward blocks, clinical pavilions, floor counts and elevator accessibility.</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Filter Campus:</label>
              <select
                value={selectedCampusId}
                onChange={e => setSelectedCampusId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:border-blue-600"
              >
                {campuses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((bld) => (
                <div key={bld.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                        {bld.code} • {bld.id}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{bld.name}</h4>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Floors / Levels:</span>
                      <strong className="text-slate-900">{bld.floors} Floors</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Bed Lift / Stretcher Access:</span>
                      <strong className={bld.hasLiftAccess ? 'text-emerald-700' : 'text-red-700'}>
                        {bld.hasLiftAccess ? 'Verified Operational' : 'Stairs Only'}
                      </strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-400 text-xs">
                No buildings configured for this campus yet. Click "Add Building" above to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Departments & Escalations */}
      {activeSubTab === 'departments' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900 text-sm">Clinical & Operational Department Hierarchy (WF-021 - WF-030)</h3>
            <p className="text-xs text-slate-500 font-medium">Department directors, 24/7 operating schedules and automated clinical surge escalation trigger rules.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Department Name & Code</th>
                  <th className="p-3.5">Clinical Manager / Director</th>
                  <th className="p-3.5">Operating Hours</th>
                  <th className="p-3.5">Escalation Trigger Rule</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {departments.map((dep) => {
                  const isEditing = editingDepId === dep.id;
                  return (
                    <tr key={dep.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{dep.name}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold">
                          {dep.code} • {dep.id}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editDepManager}
                            onChange={e => setEditDepManager(e.target.value)}
                            className="bg-white border border-blue-400 rounded px-2 py-1 text-slate-900 font-bold text-xs w-full"
                          />
                        ) : (
                          <div className="font-bold text-slate-900">{dep.manager}</div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                          {dep.workingHours}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editDepRule}
                            onChange={e => setEditDepRule(e.target.value)}
                            className="bg-white border border-blue-400 rounded px-2 py-1 text-slate-900 text-xs w-full font-medium"
                          />
                        ) : (
                          <span className="text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-medium block">
                            {dep.escalationRule}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveDepartment(dep.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition"
                          >
                            Save Rule
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEditDepartment(dep)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold border border-slate-200 transition"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Inpatient Wards & Units */}
      {activeSubTab === 'wards' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Inpatient Wards & Clinical Care Units (WF-025)</h3>
              <p className="text-xs text-slate-500 font-medium">Ward allocations, isolation room availability, nurse station extensions, and registered ward managers.</p>
            </div>
            <button
              onClick={() => setShowAddWardModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ward
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Ward Name & Code</th>
                  <th className="p-3.5">Ward Specialty Type</th>
                  <th className="p-3.5">Assigned Building</th>
                  <th className="p-3.5">Bed Capacity</th>
                  <th className="p-3.5">Isolation Rooms</th>
                  <th className="p-3.5">Nurse Station</th>
                  <th className="p-3.5">Ward Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {wards.map((ward) => {
                  const bld = buildings.find(b => b.id === ward.buildingId);
                  const wardBedsCount = beds.filter(b => b.wardId === ward.id).length;
                  return (
                    <tr key={ward.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{ward.name}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold">
                          {ward.code} • {ward.id}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                          {ward.wardType}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">{bld?.name || ward.buildingId}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{ward.capacity} Max Beds</div>
                        <span className="text-[10px] text-slate-500 font-medium">{wardBedsCount} configured</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          ward.isolationRoomsCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-400'
                        }`}>
                          {ward.isolationRoomsCount} Rooms
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono text-blue-700 font-bold">{ward.nurseStationPhone}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900">{ward.wardManager}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Bed Allocations & Physical Bed Inventory */}
      {activeSubTab === 'beds' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Physical Bed Inventory for: <span className="text-teal-600">{selectedWard?.name || 'Selected Ward'}</span>
              </h3>
              <p className="text-xs text-slate-500">Live operational states and hardware allocation of hospital beds.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Select Ward:</label>
                <select
                  value={selectedWardId}
                  onChange={e => setSelectedWardId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:border-teal-600"
                >
                  {wards.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setNewBedWardId(selectedWardId);
                  setShowAddBedModal(true);
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Bed to Ward
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => (
              <div
                key={bed.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {bed.bedNumber}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase mt-1">
                      {bed.bedType}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    bed.status === 'Occupied' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    bed.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    bed.status === 'Dirty' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div className="text-xs pt-2 border-t border-slate-200 text-slate-600">
                  {bed.currentPatientName ? (
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Patient</span>
                      <strong className="text-slate-900 font-bold">{bed.currentPatientName}</strong>
                      <span className="text-[10px] text-slate-500 block font-mono">{bed.currentPatientMrn}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">No patient assigned</span>
                  )}
                </div>
              </div>
            ))}
            {filteredBeds.length === 0 && (
              <div className="col-span-4 text-center py-8 text-slate-400 text-xs">
                No beds configured in this ward. Click "Add Bed to Ward" above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Hospital Policies & Timezone */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-blue-600" />
              Hospital Entity Metadata (WF-001)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Hospital Organization Name</label>
                <input
                  type="text"
                  defaultValue={config.name}
                  onChange={e => onUpdateHospitalConfig({ name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Locked Time Zone (WF-003)</label>
                  <input
                    type="text"
                    disabled
                    value={config.timeZone}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Financial Year</label>
                  <input
                    type="text"
                    disabled
                    value={config.financialYear}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Security & Clinical Governance Policies (WF-031)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <strong className="text-slate-900 block">Mandatory 2FA / MFA Authentication</strong>
                  <span className="text-[11px] text-slate-500">Enforce hardware token or SMS 2FA for all clinical staff.</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ENFORCED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <strong className="text-slate-900 block">Break-Glass Audit Surveillance</strong>
                  <span className="text-[11px] text-slate-500">Logs reason and notifies Medical Director immediately.</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <strong className="text-slate-900 block">Session Idle Timeout</strong>
                  <span className="text-[11px] text-slate-500">Automatic workstation lock after 15 minutes of inactivity.</span>
                </div>
                <span className="font-mono text-slate-700 font-bold">{config.securityPolicy?.sessionTimeoutMinutes || 15} MINS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 0. Modal: Add New Hospital */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Hospital className="w-5 h-5 text-blue-600" />
                Add Licensed Hospital (WF-001)
              </h3>
              <button onClick={() => setShowAddHospitalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Hospital Official Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Western Children's Hospital"
                  value={newHospName}
                  onChange={e => setNewHospName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hospital Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RWCH-AU"
                    value={newHospCode}
                    onChange={e => setNewHospCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Financial Year</label>
                  <input
                    type="text"
                    value={newHospFY}
                    onChange={e => setNewHospFY(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clinical Locked Timezone (WF-003)</label>
                <select
                  value={newHospTimezone}
                  onChange={e => setNewHospTimezone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="Australia/Sydney (AEST/AEDT)">Australia/Sydney (AEST/AEDT)</option>
                  <option value="Australia/Melbourne (AEST/AEDT)">Australia/Melbourne (AEST/AEDT)</option>
                  <option value="Australia/Brisbane (AEST)">Australia/Brisbane (AEST)</option>
                  <option value="Australia/Perth (AWST)">Australia/Perth (AWST)</option>
                  <option value="Pacific/Auckland (NZST/NZDT)">Pacific/Auckland (NZST/NZDT)</option>
                  <option value="Europe/London (GMT/BST)">Europe/London (GMT/BST)</option>
                  <option value="America/New_York (EST/EDT)">America/New_York (EST/EDT)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mfa-hosp"
                  checked={newHospMfa}
                  onChange={e => setNewHospMfa(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="mfa-hosp" className="text-slate-700 font-semibold text-[11px]">
                  Enforce Mandatory 2FA/MFA for All Clinical Staff (WF-031)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddHospitalModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Create Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Modal: Add New Campus */}
      {showAddCampusModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Configure New Campus (WF-012)
              </h3>
              <button onClick={() => setShowAddCampusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampus} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Hospital Entity *</label>
                <select
                  value={newCampusHospitalId}
                  onChange={e => setNewCampusHospitalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  {hospitals?.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Suburban Health Hub"
                  value={newCampusName}
                  onChange={e => setNewCampusName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Campus Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NSHH"
                    value={newCampusCode}
                    onChange={e => setNewCampusCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bed Capacity *</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newCampusBeds}
                    onChange={e => setNewCampusBeds(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="e.g. 200 Northway Avenue, Northern Precinct"
                  value={newCampusAddress}
                  onChange={e => setNewCampusAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddCampusModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Add New Building */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Add Building / Wing (WF-015)
              </h3>
              <button onClick={() => setShowAddBuildingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuilding} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus Assignment *</label>
                <select
                  value={newBldCampusId}
                  onChange={e => setNewBldCampusId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                >
                  {campuses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Critical Care Pavilion D"
                  value={newBldName}
                  onChange={e => setNewBldName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Building Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLD-D"
                    value={newBldCode}
                    onChange={e => setNewBldCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Floors *</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newBldFloors}
                    onChange={e => setNewBldFloors(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lift-access"
                  checked={newBldLift}
                  onChange={e => setNewBldLift(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="lift-access" className="text-slate-700 font-semibold">
                  Dedicated Bed Lift / Stretcher Access Certified (WF-017)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add New Department */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-violet-600" />
                Add Department (WF-021)
              </h3>
              <button onClick={() => setShowAddDepartmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology & Vascular Care"
                  value={newDepName}
                  onChange={e => setNewDepName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CARDIO"
                    value={newDepCode}
                    onChange={e => setNewDepCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operating Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 24/7 Continuous"
                    value={newDepHours}
                    onChange={e => setNewDepHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clinical Manager / Director *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Bennett"
                  value={newDepManager}
                  onChange={e => setNewDepManager(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Escalation Trigger Rule (WF-028)</label>
                <input
                  type="text"
                  placeholder="e.g. Escalate if wait time > 30m"
                  value={newDepRule}
                  onChange={e => setNewDepRule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddDepartmentModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add New Ward */}
      {showAddWardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-emerald-600" />
                Configure Inpatient Ward (WF-025)
              </h3>
              <button onClick={() => setShowAddWardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWard} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Building *</label>
                  <select
                    value={newWardBldId}
                    onChange={e => setNewWardBldId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department *</label>
                  <select
                    value={newWardDepId}
                    onChange={e => setNewWardDepId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ward Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 5C Paediatrics"
                  value={newWardName}
                  onChange={e => setNewWardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ward Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WARD-5C"
                    value={newWardCode}
                    onChange={e => setNewWardCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specialty Type</label>
                  <select
                    value={newWardType}
                    onChange={e => setNewWardType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Medical">Medical</option>
                    <option value="Surgical">Surgical</option>
                    <option value="ICU">ICU</option>
                    <option value="HDU">HDU</option>
                    <option value="Paediatric">Paediatric</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Emergency Observation">Emergency Observation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newWardCapacity}
                    onChange={e => setNewWardCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Isolation Rms</label>
                  <input
                    type="number"
                    min="0"
                    value={newWardIsoCount}
                    onChange={e => setNewWardIsoCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Ext.</label>
                  <input
                    type="text"
                    value={newWardPhone}
                    onChange={e => setNewWardPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Charge Nurse / Ward Manager</label>
                <input
                  type="text"
                  placeholder="e.g. RN Chloe King"
                  value={newWardManager}
                  onChange={e => setNewWardManager(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddWardModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Add New Bed */}
      {showAddBedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-600" />
                Add Physical Bed (WF-026)
              </h3>
              <button onClick={() => setShowAddBedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBed} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ward Assignment *</label>
                <select
                  value={newBedWardId}
                  onChange={e => setNewBedWardId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-teal-600"
                >
                  {wards.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bed Number / Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5C-01"
                    value={newBedNumber}
                    onChange={e => setNewBedNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bed Acuity / Type</label>
                  <select
                    value={newBedType}
                    onChange={e => setNewBedType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-teal-600"
                  >
                    <option value="General">General</option>
                    <option value="ICU">ICU</option>
                    <option value="HDU">HDU</option>
                    <option value="Isolation">Isolation</option>
                    <option value="NegativePressure">Negative Pressure</option>
                    <option value="DaySurgery">Day Surgery</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBedModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Provision Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
