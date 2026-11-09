import React, { useState } from 'react';
import {
  Gift,
  Coins,
  Store,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Sparkles,
  Ticket,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RewardItem, RedeemedCoupon } from '../../types';

export const RewardsCatalog: React.FC<{ onOpenMyCoupons: () => void }> = ({
  onOpenMyCoupons,
}) => {
  const { rewards, currentUser, redeemReward, coupons } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [confirmingReward, setConfirmingReward] = useState<RewardItem | null>(null);
  const [successCoupon, setSuccessCoupon] = useState<RedeemedCoupon | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'alimentos', label: 'Café & Alimentos' },
    { id: 'ecologia', label: 'Productos Eco' },
    { id: 'movilidad', label: 'Transporte & Movilidad' },
    { id: 'descuentos', label: 'Comercios Aliados' },
  ];

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory === 'todos') return true;
    return r.category === selectedCategory;
  });

  const handleRedeemClick = (reward: RewardItem) => {
    setErrorMessage(null);
    if (currentUser.pointsBalance < reward.pointsCost) {
      setErrorMessage(
        `Necesitas ${reward.pointsCost} eco-puntos para esta recompensa. Tienes ${currentUser.pointsBalance} pts. ¡Recicla más para acumular la diferencia!`
      );
      setSelectedReward(reward);
      return;
    }
    setConfirmingReward(reward);
  };

  const handleConfirmRedeem = () => {
    if (!confirmingReward) return;
    const res = redeemReward(confirmingReward.id);
    if (res.success && res.coupon) {
      setSuccessCoupon(res.coupon);
      setConfirmingReward(null);
    } else {
      setErrorMessage(res.error || 'No se pudo procesar el canje');
    }
  };

  const myActiveCouponsCount = coupons.filter(
    (c) => c.userId === currentUser.id && c.status === 'activo'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Billetera de Recompensas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Catálogo de Canje de Eco-Puntos
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
              Intercambia tus eco-puntos ganados por descuentos exclusivos, productos zero-waste y beneficios con patrocinadores locales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right">
              <span className="text-[11px] text-emerald-100 uppercase tracking-wider block font-semibold">
                Tu Saldo Disponible
              </span>
              <div className="flex items-center justify-end gap-1.5 text-2xl font-black font-mono">
                <Coins className="w-6 h-6 text-amber-300 fill-amber-300" />
                <span>{currentUser.pointsBalance}</span>
                <span className="text-xs font-normal text-emerald-200">pts</span>
              </div>
            </div>

            <button
              onClick={onOpenMyCoupons}
              className="flex flex-col items-center justify-center px-4 py-3.5 rounded-2xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition"
            >
              <Ticket className="w-5 h-5 text-emerald-600 mb-0.5" />
              <span>Mis Cupones</span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ({myActiveCouponsCount} activos)
              </span>
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRewards.map((reward) => {
          const canAfford = currentUser.pointsBalance >= reward.pointsCost;
          const isOutOfStock = reward.stock <= 0;

          return (
            <div
              key={reward.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image banner */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                    {reward.sponsorName}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black font-mono shadow-md flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 fill-white" />
                    {reward.pointsCost} pts
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Valor aprox: {reward.originalValue}</span>
                    <span className="font-mono">
                      {isOutOfStock ? 'Agotado' : `${reward.stock} disponibles`}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Hasta {reward.validUntil}</span>
                  </div>

                  <button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={isOutOfStock}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                      isOutOfStock
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{isOutOfStock ? 'Agotado' : canAfford ? 'Canjear' : 'Ver Requisito'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insufficient Points Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Eco-Puntos Insuficientes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-5 w-full rounded-xl bg-slate-900 dark:bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Gift className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirmar Canje de Cupón
              </h3>
            </div>

            <div className="my-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {confirmingReward.title}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Patrocinador: {confirmingReward.sponsorName}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500">Costo a descontar:</span>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                    -{confirmingReward.pointsCost} eco-puntos
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500">Saldo tras el canje:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                    {currentUser.pointsBalance - confirmingReward.pointsCost} pts
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-900 dark:text-emerald-300 border border-emerald-200/50">
                Al confirmar, se generará un código único y código de barras digital que podrás presentar directamente en el establecimiento.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => setConfirmingReward(null)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                Confirmar y Canjear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Voucher Modal (CA-04 compliance) */}
      {successCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-emerald-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              ¡Canje Exitoso!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tu cupón ha sido emitido y guardado en tu billetera digital.
            </p>

            {/* Ticket Card */}
            <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-dashed border-emerald-400 text-left space-y-2">
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                {successCoupon.rewardTitle}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {successCoupon.sponsorName}
              </p>

              {/* Barcode representation */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 my-2 text-center">
                <div className="flex justify-center items-center gap-0.5 h-10 px-2 overflow-hidden">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full ${
                        (i * 7) % 3 === 0 ? 'w-1 bg-black' : (i * 5) % 2 === 0 ? 'w-0.5 bg-black' : 'w-1.5 bg-black'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-mono text-xs font-bold text-slate-800 tracking-widest mt-1">
                  {successCoupon.couponCode}
                </p>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Vence: {successCoupon.expiresAt}</span>
                <span className="font-bold text-emerald-600">Estado: ACTIVO</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessCoupon(null);
                onOpenMyCoupons();
              }}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Ver en Mis Cupones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
