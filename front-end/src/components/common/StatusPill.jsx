import React from 'react';

export const StatusPill = ({ status, size = "md" }) => {
  const normalized = (status || "").toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case "OPEN":
      case "ACTIVE":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "UNDER_REVIEW":
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "DISPATCHED":
      case "ALERT":
      case "CRITICAL":
      case "HIGH":
        return "bg-red-50 text-red-800 border-red-200 font-bold";
      case "RESOLVED":
      case "CONFIRMED":
      case "APPROVED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold";
      case "REJECTED":
      case "DENIED":
      case "FALSE_ALARM":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "MAINTENANCE":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-md border font-mono tracking-wider ${getStyle()} ${sizeClass}`}>
      {normalized.replace('_', ' ')}
    </span>
  );
};
