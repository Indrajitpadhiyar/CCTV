import React from 'react';
import { Siren, Shield, Truck, Radio, Navigation, Clock } from 'lucide-react';
import { StatusPill } from '../../common/StatusPill';

export const ResourceCard = ({ unit, onDispatch }) => {
  const getIcon = () => {
    switch (unit.type) {
      case 'POLICE_PATROL':
        return Siren;
      case 'AMBULANCE':
        return Shield;
      case 'FIRE_RESCUE':
        return Truck;
      default:
        return Navigation;
    }
  };

  const Icon = getIcon();

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      unit.status === 'DISPATCHED'
        ? 'bg-red-50/50 border-red-300 shadow-xs'
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${
            unit.type === 'AMBULANCE' ? 'bg-emerald-100 text-emerald-800' :
            unit.type === 'FIRE_RESCUE' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-900'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 leading-snug">{unit.name}</h4>
            <p className="font-mono text-[10px] text-slate-500">{unit.officer} • {unit.contact}</p>
          </div>
        </div>

        <StatusPill status={unit.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-blue-700" />
          <span>Dist: <strong className="text-slate-900">{unit.distanceKm} km</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span>ETA: <strong className="text-slate-900">~{unit.etaMins} mins</strong></span>
        </div>
      </div>
    </div>
  );
};
