import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { CentersMap } from './components/citizen/CentersMap';
import { RewardsCatalog } from './components/citizen/RewardsCatalog';
import { TransactionHistory } from './components/citizen/TransactionHistory';
import { CitizenQRModal } from './components/citizen/CitizenQRModal';
import { RecycleEstimateModal } from './components/citizen/RecycleEstimateModal';
import { MyCouponsModal } from './components/citizen/MyCouponsModal';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { RotateCcw, Heart, Leaf, Shield, Smartphone } from 'lucide-react';

function AppContent() {
  const { currentRole, resetDemoData, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isMyCouponsOpen, setIsMyCouponsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync tab when switching roles
  React.useEffect(() => {
    if (currentRole === 'citizen') {
      if (activeTab.startsWith('operator') || activeTab.startsWith('admin')) {
        setActiveTab('dashboard');
      }
    } else if (currentRole === 'operator') {
      setActiveTab('operator-station');
    } else if (currentRole === 'admin') {
      setActiveTab('admin-metrics');
    }
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 md:pb-6">
      {/* Role Switcher Toolbar */}
      <RoleSwitcher />

      {/* Main App Navbar with PWA Install Button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQR={() => setIsQRModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Citizen Role Views */}
        {currentRole === 'citizen' && (
          <>
            {activeTab === 'dashboard' && (
              <CitizenDashboard
                onOpenQR={() => setIsQRModalOpen(true)}
                onOpenEstimate={() => setIsEstimateModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'map' && (
              <CentersMap
                onScheduleDropOff={(centerId) => {
                  setIsEstimateModalOpen(true);
                }}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsCatalog onOpenMyCoupons={() => setIsMyCouponsOpen(true)} />
            )}

            {activeTab === 'history' && <TransactionHistory />}
          </>
        )}

        {/* Operator Role Views */}
        {currentRole === 'operator' && (
          <>
            {activeTab === 'operator-station' && <OperatorDashboard />}
            {activeTab === 'operator-log' && <OperatorDashboard />}
          </>
        )}

        {/* Administrator Role Views */}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <CitizenQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      <RecycleEstimateModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
      />

      <MyCouponsModal
        isOpen={isMyCouponsOpen}
        onClose={() => setIsMyCouponsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* PWA Offline Alert */}
      <OfflineIndicator />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
              E
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              EcoRecicla PWA
            </span>
            <span>• Plataforma Inteligente de Incentivo al Reciclaje</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('¿Restablecer datos de demostración a valores iniciales?')) {
                  resetDemoData();
                }
              }}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title="Reiniciar datos de prueba a valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Demo</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Leaf className="w-3.5 h-3.5" /> Economía Circular Activa
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
