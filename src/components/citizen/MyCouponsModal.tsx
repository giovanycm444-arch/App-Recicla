import React from 'react';
import { X, Ticket, Clock, CheckCircle, Store, Sparkles, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyCouponsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { coupons, currentUser } = useApp();

  if (!isOpen) return null;

  const userCoupons = coupons.filter((c) => c.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mis Cupones Canjeados
              </h3>
              <p className="text-[11px] text-slate-400">
                Presenta estos códigos digitales en los comercios patrocinadores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
          {userCoupons.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Ticket className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Aún no has canjeado recompensas.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Acumula eco-puntos entregando materiales y explora el catálogo.
              </p>
            </div>
          ) : (
            userCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> VÁLIDO & ACTIVO
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {coupon.rewardTitle}
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3" />
                      {coupon.sponsorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Canjeado</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {coupon.redeemedAt}
                    </span>
                  </div>
                </div>

                {/* Digital barcode mockup */}
                <div className="mt-3 bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <div className="flex justify-center items-center gap-0.5 h-8 px-2 overflow-hidden">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full ${
                          (i * 3) % 2 === 0 ? 'w-1 bg-slate-900' : 'w-0.5 bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="font-mono text-xs font-black text-slate-800 tracking-wider">
                      {coupon.couponCode}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Vence: {coupon.expiresAt}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-900 dark:bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
