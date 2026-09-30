import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  FileSpreadsheet, 
  ArrowRight,
  Info,
  DollarSign,
  FileSignature
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';
import { ComplianceBadge, ComplianceLegalNotice } from '../common/ComplianceBadge';
import { ServiceType, StatementItem } from '../../types';

export const ArrangementBuilderView: React.FC = () => {
  const { 
    currentCase, 
    priceLists, 
    signStatement, 
    navigateToCase, 
    updateComplianceItem,
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(currentCase?.serviceType || 'traditional_burial');

  // Selected statement items state initialized from currentCase
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    currentCase?.statement.items.forEach(item => {
      map[item.id] = item.selected;
    });
    return map;
  });

  const [selectedCasketId, setSelectedCasketId] = useState<string>('cpl-2');
  const [selectedVaultId, setSelectedVaultId] = useState<string>('opl-2');
  const [signerName, setSignerName] = useState(currentCase?.familyContacts[0]?.name || 'Margaret Vance');
  const [signerRelation, setSignerRelation] = useState(currentCase?.familyContacts[0]?.relationship || 'Spouse');

  if (!currentCase) {
    return (
      <div className="p-12 text-center text-sm text-[#2B3946]/70">
        No case selected. Please select a case from the Cases menu first.
      </div>
    );
  }

  const gpl = priceLists.find(p => p.type === 'gpl');
  const cpl = priceLists.find(p => p.type === 'cpl');
  const opl = priceLists.find(p => p.type === 'opl');

  const serviceOptions: { type: ServiceType; title: string; description: string; baseStartingPrice: number }[] = [
    {
      type: 'traditional_burial',
      title: 'Traditional Funeral & Burial',
      description: 'Full care, family gathering / evening visitation, chapel ceremony, followed by funeral coach cortege to cemetery.',
      baseStartingPrice: 4790,
    },
    {
      type: 'direct_cremation',
      title: 'Direct Cremation',
      description: 'Dignified transfer, refrigeration, certified alternative container, crematory fee, and return of urn.',
      baseStartingPrice: 1895,
    },
    {
      type: 'memorial_service',
      title: 'Memorial Service & Celebration',
      description: 'Ceremony in chapel or memorial gardens following disposition, with multimedia tribute and reception.',
      baseStartingPrice: 3050,
    },
    {
      type: 'graveside',
      title: 'Graveside Committal Service',
      description: 'Gathering directly at graveside or committal shelter with clergy/military honors direction.',
      baseStartingPrice: 3250,
    },
    {
      type: 'celebration_of_life',
      title: 'Celebration of Life Gathering',
      description: 'Informal personalized gathering with music, reflections, and hospitality support in Pinecrest Atrium.',
      baseStartingPrice: 2850,
    },
  ];

  // Calculate live running total
  const selectedCasket = cpl?.items.find(i => i.id === selectedCasketId);
  const selectedVault = opl?.items.find(i => i.id === selectedVaultId);

  const calculateSubtotal = () => {
    let sum = 0;
    // Basic service of staff (always included per FTC)
    sum += 2450;
    // Embalming if selected
    if (selectedItems['embalming']) sum += 795;
    // Other prep
    if (selectedItems['other_prep']) sum += 325;
    // Facilities visitation
    if (selectedItems['visitation']) sum += 650;
    // Facilities ceremony
    if (selectedItems['ceremony']) sum += 850;
    // Transfer
    if (selectedItems['transfer']) sum += 495;
    // Hearse
    if (selectedItems['hearse']) sum += 450;
    // Merchandise
    if (selectedServiceType !== 'direct_cremation' && selectedCasket) {
      sum += selectedCasket.price;
    }
    if (selectedServiceType === 'traditional_burial' && selectedVault) {
      sum += selectedVault.price;
    }
    return sum;
  };

  const currentSubtotal = calculateSubtotal();
  const cashAdvancesTotal = 1900; // death certs, opening/closing, pastor
  const liveGrandTotal = currentSubtotal + cashAdvancesTotal;

  const toggleItem = (key: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCompleteAndSign = () => {
    signStatement(currentCase.id, signerName, signerRelation);
    showToast('Arrangement complete. Statement of goods signed and synced to case.', 'success');
    navigateToCase(currentCase.id, 'statement');
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header with Stepper Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#3E5C76] font-semibold">
            Guided Arrangement Builder
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#1F2F3E] mt-0.5">
            Arrangements for {currentCase.lovedOne.firstName} {currentCase.lovedOne.lastName}
          </h1>
          <p className="text-xs text-[#2B3946]/70 mt-0.5">
            {currentCase.caseNumber} · Meeting with {currentCase.familyContacts[0]?.name || 'Family'}
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-[#E3EBF2]">
          {[
            { num: 1, label: 'Service Type' },
            { num: 2, label: 'Goods & Services' },
            { num: 3, label: 'Review Statement' },
            { num: 4, label: 'Sign & Authorize' },
          ].map((st) => (
            <div key={st.num} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStep === st.num
                    ? 'bg-[#3E5C76] text-white shadow-xs'
                    : currentStep > st.num
                    ? 'bg-[#5E8C7A]/15 text-[#5E8C7A]'
                    : 'text-[#2B3946]/50 hover:text-[#1F2F3E]'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {currentStep > st.num ? '✓' : st.num}
                </span>
                <span className="hidden sm:inline">{st.label}</span>
              </button>
              {st.num < 4 && <ChevronRight className="w-3.5 h-3.5 text-[#2B3946]/30 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Wizard Body (8 cols) + Price Transparency & FTC Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Wizard Step Body */}
        <div className="lg:col-span-8 space-y-5">
          {/* STEP 1: SERVICE TYPE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="pb-2">
                <h2 className="font-serif text-lg font-medium text-[#1F2F3E]">
                  1. Select Primary Service Type
                </h2>
                <p className="text-xs text-[#2B3946]/70">
                  Every arrangement is individually itemized. Selecting a starting service pre-configures standard facilities and care.
                </p>
              </div>

              <div className="space-y-3">
                {serviceOptions.map((opt) => (
                  <CrystalCard
                    key={opt.type}
                    hoverEffect
                    onClick={() => setSelectedServiceType(opt.type)}
                    className={`p-5 transition-all ${
                      selectedServiceType === opt.type
                        ? 'border-2 border-[#3E5C76] bg-white/95 shadow-md'
                        : 'border border-[#E3EBF2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
                            {opt.title}
                          </h3>
                          {selectedServiceType === opt.type && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3E5C76] text-white">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#2B3946]/80 leading-relaxed max-w-xl">
                          {opt.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-[#2B3946]/60">Starting from</span>
                        <p className="font-serif text-base font-bold text-[#1F2F3E] tabular-nums">
                          ${opt.baseStartingPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CrystalCard>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs transition-colors"
                >
                  <span>Continue to Goods & Services</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GOODS & SERVICES (GPL, CPL, OPL LINKED) */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="pb-2">
                <h2 className="font-serif text-lg font-medium text-[#1F2F3E]">
                  2. Select Goods & Professional Services
                </h2>
                <p className="text-xs text-[#2B3946]/70">
                  Itemized directly from Pinecrest General Price List (GPL 2026.2). Disclosures display inline.
                </p>
              </div>

              {/* Mandatory Basic Services of Staff */}
              <CrystalCard ivory className="p-5 border-l-4 border-l-[#C4A35A]">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#C4A35A] uppercase tracking-wider">
                      FTC Mandatory Non-Declinable Fee
                    </span>
                    <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
                      Basic Services of Funeral Director and Staff
                    </h3>
                    <p className="text-xs text-[#2B3946]/80 leading-relaxed">
                      Initial conference, 24-hr staff coverage, legal authorizations, filing death certificates with Oregon Health Authority, and coordination with cemetery/crematory.
                    </p>
                  </div>
                  <span className="font-mono text-base font-bold text-[#1F2F3E] tabular-nums shrink-0">
                    $2,450.00
                  </span>
                </div>
              </CrystalCard>

              {/* Care & Preparation (Embalming Notice) */}
              <CrystalCard className="p-5 space-y-4">
                <h3 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                  Care & Preparation of Remains
                </h3>

                {/* Embalming statutory disclosure */}
                <div className="p-3.5 bg-[#F4F7FA] rounded-xl border border-[#E3EBF2] space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems['embalming'] ?? true}
                        onChange={() => toggleItem('embalming')}
                        className="mt-0.5 rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#1F2F3E]">
                          Embalming & Chemical Preservation
                        </span>
                        <p className="text-[11px] text-[#2B3946]/70 mt-0.5">
                          Selected for public gathering, chapel ceremony, or delayed committal.
                        </p>
                      </div>
                    </label>
                    <span className="font-mono text-xs font-semibold text-[#1F2F3E] tabular-nums">
                      $795.00
                    </span>
                  </div>

                  <p className="text-[11px] text-[#2B3946]/70 italic border-t border-[#E3EBF2]/80 pt-2">
                    "Except in certain special cases, embalming is not required by law. Embalming may be necessary if you select certain arrangements, such as a funeral with viewing."
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems['other_prep'] ?? true}
                      onChange={() => toggleItem('other_prep')}
                      className="rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                    />
                    <span>Dressing, Cosmetology & Placement in Casket</span>
                  </label>
                  <span className="font-mono text-xs text-[#1F2F3E]">$325.00</span>
                </div>
              </CrystalCard>

              {/* Facilities & Ceremony */}
              <CrystalCard className="p-5 space-y-3">
                <h3 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                  Facilities & Staff Supervision
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems['visitation'] ?? true}
                        onChange={() => toggleItem('visitation')}
                        className="rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                      />
                      <span>Visitation / Evening Gathering (3 Hours at Pinecrest Chapel)</span>
                    </label>
                    <span className="font-mono text-xs text-[#1F2F3E]">$650.00</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems['ceremony'] ?? true}
                        onChange={() => toggleItem('ceremony')}
                        className="rounded text-[#3E5C76] focus:ring-[#C4A35A]"
                      />
                      <span>Funeral Ceremony at Pinecrest Chapel (Audio/Visual & Staff)</span>
                    </label>
                    <span className="font-mono text-xs text-[#1F2F3E]">$850.00</span>
                  </div>
                </div>
              </CrystalCard>

              {/* Casket Selection from CPL */}
              <CrystalCard className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                    Casket Selection (from CPL 2026.1)
                  </h3>
                  <span className="text-[11px] text-[#5E8C7A]">No 3rd-party handling fee</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {cpl?.items.slice(0, 4).map((cask) => (
                    <div
                      key={cask.id}
                      onClick={() => setSelectedCasketId(cask.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedCasketId === cask.id
                          ? 'border-[#3E5C76] bg-[#3E5C76]/5 font-medium'
                          : 'border-[#E3EBF2] hover:bg-[#F4F7FA]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1F2F3E]">{cask.name}</span>
                        <span className="font-mono font-bold text-[#1F2F3E]">${cask.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-[#2B3946]/70 mt-1 line-clamp-2">
                        {cask.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CrystalCard>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs transition-colors"
                >
                  <span>Review Itemized Statement</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW ITEMIZED STATEMENT */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="pb-2">
                <h2 className="font-serif text-lg font-medium text-[#1F2F3E]">
                  3. Review Statement of Funeral Goods & Services Selected
                </h2>
                <p className="text-xs text-[#2B3946]/70">
                  Review complete itemization prior to formal signature. No hidden line items.
                </p>
              </div>

              <CrystalCard className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-[#E3EBF2]">
                  <h3 className="font-serif text-base font-bold text-[#1F2F3E]">
                    PINECREST MEMORIAL & FUNERAL CARE
                  </h3>
                  <p className="text-xs text-[#2B3946]/70">
                    4120 SW Pinecrest Blvd, Portland, OR · Phone: (503) 246-8100
                  </p>
                  <p className="text-xs font-medium text-[#3E5C76] mt-1">
                    Statement of Funeral Goods and Services Selected for {currentCase.lovedOne.firstName} {currentCase.lovedOne.lastName}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                    <span>Basic Services of Funeral Director & Staff (FTC non-declinable)</span>
                    <span className="font-mono font-medium">$2,450.00</span>
                  </div>

                  {selectedItems['embalming'] && (
                    <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                      <span>Embalming and Chemical Preservation</span>
                      <span className="font-mono font-medium">$795.00</span>
                    </div>
                  )}

                  {selectedItems['other_prep'] && (
                    <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                      <span>Other Preparation (Dressing & Casketing)</span>
                      <span className="font-mono font-medium">$325.00</span>
                    </div>
                  )}

                  {selectedItems['visitation'] && (
                    <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                      <span>Use of Facilities & Staff for Gathering (Chapel)</span>
                      <span className="font-mono font-medium">$650.00</span>
                    </div>
                  )}

                  {selectedItems['ceremony'] && (
                    <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                      <span>Use of Facilities & Staff for Ceremony</span>
                      <span className="font-mono font-medium">$850.00</span>
                    </div>
                  )}

                  {selectedCasket && (
                    <div className="flex justify-between py-1.5 border-b border-[#E3EBF2]/60">
                      <span>Casket: {selectedCasket.name}</span>
                      <span className="font-mono font-medium">${selectedCasket.price.toLocaleString()}.00</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 font-semibold text-[#1F2F3E] bg-[#F4F7FA] px-3 rounded-lg">
                    <span>Total Funeral Goods and Services</span>
                    <span className="font-mono">${currentSubtotal.toLocaleString()}.00</span>
                  </div>

                  <div className="pt-2">
                    <p className="font-semibold text-[#1F2F3E] mb-1">Cash Advances (Estimated Disbursements)</p>
                    <div className="space-y-1 text-[#2B3946]/80">
                      <div className="flex justify-between">
                        <span>Oregon Vital Records (8 copies)</span>
                        <span className="font-mono">$200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cemetery Grave Opening / Closing</span>
                        <span className="font-mono">$1,450.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clergy Honorarium</span>
                        <span className="font-mono">$250.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between py-3 border-t-2 border-[#1F2F3E] font-serif text-base font-bold text-[#1F2F3E]">
                    <span>Grand Total Due</span>
                    <span className="font-mono">${liveGrandTotal.toLocaleString()}.00</span>
                  </div>
                </div>
              </CrystalCard>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs transition-colors"
                >
                  <span>Proceed to Sign & Authorize</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SIGN & AUTHORIZE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="pb-2">
                <h2 className="font-serif text-lg font-medium text-[#1F2F3E]">
                  4. Authorize & E-Sign
                </h2>
                <p className="text-xs text-[#2B3946]/70">
                  Electronic execution with licensed director countersignature.
                </p>
              </div>

              <CrystalCard ivory className="p-6 space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#C4A35A]/30 text-xs text-[#2B3946]/80 space-y-2">
                  <p className="font-semibold text-[#1F2F3E]">
                    Family Acknowledgment & Consent:
                  </p>
                  <p className="leading-relaxed">
                    "I confirm that I received a copy of the General Price List prior to selecting goods and services. I authorize Pinecrest Memorial & Funeral Care to carry out the arrangements itemized herein."
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#2B3946]/70 mb-1 font-medium">
                      Responsible Party / Signer Name
                    </label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full bg-white border border-[#E3EBF2] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1F2F3E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#2B3946]/70 mb-1 font-medium">
                      Relationship to Deceased
                    </label>
                    <input
                      type="text"
                      value={signerRelation}
                      onChange={(e) => setSignerRelation(e.target.value)}
                      className="w-full bg-white border border-[#E3EBF2] rounded-xl px-3 py-2.5 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#E3EBF2]/40 rounded-xl text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#1F2F3E]">
                      Director Countersignature
                    </p>
                    <p className="text-[11px] text-[#2B3946]/70">
                      Eleanor Vance, Licensed Funeral Director #4912
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#5E8C7A] font-bold">
                    License Verified Active
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteAndSign}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A] hover:bg-[#b5944b] rounded-xl shadow-xs transition-colors"
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>Authorize & Save Statement</span>
                  </button>
                </div>
              </CrystalCard>
            </div>
          )}
        </div>

        {/* Right Sticky Panel (4 cols): Live Price Transparency & Compliance Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Always Visible Running Total */}
          <CrystalCard goldAccent className="p-5 space-y-3">
            <span className="text-[11px] font-bold text-[#C4A35A] uppercase tracking-wider">
              Live Transparent Running Total
            </span>

            <div className="space-y-1">
              <span className="text-xs text-[#2B3946]/60">Estimated Total (Items + Cash Advances)</span>
              <p className="font-serif text-3xl font-bold text-[#1F2F3E] tabular-nums tracking-tight">
                ${liveGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E3EBF2]/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#2B3946]/70">
                <span>Selected Goods & Services:</span>
                <span className="font-mono tabular-nums text-[#1F2F3E]">
                  ${currentSubtotal.toLocaleString()}.00
                </span>
              </div>
              <div className="flex justify-between text-[#2B3946]/70">
                <span>Cash Advances (Permits, Fees):</span>
                <span className="font-mono tabular-nums text-[#1F2F3E]">
                  ${cashAdvancesTotal.toLocaleString()}.00
                </span>
              </div>
            </div>
          </CrystalCard>

          {/* Real-time FTC Compliance Checklist */}
          <div className="crystal-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3EBF2]">
              <h3 className="font-serif text-sm font-semibold text-[#1F2F3E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3E5C76]" />
                <span>FTC Rule Safeguards</span>
              </h3>
              <ComplianceBadge status={currentCase.compliance.status} />
            </div>

            <div className="space-y-2.5 text-xs text-[#2B3946]/80">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Non-declinable basic services disclosure included</span>
              </div>

              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Statutory embalming notice presented</span>
              </div>

              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Casket price list offered prior to selection</span>
              </div>

              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Zero third-party handling fees confirmed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3EBF2]/60">
              <ComplianceLegalNotice />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
