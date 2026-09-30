import React from 'react';
import { ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { ComplianceRecord } from '../../types';

interface ComplianceBadgeProps {
  status: ComplianceRecord['status'];
  showDetailsTooltip?: boolean;
  className?: string;
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({
  status,
  className = '',
}) => {
  if (status === 'compliant') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#5E8C7A] ${className}`}>
        <ShieldCheck className="w-4 h-4 text-[#5E8C7A] shrink-0" />
        <span>FTC Rule Verified</span>
      </div>
    );
  }

  if (status === 'attention_needed') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#C98A2B] ${className}`}>
        <AlertCircle className="w-4 h-4 text-[#C98A2B] shrink-0" />
        <span>Compliance Review Needed</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#3E5C76] ${className}`}>
      <Clock className="w-4 h-4 text-[#3E5C76] shrink-0" />
      <span>Disclosures in Progress</span>
    </div>
  );
};

export const ComplianceLegalNotice: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`text-[12px] text-[#2B3946]/70 italic ${className}`}>
    Aurel assists compliance; confirm state-specific rules with counsel.
  </p>
);
