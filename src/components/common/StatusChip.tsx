import React from 'react';
import { CaseStatus } from '../../types';

interface StatusChipProps {
  status: CaseStatus;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className = '' }) => {
  const map: Record<CaseStatus, { label: string; textClass: string; dotClass: string }> = {
    first_call: {
      label: 'First Call',
      textClass: 'text-[#C98A2B]',
      dotClass: 'bg-[#C98A2B]',
    },
    arrangement: {
      label: 'Arrangement',
      textClass: 'text-[#3E5C76]',
      dotClass: 'bg-[#3E5C76]',
    },
    preparing: {
      label: 'Preparing',
      textClass: 'text-[#50718e]',
      dotClass: 'bg-[#50718e]',
    },
    service: {
      label: 'Service',
      textClass: 'text-[#1F2F3E]',
      dotClass: 'bg-[#C4A35A]',
    },
    aftercare: {
      label: 'Aftercare',
      textClass: 'text-[#5E8C7A]',
      dotClass: 'bg-[#5E8C7A]',
    },
    closed: {
      label: 'Closed',
      textClass: 'text-[#2B3946]/60',
      dotClass: 'bg-[#2B3946]/30',
    },
  };

  const item = map[status] || map.first_call;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.textClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dotClass}`} aria-hidden="true" />
      <span>{item.label}</span>
    </span>
  );
};
