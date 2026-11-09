import React from 'react';
import { History, ArrowDownLeft, ArrowUpRight, CheckCircle, Scale, Calendar, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MATERIAL_TARIFFS } from '../../data/initialData';

export const TransactionHistory: React.FC = () => {
  const { transactions, coupons, currentUser } = useApp();

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const userCoupons = coupons.filter((c) => c.userId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Historial de Reciclaje & Movimientos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registro auditable de depósitos validados en báscula y canjes de recompensas
            </p>
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="space-y-3">
        {userTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <Scale className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tienes entregas registradas aún.
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Visita cualquiera de nuestros centros de acopio autorizados y muestra tu código QR para acreditar tus primeros materiales.
            </p>
          </div>
        ) : (
          userTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Entrega Validada en Báscula
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                        {tx.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {tx.centerName}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {tx.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points and Weight pill */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    +{tx.totalPoints} pts
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {tx.totalWeightKg} kg pesados
                  </span>
                </div>
              </div>

              {/* Items breakdown pills */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
                {tx.items.map((it, idx) => {
                  const tariff = MATERIAL_TARIFFS[it.material];
                  return (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] border border-slate-200/60 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {tariff?.name || it.material}:
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">
                        {it.weightKg} kg
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ({it.pointsCalculated} pts)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
