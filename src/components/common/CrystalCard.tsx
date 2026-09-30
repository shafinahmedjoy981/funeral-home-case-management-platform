import React from 'react';

interface CrystalCardProps {
  children: React.ReactNode;
  className?: string;
  goldAccent?: boolean;
  ivory?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const CrystalCard: React.FC<CrystalCardProps> = ({
  children,
  className = '',
  goldAccent = false,
  ivory = false,
  hoverEffect = false,
  onClick,
}) => {
  let cardClass = 'crystal-card';
  if (goldAccent) {
    cardClass = 'crystal-card-gold';
  } else if (ivory) {
    cardClass = 'crystal-card-ivory';
  }

  const hoverClass = hoverEffect 
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 relative overflow-hidden ${cardClass} ${hoverClass} ${className}`}
    >
      {/* Subtle crystal refraction corner glint */}
      {goldAccent && (
        <div 
          className="absolute -top-12 -right-12 w-28 h-28 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(196,163,90,0.3) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};
