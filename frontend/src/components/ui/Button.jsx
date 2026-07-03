import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "font-sans text-sm font-medium tracking-[-0.28px] h-10 px-4 rounded-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors duration-150";
  
  const variants = {
    primary: "bg-ink text-white hover:bg-ink-hover active:opacity-90 border-none",
    secondary: "bg-white text-ink border border-hairline hover:bg-canvas-soft2 hover:border-hairline-strong active:opacity-80"
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyle} ${selectedVariant} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
