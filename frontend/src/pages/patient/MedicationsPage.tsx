import React, { useState, useEffect } from 'react';
import { medicationService, MedicationDTO } from '../../services/medicationService';
import { DrugInteractionResult } from '../../types';
import {
  Pill,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit3,
  X,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Search,
  ChevronRight,
  RefreshCw,
  Flame,
  Check,
  Info
} from 'lucide-react';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<MedicationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicationDTO | null>(null);

  // Interaction screening state
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [candidateDrug, setCandidateDrug] = useState('');
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionResult, setInteractionResult] = useState<DrugInteractionResult | null>(null);

  // View switch: 'list' | 'timeline'
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');

  // Adherence tracking (persisted daily)
  const todayKey = `adherence_${new Date().toISOString().slice(0, 10)}`;
  const [takenMeds, setTakenMeds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Form state
  const [form, setForm] = useState<MedicationDTO>({
    medicationName: '',
    dosage: '',
    frequency: 'Once Daily',
    timeOfDay: '08:00',
    prescribingDoctor: '',
    purpose: '',
    sideEffects: '',
    isActive: true,
    refillReminderDays: 7
  });

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getAll();
      setMedications(data);
    } catch (err) {
      console.error('Failed to load medications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const toggleTakeDose = (medId: number, slot: string) => {
    const key = `${medId}_${slot}`;
    const next = { ...takenMeds, [key]: !takenMeds[key] };
    setTakenMeds(next);
    localStorage.setItem(todayKey, JSON.stringify(next));
  };

  const resetForm = () => {
    setForm({
      medicationName: '',
      dosage: '',
      frequency: 'Once Daily',
      timeOfDay: '08:00',
      prescribingDoctor: '',
      purpose: '',
      sideEffects: '',
      isActive: true,
      refillReminderDays: 7
    });
    setEditingMed(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMed && editingMed.id) {
        await medicationService.update(editingMed.id, form);
      } else {
        await medicationService.create(form);
      }
      setShowModal(false);
      resetForm();
      loadMedications();
    } catch (err) {
      console.error('Failed to save medication', err);
    }
  };

  const handleEdit = (med: MedicationDTO) => {
    setEditingMed(med);
    setForm({ ...med });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this medication from your tracker?')) return;
    try {
      await medicationService.remove(id);
      loadMedications();
    } catch (err) {
      console.error('Failed to delete medication', err);
    }
  };

  const runInteractionCheck = async (candidate?: string) => {
    try {
      setInteractionLoading(true);
      const activeNames = medications.filter((m) => m.isActive !== false).map((m) => m.medicationName);
      const res = await medicationService.checkInteractions(activeNames, candidate || candidateDrug);
      setInteractionResult(res);
      setShowInteractionModal(true);
    } catch (err) {
      console.error('Failed to check drug interactions', err);
    } finally {
      setInteractionLoading(false);
    }
  };

  const activeMeds = medications.filter((m) => m.isActive !== false);

  // Group medications into schedule slots
  const scheduleSlots = [
    { id: 'morning', label: 'Morning', time: '08:00 AM', icon: Sunrise, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { id: 'afternoon', label: 'Afternoon / Lunch', time: '01:00 PM', icon: Sun, color: 'text-orange-500 bg-orange-50 border-orange-100' },
    { id: 'evening', label: 'Evening / Dinner', time: '07:00 PM', icon: Sunset, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { id: 'night', label: 'Bedtime', time: '10:00 PM', icon: Moon, color: 'text-purple-500 bg-purple-50 border-purple-100' }
  ];

  const getMedsForSlot = (slotId: string) => {
    return activeMeds.filter((m) => {
      const time = m.timeOfDay || '08:00';
      const hour = parseInt(time.split(':')[0], 10) || 8;
      const freq = (m.frequency || '').toLowerCase();

      if (slotId === 'morning') {
        return hour < 12 || freq.includes('twice') || freq.includes('three') || freq.includes('daily');
      }
      if (slotId === 'afternoon') {
        return (hour >= 12 && hour < 17) || freq.includes('three');
      }
      if (slotId === 'evening') {
        return (hour >= 17 && hour < 21) || freq.includes('twice') || freq.includes('three');
      }
      if (slotId === 'night') {
        return hour >= 21 || freq.includes('bedtime');
      }
      return false;
    });
  };

  // Calculate adherence progress for today
  const totalDosesToday = scheduleSlots.reduce((acc, slot) => acc + getMedsForSlot(slot.id).length, 0);
  const takenDosesToday = scheduleSlots.reduce((acc, slot) => {
    const medsInSlot = getMedsForSlot(slot.id);
    return acc + medsInSlot.filter((m) => m.id && takenMeds[`${m.id}_${slot.id}`]).length;
  }, 0);
  const adherencePercent = totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  const frequencies = ['Once Daily', 'Twice Daily', 'Three Times Daily', 'Every 8 Hours', 'Weekly', 'As Needed'];
  const suggestedCandidates = ['Ibuprofen (Advil)', 'Aspirin', 'Potassium Supplement', 'Grapefruit Juice', 'Alcohol', 'Acetaminophen (Tylenol)'];

  const getSeverityBadge = (sev: string) => {
    if (sev === 'CONTRAINDICATED') return { label: 'Contraindicated', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    if (sev === 'HIGH_RISK') return { label: 'High Risk', color: 'bg-red-50 text-red-700 border-red-200' };
    if (sev === 'MODERATE_CAUTION') return { label: 'Moderate Caution', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Safe & Synergistic', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-cyan-950 text-white p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
            <Pill className="w-3.5 h-3.5" /> Clinical Prescription & Interaction Suite
          </div>
          <h1 className="text-2xl font-bold">Medication Management</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Track dosing schedules, log daily medication adherence, and run real-time AI drug-drug & food interaction safety checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => runInteractionCheck()}
            disabled={interactionLoading}
            className="bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {interactionLoading ? 'Analyzing...' : 'AI Drug Interaction Screener'}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Prescription
          </button>
        </div>
      </div>

      {/* Daily Adherence Progress Card */}
      {activeMeds.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg border border-teal-100">
              {adherencePercent}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Today's Dosing Adherence</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Flame className="w-3 h-3 text-amber-500" /> 5-Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {takenDosesToday} of {totalDosesToday} doses recorded for today ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}).
              </p>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Progress</span>
              <span>{takenDosesToday}/{totalDosesToday} taken</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${adherencePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher: Daily Timeline vs Full Prescription List */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-teal-600" /> Daily Dosing Schedule
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-teal-600" /> All Prescriptions ({medications.length})
          </button>
        </div>

        <button
          onClick={() => runInteractionCheck()}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Test Candidate Drug Safety
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      ) : medications.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 shadow-xs text-center text-slate-400 space-y-3">
          <Pill className="w-14 h-14 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No prescriptions tracked yet</h3>
          <p className="text-xs text-slate-400">Click "Add Prescription" to start managing your medications.</p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Daily Dosing Schedule Timeline */
        <div className="space-y-4">
          {scheduleSlots.map((slot) => {
            const slotMeds = getMedsForSlot(slot.id);
            const Icon = slot.icon;

            return (
              <div key={slot.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${slot.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{slot.label}</h4>
                      <span className="text-[11px] text-slate-400">{slot.time}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{slotMeds.length} Prescription(s)</span>
                </div>

                <div className="p-5">
                  {slotMeds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No medications scheduled for this timeframe.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slotMeds.map((med) => {
                        const isTaken = med.id ? takenMeds[`${med.id}_${slot.id}`] : false;

                        return (
                          <div
                            key={`${med.id}_${slot.id}`}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                              isTaken
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-teal-600'
                                }`}
                              >
                                <Pill className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h5 className={`font-bold text-sm truncate ${isTaken ? 'text-emerald-950 line-through opacity-70' : 'text-slate-900'}`}>
                                  {med.medicationName}
                                </h5>
                                <p className="text-xs text-slate-500">{med.dosage} · {med.frequency}</p>
                                {med.purpose && (
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{med.purpose}</p>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => med.id && toggleTakeDose(med.id, slot.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                                isTaken
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isTaken ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Taken
                                </>
                              ) : (
                                'Mark Taken'
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Full Prescriptions List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`bg-white p-5 rounded-2xl border shadow-xs transition-all hover:shadow-md ${
                med.isActive ? 'border-slate-200/80' : 'border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      med.isActive ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{med.medicationName}</h3>
                    <p className="text-xs text-slate-500">
                      {med.dosage} · {med.frequency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(med)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => med.id && handleDelete(med.id)} className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                {med.timeOfDay && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3 h-3" /> {med.timeOfDay}
                  </div>
                )}
                {med.prescribingDoctor && (
                  <div className="text-slate-500 truncate">Dr. {med.prescribingDoctor}</div>
                )}
              </div>

              {med.purpose && (
                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {med.purpose}
                </p>
              )}

              <div className="mt-3 flex items-center gap-2">
                {med.isActive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                    Discontinued
                  </span>
                )}
                {med.sideEffects && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3 h-3" /> Side Effects Noted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Drug-Drug & Food Interaction Checker Modal */}
      {showInteractionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">AI Pharmacology & Interaction Screener</h3>
                  <p className="text-xs text-slate-500">Cross-reference active prescriptions with candidate OTC drugs and foods.</p>
                </div>
              </div>
              <button onClick={() => setShowInteractionModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Test Candidate Drug Input */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <label className="block text-xs font-semibold text-slate-700">
                Test Candidate Drug, Supplement, or Food Item
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={candidateDrug}
                    onChange={(e) => setCandidateDrug(e.target.value)}
                    placeholder="e.g. Ibuprofen, Aspirin, Potassium, Grapefruit"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    onKeyDown={(e) => e.key === 'Enter' && runInteractionCheck(candidateDrug)}
                  />
                </div>
                <button
                  onClick={() => runInteractionCheck(candidateDrug)}
                  disabled={interactionLoading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {interactionLoading ? 'Evaluating...' : 'Check Safety'}
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 self-center font-medium mr-1">Quick Test:</span>
                {suggestedCandidates.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      const simple = c.split(' ')[0];
                      setCandidateDrug(simple);
                      runInteractionCheck(simple);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-[10px] font-semibold border border-slate-200/80 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Interaction Results Display */}
            {interactionResult && (
              <div className="space-y-4">
                {/* Overall Summary Alert */}
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    interactionResult.safetyLevel === 'CONTRAINDICATED'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : interactionResult.safetyLevel === 'HIGH_RISK'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : interactionResult.safetyLevel === 'MODERATE_CAUTION'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Overall Safety Assessment</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getSeverityBadge(interactionResult.safetyLevel).color}`}>
                        {getSeverityBadge(interactionResult.safetyLevel).label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">{interactionResult.overallSummary}</p>
                  </div>
                </div>

                {/* Specific Pairwise Interactions */}
                {interactionResult.interactions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Identified Drug-Drug Interactions ({interactionResult.interactions.length})
                    </h4>
                    <div className="space-y-3">
                      {interactionResult.interactions.map((inter, i) => {
                        const badge = getSeverityBadge(inter.severity);
                        return (
                          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-sm">
                                {inter.drugA} + {inter.drugB}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              <strong>Pharmacological Mechanism:</strong> {inter.mechanism}
                            </p>
                            <p className="text-xs text-teal-800 bg-teal-50/80 p-2.5 rounded-xl border border-teal-100">
                              <strong>Clinical Guidance:</strong> {inter.clinicalAdvice}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dietary & Food Interactions */}
                {interactionResult.foodInteractions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Food & Lifestyle Interactions</h4>
                    <div className="space-y-2">
                      {interactionResult.foodInteractions.map((food, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800">{food.drug} + {food.food}:</span>{' '}
                            <span className="text-slate-600">{food.mechanism}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monitored Parameters */}
                {interactionResult.monitoredParameters.length > 0 && (
                  <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-sky-900 block">Recommended Biomarkers to Monitor:</span>
                    <div className="flex flex-wrap gap-2">
                      {interactionResult.monitoredParameters.map((param) => (
                        <span key={param} className="px-2.5 py-1 bg-white border border-sky-200 rounded-lg text-xs font-semibold text-sky-800">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 italic pt-1">{interactionResult.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-900">{editingMed ? 'Edit Prescription' : 'Add New Prescription'}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  value={form.medicationName}
                  onChange={(e) => setForm({ ...form, medicationName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Lisinopril or Metformin"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dosage *</label>
                  <input
                    type="text"
                    required
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 10mg or 500mg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                  >
                    {frequencies.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dosing Time</label>
                  <input
                    type="time"
                    value={form.timeOfDay || ''}
                    onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prescribing Doctor</label>
                  <input
                    type="text"
                    value={form.prescribingDoctor || ''}
                    onChange={(e) => setForm({ ...form, prescribingDoctor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Doctor name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose / Clinical Condition</label>
                <textarea
                  value={form.purpose || ''}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="e.g. Hypertension management or glycemic regulation"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Known Side Effects</label>
                <textarea
                  value={form.sideEffects || ''}
                  onChange={(e) => setForm({ ...form, sideEffects: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Mild dizziness, dry cough, etc."
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive !== false}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active Prescription</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-teal-600/20 text-sm transition-all"
              >
                {editingMed ? 'Update Prescription' : 'Save Prescription'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
