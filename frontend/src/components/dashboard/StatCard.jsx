import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  variant = 'default', // 'default' | 'danger' | 'warning' | 'success'
  onClick
}) {
  const borderStyles = {
    default: 'border-slate-200 hover:border-slate-300',
    danger: 'border-rose-200 bg-rose-50/20 hover:border-rose-300',
    warning: 'border-amber-200 bg-amber-50/20 hover:border-amber-300',
    success: 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
  };

  const iconBgStyles = {
    default: 'bg-blue-50 text-blue-600',
    danger: 'bg-rose-100 text-rose-700',
    warning: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-700'
  };

  const valueColorStyles = {
    default: 'text-slate-900',
    danger: 'text-rose-700',
    warning: 'text-amber-800',
    success: 'text-emerald-700'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border ${borderStyles[variant]} shadow-2xs transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-tight">
            {title}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${valueColorStyles[variant]}`}>
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBgStyles[variant]} shrink-0 shadow-2xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>{subtitle}</span>
        <span className="font-mono text-slate-400 text-[10px]">Real-time Feed</span>
      </div>
    </div>
  );
}
