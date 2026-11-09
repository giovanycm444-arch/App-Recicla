import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  Compass,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory, CollectionCenter } from '../../types';
import { MATERIAL_TARIFFS } from '../../data/initialData';

export const CentersMap: React.FC<{ onScheduleDropOff?: (centerId: string) => void }> = ({
  onScheduleDropOff,
}) => {
  const { centers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<MaterialCategory | 'ALL'>('ALL');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<CollectionCenter>(centers[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 19.4200,
    lng: -99.1750,
  });
  const [locating, setLocating] = useState(false);
  const [routeModal, setRouteModal] = useState<CollectionCenter | null>(null);

  // Geolocation trigger
  const handleGetLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocating(false);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using fallback', err);
          // Set to urban benchmark
          setUserLocation({ lat: 19.4284, lng: -99.1650 });
          setLocating(false);
        },
        { timeout: 6000 }
      );
    } else {
      setUserLocation({ lat: 19.4284, lng: -99.1650 });
      setLocating(false);
    }
  };

  // Distance calculation helper (Haversine approximation in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return centers
      .map((c) => {
        const dist = userLocation
          ? parseFloat(calculateDistance(userLocation.lat, userLocation.lng, c.lat, c.lng))
          : 2.5;
        return { ...c, distanceKm: dist };
      })
      .filter((c) => {
        const matchesQuery =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.postalCode.includes(searchQuery);

        const matchesMaterial =
          filterMaterial === 'ALL' || c.acceptedMaterials.includes(filterMaterial);

        const matchesOpen = !onlyOpen || c.isOpen;

        return matchesQuery && matchesMaterial && matchesOpen;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [centers, searchQuery, filterMaterial, onlyOpen, userLocation]);

  return (
    <div className="space-y-4">
      {/* Title & Search Bar Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Red de Centros Autorizados</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Puntos de Acopio & Geolocalización
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Encuentra el centro más cercano, revisa materiales aceptados y horarios de atención.
            </p>
          </div>

          {/* Location button */}
          <button
            onClick={handleGetLocation}
            disabled={locating}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detectando GPS...' : 'Usar mi ubicación GPS'}</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, calle o código postal (ej. 06600, Reforma)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Material selector */}
          <div className="sm:col-span-4">
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Todos los materiales aceptados</option>
              <option value="PET">Solo que reciban Plástico PET</option>
              <option value="ALUMINIO">Solo que reciban Aluminio</option>
              <option value="CARTON">Solo que reciban Cartón</option>
              <option value="VIDRIO">Solo que reciban Vidrio</option>
              <option value="PAPEL">Solo que reciban Papel</option>
            </select>
          </div>

          {/* Open checkbox */}
          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Solo Abiertos</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer + Centers List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Map Interactive Canvas/Schematic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Visualizador de Rutas y Coordenadas
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {filteredCenters.length} centros coincidentes
            </span>
          </div>

          {/* Interactive stylized Map Surface */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 overflow-hidden border border-slate-300 dark:border-slate-800 select-none shadow-inner">
            {/* Grid pattern / street map styling */}
            <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Stylized avenues */}
              <line x1="0" y1="90" x2="100%" y2="120" stroke="#10b981" strokeWidth="4" strokeOpacity="0.3" />
              <line x1="80" y1="0" x2="320" y2="100%" stroke="#0ea5e9" strokeWidth="5" strokeOpacity="0.25" />
              <line x1="0" y1="280" x2="100%" y2="240" stroke="#f59e0b" strokeWidth="3" strokeOpacity="0.2" />
              {/* Green zones */}
              <circle cx="180" cy="140" r="50" fill="#10b981" fillOpacity="0.12" />
              <circle cx="340" cy="280" r="70" fill="#10b981" fillOpacity="0.1" />
            </svg>

            {/* User GPS Pin marker */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                style={{ left: '38%', top: '48%' }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold">
                    Tú
                  </div>
                </div>
              </div>
            )}

            {/* Collection Center Pins on Map */}
            {filteredCenters.map((center, index) => {
              const isSelected = selectedCenter.id === center.id;
              // Map simulated coordinates to surface %
              const leftPercent = 20 + ((index * 23 + 12) % 65);
              const topPercent = 20 + ((index * 31 + 18) % 60);

              return (
                <button
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-300 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap mb-1 transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border border-emerald-400'
                          : 'bg-white/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {center.name.split('-')[0].trim()}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                        center.isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-500 text-slate-200'
                      }`}
                    >
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quick Map Overlay Footer */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedCenter.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedCenter.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                    {selectedCenter.address}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRouteModal(selectedCenter)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                <span>Cómo llegar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right List of Centers with Details */}
        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredCenters.map((center) => {
            const isSelected = selectedCenter.id === center.id;
            return (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          center.isOpen
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {center.isOpen ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Abierto hoy
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" /> Cerrado
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {center.distanceKm} km
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                      {center.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {center.address} (C.P. {center.postalCode})
                    </p>
                  </div>
                </div>

                {/* Schedule and Operator */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{center.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{center.phone}</span>
                  </div>
                </div>

                {/* Accepted Materials Chips */}
                <div className="mt-2.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Materiales Aceptados:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {center.acceptedMaterials.map((mat) => {
                      const tariff = MATERIAL_TARIFFS[mat];
                      return (
                        <span
                          key={mat}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/60 dark:border-slate-700"
                        >
                          {tariff?.name || mat}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Center Capacity Meter */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Capacidad de almacenamiento actual:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {center.capacityPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      center.capacityPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${center.capacityPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step by step route modal */}
      {routeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ruta Hacia {routeModal.name}
                </h3>
              </div>
              <button
                onClick={() => setRouteModal(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-medium">
                📍 Distancia estimada: <strong>1.8 km (~8 min en bici o vehículo / 22 min caminando)</strong>
              </div>

              <div className="space-y-2 border-l-2 border-emerald-500 pl-3 ml-2 text-[11px]">
                <p>1. Dirígete hacia la avenida principal más cercana.</p>
                <p>2. Continúa recto por 1.2 km siguiendo la ciclovía o carril lateral.</p>
                <p>3. Gira en {routeModal.address}.</p>
                <p>4. El centro cuenta con rampa de descarga de materiales y báscula digital al frente.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
                Horario de atención: <strong>{routeModal.schedule}</strong>
                <br />
                Operador a cargo: <strong>{routeModal.operatorName}</strong>
              </div>
            </div>

            <button
              onClick={() => setRouteModal(null)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
