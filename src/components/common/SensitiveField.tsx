import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SensitiveFieldProps {
  caseId: string;
  label: string;
  maskedValue: string;
  fullValue: string;
  fieldId: string;
  className?: string;
}

export const SensitiveField: React.FC<SensitiveFieldProps> = ({
  caseId,
  label,
  maskedValue,
  fullValue,
  fieldId,
  className = '',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { revealSensitiveField } = useApp();

  const handleToggle = () => {
    if (!isRevealed) {
      revealSensitiveField(caseId, label);
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-[#2B3946]/60">{label}</span>
        <span className="font-mono text-sm tracking-wider text-[#1F2F3E]">
          {isRevealed ? fullValue : maskedValue}
        </span>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        title={isRevealed ? 'Hide sensitive data' : 'Reveal sensitive data (will be logged in audit trail)'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#3E5C76] hover:text-[#1F2F3E] bg-[#E3EBF2]/60 hover:bg-[#E3EBF2] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A]"
      >
        {isRevealed ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Reveal</span>
          </>
        )}
      </button>
    </div>
  );
};
