import React from 'react';
import { UserCheck, Shield, Scale, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, currentUser } = useApp();

  const roles: { id: UserRole; label: string; icon: any; desc: string; badge: string }[] = [
    {
      id: 'citizen',
      label: 'Ciudadano',
      icon: UserCheck,
      desc: 'Registra residuos, ubica centros, muestra QR y canjea eco-puntos',
      badge: 'Usuario',
    },
    {
      id: 'operator',
      label: 'Operador Acopio',
      icon: Scale,
      desc: 'Escanea QR, valida peso en báscula y acredita eco-puntos',
      badge: 'Báscula',
    },
    {
      id: 'admin',
      label: 'Administrador',
      icon: Shield,
      desc: 'Supervisa métricas globales, centros de acopio y catálogo',
      badge: 'Gestión',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-3 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Simulación de Roles MVP:</span>
          <span className="hidden sm:inline text-slate-400">
            Explora las interfaces según los 3 roles del documento EcoRecicla.
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
                title={r.desc}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
