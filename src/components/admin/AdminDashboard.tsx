import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Building2,
  Users,
  Leaf,
  Droplet,
  TreeDeciduous,
  Plus,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  Coins,
  Store,
  Tag,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory, CollectionCenter, RewardItem } from '../../types';
import { MATERIAL_TARIFFS } from '../../data/initialData';

export const AdminDashboard: React.FC = () => {
  const {
    impactStats,
    centers,
    rewards,
    transactions,
    allUsers,
    addCollectionCenter,
    toggleCenterStatus,
    addReward,
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'centers' | 'rewards'>('metrics');

  // Modals state
  const [showNewCenterModal, setShowNewCenterModal] = useState(false);
  const [showNewRewardModal, setShowNewRewardModal] = useState(false);

  // New Center Form State
  const [centerForm, setCenterForm] = useState({
    name: '',
    address: '',
    postalCode: '',
    lat: 19.4320,
    lng: -99.1550,
    phone: '+52 55 ',
    schedule: 'Lun - Sáb: 08:00 - 18:00',
    isOpen: true,
    acceptedMaterials: ['PET', 'CARTON', 'ALUMINIO'] as MaterialCategory[],
    capacityPercentage: 20,
    operatorName: 'Nuevo Operador',
  });

  // New Reward Form State
  const [rewardForm, setRewardForm] = useState({
    title: '',
    sponsorName: '',
    category: 'alimentos' as RewardItem['category'],
    pointsCost: 150,
    originalValue: '$150 MXN',
    stock: 20,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    validUntil: '31 Dic 2026',
    terms: 'Válido presentando cupón digital en sucursal.',
  });

  // Filter multiplier simulation based on date range (CA-05 compliance)
  const rangeMultiplier = dateRange === '7d' ? 0.35 : dateRange === '30d' ? 0.85 : 1.0;

  const currentTotalKg = Number((impactStats.totalKgRecycled * rangeMultiplier).toFixed(1));
  const currentTotalPoints = Math.round(impactStats.totalPointsIssued * rangeMultiplier);
  const currentCO2 = Number((impactStats.co2SavedTotalKg * rangeMultiplier).toFixed(1));
  const currentWater = Math.round(impactStats.waterSavedTotalLiters * rangeMultiplier);

  // Materials breakdown
  const materialList: MaterialCategory[] = ['PET', 'CARTON', 'ALUMINIO', 'VIDRIO', 'PAPEL'];
  const maxMatWeight = Math.max(
    ...materialList.map((m) => (impactStats.materialTotals[m] || 1) * rangeMultiplier),
    1
  );

  const handleCreateCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerForm.name || !centerForm.address) return;
    addCollectionCenter(centerForm);
    setShowNewCenterModal(false);
    setCenterForm({
      name: '',
      address: '',
      postalCode: '',
      lat: 19.4320,
      lng: -99.1550,
      phone: '+52 55 ',
      schedule: 'Lun - Sáb: 08:00 - 18:00',
      isOpen: true,
      acceptedMaterials: ['PET', 'CARTON', 'ALUMINIO'],
      capacityPercentage: 20,
      operatorName: 'Nuevo Operador',
    });
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardForm.title || !rewardForm.sponsorName) return;
    addReward(rewardForm);
    setShowNewRewardModal(false);
    setRewardForm({
      title: '',
      sponsorName: '',
      category: 'alimentos',
      pointsCost: 150,
      originalValue: '$150 MXN',
      stock: 20,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      validUntil: '31 Dic 2026',
      terms: 'Válido presentando cupón digital en sucursal.',
    });
  };

  const exportCSV = () => {
    const headers = 'ID,Usuario,Centro,Fecha,PesoKg,Puntos\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.userName}","${t.centerName}","${t.date}",${t.totalWeightKg},${t.totalPoints}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ecorecicla-${dateRange}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel de Coordinación y Auditoría General</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Métricas de Impacto Ambiental & Gestión
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supervisa en tiempo real el pesaje de residuos, centros autorizados y alianzas comerciales.
          </p>
        </div>

        {/* Date Filter & Export Button (CA-05 requirement) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 flex text-xs font-semibold">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1.5 rounded-xl transition ${
                dateRange === '7d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1.5 rounded-xl transition ${
                dateRange === '30d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mes Actual
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                dateRange === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Histórico
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeAdminTab === 'metrics'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Reciclaje</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('centers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeAdminTab === 'centers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gestión de Centros ({centers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('rewards')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeAdminTab === 'rewards'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Catálogo & Comercios ({rewards.length})</span>
        </button>
      </div>

      {/* Tab 1: Global Metrics */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Material Recolectado
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {currentTotalKg}
                </span>
                <span className="text-xs text-slate-500 font-bold">kg</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                En {transactions.length} pesajes validados
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Eco-Puntos Emitidos
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-amber-500">
                  {currentTotalPoints}
                </span>
                <span className="text-xs text-slate-500 font-bold">pts</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                {impactStats.totalPointsRedeemed} pts canjeados en comercios
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Ciudadanos Activos
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                  {impactStats.activeCitizens}
                </span>
                <span className="text-xs text-slate-500 font-bold">usuarios</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium block mt-2">
                Participación ciudadana activa
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Centros Autorizados
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {centers.filter((c) => c.isOpen).length}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  / {centers.length} activos
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                Con báscula digital operativa
              </span>
            </div>
          </div>

          {/* Breakdown by Material Category (CA-05) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Distribución por Categoría de Material Reciclable
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kilogramos recibidos y porcentaje sobre el total recolectado
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {materialList.map((mat) => {
                  const tariff = MATERIAL_TARIFFS[mat];
                  const kg = Number(
                    ((impactStats.materialTotals[mat] || 0) * rangeMultiplier).toFixed(1)
                  );
                  const percentage =
                    currentTotalKg > 0 ? Math.round((kg / currentTotalKg) * 100) : 0;

                  return (
                    <div key={mat} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {tariff.name}
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-slate-900 dark:text-white">{kg} kg</span>
                          <span className="text-slate-400 font-normal">({percentage}%)</span>
                        </div>
                      </div>

                      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${tariff.color}`}
                          style={{ width: `${Math.max(percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Environmental Savings Summary */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 border border-emerald-800/40 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Auditoría Ecológica
                </span>
                <h3 className="text-xl font-black tracking-tight">
                  Impacto Ambiental Certificado
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Cálculo basado en las metodologías oficiales de reducción de huella de carbono y ahorro hídrico por tonelada reciclada.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-300 block">CO₂ Evitado</span>
                      <span className="text-xl font-black font-mono text-white">
                        {currentCO2} kg CO₂e
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <Droplet className="w-6 h-6 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-300 block">Agua Preservada</span>
                      <span className="text-xl font-black font-mono text-white">
                        {currentWater.toLocaleString()} Litros
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <TreeDeciduous className="w-6 h-6 text-teal-300 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-300 block">Árboles Protegidos</span>
                      <span className="text-xl font-black font-mono text-white">
                        {impactStats.treesPreserved} unidades
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400">
                Auditoría en tiempo real para reporte de cumplimiento sustentable.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Centers Management */}
      {activeAdminTab === 'centers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Centros de Acopio Autorizados
            </h3>
            <button
              onClick={() => setShowNewCenterModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Dar de Alta Nuevo Centro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centers.map((center) => (
              <div
                key={center.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {center.name}
                    </h4>
                    <button
                      onClick={() => toggleCenterStatus(center.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        center.isOpen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {center.isOpen ? 'Activo' : 'Cerrado'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {center.address}
                  </p>

                  <div className="mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p>Horario: <span className="font-semibold">{center.schedule}</span></p>
                    <p>Operador: <span className="font-semibold">{center.operatorName}</span></p>
                    <p>Teléfono: <span className="font-semibold">{center.phone}</span></p>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Materiales Aceptados:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {center.acceptedMaterials.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Capacidad actual:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {center.capacityPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Rewards & Sponsors Management */}
      {activeAdminTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Catálogo de Recompensas & Comercios Patrocinadores
            </h3>
            <button
              onClick={() => setShowNewRewardModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Recompensa Patrocinada</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((rew) => (
              <div
                key={rew.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                        {rew.sponsorName}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {rew.title}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs">
                      {rew.pointsCost} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {rew.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Stock disponible:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {rew.stock} unidades
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Center Modal */}
      {showNewCenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Dar de Alta Nuevo Centro de Acopio
            </h3>

            <form onSubmit={handleCreateCenter} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nombre del Centro:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Centro Verde Insurgentes Sur"
                  value={centerForm.name}
                  onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Dirección completa:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Av. Insurgentes Sur 1520, Benito Juárez"
                  value={centerForm.address}
                  onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Código Postal:</label>
                  <input
                    type="text"
                    required
                    placeholder="03920"
                    value={centerForm.postalCode}
                    onChange={(e) => setCenterForm({ ...centerForm, postalCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Operador a cargo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre del operador"
                    value={centerForm.operatorName}
                    onChange={(e) => setCenterForm({ ...centerForm, operatorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewCenterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Crear Centro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Reward Modal */}
      {showNewRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Dar de Alta Nueva Recompensa Patrocinada
            </h3>

            <form onSubmit={handleCreateReward} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Título de la Recompensa:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 20% Descuento en Cafetería Sustentable"
                  value={rewardForm.title}
                  onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Comercio Patrocinador:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Café Grano Verde"
                  value={rewardForm.sponsorName}
                  onChange={(e) => setRewardForm({ ...rewardForm, sponsorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Costo en Eco-Puntos:</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={rewardForm.pointsCost}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, pointsCost: parseInt(e.target.value) || 50 })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stock de cupones:</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={rewardForm.stock}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, stock: parseInt(e.target.value) || 10 })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Descripción y términos:</label>
                <textarea
                  rows={2}
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  placeholder="Detalles de lo que incluye el beneficio..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewRewardModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Guardar Recompensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
