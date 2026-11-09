import React from 'react';
import {
  Recycle,
  Coins,
  QrCode,
  MapPin,
  Gift,
  History,
  LayoutDashboard,
  Scale,
  BarChart3,
  Building2,
  Store,
  User,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQR: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQR,
  onOpenAuth,
}) => {
  const { currentUser, currentRole, resetDemoData } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/20 rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Eco<span className="text-emerald-600 dark:text-emerald-400">Recicla</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ml-1">
                    PWA
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-1 font-medium">
                  {currentRole === 'citizen'
                    ? 'Portal Ciudadano'
                    : currentRole === 'operator'
                    ? 'Báscula y Centro de Acopio'
                    : 'Panel de Administración'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {currentRole === 'citizen' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'map'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Centros de Acopio
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'rewards'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Gift className="w-4 h-4 text-emerald-500" />
                  Canjear Puntos
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'history'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-500" />
                  Mis Entregas
                </button>
              </>
            )}

            {currentRole === 'operator' && (
              <>
                <button
                  onClick={() => setActiveTab('operator-station')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'operator-station'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Scale className="w-4 h-4 text-emerald-500" />
                  Báscula y Recepción
                </button>
                <button
                  onClick={() => setActiveTab('operator-log')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'operator-log'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-500" />
                  Historial del Centro
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-metrics')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'admin-metrics'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  Métricas Globales
                </button>
                <button
                  onClick={() => setActiveTab('admin-centers')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'admin-centers'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Centros de Acopio
                </button>
                <button
                  onClick={() => setActiveTab('admin-rewards')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    activeTab === 'admin-rewards'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-500" />
                  Catálogo & Comercios
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons: PWA Install + Points Wallet + User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Citizen QR Code quick button */}
            {currentRole === 'citizen' && (
              <button
                onClick={onOpenQR}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-medium text-xs hover:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition active:scale-95"
                title="Mostrar mi código QR de entrega"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Mi QR</span>
              </button>
            )}

            {/* Eco-Points Pill (Citizen only) */}
            {currentRole === 'citizen' && (
              <div
                onClick={() => setActiveTab('rewards')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition shadow-xs"
              >
                <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{currentUser.pointsBalance}</span>
                <span className="font-normal text-[10px] text-emerald-600 dark:text-emerald-400 hidden xs:inline">pts</span>
              </div>
            )}

            {/* Profile pill */}
            <div
              onClick={onOpenAuth}
              className="cursor-pointer flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
              title="Ver perfil o cambiar usuario"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  {currentUser.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {currentUser.accountNumber}
                </p>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5">
        <div className="flex items-center justify-around text-[10px] font-medium text-slate-500 dark:text-slate-400">
          {currentRole === 'citizen' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                  activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mb-0.5" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                  activeTab === 'map' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <MapPin className="w-5 h-5 mb-0.5" />
                <span>Centros</span>
              </button>
              <button
                onClick={onOpenQR}
                className="flex flex-col items-center py-1 px-3 -mt-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold"
              >
                <QrCode className="w-6 h-6 mb-0.5" />
                <span>Mi QR</span>
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                  activeTab === 'rewards' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <Gift className="w-5 h-5 mb-0.5" />
                <span>Canje</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                  activeTab === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <History className="w-5 h-5 mb-0.5" />
                <span>Historial</span>
              </button>
            </>
          )}

          {currentRole === 'operator' && (
            <>
              <button
                onClick={() => setActiveTab('operator-station')}
                className={`flex flex-col items-center py-1 px-4 rounded-lg transition ${
                  activeTab === 'operator-station' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <Scale className="w-5 h-5 mb-0.5" />
                <span>Báscula y Pesaje</span>
              </button>
              <button
                onClick={() => setActiveTab('operator-log')}
                className={`flex flex-col items-center py-1 px-4 rounded-lg transition ${
                  activeTab === 'operator-log' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <History className="w-5 h-5 mb-0.5" />
                <span>Entregas de Hoy</span>
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin-metrics')}
                className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                  activeTab === 'admin-metrics' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <BarChart3 className="w-5 h-5 mb-0.5" />
                <span>Métricas</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-centers')}
                className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                  activeTab === 'admin-centers' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <Building2 className="w-5 h-5 mb-0.5" />
                <span>Centros</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-rewards')}
                className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                  activeTab === 'admin-rewards' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                <Store className="w-5 h-5 mb-0.5" />
                <span>Recompensas</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
