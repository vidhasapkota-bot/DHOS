import React, { useState } from 'react';
import {
  Plus,
  MapPin,
  Sliders,
  BedDouble,
  DoorOpen,
  Hospital,
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  X,
  Building as BuildingIcon,
  Layers,
  User,
  Clock,
  Edit2,
  Phone
} from 'lucide-react';
import { Campus, Building, Department, Ward, Bed, HospitalConfig, BedStatus, BedType } from '../types/dhos';

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

type HierarchyTier = 'hospital' | 'campus' | 'building' | 'ward' | 'bed';

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
  // Main Tab Navigation: Physical Hierarchy vs Departments
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'departments'>('hierarchy');

  // Currently selected item in hierarchy
  const [selectedTier, setSelectedTier] = useState<HierarchyTier>('hospital');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(config?.id || 'HOSP-001');
  const [selectedCampusId, setSelectedCampusId] = useState<string>(campuses[0]?.id || 'CAMP-01');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0]?.id || 'BLD-A');
  const [selectedWardId, setSelectedWardId] = useState<string>(wards[0]?.id || 'WARD-3A');
  const [selectedBedId, setSelectedBedId] = useState<string>(beds[0]?.id || 'BED-3A-01');

  // Hospital filter for Departments view
  const [deptHospitalFilter, setDeptHospitalFilter] = useState<string>(config?.id || 'HOSP-001');

  // Search & Tree expansion
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'HOSP-001': true,
    'CAMP-01': true,
    'BLD-A': true,
  });

  // Modals
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [showAddCampusModal, setShowAddCampusModal] = useState(false);
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showAddWardModal, setShowAddWardModal] = useState(false);
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [showBatchBedModal, setShowBatchBedModal] = useState(false);

  // Department editing
  const [editingDepId, setEditingDepId] = useState<string | null>(null);
  const [editDepManager, setEditDepManager] = useState('');
  const [editDepRule, setEditDepRule] = useState('');

  // Form states
  const [newHospName, setNewHospName] = useState('');
  const [newHospCode, setNewHospCode] = useState('');

  const [newCampusName, setNewCampusName] = useState('');
  const [newCampusCode, setNewCampusCode] = useState('');
  const [newCampusAddress, setNewCampusAddress] = useState('');
  const [newCampusBeds, setNewCampusBeds] = useState(250);

  const [newBldName, setNewBldName] = useState('');
  const [newBldCode, setNewBldCode] = useState('');
  const [newBldFloors, setNewBldFloors] = useState(5);
  const [newBldLift, setNewBldLift] = useState(true);

  const [newWardName, setNewWardName] = useState('');
  const [newWardCode, setNewWardCode] = useState('');
  const [newWardType, setNewWardType] = useState<Ward['wardType']>('Medical');
  const [newWardCapacity, setNewWardCapacity] = useState(12);
  const [newWardDepId, setNewWardDepId] = useState('');
  const [newWardManager, setNewWardManager] = useState('');
  const [newWardPhone, setNewWardPhone] = useState('x3200');

  const [newBedNumber, setNewBedNumber] = useState('');
  const [newBedType, setNewBedType] = useState<BedType>('General');

  const [batchPrefix, setBatchPrefix] = useState('3A-');
  const [batchStartNum, setBatchStartNum] = useState(11);
  const [batchEndNum, setBatchEndNum] = useState(15);
  const [batchBedType, setBatchBedType] = useState<BedType>('General');

  const [newDepHospitalId, setNewDepHospitalId] = useState(selectedHospitalId || 'HOSP-001');
  const [newDepName, setNewDepName] = useState('');
  const [newDepCode, setNewDepCode] = useState('');
  const [newDepManager, setNewDepManager] = useState('');
  const [newDepHours, setNewDepHours] = useState('24/7 Continuous');
  const [newDepRule, setNewDepRule] = useState('Escalate to Department Director if capacity > 90%');

  // Active object references
  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || config;
  const currentCampus = campuses.find(c => c.id === selectedCampusId) || campuses[0];
  const currentBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];
  const currentWard = wards.find(w => w.id === selectedWardId) || wards[0];
  const currentBed = beds.find(b => b.id === selectedBedId) || beds[0];

  // Tree toggle
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Selection handlers
  const handleSelectHospital = (hospId: string) => {
    setSelectedHospitalId(hospId);
    setDeptHospitalFilter(hospId);
    onSelectHospital(hospId);
    setSelectedTier('hospital');
  };

  const handleSelectCampus = (campId: string) => {
    setSelectedCampusId(campId);
    const camp = campuses.find(c => c.id === campId);
    if (camp && camp.hospitalId !== selectedHospitalId) {
      setSelectedHospitalId(camp.hospitalId);
      setDeptHospitalFilter(camp.hospitalId);
      onSelectHospital(camp.hospitalId);
    }
    const campBlds = buildings.filter(b => b.campusId === campId);
    if (campBlds.length > 0 && !campBlds.some(b => b.id === selectedBuildingId)) {
      setSelectedBuildingId(campBlds[0].id);
    }
    setSelectedTier('campus');
  };

  const handleSelectBuilding = (bldId: string) => {
    setSelectedBuildingId(bldId);
    const bld = buildings.find(b => b.id === bldId);
    if (bld) {
      setSelectedCampusId(bld.campusId);
      const camp = campuses.find(c => c.id === bld.campusId);
      if (camp && camp.hospitalId !== selectedHospitalId) {
        setSelectedHospitalId(camp.hospitalId);
        setDeptHospitalFilter(camp.hospitalId);
        onSelectHospital(camp.hospitalId);
      }
    }
    const bldWards = wards.filter(w => w.buildingId === bldId);
    if (bldWards.length > 0 && !bldWards.some(w => w.id === selectedWardId)) {
      setSelectedWardId(bldWards[0].id);
    }
    setSelectedTier('building');
  };

  const handleSelectWard = (wardId: string) => {
    setSelectedWardId(wardId);
    const ward = wards.find(w => w.id === wardId);
    if (ward) {
      setSelectedBuildingId(ward.buildingId);
      const bld = buildings.find(b => b.id === ward.buildingId);
      if (bld) {
        setSelectedCampusId(bld.campusId);
        const camp = campuses.find(c => c.id === bld.campusId);
        if (camp && camp.hospitalId !== selectedHospitalId) {
          setSelectedHospitalId(camp.hospitalId);
          setDeptHospitalFilter(camp.hospitalId);
          onSelectHospital(camp.hospitalId);
        }
      }
    }
    const wardBeds = beds.filter(b => b.wardId === wardId);
    if (wardBeds.length > 0 && !wardBeds.some(b => b.id === selectedBedId)) {
      setSelectedBedId(wardBeds[0].id);
    }
    setSelectedTier('ward');
  };

  const handleSelectBed = (bedId: string) => {
    setSelectedBedId(bedId);
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedWardId(bed.wardId);
      const ward = wards.find(w => w.id === bed.wardId);
      if (ward) {
        setSelectedBuildingId(ward.buildingId);
        const bld = buildings.find(b => b.id === ward.buildingId);
        if (bld) {
          setSelectedCampusId(bld.campusId);
          const camp = campuses.find(c => c.id === bld.campusId);
          if (camp && camp.hospitalId !== selectedHospitalId) {
            setSelectedHospitalId(camp.hospitalId);
            setDeptHospitalFilter(camp.hospitalId);
            onSelectHospital(camp.hospitalId);
          }
        }
      }
    }
    setSelectedTier('bed');
  };

  // Form Submits
  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName || !newHospCode) return;
    const newHosp: HospitalConfig = {
      id: `HOSP-00${hospitals.length + 1}`,
      name: newHospName,
      code: newHospCode.toUpperCase(),
      financialYear: '2026-2027',
      timeZone: 'Australia/Sydney (AEST/AEDT)',
      publicHolidays: ['2026-01-01', '2026-01-26', '2026-04-25', '2026-12-25'],
      workingWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      securityPolicy: { mfaRequired: true, sessionTimeoutMinutes: 30, passwordExpiryDays: 90 },
      aiSettings: { enabled: true, modelAlias: 'gemini-3.6-flash', autoAssist: true }
    };
    onAddHospital(newHosp);
    setShowAddHospitalModal(false);
    setNewHospName('');
    setNewHospCode('');
    handleSelectHospital(newHosp.id);
  };

  const handleCreateCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampusName || !newCampusCode) return;
    const newCampus: Campus = {
      id: `CAMP-0${campuses.length + 1}`,
      hospitalId: selectedHospitalId || 'HOSP-001',
      name: newCampusName,
      code: newCampusCode.toUpperCase(),
      address: newCampusAddress || 'Health Precinct, Metro District',
      status: 'Active',
      buildingsCount: 1,
      totalBedCapacity: Number(newCampusBeds) || 150,
    };
    onAddCampus(newCampus);
    setShowAddCampusModal(false);
    setNewCampusName('');
    setNewCampusCode('');
    setNewCampusAddress('');
    handleSelectCampus(newCampus.id);
  };

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBldName || !newBldCode) return;
    const newBld: Building = {
      id: `BLD-${String.fromCharCode(65 + buildings.length)}`,
      campusId: selectedCampusId,
      name: newBldName,
      code: newBldCode.toUpperCase(),
      floors: Number(newBldFloors) || 1,
      hasLiftAccess: Boolean(newBldLift),
    };
    onAddBuilding(newBld);
    setShowAddBuildingModal(false);
    setNewBldName('');
    setNewBldCode('');
    handleSelectBuilding(newBld.id);
  };

  const handleCreateWard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardName || !newWardCode) return;
    const hospDepts = departments.filter(d => d.hospitalId === selectedHospitalId);
    const chosenDepId = newWardDepId || hospDepts[0]?.id || 'DEP-MED';
    const newWard: Ward = {
      id: `WARD-${newWardCode.toUpperCase()}`,
      buildingId: selectedBuildingId,
      departmentId: chosenDepId,
      name: newWardName,
      code: newWardCode.toUpperCase(),
      wardType: newWardType,
      capacity: Number(newWardCapacity) || 10,
      occupiedCount: 0,
      nurseStationPhone: newWardPhone || 'x3200',
      isolationRoomsCount: 1,
      wardManager: newWardManager || 'Charge Nurse',
    };
    onAddWard(newWard);
    setShowAddWardModal(false);
    setNewWardName('');
    setNewWardCode('');
    setNewWardManager('');
    handleSelectWard(newWard.id);
  };

  const handleCreateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedNumber) return;
    const targetWard = currentWard;
    const targetBld = currentBuilding;
    const newBed: Bed = {
      id: `BED-${newBedNumber.replace(/\s+/g, '-').toUpperCase()}`,
      bedNumber: newBedNumber.toUpperCase(),
      wardId: targetWard.id,
      wardName: targetWard.name,
      buildingName: targetBld?.name || 'Inpatient Block',
      bedType: newBedType,
      status: 'Available',
    };
    onAddBed(newBed);
    setShowAddBedModal(false);
    setNewBedNumber('');
    handleSelectBed(newBed.id);
  };

  const handleBatchGenerateBeds = (e: React.FormEvent) => {
    e.preventDefault();
    const start = Math.min(Number(batchStartNum), Number(batchEndNum));
    const end = Math.max(Number(batchStartNum), Number(batchEndNum));
    for (let i = start; i <= end; i++) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const numStr = `${batchPrefix}${padded}`;
      const newBed: Bed = {
        id: `BED-${numStr.replace(/\s+/g, '-').toUpperCase()}`,
        bedNumber: numStr.toUpperCase(),
        wardId: currentWard.id,
        wardName: currentWard.name,
        buildingName: currentBuilding?.name || 'Inpatient Block',
        bedType: batchBedType,
        status: 'Available',
      };
      onAddBed(newBed);
    }
    setShowBatchBedModal(false);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName || !newDepCode) return;
    const newDep: Department = {
      id: `DEP-${newDepCode.toUpperCase()}`,
      name: newDepName,
      code: newDepCode.toUpperCase(),
      manager: newDepManager || 'Department Director',
      workingHours: newDepHours || '24/7 Continuous',
      escalationRule: newDepRule || 'Immediate escalation on capacity surge',
      hospitalId: newDepHospitalId || selectedHospitalId || 'HOSP-001',
    };
    onAddDepartment(newDep);
    setShowAddDepartmentModal(false);
    setNewDepName('');
    setNewDepCode('');
    setNewDepManager('');
    setDeptHospitalFilter(newDep.hospitalId);
  };

  const handleSaveDepartment = (depId: string) => {
    onUpdateDepartmentEscalation(depId, editDepManager, editDepRule);
    setEditingDepId(null);
  };

  // Helper counts and scoped lists
  const currentHospitalCampuses = campuses.filter(c => c.hospitalId === selectedHospitalId);
  const currentHospitalDepartments = departments.filter(d => d.hospitalId === selectedHospitalId);
  const currentCampusBuildings = buildings.filter(b => b.campusId === selectedCampusId);
  const currentBuildingWards = wards.filter(w => w.buildingId === selectedBuildingId);
  const currentWardBeds = beds.filter(b => b.wardId === selectedWardId);

  // Filtered departments for Departments Tab
  const activeDeptHospital = hospitals.find(h => h.id === deptHospitalFilter) || currentHospital;
  const filteredDepartments = departments.filter(d => d.hospitalId === deptHospitalFilter);

  // Status helper
  const getBedStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Occupied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Dirty':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cleaning':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Navigation Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Hospital className="w-5 h-5 text-blue-600" />
            Enterprise & Campus Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure multi-hospital infrastructure hierarchy and hospital-specific clinical departments.
          </p>
        </div>

        {/* 2 Primary Modes */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'hierarchy'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Physical Hierarchy (5 Tiers)
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'departments'
                ? 'bg-white text-violet-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Clinical Departments ({departments.length})
          </button>
        </div>
      </div>

      {/* MODE 1: PHYSICAL HIERARCHY (Hospital > Campus > Building > Ward > Bed) */}
      {activeTab === 'hierarchy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT: Clean Tree Navigator */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col max-h-[820px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hierarchy Tree
              </span>
              <button
                onClick={() => setShowAddHospitalModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Hospital
              </button>
            </div>

            {/* Quick Filter */}
            <div className="relative mt-2.5 mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter hierarchy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tree Nodes */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 text-xs scrollbar-thin">
              {hospitals
                .filter(h => !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(hosp => {
                  const isHospExpanded = expandedNodes[hosp.id] ?? true;
                  const isHospActive = selectedTier === 'hospital' && selectedHospitalId === hosp.id;
                  const hospCampuses = campuses.filter(c => c.hospitalId === hosp.id);

                  return (
                    <div key={hosp.id} className="space-y-1">
                      {/* Hospital Node */}
                      <div
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg group transition cursor-pointer ${
                          isHospActive ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-800'
                        }`}
                        onClick={() => handleSelectHospital(hosp.id)}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleNode(hosp.id);
                            }}
                            className="p-0.5 hover:bg-black/10 rounded"
                          >
                            {isHospExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                          <Hospital className={`w-3.5 h-3.5 shrink-0 ${isHospActive ? 'text-white' : 'text-blue-600'}`} />
                          <span className="truncate">{hosp.name}</span>
                        </div>
                        <span className={`text-[10px] px-1 rounded font-mono ${
                          isHospActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {hospCampuses.length} Campuses
                        </span>
                      </div>

                      {/* Campuses */}
                      {isHospExpanded && (
                        <div className="pl-3.5 ml-2.5 border-l border-slate-200 space-y-1">
                          {hospCampuses.map(camp => {
                            const isCampExpanded = expandedNodes[camp.id] ?? true;
                            const isCampActive = selectedTier === 'campus' && selectedCampusId === camp.id;
                            const campBlds = buildings.filter(b => b.campusId === camp.id);

                            return (
                              <div key={camp.id} className="space-y-1">
                                <div
                                  className={`flex items-center justify-between px-2 py-1 rounded-md group transition cursor-pointer ${
                                    isCampActive ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                                  }`}
                                  onClick={() => handleSelectCampus(camp.id)}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        toggleNode(camp.id);
                                      }}
                                      className="p-0.5 hover:bg-black/10 rounded"
                                    >
                                      {isCampExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    </button>
                                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCampActive ? 'text-white' : 'text-indigo-600'}`} />
                                    <span className="truncate">{camp.name}</span>
                                  </div>
                                  <span className={`text-[9px] px-1 rounded font-mono ${
                                    isCampActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {campBlds.length} BLD
                                  </span>
                                </div>

                                {/* Buildings */}
                                {isCampExpanded && (
                                  <div className="pl-3.5 ml-2.5 border-l border-slate-200 space-y-1">
                                    {campBlds.map(bld => {
                                      const isBldExpanded = expandedNodes[bld.id] ?? true;
                                      const isBldActive = selectedTier === 'building' && selectedBuildingId === bld.id;
                                      const bldWards = wards.filter(w => w.buildingId === bld.id);

                                      return (
                                        <div key={bld.id} className="space-y-1">
                                          <div
                                            className={`flex items-center justify-between px-2 py-1 rounded-md group transition cursor-pointer ${
                                              isBldActive ? 'bg-violet-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                                            }`}
                                            onClick={() => handleSelectBuilding(bld.id)}
                                          >
                                            <div className="flex items-center gap-1.5 truncate">
                                              <button
                                                type="button"
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  toggleNode(bld.id);
                                                }}
                                                className="p-0.5 hover:bg-black/10 rounded"
                                              >
                                                {isBldExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                              </button>
                                              <BuildingIcon className={`w-3.5 h-3.5 shrink-0 ${isBldActive ? 'text-white' : 'text-violet-600'}`} />
                                              <span className="truncate">{bld.name}</span>
                                            </div>
                                            <span className={`text-[9px] px-1 rounded font-mono ${
                                              isBldActive ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                              {bldWards.length} Wards
                                            </span>
                                          </div>

                                          {/* Wards */}
                                          {isBldExpanded && (
                                            <div className="pl-3.5 ml-2.5 border-l border-slate-200 space-y-1">
                                              {bldWards.map(ward => {
                                                const isWardExpanded = expandedNodes[ward.id] ?? false;
                                                const isWardActive = selectedTier === 'ward' && selectedWardId === ward.id;
                                                const wardBeds = beds.filter(b => b.wardId === ward.id);

                                                return (
                                                  <div key={ward.id} className="space-y-0.5">
                                                    <div
                                                      className={`flex items-center justify-between px-2 py-1 rounded-md group transition cursor-pointer ${
                                                        isWardActive ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                                                      }`}
                                                      onClick={() => handleSelectWard(ward.id)}
                                                    >
                                                      <div className="flex items-center gap-1.5 truncate">
                                                        <button
                                                          type="button"
                                                          onClick={e => {
                                                            e.stopPropagation();
                                                            toggleNode(ward.id);
                                                          }}
                                                          className="p-0.5 hover:bg-black/10 rounded"
                                                        >
                                                          {isWardExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                        </button>
                                                        <DoorOpen className={`w-3.5 h-3.5 shrink-0 ${isWardActive ? 'text-white' : 'text-emerald-600'}`} />
                                                        <span className="truncate">{ward.name}</span>
                                                      </div>
                                                      <span className={`text-[9px] px-1 rounded font-mono ${
                                                        isWardActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                                                      }`}>
                                                        {wardBeds.length} Beds
                                                      </span>
                                                    </div>

                                                    {/* Beds */}
                                                    {isWardExpanded && (
                                                      <div className="pl-3.5 ml-2.5 border-l border-slate-200 space-y-0.5">
                                                        {wardBeds.map(bed => {
                                                          const isBedActive = selectedTier === 'bed' && selectedBedId === bed.id;
                                                          return (
                                                            <div
                                                              key={bed.id}
                                                              onClick={() => handleSelectBed(bed.id)}
                                                              className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer text-[11px] transition ${
                                                                isBedActive ? 'bg-teal-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-600'
                                                              }`}
                                                            >
                                                              <div className="flex items-center gap-1.5 truncate">
                                                                <BedDouble className={`w-3 h-3 shrink-0 ${isBedActive ? 'text-white' : 'text-teal-600'}`} />
                                                                <span>{bed.bedNumber}</span>
                                                              </div>
                                                              <span className={`text-[9px] font-medium ${
                                                                isBedActive ? 'text-white' : 'text-slate-400'
                                                              }`}>
                                                                {bed.status}
                                                              </span>
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* RIGHT: Detail & Child Management Pane */}
          <div className="lg:col-span-8 space-y-4">
            {/* Unified Breadcrumb Bar */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto shadow-xs">
              <button
                onClick={() => handleSelectHospital(currentHospital.id)}
                className={`hover:text-blue-600 whitespace-nowrap ${selectedTier === 'hospital' ? 'font-bold text-blue-700' : ''}`}
              >
                {currentHospital.name}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              <button
                onClick={() => handleSelectCampus(currentCampus.id)}
                className={`hover:text-indigo-600 whitespace-nowrap ${selectedTier === 'campus' ? 'font-bold text-indigo-700' : ''}`}
              >
                {currentCampus?.name || 'Campus'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              <button
                onClick={() => handleSelectBuilding(currentBuilding.id)}
                className={`hover:text-violet-600 whitespace-nowrap ${selectedTier === 'building' ? 'font-bold text-violet-700' : ''}`}
              >
                {currentBuilding?.name || 'Building'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              <button
                onClick={() => handleSelectWard(currentWard.id)}
                className={`hover:text-emerald-600 whitespace-nowrap ${selectedTier === 'ward' ? 'font-bold text-emerald-700' : ''}`}
              >
                {currentWard?.name || 'Ward'}
              </button>

              {selectedTier === 'bed' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="font-bold text-teal-700 whitespace-nowrap">
                    Bed {currentBed?.bedNumber}
                  </span>
                </>
              )}
            </div>

            {/* LEVEL 1: HOSPITAL VIEW */}
            {selectedTier === 'hospital' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                        Hospital Entity
                      </span>
                      <span className="text-xs font-mono text-slate-400">{currentHospital.code}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{currentHospital.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDeptHospitalFilter(currentHospital.id);
                        setActiveTab('departments');
                      }}
                      className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Sliders className="w-3.5 h-3.5" /> View {currentHospitalDepartments.length} Departments
                    </button>
                    <button
                      onClick={() => setShowAddCampusModal(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Campus Site
                    </button>
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Campuses</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentHospitalCampuses.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Hospital Departments</span>
                    <p className="text-lg font-bold text-violet-700 mt-0.5">{currentHospitalDepartments.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Timezone</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{currentHospital.timeZone}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Financial Year</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{currentHospital.financialYear}</p>
                  </div>
                </div>

                {/* Campuses Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Campuses / Sites in this Hospital
                  </h3>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-2.5">Campus Name</th>
                          <th className="p-2.5">Code</th>
                          <th className="p-2.5">Address</th>
                          <th className="p-2.5">Buildings</th>
                          <th className="p-2.5">Bed Capacity</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentHospitalCampuses.map(c => {
                          const bldCount = buildings.filter(b => b.campusId === c.id).length;
                          return (
                            <tr key={c.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-2.5 font-semibold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                {c.name}
                              </td>
                              <td className="p-2.5 font-mono text-slate-500">{c.code}</td>
                              <td className="p-2.5 text-slate-500">{c.address}</td>
                              <td className="p-2.5 font-medium">{bldCount} Blocks</td>
                              <td className="p-2.5 font-medium">{c.totalBedCapacity} Beds</td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => handleSelectCampus(c.id)}
                                  className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-0.5"
                                >
                                  Manage <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hospital's Registered Departments Quick View */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-violet-600" />
                      Departments belonging to {currentHospital.name} ({currentHospitalDepartments.length})
                    </h3>
                    <button
                      onClick={() => {
                        setDeptHospitalFilter(currentHospital.id);
                        setActiveTab('departments');
                      }}
                      className="text-xs text-violet-600 hover:text-violet-800 font-semibold"
                    >
                      Manage All Departments →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {currentHospitalDepartments.map(dep => (
                      <div key={dep.id} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>{dep.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{dep.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">Director: {dep.manager}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 2: CAMPUS VIEW */}
            {selectedTier === 'campus' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                        Campus Site
                      </span>
                      <span className="text-xs font-mono text-slate-400">{currentCampus.code}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        {currentCampus.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{currentCampus.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {currentCampus.address}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddBuildingModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Building Block
                  </button>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Buildings</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentCampusBuildings.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Licensed Bed Capacity</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentCampus.totalBedCapacity} Beds</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Parent Hospital</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{currentHospital.name}</p>
                  </div>
                </div>

                {/* Buildings Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Building Blocks at {currentCampus.name}
                  </h3>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-2.5">Building Name</th>
                          <th className="p-2.5">Code</th>
                          <th className="p-2.5">Floors</th>
                          <th className="p-2.5">Lift Access</th>
                          <th className="p-2.5">Wards</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentCampusBuildings.map(bld => {
                          const wardCount = wards.filter(w => w.buildingId === bld.id).length;
                          return (
                            <tr key={bld.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-2.5 font-semibold text-slate-900 flex items-center gap-2">
                                <BuildingIcon className="w-3.5 h-3.5 text-violet-600" />
                                {bld.name}
                              </td>
                              <td className="p-2.5 font-mono text-slate-500">{bld.code}</td>
                              <td className="p-2.5 text-slate-600">{bld.floors} Levels</td>
                              <td className="p-2.5">
                                {bld.hasLiftAccess ? (
                                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Lift Available
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">No Lift</span>
                                )}
                              </td>
                              <td className="p-2.5 font-medium">{wardCount} Inpatient Wards</td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => handleSelectBuilding(bld.id)}
                                  className="text-violet-600 hover:text-violet-800 font-bold inline-flex items-center gap-0.5"
                                >
                                  Manage <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 3: BUILDING VIEW */}
            {selectedTier === 'building' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-md">
                        Building Block
                      </span>
                      <span className="text-xs font-mono text-slate-400">{currentBuilding.code}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{currentBuilding.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Located in <span className="font-semibold text-slate-700">{currentCampus.name}</span> • {currentBuilding.floors} Floors
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const hospDepts = departments.filter(d => d.hospitalId === selectedHospitalId);
                      setNewWardDepId(hospDepts[0]?.id || '');
                      setShowAddWardModal(true);
                    }}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Inpatient Ward
                  </button>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Wards</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentBuildingWards.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Floors / Levels</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentBuilding.floors}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Stretcher Elevator</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {currentBuilding.hasLiftAccess ? 'Yes (Certified)' : 'None'}
                    </p>
                  </div>
                </div>

                {/* Wards Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Inpatient Wards in {currentBuilding.name}
                  </h3>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-2.5">Ward Name</th>
                          <th className="p-2.5">Clinical Department</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Capacity</th>
                          <th className="p-2.5">Nurse Phone</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentBuildingWards.map(w => {
                          const dept = departments.find(d => d.id === w.departmentId);
                          return (
                            <tr key={w.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-2.5 font-semibold text-slate-900 flex items-center gap-2">
                                <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                                {w.name}
                              </td>
                              <td className="p-2.5 text-slate-600">{dept?.name || 'General'}</td>
                              <td className="p-2.5 text-slate-600">{w.wardType}</td>
                              <td className="p-2.5 font-medium">{w.capacity} Beds</td>
                              <td className="p-2.5 font-mono text-slate-500">{w.nurseStationPhone}</td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => handleSelectWard(w.id)}
                                  className="text-emerald-600 hover:text-emerald-800 font-bold inline-flex items-center gap-0.5"
                                >
                                  Manage <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 4: WARD VIEW */}
            {selectedTier === 'ward' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        Inpatient Ward
                      </span>
                      <span className="text-xs font-mono text-slate-400">{currentWard.code}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{currentWard.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Building: <span className="font-semibold text-slate-700">{currentBuilding.name}</span> • Department: <span className="font-semibold text-slate-700">{departments.find(d => d.id === currentWard.departmentId)?.name || 'Clinical'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBatchBedModal(true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                    >
                      Batch Add Beds
                    </button>
                    <button
                      onClick={() => setShowAddBedModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Bed
                    </button>
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Beds</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{currentWardBeds.length} / {currentWard.capacity}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Ward Specialty</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{currentWard.wardType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Nurse Station Ext.</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {currentWard.nurseStationPhone}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Charge Nurse / Lead</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{currentWard.wardManager}</p>
                  </div>
                </div>

                {/* Beds Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Beds Configured in {currentWard.name} ({currentWardBeds.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {currentWardBeds.map(bed => (
                      <div
                        key={bed.id}
                        onClick={() => handleSelectBed(bed.id)}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg cursor-pointer transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-teal-600" />
                            {bed.bedNumber}
                          </span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${getBedStatusBadge(bed.status)}`}>
                            {bed.status}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-500">
                          <p className="font-semibold text-slate-700 truncate">{bed.bedType} Bed</p>
                          {bed.currentPatientName ? (
                            <p className="text-blue-700 font-medium truncate mt-0.5">
                              {bed.currentPatientName}
                            </p>
                          ) : (
                            <p className="text-slate-400 mt-0.5 italic">No Patient</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 5: BED VIEW */}
            {selectedTier === 'bed' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                        Bed Unit
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getBedStatusBadge(currentBed.status)}`}>
                        {currentBed.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">Bed {currentBed.bedNumber}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ward: <span className="font-semibold text-slate-700">{currentWard.name}</span> • Building: <span className="font-semibold text-slate-700">{currentBuilding.name}</span>
                    </p>
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Acuity Type</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{currentBed.bedType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Operational Status</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{currentBed.status}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Current Patient</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                      {currentBed.currentPatientName || 'None (Empty)'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Parent Ward</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{currentWard.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: CLINICAL DEPARTMENTS (SCOPED BY HOSPITAL) */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {/* Header & Hospital Selector Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-600" />
                  Hospital Clinical Departments & Escalations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Each hospital maintains its own distinct clinical and operational departments, service directors, and escalation rules.
                </p>
              </div>
              <button
                onClick={() => {
                  setNewDepHospitalId(deptHospitalFilter);
                  setShowAddDepartmentModal(true);
                }}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add Department to Hospital
              </button>
            </div>

            {/* Hospital Selector Filter Pills */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Select Hospital:</span>
              {hospitals.map(hosp => {
                const hospDepCount = departments.filter(d => d.hospitalId === hosp.id).length;
                const isSelected = deptHospitalFilter === hosp.id;
                return (
                  <button
                    key={hosp.id}
                    onClick={() => setDeptHospitalFilter(hosp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                      isSelected
                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Hospital className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    {hosp.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-violet-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hospDepCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Department Cards Grid for Selected Hospital */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredDepartments.map(dep => {
              const assignedWards = wards.filter(w => w.departmentId === dep.id);
              const isEditing = editingDepId === dep.id;

              return (
                <div key={dep.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center font-bold text-xs">
                        {dep.code.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{dep.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{dep.code}</span>
                      </div>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingDepId(dep.id);
                          setEditDepManager(dep.manager);
                          setEditDepRule(dep.escalationRule);
                        }}
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-slate-50 rounded-lg transition"
                        title="Edit Department Escalation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Manager & Rules */}
                  {isEditing ? (
                    <div className="space-y-2.5 p-3 bg-violet-50/50 border border-violet-200 rounded-lg text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Appointed Manager
                        </label>
                        <input
                          type="text"
                          value={editDepManager}
                          onChange={e => setEditDepManager(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Surge Escalation Protocol
                        </label>
                        <textarea
                          rows={2}
                          value={editDepRule}
                          onChange={e => setEditDepRule(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingDepId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveDepartment(dep.id)}
                          className="px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded hover:bg-violet-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <User className="w-3 h-3" /> Appointed Director:
                        </span>
                        <span className="font-semibold text-slate-900">{dep.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" /> Operating Hours:
                        </span>
                        <span className="font-medium text-slate-800">{dep.workingHours}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200/80 text-[11px]">
                        <span className="font-bold text-slate-600 block mb-0.5">Escalation Protocol:</span>
                        <p className="text-slate-600 italic">{dep.escalationRule}</p>
                      </div>
                    </div>
                  )}

                  {/* Assigned Wards List */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Assigned Inpatient Wards:</span>
                    <span className="font-semibold text-slate-800">
                      {assignedWards.length > 0
                        ? assignedWards.map(w => w.name).join(', ')
                        : 'Outpatient / Auxiliary Service'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredDepartments.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                No clinical departments configured yet for {activeDeptHospital.name}. Click "Add Department to Hospital" above to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Add Hospital */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-blue-600" /> Add New Hospital Entity
              </h3>
              <button onClick={() => setShowAddHospitalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Vincent Metropolitan Health"
                  value={newHospName}
                  onChange={e => setNewHospName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SVMH"
                  value={newHospCode}
                  onChange={e => setNewHospCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddHospitalModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Create Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Campus */}
      {showAddCampusModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Add Campus Site to {currentHospital.name}
              </h3>
              <button onClick={() => setShowAddCampusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampus} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Shore Medical Campus"
                  value={newCampusName}
                  onChange={e => setNewCampusName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NSMC"
                    value={newCampusCode}
                    onChange={e => setNewCampusCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Beds</label>
                  <input
                    type="number"
                    value={newCampusBeds}
                    onChange={e => setNewCampusBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 100 University Ave, Health Precinct"
                  value={newCampusAddress}
                  onChange={e => setNewCampusAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCampusModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Create Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Building */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BuildingIcon className="w-4 h-4 text-violet-600" /> Add Building Block
              </h3>
              <button onClick={() => setShowAddBuildingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBuilding} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Services Tower B"
                  value={newBldName}
                  onChange={e => setNewBldName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Building Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLD-B"
                    value={newBldCode}
                    onChange={e => setNewBldCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floors / Levels</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newBldFloors}
                    onChange={e => setNewBldFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="liftCheck"
                  checked={newBldLift}
                  onChange={e => setNewBldLift(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="liftCheck" className="text-slate-700 font-medium">
                  Stretcher Lift / Elevator Access Available
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold"
                >
                  Create Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Ward */}
      {showAddWardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-emerald-600" /> Add Inpatient Ward
              </h3>
              <button onClick={() => setShowAddWardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWard} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ward Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 5C Respiratory & Oncology"
                  value={newWardName}
                  onChange={e => setNewWardName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ward Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. W5C"
                    value={newWardCode}
                    onChange={e => setNewWardCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity (Beds)</label>
                  <input
                    type="number"
                    min="1"
                    value={newWardCapacity}
                    onChange={e => setNewWardCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Department Selector Filtered Strictly by Hospital */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Department ({currentHospital.name}) *
                </label>
                <select
                  value={newWardDepId}
                  onChange={e => setNewWardDepId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  {currentHospitalDepartments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                  {currentHospitalDepartments.length === 0 && (
                    <option value="">No departments in {currentHospital.name}</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ward Specialty</label>
                  <select
                    value={newWardType}
                    onChange={e => setNewWardType(e.target.value as Ward['wardType'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Medical">Medical</option>
                    <option value="Surgical">Surgical</option>
                    <option value="ICU">ICU</option>
                    <option value="HDU">HDU</option>
                    <option value="Paediatric">Paediatric</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Emergency Observation">Emergency Observation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nurse Station Ext</label>
                  <input
                    type="text"
                    value={newWardPhone}
                    onChange={e => setNewWardPhone(e.target.value)}
                    placeholder="e.g. x5100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nurse Unit Manager / Lead</label>
                <input
                  type="text"
                  value={newWardManager}
                  onChange={e => setNewWardManager(e.target.value)}
                  placeholder="e.g. Sr. Sarah Connor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddWardModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Create Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Bed */}
      {showAddBedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-teal-600" /> Add Bed to {currentWard.name}
              </h3>
              <button onClick={() => setShowAddBedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBed} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bed Number / Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3A-11"
                  value={newBedNumber}
                  onChange={e => setNewBedNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acuity / Type</label>
                <select
                  value={newBedType}
                  onChange={e => setNewBedType(e.target.value as BedType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="HDU">HDU</option>
                  <option value="Isolation">Isolation</option>
                  <option value="Negative Pressure">Negative Pressure</option>
                  <option value="Day Surgery">Day Surgery</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBedModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  Create Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Batch Add Beds */}
      {showBatchBedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-teal-600" /> Batch Provision Beds
              </h3>
              <button onClick={() => setShowBatchBedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchGenerateBeds} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prefix</label>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={e => setBatchPrefix(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Number</label>
                  <input
                    type="number"
                    value={batchStartNum}
                    onChange={e => setBatchStartNum(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Number</label>
                  <input
                    type="number"
                    value={batchEndNum}
                    onChange={e => setBatchEndNum(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acuity Type</label>
                <select
                  value={batchBedType}
                  onChange={e => setBatchBedType(e.target.value as BedType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="HDU">HDU</option>
                  <option value="Isolation">Isolation</option>
                  <option value="Negative Pressure">Negative Pressure</option>
                  <option value="Day Surgery">Day Surgery</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchBedModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  Generate Beds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Department */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-600" /> Add Clinical Department
              </h3>
              <button onClick={() => setShowAddDepartmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-3 mt-4 text-xs">
              {/* Target Hospital Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Hospital *</label>
                <select
                  value={newDepHospitalId}
                  onChange={e => setNewDepHospitalId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology & Vascular Medicine"
                  value={newDepName}
                  onChange={e => setNewDepName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CARD"
                    value={newDepCode}
                    onChange={e => setNewDepCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={newDepHours}
                    onChange={e => setNewDepHours(e.target.value)}
                    placeholder="e.g. 24/7 Continuous"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointed Director / Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Catherine Mitchell"
                  value={newDepManager}
                  onChange={e => setNewDepManager(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Surge Escalation Protocol</label>
                <textarea
                  rows={2}
                  value={newDepRule}
                  onChange={e => setNewDepRule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDepartmentModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
