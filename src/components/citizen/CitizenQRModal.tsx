import React from 'react';
import { X, QrCode, ShieldCheck, Copy, Check, Sparkles, User, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenQRModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUser.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                Pase Digital de Reciclaje
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Identificación Única EcoRecicla</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center">
          <div className="relative p-4 rounded-2xl bg-white border-2 border-emerald-500/30 shadow-inner flex flex-col items-center">
            {/* High visual fidelity QR representation */}
            <div className="w-56 h-56 bg-slate-950 rounded-xl p-3 flex flex-col justify-between shadow-md relative overflow-hidden">
              {/* Corner position markers */}
              <div className="flex justify-between">
                <div className="w-12 h-12 border-4 border-emerald-400 rounded-lg p-1.5 flex items-center justify-center bg-slate-900">
                  <div className="w-6 h-6 bg-emerald-400 rounded-xs" />
                </div>
                <div className="w-12 h-12 border-4 border-emerald-400 rounded-lg p-1.5 flex items-center justify-center bg-slate-900">
                  <div className="w-6 h-6 bg-emerald-400 rounded-xs" />
                </div>
              </div>

              {/* Center matrix elements */}
              <div className="grid grid-cols-6 gap-1.5 px-2 py-1">
                <div className="h-2 bg-emerald-400/80 rounded-xs" />
                <div className="h-2 bg-white rounded-xs" />
                <div className="h-2 bg-emerald-400 rounded-xs" />
                <div className="h-2 bg-slate-800 rounded-xs" />
                <div className="h-2 bg-white rounded-xs" />
                <div className="h-2 bg-emerald-400 rounded-xs" />
                <div className="h-2 bg-white rounded-xs" />
                <div className="h-2 bg-emerald-500 rounded-xs col-span-2" />
                <div className="h-2 bg-white rounded-xs" />
                <div className="h-2 bg-slate-700 rounded-xs" />
                <div className="h-2 bg-emerald-400 rounded-xs" />
              </div>

              {/* Bottom position marker & logo badge */}
              <div className="flex justify-between items-end">
                <div className="w-12 h-12 border-4 border-emerald-400 rounded-lg p-1.5 flex items-center justify-center bg-slate-900">
                  <div className="w-6 h-6 bg-emerald-400 rounded-xs" />
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="w-12 h-6 flex items-center justify-center gap-1">
                  <span className="w-2 h-4 bg-emerald-400 rounded-xs" />
                  <span className="w-2 h-6 bg-white rounded-xs" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-xs" />
                </div>
              </div>

              {/* Scanline animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" style={{ top: '45%' }} />
            </div>

            <p className="mt-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wider">
              {currentUser.qrCode}
            </p>
          </div>

          {/* User info card */}
          <div className="mt-4 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Matrícula: {currentUser.institutionalId || currentUser.accountNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Balance Actual</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentUser.pointsBalance} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex items-start gap-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 text-xs text-emerald-900 dark:text-emerald-300 mb-4 border border-emerald-200/50 dark:border-emerald-800/40">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Muestra esta pantalla al operador del centro de acopio. Él escaneará tu código para pesar tus materiales y acreditar tus eco-puntos al instante.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
