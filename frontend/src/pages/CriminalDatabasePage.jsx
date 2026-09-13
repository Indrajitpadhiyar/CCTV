import React, { useState, useMemo } from 'react';
import { CRIMINAL_DATABASE } from '../data/mockData';
import { FacePlaceholder } from '../components/common/FacePlaceholder';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { SearchIcon, DatabaseIcon, EyeIcon, FilterIcon, RefreshCwIcon } from '../components/common/Icons';

export function CriminalDatabasePage({ onSelectCriminal, criminals = [], onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return criminals.filter((crim) => {
      const matchesSearch =
        searchQuery === '' ||
        (crim.criminalId && crim.criminalId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (crim.name && crim.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (crim.alias && crim.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (crim.caseId && crim.caseId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (crim.category && crim.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCity = selectedCity === '' || crim.city === selectedCity;
      const matchesStatus = selectedStatus === '' || crim.status === selectedStatus;
      const matchesRisk = selectedRisk === '' || crim.riskLevel === selectedRisk;

      return matchesSearch && matchesCity && matchesStatus && matchesRisk;
    });
  }, [criminals, searchQuery, selectedCity, selectedStatus, selectedRisk]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedStatus('');
    setSelectedRisk('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                State Criminal Intelligence Registry
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {criminals.length} Registered Biometric Profiles
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Gujarat State Police Central Fingerprint & Face Biometric Index
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium shadow-2xs self-start sm:self-auto"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Search</span>
          </button>
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Text Search */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Search Record
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Name, Criminal ID, FIR Case..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              City Range
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="">All Cities</option>
              {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Jamnagar', 'Mehsana'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Risk Classification
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="">All Risk Levels</option>
              <option value="High Risk">High Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low Risk">Low Risk</option>
            </select>
          </div>

          {/* Case Status Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Warrant Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active Pursuit">Active Pursuit</option>
              <option value="Requires Verification">Requires Verification</option>
              <option value="Under Review">Under Review</option>
              <option value="Wanted">Wanted</option>
              <option value="Flagged for Intercept">Flagged for Intercept</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3">Criminal ID</th>
                <th scope="col" className="px-3 py-3">Biometric Profile</th>
                <th scope="col" className="px-4 py-3">Subject Name & Case</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Last Known Location</th>
                <th scope="col" className="px-4 py-3">Latest Camera Sight</th>
                <th scope="col" className="px-4 py-3">Risk Level</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((crim) => {
                const isHigh = crim.riskLevel === 'High Risk';

                return (
                  <tr key={crim.criminalId} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {crim.criminalId}
                    </td>

                    <td className="px-3 py-3">
                      {crim.photoUrl || crim.photo ? (
                        <img
                          src={crim.photoUrl || crim.photo}
                          alt={crim.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold">
                          BIO
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {crim.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Alias: <span className="font-medium text-slate-800">{crim.alias}</span> • {crim.caseId}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      <span className="font-medium">{crim.category}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      <div>{crim.lastKnownLocation}</div>
                      <div className="text-[10px] text-slate-400">{crim.policeStation}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{crim.lastDetection}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {isHigh ? (
                        <Badge variant="danger" dot size="sm">High Risk</Badge>
                      ) : (
                        <Badge variant="warning" dot size="sm">{crim.riskLevel}</Badge>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{crim.status}</span>
                      <div className="text-[10px] text-slate-400">{crim.warrantStatus}</div>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectCriminal && onSelectCriminal(crim)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-2xs hover:text-blue-700"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <DatabaseIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Biometric Records Found</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No registered criminal profiles match the search criteria. Upload or scan a subject photo via 'Find Person' to query the CCTV surveillance network and register biometric records.
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          currentCount={paginatedItems.length}
        />
      </div>
    </div>
  );
}
