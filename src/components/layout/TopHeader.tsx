import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Type, 
  Contrast, 
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopHeader: React.FC = () => {
  const { 
    currentView, 
    currentCase, 
    setCurrentView, 
    setIsNewCaseModalOpen,
    isLargeText,
    toggleLargeText,
    isHighContrast,
    toggleHighContrast,
    cases,
    navigateToCase
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredCases = searchQuery.trim() === '' ? [] : cases.filter(c => 
    c.lovedOne.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lovedOne.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.familyContacts.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getViewBreadcrumb = () => {
    switch (currentView) {
      case 'today':
        return 'Today & Daily Schedule';
      case 'cases':
        return 'Active & Archived Cases';
      case 'case_detail':
        return currentCase ? `${currentCase.lovedOne.firstName} ${currentCase.lovedOne.lastName} (${currentCase.caseNumber})` : 'Case Details';
      case 'arrangement_builder':
        return currentCase ? `Arrangement Builder · ${currentCase.lovedOne.firstName} ${currentCase.lovedOne.lastName}` : 'Arrangement Builder';
      case 'price_lists':
        return 'FTC Price Lists (GPL / CPL / OPL)';
      case 'calendar':
        return 'Chapel & Vehicle Calendar';
      case 'settings':
        return 'Settings & Compliance Controls';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-[#E3EBF2] bg-white/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 select-none shrink-0 z-10">
      {/* Zone 1: Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-sm text-[#2B3946] min-w-0">
        <span 
          onClick={() => setCurrentView('today')} 
          className="text-[#3E5C76] hover:underline cursor-pointer font-medium truncate shrink-0"
        >
          Aurel Care
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#2B3946]/40 shrink-0" />
        <span className="font-semibold text-[#1F2F3E] truncate">
          {getViewBreadcrumb()}
        </span>
      </div>

      {/* Zone 2: Real-time Search with quick popover */}
      <div className="relative max-w-md w-full hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#2B3946]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by loved one name, case #, or family..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            className="w-full bg-[#F4F7FA] hover:bg-white focus:bg-white text-xs pl-9 pr-4 py-2 rounded-xl border border-[#E3EBF2] focus:border-[#C4A35A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A] transition-colors"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && filteredCases.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E3EBF2] p-2 space-y-1 max-h-72 overflow-y-auto z-50">
            {filteredCases.map(c => (
              <button
                key={c.id}
                onMouseDown={() => {
                  navigateToCase(c.id, 'overview');
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-[#F4F7FA] transition-colors text-xs"
              >
                <div>
                  <p className="font-semibold text-[#1F2F3E]">
                    {c.lovedOne.firstName} {c.lovedOne.lastName}
                  </p>
                  <p className="text-[11px] text-[#2B3946]/60">
                    {c.caseNumber} · {c.serviceLocation}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#3E5C76]">
                  {c.status.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Accessibility Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Elder / Vision Accessibility Toggles */}
        <div className="flex items-center bg-[#F4F7FA] p-0.5 rounded-lg border border-[#E3EBF2]">
          <button
            type="button"
            onClick={toggleLargeText}
            title={isLargeText ? 'Disable large text mode' : 'Enable elder-friendly large text'}
            className={`p-1.5 rounded-md transition-colors ${
              isLargeText 
                ? 'bg-white text-[#3E5C76] shadow-xs font-bold' 
                : 'text-[#2B3946]/70 hover:text-[#1F2F3E]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleHighContrast}
            title={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            className={`p-1.5 rounded-md transition-colors ${
              isHighContrast 
                ? 'bg-white text-[#1F2F3E] shadow-xs' 
                : 'text-[#2B3946]/70 hover:text-[#1F2F3E]'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsNewCaseModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4A35A] whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Case Intake</span>
        </button>
      </div>
    </header>
  );
};
