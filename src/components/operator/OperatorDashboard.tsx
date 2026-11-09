import React, { useState } from 'react';
import {
  Scale,
  QrCode,
  Scan,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Camera,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory, UserProfile } from '../../types';
import { MATERIAL_TARIFFS } from '../../data/initialData';

export const OperatorDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    centers,
    createDropOffTransaction,
    transactions,
  } = useApp();

  // Find center assigned to this operator
  const myCenter = centers[0]; // Centro Metropolitano by default

  const [scannedCode, setScannedCode] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<UserProfile | null>(allUsers[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [weighItems, setWeighItems] = useState<{ material: MaterialCategory; weightKg: number }[]>([
    { material: 'PET', weightKg: 5.2 },
    { material: 'ALUMINIO', weightKg: 1.8 },
  ]);
  const [successResult, setSuccessResult] = useState<{
    citizenName: string;
    points: number;
    weight: number;
  } | null>(null);

  // Quick citizen selection helper
  const citizens = allUsers.filter((u) => u.role === 'citizen');

  const handleScanInput = (code: string) => {
    setScannedCode(code);
    const found = allUsers.find(
      (u) =>
        u.qrCode === code ||
        u.accountNumber === code ||
        (u.institutionalId && u.institutionalId === code) ||
        u.email === code
    );
    if (found) {
      setSelectedCitizen(found);
      setIsCameraActive(false);
    }
  };

  const handleAddRow = (mat: MaterialCategory) => {
    if (weighItems.some((w) => w.material === mat)) return;
    setWeighItems([...weighItems, { material: mat, weightKg: 1.0 }]);
  };

  const handleRemoveRow = (idx: number) => {
    setWeighItems(weighItems.filter((_, i) => i !== idx));
  };

  const handleWeightChange = (idx: number, val: number) => {
    const updated = [...weighItems];
    updated[idx].weightKg = Math.max(0, Number(val));
    setWeighItems(updated);
  };

  // Compute live totals
  const totalWeight = weighItems.reduce((acc, it) => acc + (it.weightKg || 0), 0);
  const totalPoints = weighItems.reduce((acc, it) => {
    const tariff = MATERIAL_TARIFFS[it.material];
    return acc + Math.round((it.weightKg || 0) * (tariff?.pointsPerKg || 10));
  }, 0);

  const handleConfirmTransaction = () => {
    if (!selectedCitizen) return;
    if (totalWeight <= 0) {
      alert('Ingresa el peso verificado de al menos un material');
      return;
    }

    const res = createDropOffTransaction(
      selectedCitizen.id,
      myCenter.id,
      currentUser.id,
      weighItems
    );

    if (res.success) {
      setSuccessResult({
        citizenName: selectedCitizen.name,
        points: res.pointsEarned,
        weight: Number(totalWeight.toFixed(2)),
      });
      // Reset weigh items to default clean row
      setWeighItems([{ material: 'PET', weightKg: 0 }]);
    }
  };

  const centerTransactions = transactions.filter((t) => t.centerId === myCenter.id);
  const totalKgToday = centerTransactions.reduce((acc, t) => acc + t.totalWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* Operator Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Módulo de Operador & Báscula</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Estación de Recepción y Pesaje
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>Centro: <strong>{myCenter.name}</strong></span>
            <span>• Operador en turno: <strong>{currentUser.name}</strong></span>
          </p>
        </div>

        {/* Center Quick Stats */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Kg Recibidos en este Centro
            </span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {totalKgToday.toFixed(1)} kg
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: QR Scanner & Scale Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Scanner / Citizen Selector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Identificación del Ciudadano (Escanear QR)
                </h3>
              </div>
              <button
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition ${
                  isCameraActive
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{isCameraActive ? 'Cerrar Cámara' : 'Cámara QR'}</span>
              </button>
            </div>

            {/* Simulated Live Camera View */}
            {isCameraActive ? (
              <div className="relative rounded-2xl bg-black h-48 overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500 shadow-inner mb-4">
                <div className="w-36 h-36 border-2 border-dashed border-emerald-400 rounded-xl flex items-center justify-center relative">
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-400 animate-bounce" />
                  <Scan className="w-8 h-8 text-emerald-400/60 animate-pulse" />
                </div>
                <p className="text-[11px] text-white/80 mt-2 font-mono">
                  Buscando código QR de EcoRecicla...
                </p>
                <button
                  onClick={() => handleScanInput('ECO-PASS-USR-7749-SECURE')}
                  className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition"
                >
                  Simular Detección de QR
                </button>
              </div>
            ) : null}

            {/* Quick manual selection of registered test citizens */}
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Seleccionar ciudadano presente o escribir código:
            </label>
            <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
              {citizens.map((c) => {
                const isSelected = selectedCitizen?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCitizen(c);
                      setScannedCode(c.qrCode);
                    }}
                    className={`cursor-pointer p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {c.institutionalId || c.accountNumber}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {c.pointsBalance} pts
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Direct manual code input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresar código QR (ej. ECO-PASS-...)"
                value={scannedCode}
                onChange={(e) => handleScanInput(e.target.value)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>

          {/* Citizen Verification Badge */}
          {selectedCitizen && (
            <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Ciudadano Verificado: {selectedCitizen.name}
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                    Cuenta: {selectedCitizen.accountNumber}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-300">
                {selectedCitizen.pointsBalance} pts actuales
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Digital Scale & Weighing Station */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  2
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Báscula Digital & Pesaje Físico Verificado
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 dark:border-emerald-800">
                Báscula Calibrada OK
              </span>
            </div>

            {/* Quick add material buttons */}
            <div className="mb-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
                Agregar tipo de material entregado:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['PET', 'CARTON', 'ALUMINIO', 'VIDRIO', 'PAPEL'] as MaterialCategory[]).map(
                  (mat) => {
                    const isAdded = weighItems.some((w) => w.material === mat);
                    const tariff = MATERIAL_TARIFFS[mat];
                    return (
                      <button
                        key={mat}
                        onClick={() => handleAddRow(mat)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-xl font-medium transition ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 opacity-60'
                            : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        + {tariff.name}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Weighing input rows */}
            <div className="space-y-2.5 mb-4 max-h-56 overflow-y-auto pr-1">
              {weighItems.map((item, idx) => {
                const tariff = MATERIAL_TARIFFS[item.material];
                const points = Math.round((item.weightKg || 0) * tariff.pointsPerKg);
                return (
                  <div
                    key={item.material}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {tariff.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({tariff.pointsPerKg} pts/kg)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Scale Weight input */}
                      <div className="flex items-center bg-white dark:bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="500"
                          value={item.weightKg}
                          onChange={(e) => handleWeightChange(idx, parseFloat(e.target.value) || 0)}
                          className="w-16 text-center font-black text-sm bg-transparent outline-none dark:text-white font-mono"
                        />
                        <span className="text-xs text-slate-400 ml-1">kg</span>
                      </div>

                      {/* Calculated points badge */}
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 w-16 text-right">
                        +{points} pts
                      </span>

                      <button
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scale Calculation Banner */}
            <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between mb-4 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Peso Total en Báscula
                </span>
                <span className="text-2xl font-black font-mono text-white">
                  {totalWeight.toFixed(2)} <span className="text-xs text-slate-400">kg</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold flex items-center justify-end gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Total Acreditar
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  +{totalPoints} <span className="text-xs text-emerald-200">pts</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleConfirmTransaction}
            disabled={!selectedCitizen || totalWeight <= 0}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
              !selectedCitizen || totalWeight <= 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirmar Entrega y Acreditar Eco-Puntos Inmediatos</span>
          </button>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {successResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-emerald-500/40 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              ¡Puntos Acreditados con Éxito!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Se han transferido inmediatamente <strong>+{successResult.points} eco-puntos</strong> a la billetera digital de <strong>{successResult.citizenName}</strong>.
            </p>
            <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
              Peso validado: {successResult.weight} kg • Ticket digital generado
            </div>
            <button
              onClick={() => setSuccessResult(null)}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Realizar Siguiente Pesaje
            </button>
          </div>
        </div>
      )}

      {/* Today's Reception Log at this Center */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          Registro de Recepciones en Este Centro de Acopio
        </h3>
        <div className="space-y-2.5">
          {centerTransactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{tx.userName}</p>
                <p className="text-[11px] text-slate-400">{tx.date} • Op: {tx.operatorName}</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  +{tx.totalPoints} pts
                </span>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {tx.totalWeightKg} kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
