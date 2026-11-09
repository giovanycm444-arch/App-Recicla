import React from 'react';
import {
  Coins,
  QrCode,
  Scale,
  MapPin,
  Gift,
  Leaf,
  Droplet,
  TreeDeciduous,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MATERIAL_TARIFFS } from '../../data/initialData';

interface CitizenDashboardProps {
  onOpenQR: () => void;
  onOpenEstimate: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onOpenQR,
  onOpenEstimate,
  onNavigateTab,
}) => {
  const { currentUser, transactions } = useApp();

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  // Compute personal impact
  const totalKg = currentUser.totalKgRecycled;
  const approxCo2 = (totalKg * 1.8).toFixed(1);
  const approxWater = Math.round(totalKg * 18);
  const approxTrees = (totalKg / 40).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Nivel: Eco-Héroe Oro</span>
              <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full font-mono">
                {currentUser.accountNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              ¡Hola, {currentUser.name.split(' ')[0]}! 🌱
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
              Cada kilogramo de residuo que separas genera eco-puntos digitales para canjear en comercios locales y protege el medio ambiente.
            </p>
          </div>

          {/* Eco-Points Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-lg min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-emerald-100 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Billetera de Puntos</span>
              <span className="bg-emerald-500/50 text-[10px] px-2 py-0.5 rounded-full font-bold">Activo</span>
            </div>
            <div className="flex items-baseline gap-2">
              <Coins className="w-7 h-7 text-amber-300 fill-amber-300 self-center" />
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                {currentUser.pointsBalance}
              </span>
              <span className="text-xs text-emerald-200 font-semibold">eco-puntos</span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
              <span>Reciclado acumulado:</span>
              <span className="font-bold font-mono text-white text-xs">
                {currentUser.totalKgRecycled} kg
              </span>
            </div>
          </div>
        </div>

        {/* Quick CTA Buttons */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onOpenQR}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Mi QR de Entrega</span>
          </button>

          <button
            onClick={onOpenEstimate}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/40 hover:bg-emerald-500/60 backdrop-blur-md text-white font-bold text-xs border border-white/20 active:scale-95 transition"
          >
            <Scale className="w-4 h-4 text-emerald-200" />
            <span>Registrar Residuos</span>
          </button>

          <button
            onClick={() => onNavigateTab('map')}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/40 hover:bg-emerald-500/60 backdrop-blur-md text-white font-bold text-xs border border-white/20 active:scale-95 transition"
          >
            <MapPin className="w-4 h-4 text-emerald-200" />
            <span>Centros Cercanos</span>
          </button>

          <button
            onClick={() => onNavigateTab('rewards')}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-400 text-slate-900 font-bold text-xs shadow-md hover:bg-amber-300 active:scale-95 transition"
          >
            <Gift className="w-4 h-4 text-slate-900" />
            <span>Canjear Recompensas</span>
          </button>
        </div>
      </div>

      {/* Environmental Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              CO₂ Evitado a la Atmósfera
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {approxCo2}
              </span>
              <span className="text-xs text-slate-500">kg CO₂e</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Agua Dulce Preservada
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {approxWater}
              </span>
              <span className="text-xs text-slate-500">Litros</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <TreeDeciduous className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Árboles Equivalentes
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {approxTrees}
              </span>
              <span className="text-xs text-slate-500">árboles protegidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Tariff & Recycling Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Catálogo Oficial de Materiales & Tarifas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conoce cuántos puntos ganas por cada kilogramo entregado en nuestros centros
            </p>
          </div>
          <button
            onClick={onOpenEstimate}
            className="self-start sm:self-auto text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Calcular entrega</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.values(MATERIAL_TARIFFS).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[11px]">
                    +{item.pointsPerKg} pts/kg
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-start gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{item.tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deliveries Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Últimas Entregas Validadas
          </h3>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Ver todo el historial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {userTransactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{tx.centerName}</p>
                <p className="text-[11px] text-slate-400">{tx.date} • {tx.totalWeightKg} kg pesados</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  +{tx.totalPoints} pts
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">Acreditado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
