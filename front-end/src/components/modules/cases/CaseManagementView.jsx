import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  CarFront, 
  Users, 
  Siren, 
  Search, 
  Plus, 
  Activity, 
  Shield, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';
import { StatusPill } from '../../common/StatusPill';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';

export const CaseManagementView = ({ onOpenNewCase }) => {
  const { cases, activeCaseId, setActiveCaseId, activeIncident } = useCase();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = cases.filter(c => {
    const matchesType = filterType === "ALL" || c.type === filterType;
    const matchesPriority = filterPriority === "ALL" || c.priority === filterPriority;
    const matchesQuery = searchQuery === "" || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.firNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesPriority && matchesQuery;
  });

  const handleOpenCase = (c) => {
    setActiveCaseId(c.id);
    if (c.type === "VEHICLE_INVESTIGATION") {
      navigate('/vehicle');
    } else if (c.type === "MISSING_PERSON") {
      navigate('/missing');
    } else if (c.type === "EMERGENCY_CAD") {
      navigate('/emergency');
    } else {
      navigate('/vehicle');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B2545] tracking-wide uppercase flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#0B2545]" />
            <span>Master Case Management & Active Investigations</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time surveillance dossiers, multi-agency FIR records, and continuous AI monitoring
          </p>
        </div>

        <button
          onClick={onOpenNewCase}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>New Investigation File</span>
        </button>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Active Cases</p>
            <p className="text-2xl font-extrabold text-[#0B2545] font-mono">{cases.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium">3 Priority Investigations</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2545] flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">{t('totalCameras')}</p>
            <p className="text-2xl font-extrabold text-[#0B2545] font-mono">1,420</p>
            <p className="text-[11px] text-emerald-700 font-medium">● 98.6% Grid Uptime</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">{t('anprDetections24h')}</p>
            <p className="text-2xl font-extrabold text-[#0B2545] font-mono">148,920</p>
            <p className="text-[11px] text-blue-700 font-medium">12 Watchlist Alerts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C9A227] flex items-center justify-center">
            <CarFront className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">{t('activeIncidents')}</p>
            <p className="text-2xl font-extrabold text-red-600 font-mono">
              {activeIncident?.status === 'DISPATCHED' ? '1 CRITICAL' : '0 ACTIVE'}
            </p>
            <p className="text-[11px] text-red-700 font-medium">PCR Units Dispatched</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, FIR number, or incident summary..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
            />
          </div>

          {/* Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-mono mr-1">TYPE:</span>
            {[
              { key: "ALL", label: "All Cases" },
              { key: "VEHICLE_INVESTIGATION", label: "Vehicle ANPR" },
              { key: "MISSING_PERSON", label: "Missing Persons" },
              { key: "EMERGENCY_CAD", label: "Emergency CAD" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterType === tab.key
                    ? 'bg-[#0B2545] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-mono font-semibold">
          <span>SHOWING {filteredCases.length} ACTIVE INVESTIGATION DOSSIERS</span>
          <span>CLICK ANY CASE TO OPEN WORKSPACE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((c) => {
            const isActive = c.id === activeCaseId;
            const getIcon = () => {
              if (c.type === 'VEHICLE_INVESTIGATION') return CarFront;
              if (c.type === 'MISSING_PERSON') return Users;
              if (c.type === 'EMERGENCY_CAD') return Siren;
              return FolderKanban;
            };
            const Icon = getIcon();

            return (
              <div
                key={c.id}
                onClick={() => handleOpenCase(c)}
                className={`bg-white rounded-xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                  isActive ? 'border-2 border-[#0B2545] bg-blue-50/20 shadow-md' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Case ID, Type Icon, Priority & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        c.type === 'EMERGENCY_CAD' ? 'bg-red-50 text-red-600' :
                        c.type === 'MISSING_PERSON' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-[#0B2545]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-[#0B2545] block">{c.id}</span>
                        <span className="font-mono text-[10px] text-slate-500">{c.firNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusPill status={c.priority} size="sm" />
                      <StatusPill status={c.status} size="sm" />
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {c.summary}
                    </p>
                  </div>

                  {/* Case Metadata */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
                    <div>
                      <span className="text-slate-400">Officer:</span> <span className="font-semibold text-slate-800">{c.assignedOfficer}</span>
                    </div>
                    {c.linkedVehicle && (
                      <div className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-[#0B2545]">
                        Plate: {c.linkedVehicle}
                      </div>
                    )}
                    {c.personName && (
                      <div className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-amber-900">
                        Subject: {c.personName} ({c.personAge}y)
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Action Trigger & Timestamp */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {c.registeredDate}
                  </span>

                  <span className="font-bold text-[#0B2545] group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    <span>Open Investigation</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
