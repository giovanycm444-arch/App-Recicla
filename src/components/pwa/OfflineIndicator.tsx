import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 text-white px-4 py-3 shadow-2xl backdrop-blur-md border border-amber-500/40 animate-bounce-subtle">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <WifiOff className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            Modo Sin Conexión (PWA)
          </p>
          <p className="text-xs text-slate-300">
            Tus datos y códigos QR están sincronizados localmente en caché.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800">
        <Database className="w-3 h-3" />
        <span>Guardado</span>
      </div>
    </div>
  );
};
