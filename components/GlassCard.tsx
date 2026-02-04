
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`liquid-glass rounded-[32px] p-8 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
