import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  Building2, 
  ScrollText, 
  Users, 
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, funeralHomeInfo, showToast } = useApp();
  const [step, setStep] = useState<number>(1);

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    setIsOnboardingOpen(false);
    showToast('Pinecrest Memorial setup tour completed. Aurel is ready for daily care.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2F3E]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="crystal-card max-w-xl w-full p-6 space-y-6 rounded-2xl bg-white shadow-2xl relative">
        <button
          onClick={() => setIsOnboardingOpen(false)}
          className="absolute top-5 right-5 text-[#2B3946]/40 hover:text-[#1F2F3E]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#C4A35A]">
            <span>Welcome to Aurel</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1F2F3E]">
            Funeral Home Quick Setup (Step {step} of 4)
          </h2>
          <p className="text-xs text-[#2B3946]/70">
            Aurel streamlines independent funeral operations with calm clarity.
          </p>
        </div>

        {/* 4-Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Home Details', icon: Building2 },
            { num: 2, label: 'GPL Price List', icon: ScrollText },
            { num: 3, label: 'Staff & Roles', icon: Users },
            { num: 4, label: 'Portal Brand', icon: HeartHandshake },
          ].map((st) => (
            <div
              key={st.num}
              className={`p-2 rounded-xl border text-[11px] font-medium ${
                step === st.num
                  ? 'border-[#3E5C76] bg-[#3E5C76]/5 text-[#3E5C76] font-bold'
                  : step > st.num
                  ? 'border-[#5E8C7A]/40 bg-[#5E8C7A]/10 text-[#5E8C7A]'
                  : 'border-[#E3EBF2] text-[#2B3946]/50'
              }`}
            >
              <st.icon className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-2 text-xs text-[#2B3946]/80 leading-relaxed min-h-[160px]">
          {step === 1 && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#1F2F3E]">
                1. Confirm Funeral Home Identity & Mortuary License
              </p>
              <p>
                Aurel requires your state mortuary board license number to populate legal itemized statements and burial-transit records automatically.
              </p>
              <div className="p-3 bg-[#F4F7FA] rounded-xl space-y-1">
                <p className="font-semibold text-[#1F2F3E]">{funeralHomeInfo.name}</p>
                <p className="font-mono text-[11px] text-[#3E5C76]">License: {funeralHomeInfo.licenseNumber} (Oregon)</p>
                <p className="text-[11px] text-[#2B3946]/70">{funeralHomeInfo.address}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#1F2F3E]">
                2. Federal Trade Commission (FTC) Funeral Rule Price Lists
              </p>
              <p>
                Import your General Price List (GPL), Casket Price List (CPL), and Outer Burial Container Price List (OPL). Aurel automatically verifies required statutory disclosures (preamble notices, non-declinable basic services, and zero handling fees for third-party caskets).
              </p>
              <div className="p-3 bg-[#F4F7FA] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1F2F3E]">GPL 2026.2 Initialized</p>
                  <p className="text-[11px] text-[#5E8C7A]">16 statutory categories pre-linked</p>
                </div>
                <span className="text-[10px] font-mono text-[#3E5C76] font-bold">VERIFIED</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#1F2F3E]">
                3. Role-Based Permissions & Sensitive Vitals Protection
              </p>
              <p>
                Assign your Licensed Funeral Directors, Apprentices, and Arrangement Counselors. Sensitive decedent vitals (Social Security Numbers, cause of death) remain masked by default to safeguard family privacy.
              </p>
              <div className="p-3 bg-[#F4F7FA] rounded-xl space-y-1">
                <p className="font-semibold text-[#1F2F3E]">4 Staff Accounts Ready</p>
                <p className="text-[11px] text-[#2B3946]/70">Eleanor Vance (FD #4912) assigned as Managing Director</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#1F2F3E]">
                4. Elder-Friendly Family Portal Activation
              </p>
              <p>
                Your families will receive clean, peaceful invitation links. The portal features soft ivory backgrounds, large 18px text, single-decision screens, and zero aggressive upsell dark patterns.
              </p>
              <div className="p-3 bg-[#FBF9F4] border border-[#C4A35A]/30 rounded-xl">
                <p className="font-semibold text-[#1F2F3E]">Quiet, Dignified Branding Active</p>
                <p className="text-[11px] text-[#2B3946]/70">Microcopy tuned for emotional ease</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E3EBF2]">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-semibold text-[#1F2F3E] bg-[#C4A35A] hover:bg-[#b89547] rounded-xl shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Complete Onboarding</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
