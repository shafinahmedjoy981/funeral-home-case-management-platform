import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  FileText, 
  DollarSign, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Printer, 
  Send, 
  Plus, 
  Shield, 
  FileSignature,
  FileSpreadsheet
} from 'lucide-react';
import { useApp, CaseDetailTab } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';
import { ComplianceBadge, ComplianceLegalNotice } from '../common/ComplianceBadge';
import { StatusChip } from '../common/StatusChip';
import { SensitiveField } from '../common/SensitiveField';
import { CaseStatus } from '../../types';

export const CaseDetailView: React.FC = () => {
  const { 
    currentCase, 
    caseDetailTab, 
    setCaseDetailTab, 
    updateCaseStatus, 
    updateComplianceItem, 
    signStatement, 
    addPaymentToCase, 
    launchFamilyPortal,
    openArrangementBuilderForCase,
    auditLogs
  } = useApp();

  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'ACH Bank Transfer' | 'Check' | 'Insurance Assignment' | 'Cash'>('Credit Card');
  const [paymentRef, setPaymentRef] = useState('REF-NEW');
  const [signerNameInput, setSignerNameInput] = useState('');
  const [signerRelationInput, setSignerRelationInput] = useState('Spouse');
  const [isSigningOpen, setIsSigningOpen] = useState(false);

  if (!currentCase) {
    return (
      <div className="p-12 text-center text-sm text-[#2B3946]/70">
        No case selected. Please select a case from the Cases menu.
      </div>
    );
  }

  const tabs: { id: CaseDetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: UserCheck },
    { id: 'family', label: 'Family & Contacts', icon: Phone },
    { id: 'statement', label: 'Services & Goods (FTC)', icon: FileSpreadsheet },
    { id: 'documents', label: 'Documents', icon: FileCheck },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'notes', label: 'Notes & Audit Trail', icon: FileText },
  ];

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerNameInput.trim()) return;
    signStatement(currentCase.id, signerNameInput.trim(), signerRelationInput.trim());
    setIsSigningOpen(false);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;
    addPaymentToCase(currentCase.id, paymentAmount, paymentMethod, paymentRef);
    setPaymentAmount(500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Key Info Card & Action Center */}
      <CrystalCard goldAccent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Loved One Profile */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#3E5C76]/10 text-[#3E5C76]">
                {currentCase.caseNumber}
              </span>
              <span>·</span>
              <StatusChip status={currentCase.status} />
              <span>·</span>
              <ComplianceBadge status={currentCase.compliance.status} />
            </div>

            <h1 className="font-serif text-3xl font-medium text-[#1F2F3E] tracking-tight">
              {currentCase.lovedOne.firstName} {currentCase.lovedOne.lastName}
            </h1>

            <p className="text-xs text-[#2B3946]/80 flex flex-wrap items-center gap-3">
              <span>Born {currentCase.lovedOne.dateOfBirth}</span>
              <span>·</span>
              <span>Passed {currentCase.lovedOne.dateOfDeath} (Age {currentCase.lovedOne.age})</span>
              <span>·</span>
              <span>{currentCase.lovedOne.placeOfDeath}</span>
            </p>
          </div>

          {/* Quick Actions & Portal Launch */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => openArrangementBuilderForCase(currentCase.id)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4A35A]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Arrangement Wizard</span>
            </button>

            <button
              type="button"
              onClick={() => launchFamilyPortal(currentCase.id)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A]/25 hover:bg-[#C4A35A]/40 border border-[#C4A35A]/50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1F2F3E]" />
              <span>Launch Family Portal</span>
            </button>
          </div>
        </div>

        {/* Status progression bar */}
        <div className="mt-5 pt-4 border-t border-[#E3EBF2]/80 flex items-center justify-between overflow-x-auto text-xs gap-4">
          <span className="text-[#2B3946]/60 font-medium shrink-0">Case Stage:</span>
          <div className="flex items-center gap-1.5 flex-1 min-w-[500px]">
            {(['first_call', 'arrangement', 'preparing', 'service', 'aftercare', 'closed'] as CaseStatus[]).map((st, idx) => {
              const stages: CaseStatus[] = ['first_call', 'arrangement', 'preparing', 'service', 'aftercare', 'closed'];
              const currentIdx = stages.indexOf(currentCase.status);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={st}
                  onClick={() => updateCaseStatus(currentCase.id, st)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium capitalize text-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#3E5C76] text-white shadow-xs font-semibold'
                      : isPast
                      ? 'bg-[#5E8C7A]/15 text-[#5E8C7A]'
                      : 'bg-[#F4F7FA] text-[#2B3946]/50 hover:bg-[#E3EBF2]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </CrystalCard>

      {/* Main Grid: Left Timeline (sticky) + Right Tabbed Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Dedicated Case Timeline */}
        <div className="lg:col-span-4 space-y-4">
          {/* Always Visible "Next Step" Card */}
          <CrystalCard ivory className="p-5 border-l-4 border-l-[#C4A35A]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[#C4A35A] uppercase tracking-wider">
                Immediate Next Step
              </span>
              <span className="text-[11px] font-medium text-[#C98A2B]">
                {currentCase.nextStep?.dueDate}
              </span>
            </div>
            <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
              {currentCase.nextStep?.title}
            </h3>
            <p className="text-xs text-[#2B3946]/80 mt-1 leading-relaxed">
              {currentCase.nextStep?.description}
            </p>
            <button
              onClick={() => setCaseDetailTab(currentCase.nextStep.targetTab)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E5C76] hover:text-[#1F2F3E]"
            >
              <span>{currentCase.nextStep?.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </CrystalCard>

          {/* Timeline of Care */}
          <div className="crystal-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3EBF2]">
              <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                Timeline of Care
              </h3>
              <span className="text-[11px] text-[#2B3946]/60">One case = One timeline</span>
            </div>

            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3EBF2]">
              {currentCase.timeline.map((item, idx) => (
                <div key={item.id} className="relative text-xs space-y-0.5">
                  <div 
                    className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                      item.status === 'completed'
                        ? 'border-[#5E8C7A] bg-[#5E8C7A]'
                        : item.status === 'in_progress'
                        ? 'border-[#C4A35A] bg-[#C4A35A]'
                        : 'border-[#2B3946]/30'
                    }`} 
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2F3E]">{item.title}</span>
                    <span className="text-[10px] text-[#2B3946]/50">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-[#2B3946]/70 leading-relaxed">{item.subtitle}</p>
                  {item.assignee && (
                    <p className="text-[10px] text-[#3E5C76] italic">Care Lead: {item.assignee}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FTC Compliance Status Sidebar Widget */}
          <div className="crystal-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-semibold text-[#1F2F3E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3E5C76]" />
                <span>FTC Rule Safeguards</span>
              </h4>
              <ComplianceBadge status={currentCase.compliance.status} />
            </div>

            <p className="text-[11px] text-[#2B3946]/70 leading-relaxed">
              Mandatory federal disclosures tracked per 16 CFR Part 453:
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.phoneGplOffered}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'phoneGplOffered', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>Phone price disclosure provided if requested</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.inPersonGplHandedOut}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'inPersonGplHandedOut', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>Printed General Price List given to family</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.casketPriceListPresentedBeforeSelection}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'casketPriceListPresentedBeforeSelection', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>CPL presented prior to showing caskets</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.embalmingDisclosureAcknowledged}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'embalmingDisclosureAcknowledged', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>Embalming statutory notice acknowledged</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.noHandlingFeeDisclosed}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'noHandlingFeeDisclosed', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>Zero handling fee for 3rd-party caskets disclosed</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentCase.compliance.itemizedStatementSigned}
                  onChange={(e) => updateComplianceItem(currentCase.id, 'itemizedStatementSigned', e.target.checked)}
                  className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                />
                <span>Itemized Statement signed & copy retained</span>
              </label>
            </div>

            <div className="pt-2 border-t border-[#E3EBF2]/60">
              <ComplianceLegalNotice />
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Tabbed Case Workspaces */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3EBF2]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = caseDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCaseDetailTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-[#3E5C76] border border-[#E3EBF2] shadow-xs'
                      : 'text-[#2B3946]/70 hover:text-[#1F2F3E] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3E5C76]' : 'text-[#2B3946]/50'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {caseDetailTab === 'overview' && (
            <div className="space-y-4">
              {/* Vital Statistics Card with Masked Sensitive Fields */}
              <CrystalCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3EBF2]">
                  <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                    Vital Statistics & Demographics
                  </h3>
                  <span className="text-[11px] text-[#2B3946]/60">Used for Oregon Health Authority vital filing</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#2B3946]/60">Full Legal Name</span>
                    <p className="font-medium text-[#1F2F3E] text-sm">
                      {currentCase.lovedOne.firstName} {currentCase.lovedOne.middleName || ''} {currentCase.lovedOne.lastName}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#2B3946]/60">Preferred Name / Nickname</span>
                    <p className="font-medium text-[#1F2F3E]">
                      {currentCase.lovedOne.preferredName || 'None'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#2B3946]/60">Date of Birth & Age</span>
                    <p className="font-medium text-[#1F2F3E]">
                      {currentCase.lovedOne.dateOfBirth} (Age {currentCase.lovedOne.age})
                    </p>
                  </div>

                  <div>
                    <span className="text-[#2B3946]/60">Date & Place of Death</span>
                    <p className="font-medium text-[#1F2F3E]">
                      {currentCase.lovedOne.dateOfDeath} · {currentCase.lovedOne.placeOfDeath}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#2B3946]/60">Birthplace & Parents</span>
                    <p className="font-medium text-[#1F2F3E]">
                      {currentCase.lovedOne.birthCity}, {currentCase.lovedOne.birthState} · Father: {currentCase.lovedOne.fatherName || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#2B3946]/60">Military / Veteran Status</span>
                    <p className="font-medium text-[#1F2F3E]">
                      {currentCase.lovedOne.veteranStatus ? 'Honorably Discharged US Veteran (DD-214 Verified)' : 'Non-veteran'}
                    </p>
                  </div>
                </div>

                {/* Sensitive Masked Social Security Number */}
                <div className="pt-3 border-t border-[#E3EBF2] bg-[#F4F7FA]/70 p-3 rounded-xl">
                  <SensitiveField
                    caseId={currentCase.id}
                    label="Social Security Number (Confidential State Record)"
                    maskedValue={currentCase.lovedOne.ssnMasked}
                    fullValue={currentCase.lovedOne.ssnFull}
                    fieldId="ssn"
                  />
                </div>
              </CrystalCard>

              {/* Service Logistics */}
              <CrystalCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3EBF2]">
                  <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                    Service & Committal Logistics
                  </h3>
                  <button 
                    onClick={() => setCaseDetailTab('statement')}
                    className="text-xs text-[#3E5C76] hover:underline"
                  >
                    Edit Selections →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#3E5C76] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#2B3946]/60">Service Date & Time</span>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        {currentCase.serviceDate} at {currentCase.serviceTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#3E5C76] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#2B3946]/60">Ceremony Location</span>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        {currentCase.serviceLocation}
                      </p>
                    </div>
                  </div>

                  {currentCase.cemeteryLocation && (
                    <div className="flex items-start gap-2.5 md:col-span-2">
                      <MapPin className="w-4 h-4 text-[#C4A35A] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#2B3946]/60">Cemetery / Final Resting Place</span>
                        <p className="font-semibold text-[#1F2F3E]">
                          {currentCase.cemeteryLocation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CrystalCard>
            </div>
          )}

          {/* TAB 2: FAMILY & CONTACTS */}
          {caseDetailTab === 'family' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                    Family & Responsible Parties
                  </h3>
                  <p className="text-xs text-[#2B3946]/70">
                    Contacts receive real-time notifications and portal access.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => launchFamilyPortal(currentCase.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A]/20 hover:bg-[#C4A35A]/35 rounded-lg border border-[#C4A35A]/40 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Portal for this Family</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentCase.familyContacts.map((contact, idx) => (
                  <CrystalCard key={idx} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3EBF2]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#1F2F3E]">
                            {contact.name}
                          </span>
                          {contact.isPrimary && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5E8C7A]/15 text-[#5E8C7A]">
                              Next of Kin / Primary Signer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#2B3946]/60">
                          {contact.relationship} of {currentCase.lovedOne.firstName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {contact.portalAccessGranted ? (
                          <span className="text-xs font-medium text-[#5E8C7A] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Portal Active ({contact.portalLastActive || 'Active'})</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-2.5 py-1 text-xs font-medium text-[#3E5C76] bg-[#E3EBF2] rounded-lg hover:bg-[#3E5C76] hover:text-white transition-colors"
                          >
                            Send Portal Invite
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#3E5C76]" />
                        <span className="font-mono text-[#1F2F3E]">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#3E5C76]" />
                        <span className="text-[#1F2F3E] truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#3E5C76]" />
                        <span className="text-[#1F2F3E] truncate">{contact.address}</span>
                      </div>
                    </div>
                  </CrystalCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & GOODS (FTC STATEMENT) */}
          {caseDetailTab === 'statement' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1F2F3E]">
                    Statement of Funeral Goods and Services Selected
                  </h3>
                  <p className="text-xs text-[#2B3946]/70">
                    Per FTC Funeral Rule 16 CFR § 453.2(b)(4) itemization mandate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2B3946] bg-white border border-[#E3EBF2] rounded-lg hover:bg-[#F4F7FA] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Statement</span>
                  </button>

                  {!currentCase.statement.isSigned ? (
                    <button
                      type="button"
                      onClick={() => setIsSigningOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-lg shadow-xs transition-colors"
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>E-Sign Statement</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5E8C7A] bg-[#5E8C7A]/10 border border-[#5E8C7A]/30 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Countersigned & Sealed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Itemized Goods & Services Table */}
              <CrystalCard className="p-0 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7FA] border-b border-[#E3EBF2] text-[#2B3946]/70">
                    <tr>
                      <th className="py-3 px-4 font-normal">Item Description</th>
                      <th className="py-3 px-4 font-normal">Category</th>
                      <th className="py-3 px-4 font-normal text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3EBF2]/60">
                    {currentCase.statement.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FBF9F4]/40">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#1F2F3E]">{item.name}</p>
                          {item.ftcMandatoryNotice && (
                            <p className="text-[11px] text-[#C4A35A] font-medium mt-0.5">
                              {item.ftcMandatoryNotice}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#2B3946]/70">
                          {item.categoryLabel}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-[#1F2F3E] text-right tabular-nums">
                          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#F4F7FA]/70 border-t border-[#E3EBF2]">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-4 font-semibold text-[#1F2F3E]">
                        Total Funeral Goods and Services
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#1F2F3E] text-right tabular-nums">
                        ${currentCase.statement.totalGoodsAndServices.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </CrystalCard>

              {/* Cash Advance Items */}
              {currentCase.statement.cashAdvances.length > 0 && (
                <CrystalCard className="p-0 overflow-hidden">
                  <div className="bg-[#F4F7FA] px-4 py-2 border-b border-[#E3EBF2] text-xs font-semibold text-[#1F2F3E]">
                    Cash Advances (Paid to third parties on family's behalf)
                  </div>
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-[#E3EBF2]/60">
                      {currentCase.statement.cashAdvances.map((ca) => (
                        <tr key={ca.id}>
                          <td className="py-2.5 px-4">
                            <p className="font-medium text-[#1F2F3E]">{ca.name}</p>
                            <p className="text-[11px] text-[#2B3946]/60">Payee: {ca.payee}</p>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-medium text-[#1F2F3E] text-right tabular-nums">
                            ${ca.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F4F7FA]/70 border-t border-[#E3EBF2]">
                      <tr>
                        <td className="py-2 px-4 font-semibold text-[#1F2F3E]">
                          Total Cash Advance Items
                        </td>
                        <td className="py-2 px-4 font-mono font-bold text-[#1F2F3E] text-right tabular-nums">
                          ${currentCase.statement.totalCashAdvances.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </CrystalCard>
              )}

              {/* Grand Total & Signature Status */}
              <CrystalCard ivory className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#2B3946]/60 uppercase tracking-wide">
                    Grand Total
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#1F2F3E] mt-0.5">
                    ${currentCase.statement.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-[#2B3946]/70 mt-1">
                    Includes all professional services, facility charges, selected merchandise, and outside cash advances.
                  </p>
                </div>

                <div className="text-right text-xs">
                  {currentCase.statement.isSigned ? (
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#5E8C7A]">
                        Signed by {currentCase.statement.signedBy} ({currentCase.statement.signerRelation})
                      </p>
                      <p className="text-[11px] text-[#2B3946]/60 font-mono">
                        {currentCase.statement.signedAt} · Director: {currentCase.statement.directorSignature}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#C98A2B] font-medium">
                      Awaiting Family Signature
                    </p>
                  )}
                </div>
              </CrystalCard>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {caseDetailTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                    Legal Authorizations & Records
                  </h3>
                  <p className="text-xs text-[#2B3946]/70">
                    Encrypted documents generated and archived in compliance with Oregon state regulations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCase.documents.map((doc) => (
                  <CrystalCard key={doc.id} className="p-5 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono text-[#2B3946]/60">{doc.size}</span>
                        <span className={`text-[11px] font-medium capitalize px-2 py-0.5 rounded ${
                          doc.status === 'completed'
                            ? 'bg-[#5E8C7A]/15 text-[#5E8C7A]'
                            : doc.status === 'pending_signature'
                            ? 'bg-[#C98A2B]/15 text-[#C98A2B]'
                            : 'bg-[#F4F7FA] text-[#2B3946]/60'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-[#2B3946]/70 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E3EBF2]/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#2B3946]/50">
                        Updated {doc.lastUpdated}
                      </span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 text-[#3E5C76] hover:text-[#1F2F3E] font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </CrystalCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS */}
          {caseDetailTab === 'payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CrystalCard className="p-4 text-center">
                  <span className="text-xs text-[#2B3946]/60">Total Charges</span>
                  <p className="font-serif text-xl font-bold text-[#1F2F3E] mt-0.5">
                    ${currentCase.payments.totalCharges.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </CrystalCard>

                <CrystalCard className="p-4 text-center">
                  <span className="text-xs text-[#5E8C7A]">Total Paid</span>
                  <p className="font-serif text-xl font-bold text-[#5E8C7A] mt-0.5">
                    ${currentCase.payments.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </CrystalCard>

                <CrystalCard ivory className="p-4 text-center">
                  <span className="text-xs text-[#C98A2B]">Balance Due</span>
                  <p className="font-serif text-xl font-bold text-[#C98A2B] mt-0.5">
                    ${currentCase.payments.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </CrystalCard>
              </div>

              {/* Record a Payment Form */}
              <CrystalCard className="p-5 space-y-3">
                <h4 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                  Record a Payment or Assignment
                </h4>
                <form onSubmit={handlePayment} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#2B3946]/70 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      min={1}
                      max={currentCase.payments.balanceDue || 50000}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full bg-white border border-[#E3EBF2] rounded-lg px-3 py-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#2B3946]/70 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-white border border-[#E3EBF2] rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="ACH Bank Transfer">ACH Bank Transfer</option>
                      <option value="Check">Check</option>
                      <option value="Insurance Assignment">Insurance Assignment</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#2B3946]/70 mb-1">Check # / Auth Ref</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full bg-white border border-[#E3EBF2] rounded-lg px-3 py-2 text-xs"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-lg transition-colors"
                    >
                      Record Payment
                    </button>
                  </div>
                </form>
              </CrystalCard>

              {/* Transaction Ledger */}
              <CrystalCard className="p-0 overflow-hidden">
                <div className="bg-[#F4F7FA] px-4 py-2.5 border-b border-[#E3EBF2] text-xs font-semibold text-[#1F2F3E]">
                  Receipt History
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7FA]/50 text-[#2B3946]/60">
                    <tr>
                      <th className="py-2.5 px-4 font-normal">Date</th>
                      <th className="py-2.5 px-4 font-normal">Method</th>
                      <th className="py-2.5 px-4 font-normal">Reference</th>
                      <th className="py-2.5 px-4 font-normal">Recorded By</th>
                      <th className="py-2.5 px-4 font-normal text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3EBF2]/60">
                    {currentCase.payments.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="py-3 px-4 font-mono">{tx.date}</td>
                        <td className="py-3 px-4 font-medium">{tx.method}</td>
                        <td className="py-3 px-4 font-mono text-[#2B3946]/70">{tx.reference}</td>
                        <td className="py-3 px-4 text-[#2B3946]/70">{tx.receivedBy}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#5E8C7A] text-right">
                          ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    {currentCase.payments.transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[#2B3946]/50">
                          No payments recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CrystalCard>
            </div>
          )}

          {/* TAB 6: NOTES & AUDIT TRAIL */}
          {caseDetailTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                    Case Activity & Immutable Audit Trail
                  </h3>
                  <p className="text-xs text-[#2B3946]/70">
                    Every vital disclosure, price list modification, and sensitive field access is logged with timestamp.
                  </p>
                </div>
              </div>

              <div className="crystal-card rounded-2xl p-0 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7FA] border-b border-[#E3EBF2] text-[#2B3946]/70">
                    <tr>
                      <th className="py-3 px-4 font-normal">Timestamp</th>
                      <th className="py-3 px-4 font-normal">Actor</th>
                      <th className="py-3 px-4 font-normal">Action</th>
                      <th className="py-3 px-4 font-normal">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3EBF2]/60">
                    {auditLogs
                      .filter(log => !log.caseNumber || log.caseNumber === currentCase.caseNumber)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-[#FBF9F4]/40">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-[#2B3946]/70">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-[#1F2F3E]">
                            {log.user}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-semibold text-[#3E5C76]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-[#2B3946]/80 leading-relaxed">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* E-Signature Modal */}
      {isSigningOpen && (
        <div className="fixed inset-0 bg-[#1F2F3E]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="crystal-card max-w-lg w-full p-6 space-y-4 rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EBF2]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1F2F3E]">
                  E-Sign Statement of Goods Selected
                </h3>
                <p className="text-xs text-[#2B3946]/70">
                  Compliant electronic signature under Federal E-SIGN Act.
                </p>
              </div>
              <button 
                onClick={() => setIsSigningOpen(false)}
                className="text-xs text-[#2B3946]/50 hover:text-[#1F2F3E]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#2B3946]/80 leading-relaxed">
              I acknowledge that I have received a copy of the General Price List prior to discussing funeral goods and services. I have selected the goods and services listed on this Statement, and agree to the specified terms.
            </p>

            <form onSubmit={handleSign} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">
                  Family Representative / Signer Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Margaret Vance"
                  value={signerNameInput}
                  onChange={(e) => setSignerNameInput(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F2F3E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">
                  Relationship to Deceased
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Next of Kin"
                  value={signerRelationInput}
                  onChange={(e) => setSignerRelationInput(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#C4A35A]/30 text-[11px] text-[#2B3946]/80 space-y-1">
                <p className="font-semibold text-[#1F2F3E]">
                  Funeral Director Attestation:
                </p>
                <p>
                  Countersigned by Eleanor Vance, Licensed Funeral Director #4912.
                  Timestamped and certified.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSigningOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs"
                >
                  Confirm & Seal Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
