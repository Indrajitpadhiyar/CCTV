import React, { useState } from 'react';
import { SECURITY_ALERTS } from '../data/mockData';
import { Badge } from '../components/common/Badge';
import { ShieldAlertIcon, AlertTriangleIcon, BellIcon, CheckCircleIcon, EyeIcon } from '../components/common/Icons';

export function AlertsPage({ onSelectMatch, alerts = [], onNavigate }) {
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [priorityFilter, setPriorityFilter] = useState('all');

  const alertsList = alerts.filter((a) => !dismissedIds.has(a.alertId));

  const handleDismiss = (id) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const filtered = alertsList.filter((a) => {
    if (priorityFilter === 'high') return a.priorityLevel === 'high';
    if (priorityFilter === 'medium') return a.priorityLevel === 'medium';
    if (priorityFilter === 'low') return a.priorityLevel === 'low';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Security Alerts & System Incidents
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {filtered.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts prioritized by biometric threat severity and operational jurisdiction
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setPriorityFilter('all')}
            className={`px-3 py-1.5 font-medium transition ${
              priorityFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Alerts ({alertsList.length})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('high')}
            className={`px-3 py-1.5 font-medium transition ${
              priorityFilter === 'high' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            High Priority
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('medium')}
            className={`px-3 py-1.5 font-medium transition ${
              priorityFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Medium Priority
          </button>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const isHigh = alert.priorityLevel === 'high';
          const isMed = alert.priorityLevel === 'medium';

          return (
            <div
              key={alert.alertId}
              className={`bg-white rounded-xl border ${
                isHigh ? 'border-rose-300 bg-rose-50/10' : isMed ? 'border-amber-200' : 'border-slate-200'
              } p-4 sm:p-5 shadow-2xs transition hover:shadow-xs`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isHigh ? 'bg-rose-100 text-rose-700' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isHigh ? (
                      <ShieldAlertIcon className="w-5 h-5" />
                    ) : (
                      <AlertTriangleIcon className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {alert.alertId}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {alert.type}
                      </h4>
                      <Badge
                        variant={isHigh ? 'danger' : isMed ? 'warning' : 'neutral'}
                        dot={isHigh}
                        size="sm"
                      >
                        {alert.priority}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium mt-1.5">
                      {alert.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div>
                        <span className="text-slate-400">Camera:</span>{' '}
                        <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                          {alert.camera}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span>{' '}
                        <span className="font-medium text-slate-800">
                          {alert.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Police Station:</span>{' '}
                        <span className="font-medium text-slate-800">
                          {alert.policeStation}
                        </span>
                      </div>
                      {alert.confidence !== 'N/A' && (
                        <div>
                          <span className="text-slate-400">AI Match:</span>{' '}
                          <span className="font-mono font-bold text-rose-700">
                            {alert.confidence}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded border border-blue-100 inline-block font-medium">
                      Recommended Protocol: {alert.recommendedAction}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0 ml-auto sm:ml-0">
                  {alert.targetMatchId ? (
                    <button
                      type="button"
                      onClick={() => onSelectMatch(alert.targetMatchId)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-2xs flex items-center gap-1.5"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      Review Footage
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectMatch && onSelectMatch(alert.alertId)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-2xs"
                    >
                      Review
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDismiss(alert.alertId)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium text-xs transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Active Security Alerts</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All monitored CCTV feeds across Gujarat are operating normally. Real-time biometric alerts will appear here automatically when a face match or threat is detected.
            </p>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition"
              >
                Go to Face Scan / Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
