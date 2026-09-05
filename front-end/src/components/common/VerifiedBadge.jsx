import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const VerifiedBadge = ({ 
  text = "Human Verified", 
  officer = null,
  size = "md" 
}) => {
  const sizeClasses = size === "sm" 
    ? "text-[11px] px-2 py-0.5" 
    : "text-xs px-2.5 py-1 font-medium";

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-700 text-white shadow-xs font-semibold tracking-wide ${sizeClasses}`}
      title={officer ? `Verified by ${officer}` : "Verified by Investigating Officer"}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
      <span>{text}</span>
    </span>
  );
};
