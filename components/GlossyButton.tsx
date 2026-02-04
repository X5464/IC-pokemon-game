
import React from 'react';

interface GlossyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const GlossyButton: React.FC<GlossyButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  variant = 'primary'
}) => {
  const baseStyle = "glossy-button rounded-2xl py-4 px-6 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyle = variant === 'primary' 
    ? "text-white" 
    : "text-white/60 hover:text-white";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default GlossyButton;
