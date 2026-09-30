import React from 'react';
import { 
  CalendarDays, 
  Folders, 
  UserCheck, 
  FileSpreadsheet, 
  ScrollText, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon,
  HeartHandshake,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { CrystalFacetLogo } from '../common/CrystalFacetLogo';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cases, 
    launchFamilyPortal, 
    currentCase,
    setIsOnboardingOpen,
    funeralHomeInfo
  } = useApp();

  const activeCasesCount = cases.filter(c => c.status !== 'closed').length;
  const complianceAttentionCount = cases.filter(c => c.compliance.status === 'attention_needed').length;

  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: CalendarDays, badge: complianceAttentionCount > 0 ? `${complianceAttentionCount} alerts` : undefined },
    { id: 'cases', label: 'Cases', icon: Folders, badge: activeCasesCount },
    { id: 'case_detail', label: 'Case Detail', icon: UserCheck },
    { id: 'arrangement_builder', label: 'Arrangement Builder', icon: FileSpreadsheet },
    { id: 'price_lists', label: 'Price Lists', icon: ScrollText },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-[#E3EBF2] flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Branding */}
      <div>
        <div className="p-6 border-b border-[#E3EBF2]/70">
          <CrystalFacetLogo size={24} />
          <div className="mt-3.5 pt-3 border-t border-[#E3EBF2]/60 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-[#1F2F3E] truncate">{funeralHomeInfo.name}</p>
              <p className="text-[11px] text-[#2B3946]/60 truncate">License {funeralHomeInfo.licenseNumber}</p>
            </div>
          </div>
        </div>

        {/* Navigation list (Max 7 items with plain labels) */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A] ${
                  isActive
                    ? 'bg-[#3E5C76] text-white shadow-sm'
                    : 'text-[#2B3946] hover:bg-[#F4F7FA] hover:text-[#1F2F3E]'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#3E5C76]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'today' && complianceAttentionCount > 0
                        ? 'bg-[#C98A2B]/15 text-[#C98A2B] font-semibold'
                        : 'bg-[#E3EBF2] text-[#2B3946]/70'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Family Portal Launcher */}
      <div className="p-4 space-y-3 border-t border-[#E3EBF2]/70 bg-gradient-to-b from-transparent to-[#F4F7FA]/40">
        {/* Family Portal Quick Test Link */}
        <div className="rounded-xl p-3 bg-[#FBF9F4] border border-[#C4A35A]/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#1F2F3E] flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C4A35A]" />
              Family Portal
            </span>
            <span className="text-[10px] text-[#5E8C7A] font-medium">Live Safe</span>
          </div>
          <p className="text-[11px] text-[#2B3946]/70 mb-2 leading-relaxed">
            Elder-friendly, calm interface for {currentCase?.lovedOne.firstName || 'Family'}.
          </p>
          <button
            type="button"
            onClick={() => launchFamilyPortal()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A]/25 hover:bg-[#C4A35A]/35 border border-[#C4A35A]/50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A]"
          >
            <span>Launch Family View</span>
            <ExternalLink className="w-3 h-3 text-[#1F2F3E]" />
          </button>
        </div>

        {/* Onboarding Setup button */}
        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#3E5C76] hover:text-[#1F2F3E] hover:bg-[#E3EBF2]/40 rounded-lg transition-colors"
        >
          <span>
            First-time Setup Tour
          </span>
          <span className="text-[10px] text-[#2B3946]/50">4 steps</span>
        </button>

        {/* Staff user profile */}
        <div className="pt-2 border-t border-[#E3EBF2]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-[#3E5C76] text-white flex items-center justify-center font-serif text-xs shrink-0 font-medium">
              EV
            </div>
            <div className="truncate">
              <p className="font-medium text-[#1F2F3E] truncate">Eleanor Vance</p>
              <p className="text-[11px] text-[#2B3946]/60 truncate">Funeral Director</p>
            </div>
          </div>
          <span title="Encrypted Connection" className="text-[#5E8C7A]">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
      </div>
    </aside>
  );
};
