import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { ComplianceLegalNotice } from '../common/ComplianceBadge';

export const ComplianceBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-[#E3EBF2]/40 border-b border-[#E3EBF2] px-6 py-2 flex items-center justify-between text-xs text-[#2B3946] z-0">
      <div className="flex items-center gap-2.5 truncate">
        <ShieldCheck className="w-4 h-4 text-[#3E5C76] shrink-0" />
        <span className="font-medium text-[#1F2F3E]">FTC Funeral Rule Safeguard Active</span>
        <span className="hidden sm:inline text-[#2B3946]/40">·</span>
        <ComplianceLegalNotice className="hidden sm:inline" />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-[#3E5C76] hidden md:inline">
          GPL 2026.2 verified & itemized statement synced
        </span>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#2B3946]/50 hover:text-[#1F2F3E] p-0.5 rounded transition-colors"
          title="Dismiss reminder"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
