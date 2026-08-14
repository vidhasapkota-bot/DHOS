import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  BedDouble,
  Flame,
  Scissors,
  HeartPulse,
  ClipboardList,
  FlaskConical,
  Pill,
  Utensils,
  Sparkles,
  Truck,
  Wrench,
  Package,
  Users,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  criticalAlertsCount?: number;
}

interface NavGroup {
  groupName: string;
  items: {
    id: string;
    altIds?: string[];
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  criticalAlertsCount = 0,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      groupName: 'Command & Operations',
      items: [
        { id: 'command-centre', altIds: ['command'], label: 'Command Centre', icon: LayoutDashboard },
        { id: 'patient-registration', altIds: ['patients'], label: 'Patients & Admissions', icon: UserPlus },
        { id: 'bed-management', altIds: ['beds'], label: 'Bed Map & Allocations', icon: BedDouble },
      ],
    },
    {
      groupName: 'Clinical Departments',
      items: [
        { id: 'emergency', label: 'Emergency Dept (ED)', icon: Flame },
        { id: 'operating-theatre', altIds: ['theatre'], label: 'Operating Theatre (OT)', icon: Scissors },
        { id: 'icu', label: 'Critical Care (ICU)', icon: HeartPulse },
        { id: 'wards-clinical', altIds: ['wards'], label: 'Ward Clinical Care', icon: ClipboardList },
      ],
    },
    {
      groupName: 'Diagnostics & Pharmacy',
      items: [
        { id: 'diagnostics', label: 'Diagnostics & PACS', icon: FlaskConical, badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined },
        { id: 'pharmacy', label: 'Pharmacy & Meds', icon: Pill },
      ],
    },
    {
      groupName: 'Support Services',
      items: [
        { id: 'nutrition', label: 'Meals & Nutrition', icon: Utensils },
        { id: 'evs', label: 'EVS Housekeeping', icon: Sparkles },
        { id: 'logistics', label: 'Logistics & Porters', icon: Truck },
        { id: 'facilities-biomedical', altIds: ['facilities'], label: 'Facilities & Biomedical', icon: Wrench },
        { id: 'supply-chain', altIds: ['supply'], label: 'Supply Chain', icon: Package },
      ],
    },
    {
      groupName: 'Governance & Staff',
      items: [
        { id: 'workforce', label: 'Workforce & Roster', icon: Users },
        { id: 'grac', label: 'Governance & GRAC', icon: ShieldAlert },
      ],
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const isTabActive = (id: string, altIds?: string[]) => {
    if (activeTab === id) return true;
    if (altIds && altIds.includes(activeTab)) return true;
    return false;
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Sidebar Header / Collapse Toggle */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            System Modules
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.groupName}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isTabActive(item.id, item.altIds);

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition group ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 text-center font-medium">
          DHOS Enterprise Hub • 16 Modules
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 md:hidden transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block bg-white border-r border-slate-200 shrink-0 sticky top-[105px] h-[calc(100vh-105px)] transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
