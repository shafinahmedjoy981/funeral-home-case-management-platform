import React from 'react';

interface CrystalFacetLogoProps {
  className?: string;
  size?: number;
  showSubtitle?: boolean;
}

export const CrystalFacetLogo: React.FC<CrystalFacetLogoProps> = ({
  className = '',
  size = 32,
  showSubtitle = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Faceted Crystal Emblem */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#3E5C76] to-[#1F2F3E] p-2 text-white shadow-sm border border-[#C4A35A]/30 shrink-0"
        style={{ width: size + 10, height: size + 10 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#E3EBF2]"
        >
          {/* Faceted geometric lines representing crystal clarity and quiet dignity */}
          <path
            d="M12 2L3 8.5L5 19L12 22L19 19L21 8.5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V22"
            stroke="#C4A35A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M3 8.5L12 13L21 8.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M5 19L12 13L19 19"
            stroke="#C4A35A"
            strokeWidth="1"
            strokeOpacity="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-serif text-2xl font-medium tracking-tight text-[#1F2F3E]">
          Aurel
        </span>
        {showSubtitle && (
          <span className="text-[11px] tracking-wide text-[#3E5C76]/80 font-medium">
            Independent Care
          </span>
        )}
      </div>
    </div>
  );
};
