import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Sparkles,
  Leaf,
  CheckCircle2,
  Scale,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory } from '../../types';
import { MATERIAL_TARIFFS } from '../../data/initialData';

export const RecycleEstimateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { centers, createDropOffEstimate } = useApp();

  const [selectedMaterials, setSelectedMaterials] = useState<
    { material: MaterialCategory; estimatedKg: number }[]
  >([{ material: 'PET', estimatedKg: 3.5 }]);

  const [selectedCenterId, setSelectedCenterId] = useState<string>(centers[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [submittedPass, setSubmittedPass] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddMaterial = (cat: MaterialCategory) => {
    if (selectedMaterials.some((m) => m.material === cat)) return;
    setSelectedMaterials([...selectedMaterials, { material: cat, estimatedKg: 2.0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const handleUpdateKg = (index: number, kg: number) => {
    const updated = [...selectedMaterials];
    updated[index].estimatedKg = Math.max(0.1, Number(kg));
    setSelectedMaterials(updated);
  };

  // Calculations
  const totalKg = selectedMaterials.reduce((acc, m) => acc + (m.estimatedKg || 0), 0);
  const estimatedPoints = selectedMaterials.reduce((acc, m) => {
    const tariff = MATERIAL_TARIFFS[m.material];
    return acc + Math.round((m.estimatedKg || 0) * (tariff?.pointsPerKg || 10));
  }, 0);

  const estimatedCO2 = selectedMaterials.reduce((acc, m) => {
    const tariff = MATERIAL_TARIFFS[m.material];
    return acc + (m.estimatedKg || 0) * (tariff?.co2SavedPerKg || 1);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaterials.length === 0) return;

    createDropOffEstimate({
      centerId: selectedCenterId,
      estimatedMaterials: selectedMaterials,
      scheduledDate,
      notes,
    });

    setSubmittedPass(true);
  };

  const resetForm = () => {
    setSubmittedPass(false);
    onClose();
  };

  const allCategories: MaterialCategory[] = ['PET', 'CARTON', 'ALUMINIO', 'VIDRIO', 'PAPEL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 my-8">
        {!submittedPass ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Programar Entrega de Residuos
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Estima tus materiales y calcula tus eco-puntos proyectados
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick add category chips */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Selecciona materiales a registrar:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allCategories.map((cat) => {
                  const isSelected = selectedMaterials.some((m) => m.material === cat);
                  const tariff = MATERIAL_TARIFFS[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleAddMaterial(cat)}
                      disabled={isSelected}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{tariff.name}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        ({tariff.pointsPerKg} pts/kg)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material weight items */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {selectedMaterials.map((item, idx) => {
                const tariff = MATERIAL_TARIFFS[item.material];
                return (
                  <div
                    key={item.material}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {tariff.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                          +{tariff.pointsPerKg} pts/kg
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {tariff.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="200"
                          value={item.estimatedKg}
                          onChange={(e) => handleUpdateKg(idx, parseFloat(e.target.value) || 0)}
                          className="w-14 text-center font-bold text-sm bg-transparent outline-none dark:text-white font-mono"
                        />
                        <span className="text-xs text-slate-400">kg</span>
                      </div>

                      {selectedMaterials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1 uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Eco-Puntos Estimados
                </span>
                <p className="text-2xl font-black font-mono tracking-tight">
                  ~{estimatedPoints}{' '}
                  <span className="text-xs font-normal text-emerald-200">puntos</span>
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-semibold">{totalKg.toFixed(1)} kg totales</p>
                <p className="text-[11px] text-emerald-200 flex items-center justify-end gap-1 mt-0.5">
                  <Leaf className="w-3 h-3" /> ~{estimatedCO2.toFixed(1)} kg CO₂ evitados
                </p>
              </div>
            </div>

            {/* Collection Center & Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Centro de Acopio Destino:
                </label>
                <div className="relative">
                  <select
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.isOpen ? '(Abierto)' : '(Cerrado hoy)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha planeada de entrega:
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Notas opcionales (ej. cajas cerradas, botellas aplastadas):
              </label>
              <input
                type="text"
                placeholder="Ej. 2 costales con PET lavado y comprimido..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Footnote */}
            <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                El peso final y los puntos exactos se validarán en báscula con el operador en el centro de acopio físico.
              </span>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <span>Generar Pre-Registro de Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ¡Pre-Registro de Entrega Creado!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Tu entrega ha quedado agendada para el <strong>{scheduledDate}</strong>. Guarda tus materiales limpios y secos.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-4 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimado total:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {totalKg.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Puntos proyectados:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  ~{estimatedPoints} eco-puntos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Centro:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {centers.find((c) => c.id === selectedCenterId)?.name}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Al llegar al centro de acopio, abre tu <strong>Pase QR Digital</strong> para que el operador verifique el pesaje en la báscula física.
            </p>

            <button
              onClick={resetForm}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Listo, ver mi panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
