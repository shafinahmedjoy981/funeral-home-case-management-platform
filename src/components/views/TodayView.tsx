import React from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ArrowRight, 
  HeartHandshake, 
  Users, 
  FileText, 
  ShieldAlert, 
  MapPin,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';
import { ComplianceBadge } from '../common/ComplianceBadge';
import { StatusChip } from '../common/StatusChip';

export const TodayView: React.FC = () => {
  const { 
    cases, 
    navigateToCase, 
    launchFamilyPortal, 
    setIsNewCaseModalOpen,
    setCurrentView,
    calendarEvents 
  } = useApp();

  const activeCases = cases.filter(c => c.status !== 'closed');
  const firstCalls = cases.filter(c => c.status === 'first_call');
  const complianceAlerts = cases.filter(c => c.compliance.status === 'attention_needed');
  const servicesThisWeek = calendarEvents.slice(0, 3);

  // Cases needing attention
  const urgentTasks = cases
    .filter(c => c.nextStep)
    .sort((a, b) => (b.nextStep?.isUrgent ? 1 : 0) - (a.nextStep?.isUrgent ? 1 : 0))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#3E5C76] font-semibold">
            Monday, September 28, 2026
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#1F2F3E] mt-1 tracking-tight">
            Good afternoon, Eleanor.
          </h1>
          <p className="text-sm text-[#2B3946]/80 mt-1 max-w-xl">
            You are currently caring for 7 active families. 1 service is scheduled today at 2:00 PM, and 1 FTC compliance disclosure requires review before the 2:00 PM arrangement conference.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => launchFamilyPortal('case-01')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FBF9F4] text-[#1F2F3E] border border-[#C4A35A]/50 hover:bg-[#F4EFE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A]"
          >
            <HeartHandshake className="w-4 h-4 text-[#C4A35A]" />
            <span>Preview Family Space</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4A35A]"
          >
            <span>Take First Call</span>
          </button>
        </div>
      </div>

      {/* FTC Compliance Alert Banner (if any cases require action) */}
      {complianceAlerts.length > 0 && (
        <CrystalCard goldAccent className="border-l-4 border-l-[#C98A2B] py-4 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-[#C98A2B]/15 text-[#C98A2B] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1F2F3E]">
                  FTC Funeral Rule Attention: Embalming Disclosure Required
                </p>
                <p className="text-xs text-[#2B3946]/80 mt-0.5">
                  Case <span className="font-semibold">{complianceAlerts[0].lovedOne.firstName} {complianceAlerts[0].lovedOne.lastName}</span> ({complianceAlerts[0].caseNumber}): Written embalming consent form must be countersigned before public viewing preparation.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateToCase(complianceAlerts[0].id, 'statement')}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A]/20 hover:bg-[#C4A35A]/35 rounded-lg border border-[#C4A35A]/40 transition-colors shrink-0"
            >
              <span>Review Statement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </CrystalCard>
      )}

      {/* Main Grid: "What Needs You Next" + Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: What Needs You Next (Actionable Queue) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-[#1F2F3E] flex items-center gap-2">
              <span>What Needs You Next</span>
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#E3EBF2] text-[#3E5C76] font-medium">
                {urgentTasks.length} pending
              </span>
            </h2>
            <button
              onClick={() => setCurrentView('cases')}
              className="text-xs font-medium text-[#3E5C76] hover:underline"
            >
              View all cases →
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.map((c) => (
              <CrystalCard 
                key={c.id} 
                hoverEffect
                onClick={() => navigateToCase(c.id, c.nextStep.targetTab)}
                className={`py-4 px-5 transition-all ${c.nextStep?.isUrgent ? 'border-l-4 border-l-[#C4A35A]' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#2B3946]/70">
                      <span className="font-semibold text-[#1F2F3E]">
                        {c.lovedOne.firstName} {c.lovedOne.lastName}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{c.caseNumber}</span>
                      <span>·</span>
                      <StatusChip status={c.status} />
                    </div>

                    <h3 className="text-sm font-semibold text-[#1F2F3E]">
                      {c.nextStep?.title}
                    </h3>
                    <p className="text-xs text-[#2B3946]/80 leading-relaxed">
                      {c.nextStep?.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      c.nextStep?.isUrgent 
                        ? 'bg-[#C98A2B]/15 text-[#C98A2B] font-semibold' 
                        : 'bg-[#F4F7FA] text-[#2B3946]/60'
                    }`}>
                      {c.nextStep?.dueDate}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#3E5C76] hover:text-[#1F2F3E]"
                    >
                      <span>{c.nextStep?.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CrystalCard>
            ))}
          </div>
        </div>

        {/* Right Column: Today's Services & Key Schedule */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-[#1F2F3E] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3E5C76]" />
              <span>Services & Facilities</span>
            </h2>
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs font-medium text-[#3E5C76] hover:underline"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {servicesThisWeek.map((evt) => (
              <CrystalCard key={evt.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#3E5C76]/10 text-[#3E5C76] shrink-0 text-center min-w-[54px]">
                    <span className="block text-[10px] uppercase font-bold text-[#3E5C76]">
                      {new Date(evt.startDateTime).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="block font-serif text-base font-bold text-[#1F2F3E]">
                      {new Date(evt.startDateTime).toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#1F2F3E] truncate">
                      {evt.title}
                    </p>
                    <p className="text-xs text-[#3E5C76] font-medium">
                      In memory of {evt.lovedOneName}
                    </p>
                    <div className="flex flex-col gap-0.5 text-[11px] text-[#2B3946]/70 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#2B3946]/50" />
                        {new Date(evt.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Lead: {evt.staffLead}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-[#2B3946]/50" />
                        {evt.room}
                      </span>
                    </div>
                  </div>
                </div>
              </CrystalCard>
            ))}
          </div>

          {/* Transparent Pricing Callout Card */}
          <CrystalCard ivory className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#C4A35A] uppercase tracking-wider">
                Aurel Flat Pricing
              </span>
              <span className="font-mono text-xs font-semibold text-[#5E8C7A]">
                $49 / month flat
              </span>
            </div>
            <p className="text-xs text-[#2B3946]/80 leading-relaxed">
              Unlimited cases. No per-case tax, no locked contracts. Every feature—including the elder-friendly Family Portal and FTC Rule safeguards—is permanently included.
            </p>
            <div className="mt-3 pt-3 border-t border-[#C4A35A]/20 flex items-center justify-between text-xs">
              <span className="text-[#2B3946]/60">Pinecrest Memorial subscription</span>
              <button 
                onClick={() => setCurrentView('settings')}
                className="text-[#3E5C76] font-medium hover:underline"
              >
                View billing & receipts →
              </button>
            </div>
          </CrystalCard>
        </div>
      </div>

      {/* Active Cases Triage Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium text-[#1F2F3E]">
            Recent Cases in Care
          </h2>
          <button
            onClick={() => setCurrentView('cases')}
            className="text-xs font-medium text-[#3E5C76] hover:underline"
          >
            All 8 cases →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cases.slice(0, 4).map((c) => (
            <CrystalCard 
              key={c.id} 
              hoverEffect 
              onClick={() => navigateToCase(c.id, 'overview')}
              className="p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[11px] text-[#2B3946]/60">{c.caseNumber}</span>
                  <StatusChip status={c.status} />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
                  {c.lovedOne.firstName} {c.lovedOne.lastName}
                </h3>
                <p className="text-xs text-[#2B3946]/70 mt-0.5">
                  {c.serviceType.replace('_', ' ')} · {c.serviceDate}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E3EBF2]/60 flex items-center justify-between text-xs">
                <ComplianceBadge status={c.compliance.status} />
                <span className="text-[#3E5C76] font-medium">Open →</span>
              </div>
            </CrystalCard>
          ))}
        </div>
      </div>
    </div>
  );
};
