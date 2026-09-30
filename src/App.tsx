/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { TodayView } from './components/views/TodayView';
import { CasesView } from './components/views/CasesView';
import { CaseDetailView } from './components/views/CaseDetailView';
import { ArrangementBuilderView } from './components/views/ArrangementBuilderView';
import { PriceListsView } from './components/views/PriceListsView';
import { CalendarView } from './components/views/CalendarView';
import { SettingsView } from './components/views/SettingsView';
import { FamilyPortalModal } from './components/portal/FamilyPortalModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { NewCaseModal } from './components/common/NewCaseModal';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toast } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView />;
      case 'cases':
        return <CasesView />;
      case 'case_detail':
        return <CaseDetailView />;
      case 'arrangement_builder':
        return <ArrangementBuilderView />;
      case 'price_lists':
        return <PriceListsView />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7FA] font-sans antialiased text-[#2B3946] crystal-facet-bg">
      {/* 1. Left Sidebar Navigation (Max 7 items, quiet branding) */}
      <Sidebar />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with Breadcrumbs, Search, and Accessibility Controls */}
        <TopHeader />

        {/* FTC Compliance Safeguard Banner with Legal Disclaimer */}
        <ComplianceBanner />

        {/* Viewport Content Scroll Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* 3. Global Modals & Elder-Friendly Family Portal */}
      <FamilyPortalModal />
      <OnboardingModal />
      <NewCaseModal />

      {/* 4. Kind, Non-Intrusive Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="crystal-card bg-white/95 border border-[#C4A35A]/40 shadow-xl px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium text-[#1F2F3E]">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#5E8C7A]" />}
            {toast.type === 'amber' && <AlertTriangle className="w-4 h-4 text-[#C98A2B]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#3E5C76]" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
