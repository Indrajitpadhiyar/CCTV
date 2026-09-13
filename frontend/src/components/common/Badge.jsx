import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'md', dot = false, className = '' }) {
  const variantStyles = {
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const dotStyles = {
    danger: 'bg-rose-600',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    blue: 'bg-blue-600',
    neutral: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-medium',
    lg: 'text-sm px-3 py-1 font-semibold'
  };

  const baseVariant = variantStyles[variant] || variantStyles.neutral;
  const dotColor = dotStyles[variant] || dotStyles.neutral;
  const baseSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${baseVariant} ${baseSize} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></span>}
      {children}
    </span>
  );
}
