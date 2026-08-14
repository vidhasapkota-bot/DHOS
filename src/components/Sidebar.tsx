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
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown
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
  criticalAlertsCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const navGroups: NavGroup[] = [
    {
      groupName: 'Command & Operations',
      items: [
        { id: 'command-centre', altIds: ['command'], label: 'Command Centre', icon: LayoutDashboard },
        { id: 'patient-registration', altIds: ['patients'], label: 'Patients & Admissions', icon: UserPlus },
        { id: 'bed-management', altIds: ['beds'], label: 'Bed Map & Capacity', icon: BedDouble },
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
      groupName: 'Enterprise & Governance',
      items: [
        { id: 'campus-config', altIds: ['campus', 'campuses', 'enterprise', 'hospital'], label: 'Enterprise & Campus Config', icon: Building2 },
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

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none bg-white">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        {!isCollapsed ? (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </span>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1">
          {/* Mobile close */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Desktop collapse */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
        {navGroups.map((group, groupIdx) => {
          const isGroupCollapsed = !!collapsedGroups[group.groupName] && !isCollapsed;

          return (
            <div key={groupIdx} className="space-y-0.5">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroupCollapse(group.groupName)}
                  className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition group"
                >
                  <span>{group.groupName}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                </button>
              )}

              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isTabActive(item.id, item.altIds);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition group ${
                          active
                            ? 'bg-blue-600 text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${
                          active
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`} />
                        {!isCollapsed && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}
                        {!isCollapsed && item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                            active ? 'bg-white text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-medium">DHOS Operating System</span>
          <span className="font-mono text-[10px] text-slate-400">v2.5</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block border-r border-slate-200/80 shrink-0 bg-white transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
