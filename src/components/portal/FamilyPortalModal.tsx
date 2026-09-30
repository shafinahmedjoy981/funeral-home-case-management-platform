import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Phone, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  FileText,
  Clock,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FamilyPortalModal: React.FC = () => {
  const { 
    isFamilyPortalOpen, 
    setIsFamilyPortalOpen, 
    familyPortalCaseId, 
    cases,
    funeralHomeInfo,
    showToast,
    updateObituary 
  } = useApp();

  const [portalStep, setPortalStep] = useState<number>(1);
  const [devicePreviewMode, setDevicePreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  // Obituary fields
  const activeCase = cases.find(c => c.id === familyPortalCaseId) || cases[0];
  const [obitBody, setObitBody] = useState(activeCase?.obituary.body || '');
  const [obitSurvived, setObitSurvived] = useState(activeCase?.obituary.survivedBy || '');
  const [isStatementApproved, setIsStatementApproved] = useState(activeCase?.statement.isSigned || false);

  if (!isFamilyPortalOpen || !activeCase) return null;

  const handleSaveObit = () => {
    updateObituary(activeCase.id, {
      body: obitBody,
      survivedBy: obitSurvived,
      isApprovedByFamily: true,
    });
    showToast('Memories and obituary text saved gently.', 'success');
    setPortalStep(4);
  };

  const handleApproveStatement = () => {
    setIsStatementApproved(true);
    showToast('Thank you. Your approval has been communicated to the director.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2F3E]/70 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Floating Control Bar for Staff */}
      <div className="w-full max-w-2xl flex items-center justify-between py-2 px-4 mb-2 text-white text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold flex items-center gap-1.5 text-[#C4A35A]">
            <HeartHandshake className="w-4 h-4" />
            Family Portal Experience
          </span>
          <span className="text-white/40">·</span>
          <span className="text-white/70">
            For {activeCase.familyContacts[0]?.name || 'Family'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setDevicePreviewMode('mobile')}
              className={`p-1.5 rounded transition-colors ${
                devicePreviewMode === 'mobile' ? 'bg-white text-[#1F2F3E]' : 'text-white/70 hover:text-white'
              }`}
              title="Mobile phone view (elder-friendly)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevicePreviewMode('desktop')}
              className={`p-1.5 rounded transition-colors ${
                devicePreviewMode === 'desktop' ? 'bg-white text-[#1F2F3E]' : 'text-white/70 hover:text-white'
              }`}
              title="Tablet / Desktop in-room meeting view"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFamilyPortalOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Family Space"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Family Portal Window (Ivory Background, Calm Pacing, Elderly Friendly) */}
      <div 
        className={`w-full bg-[#FBF9F4] text-[#2B3946] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 border border-[#C4A35A]/30 ${
          devicePreviewMode === 'mobile'
            ? 'max-w-md h-[90vh] max-h-[820px]'
            : 'max-w-3xl h-[88vh] max-h-[820px]'
        }`}
      >
        {/* Portal Header */}
        <div className="p-5 border-b border-[#C4A35A]/20 bg-[#FBF9F4] shrink-0 text-center relative">
          <p className="text-[11px] uppercase tracking-wider text-[#3E5C76] font-semibold">
            {funeralHomeInfo.name}
          </p>
          <h2 className="font-serif text-xl font-medium text-[#1F2F3E] mt-0.5">
            Family Space for {activeCase.lovedOne.firstName} {activeCase.lovedOne.lastName}
          </h2>
          <p className="text-xs text-[#2B3946]/70 mt-1">
            "Take your time. We'll save everything as you go."
          </p>
        </div>

        {/* 4-Step Calm Navigation */}
        <div className="px-5 py-2.5 bg-[#F4EFE6]/60 border-b border-[#C4A35A]/15 flex items-center justify-between text-xs shrink-0">
          {[
            { num: 1, label: 'Welcome' },
            { num: 2, label: 'Statement' },
            { num: 3, label: 'Memories' },
            { num: 4, label: 'Care Team' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setPortalStep(st.num)}
              className={`flex items-center gap-1.5 py-1 px-2 rounded-lg font-medium transition-colors ${
                portalStep === st.num
                  ? 'text-[#1F2F3E] font-bold bg-[#C4A35A]/25'
                  : 'text-[#2B3946]/60 hover:text-[#1F2F3E]'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] bg-white border border-[#C4A35A]/30 font-bold">
                {st.num}
              </span>
              <span className="text-[11px]">{st.label}</span>
            </button>
          ))}
        </div>

        {/* Portal Content Scroll Area (Large readable font, generous whitespace) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: WARM WELCOME & WHAT HAPPENS NEXT */}
          {portalStep === 1 && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="text-center space-y-2 py-2">
                <div className="w-14 h-14 rounded-full bg-[#C4A35A]/20 text-[#1F2F3E] flex items-center justify-center mx-auto mb-2 border border-[#C4A35A]/40 font-serif text-xl font-medium">
                  {activeCase.lovedOne.firstName[0]}{activeCase.lovedOne.lastName[0]}
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2F3E]">
                  We are here for you, {activeCase.familyContacts[0]?.name || 'Family'}.
                </h3>
                <p className="text-sm text-[#2B3946]/80 leading-relaxed">
                  There is no rush on any decision. We created this quiet private space so you can review details, share memories, and ask questions from the comfort of your home.
                </p>
              </div>

              {/* "Here is what happens next" 4-step progress */}
              <div className="bg-white/80 rounded-2xl p-5 border border-[#C4A35A]/30 space-y-4 shadow-xs">
                <h4 className="font-serif text-base font-semibold text-[#1F2F3E]">
                  Here is what happens next:
                </h4>

                <div className="space-y-3.5 text-xs text-[#2B3946]/80">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#5E8C7A]/20 text-[#5E8C7A] font-bold flex items-center justify-center shrink-0">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        1. Safe Care & Transfer
                      </p>
                      <p className="text-[#2B3946]/70 mt-0.5">
                        {activeCase.lovedOne.firstName} is in our gentle, temperature-controlled care at Pinecrest.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C4A35A]/30 text-[#1F2F3E] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        2. Reviewing the Itemized Statement
                      </p>
                      <p className="text-[#2B3946]/70 mt-0.5">
                        Transparent pricing with no unexpected fees. Take your time to review what was selected.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E3EBF2] text-[#3E5C76] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        3. Remembering {activeCase.lovedOne.firstName}
                      </p>
                      <p className="text-[#2B3946]/70 mt-0.5">
                        Add personal reflections, favorite music, or photos for the memorial tribute.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E3EBF2] text-[#3E5C76] font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2F3E] text-sm">
                        4. The Service & Aftercare
                      </p>
                      <p className="text-[#2B3946]/70 mt-0.5">
                        Ceremony on {activeCase.serviceDate}. We will remain by your side for certified records and support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 56px Tall Comfortable Touch Button */}
              <button
                type="button"
                onClick={() => setPortalStep(2)}
                className="w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold text-[#1F2F3E] bg-[#C4A35A] hover:bg-[#b89547] rounded-2xl shadow-sm transition-colors"
              >
                <span>Continue to Itemized Statement</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW STATEMENT IN PLAIN LANGUAGE */}
          {portalStep === 2 && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#3E5C76] uppercase tracking-wider">
                  Price Transparency
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1F2F3E]">
                  Statement of Selected Services
                </h3>
                <p className="text-xs text-[#2B3946]/70">
                  Every item is listed in plain language. You may change or decline optional items at any time.
                </p>
              </div>

              <div className="bg-white/90 rounded-2xl p-5 border border-[#C4A35A]/30 space-y-3 shadow-xs text-xs">
                {activeCase.statement.items.map((it) => (
                  <div key={it.id} className="flex justify-between py-2 border-b border-[#E3EBF2]/60 last:border-b-0">
                    <div>
                      <p className="font-semibold text-[#1F2F3E] text-sm">{it.name}</p>
                      <p className="text-[11px] text-[#2B3946]/60">{it.categoryLabel}</p>
                    </div>
                    <span className="font-mono font-bold text-[#1F2F3E] text-sm tabular-nums">
                      ${it.price.toLocaleString()}.00
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t-2 border-[#1F2F3E] flex items-center justify-between text-base font-serif font-bold text-[#1F2F3E]">
                  <span>Total Amount</span>
                  <span className="font-mono text-xl text-[#3E5C76]">
                    ${activeCase.statement.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#E3EBF2]/40 rounded-2xl text-xs text-[#2B3946]/80 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#5E8C7A] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Federal Funeral Rule guarantee: We never charge handling fees if you provide your own casket or urn.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleApproveStatement}
                  className={`w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold rounded-2xl transition-colors ${
                    isStatementApproved
                      ? 'bg-[#5E8C7A] text-white'
                      : 'bg-[#C4A35A] hover:bg-[#b89547] text-[#1F2F3E]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isStatementApproved ? 'Statement Approved by Family' : 'Approve This Statement'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortalStep(3)}
                  className="w-full h-12 flex items-center justify-center text-xs font-semibold text-[#3E5C76] hover:underline"
                >
                  <span>Continue to Share Memories & Obituary →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OBITUARY & MEMORIAL DETAILS */}
          {portalStep === 3 && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#3E5C76] uppercase tracking-wider">
                  Honoring a Legacy
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1F2F3E]">
                  Memories & Obituary Tribute
                </h3>
                <p className="text-xs text-[#2B3946]/70">
                  Write freely or edit existing drafts. Our staff will proofread gently before publication.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#C4A35A]/30 space-y-4 shadow-xs text-xs">
                <div>
                  <label className="block font-semibold text-[#1F2F3E] mb-1.5">
                    Life Story & Reflections
                  </label>
                  <textarea
                    rows={6}
                    value={obitBody}
                    onChange={(e) => setObitBody(e.target.value)}
                    className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl p-3 text-xs leading-relaxed focus:border-[#C4A35A]"
                    placeholder="Tell us about their passions, achievements, and spirit..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2F3E] mb-1.5">
                    Family & Those Survived By
                  </label>
                  <textarea
                    rows={3}
                    value={obitSurvived}
                    onChange={(e) => setObitSurvived(e.target.value)}
                    className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl p-3 text-xs leading-relaxed focus:border-[#C4A35A]"
                    placeholder="Spouse, children, grandchildren, siblings..."
                  />
                </div>

                {/* Photo Upload Simulator */}
                <div className="p-4 border-2 border-dashed border-[#C4A35A]/40 rounded-xl text-center space-y-1 bg-[#FBF9F4]">
                  <Upload className="w-5 h-5 text-[#C4A35A] mx-auto" />
                  <p className="font-semibold text-xs text-[#1F2F3E]">
                    Upload Portrait or Family Photos
                  </p>
                  <p className="text-[11px] text-[#2B3946]/60">
                    High-resolution photos for the printed memorial cards and video tribute.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveObit}
                className="w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold text-[#1F2F3E] bg-[#C4A35A] hover:bg-[#b89547] rounded-2xl shadow-sm transition-colors"
              >
                <span>Save Memories & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: CONTACT THE DIRECTOR */}
          {portalStep === 4 && (
            <div className="space-y-5 max-w-xl mx-auto text-center">
              <div className="w-14 h-14 rounded-full bg-[#5E8C7A]/20 text-[#5E8C7A] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-medium text-[#1F2F3E]">
                  Everything is Safely Received
                </h3>
                <p className="text-xs text-[#2B3946]/80 leading-relaxed max-w-md mx-auto">
                  Your preferences and reflections are stored safely with licensed director Eleanor Vance. You may return to this space anytime.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#C4A35A]/30 text-left space-y-3 shadow-xs">
                <p className="font-serif text-sm font-semibold text-[#1F2F3E]">
                  Your Dedicated Care Contact:
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E5C76] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    EV
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#1F2F3E]">Eleanor Vance</p>
                    <p className="text-[11px] text-[#2B3946]/70">Licensed Funeral Director #4912</p>
                  </div>
                </div>
                <p className="text-xs text-[#2B3946]/80 pt-2 border-t border-[#E3EBF2] leading-relaxed">
                  "If you have questions about timing, flowers, or simply want to talk through things, please call me directly."
                </p>
              </div>

              {/* Direct Call Button (56px tall) */}
              <a
                href={`tel:${funeralHomeInfo.phone}`}
                className="w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-2xl shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Director: {funeralHomeInfo.phone}</span>
              </a>
            </div>
          )}
        </div>

        {/* Portal Bottom Safety Bar */}
        <div className="p-3.5 border-t border-[#C4A35A]/20 bg-[#F4EFE6]/50 shrink-0 flex items-center justify-between text-xs text-[#2B3946]/70">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#5E8C7A]" />
            <span className="text-[11px]">Private encrypted family space</span>
          </div>

          <a
            href={`tel:${funeralHomeInfo.phone}`}
            className="text-[11px] font-semibold text-[#3E5C76] flex items-center gap-1 hover:underline"
          >
            <Phone className="w-3 h-3" />
            <span>Need assistance? {funeralHomeInfo.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
