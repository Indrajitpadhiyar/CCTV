import React from 'react';
import { ANALYTICS_DATA } from '../data/mockData';
import { BarChartIcon, DownloadIcon, CheckCircleIcon, AlertTriangleIcon } from '../components/common/Icons';

export function ReportsPage() {
  const maxHourlyDetection = Math.max(...ANALYTICS_DATA.hourlyDetections.map((d) => d.detections), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Surveillance Intelligence & Analytics Reports
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Generated 13-Sep-2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational analytics on face detections, criminal matches, and camera network telemetry
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting Official Surveillance Analytics Report (PDF)...')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Row 1: Hourly Face Detections Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Face Detections & Criminal Matches Over Time (24h Window)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly biometric ingestion density across all connected Gujarat CCTV feeds
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-500"></span>
              <span className="text-slate-600">Total Face Scans</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-600"></span>
              <span className="text-slate-600">Criminal Matches</span>
            </div>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-56 flex items-end gap-2 sm:gap-3 pt-6 border-b border-slate-200 pb-2">
          {ANALYTICS_DATA.hourlyDetections.map((item) => {
            const heightPercent = Math.round((item.detections / maxHourlyDetection) * 100);
            return (
              <div key={item.time} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  {item.detections} faces • {item.matches} matches
                </div>

                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Detections Bar */}
                  <div
                    className="w-full max-w-[24px] bg-blue-500 rounded-t group-hover:bg-blue-600 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  {/* Criminal match indicator on top of hour */}
                  {item.matches > 0 && (
                    <div
                      className="w-1.5 bg-rose-600 rounded-t"
                      style={{ height: `${item.matches * 24}px` }}
                      title={`${item.matches} criminal matches`}
                    ></div>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-900 transition">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Two Columns: Criminal Matches by City + Detection Confidence Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Criminal Matches by District Range
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of flagged biometric identifications across major cities
          </p>

          <div className="space-y-4">
            {ANALYTICS_DATA.cityMatches.length > 0 ? (
              ANALYTICS_DATA.cityMatches.map((c) => (
                <div key={c.city} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span>{c.city}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({c.totalCameras} cameras)
                      </span>
                    </span>
                    <span className="font-mono text-rose-700 font-bold">
                      {c.count} Matches
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-rose-600 h-2.5 rounded-l-full"
                      style={{ width: `${(c.highRisk / 8) * 100}%` }}
                      title="High Risk"
                    ></div>
                    <div
                      className="bg-amber-500 h-2.5 rounded-r-full"
                      style={{ width: `${((c.count - c.highRisk) / 8) * 100}%` }}
                      title="Medium/Low"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>High Risk: {c.highRisk}</span>
                    <span>Active Feeds: {c.activeFeeds}/{c.totalCameras}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No criminal correlation records logged for this reporting period.
              </div>
            )}
          </div>
        </div>

        {/* AI Confidence Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            AI Facial Match Confidence Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Correlation threshold accuracy across 2,846 daily face captures
          </p>

          <div className="space-y-4">
            {ANALYTICS_DATA.confidenceDistribution.length > 0 ? (
              ANALYTICS_DATA.confidenceDistribution.map((item) => (
                <div key={item.range} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>{item.label} ({item.range})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.count} detections
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${item.range === '< 70%' ? 100 : item.count * 6}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Awaiting face detection scans to establish confidence distribution model.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Camera Health & Alert Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Incident Alerts by Classification
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution of automated notifications logged by camera analytics
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {ANALYTICS_DATA.alertsByCategory.length > 0 ? (
              ANALYTICS_DATA.alertsByCategory.map((cat) => (
                <div key={cat.category} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-slate-700">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">{cat.count}</span>
                    <span className="text-slate-400 w-10 text-right">{cat.share}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No active security incidents or classifications logged.
              </div>
            )}
          </div>
        </div>

        {/* Network Telemetry & Camera Health Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Surveillance Grid Health & Compliance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time hardware availability and legal audit compliance
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-emerald-800">Online Feeds</div>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">128 (95.5%)</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Normal Bitrate</div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-amber-800">Degraded Feeds</div>
                <div className="text-xl font-bold text-amber-700 mt-0.5">6 (4.5%)</div>
                <div className="text-[10px] text-amber-600 mt-0.5">Frame rate alert</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-0.5">Legal & Ethical AI Compliance:</span>
            All facial recognition telemetry is strictly cataloged under the Gujarat Police Digital Evidence Handling Framework. Biometric false positives are automatically expunged after 30 days.
          </div>
        </div>
      </div>
    </div>
  );
}
