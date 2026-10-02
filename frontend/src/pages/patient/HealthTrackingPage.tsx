import React, { useState, useEffect, useMemo } from 'react';
import { healthMetricService } from '../../services/healthMetricService';
import { HealthMetric } from '../../types';
import {
  LineChart as LineChartIcon,
  Activity,
  Plus,
  Calendar,
  Heart,
  Droplet,
  Scale,
  Moon,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  TrendingUp,
  TrendingDown,
  Gauge
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

type MetricTab = 'bp' | 'glucose' | 'heartRate' | 'weight' | 'lifestyle';
type TimeFilter = '7d' | '30d' | '90d' | 'all';

export default function HealthTrackingPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MetricTab>('bp');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [showLogModal, setShowLogModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<HealthMetric>({
    systolicBp: 120,
    diastolicBp: 80,
    glucoseMgDl: 95,
    heartRateBpm: 72,
    weightKg: 75,
    sleepHours: 7.5,
    waterIntakeLiters: 2.5,
    exerciseMinutes: 30
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await healthMetricService.getHistory();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metric history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await healthMetricService.recordMetric(form);
      setShowLogModal(false);
      await fetchMetrics();
    } catch (err) {
      console.error('Failed to record metric', err);
    } finally {
      setSaving(false);
    }
  };

  // Filtered metrics chronologically ascending for charts
  const chartData = useMemo(() => {
    if (!metrics || metrics.length === 0) return [];
    
    // Sort oldest to newest
    const sorted = [...metrics].sort((a, b) => {
      const tA = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
      const tB = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
      return tA - tB;
    });

    const now = Date.now();
    let filtered = sorted;
    if (timeFilter === '7d') {
      filtered = sorted.filter(m => (now - new Date(m.recordedAt || now).getTime()) <= 7 * 86400000);
    } else if (timeFilter === '30d') {
      filtered = sorted.filter(m => (now - new Date(m.recordedAt || now).getTime()) <= 30 * 86400000);
    } else if (timeFilter === '90d') {
      filtered = sorted.filter(m => (now - new Date(m.recordedAt || now).getTime()) <= 90 * 86400000);
    }

    return filtered.map((m) => {
      const d = m.recordedAt ? new Date(m.recordedAt) : new Date();
      const sbp = m.systolicBp || 120;
      const dbp = m.diastolicBp || 80;
      const map = Math.round(dbp + (sbp - dbp) / 3);
      const pulsePressure = sbp - dbp;

      return {
        rawDate: d,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayTime: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        systolicBp: sbp,
        diastolicBp: dbp,
        map,
        pulsePressure,
        glucose: m.glucoseMgDl || 95,
        heartRate: m.heartRateBpm || 72,
        weight: m.weightKg || 75,
        sleep: m.sleepHours || 7.0,
        water: m.waterIntakeLiters || 2.0,
        exercise: m.exerciseMinutes || 30
      };
    });
  }, [metrics, timeFilter]);

  const latest = metrics[0] || null;
  const latestSbp = latest?.systolicBp || 120;
  const latestDbp = latest?.diastolicBp || 80;
  const latestMap = Math.round(latestDbp + (latestSbp - latestDbp) / 3);
  const latestPulsePressure = latestSbp - latestDbp;

  // Friendly BP Classification
  const getBpStatus = (sbp: number, dbp: number) => {
    if (sbp >= 140 || dbp >= 90) return { label: 'High BP (Check with Doctor)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (sbp >= 130 || dbp >= 80) return { label: 'Mildly Elevated BP', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (sbp >= 120 && dbp < 80) return { label: 'Slightly Above Normal', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { label: 'Normal & Healthy', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const getGlucoseStatus = (glu: number) => {
    if (glu >= 126) return { label: 'High Sugar (Check with Doctor)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (glu >= 100) return { label: 'Slightly High Sugar', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Normal & Healthy (<100 mg/dL)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const exportCSV = () => {
    if (metrics.length === 0) return;
    const headers = 'ID,Date,Time,Systolic_BP,Diastolic_BP,MAP_mmHg,Pulse_Pressure,Glucose_mg_dL,HeartRate_BPM,Weight_kg,Sleep_Hours,Water_Liters,Exercise_Mins\n';
    const rows = metrics.map(m => {
      const d = m.recordedAt ? new Date(m.recordedAt) : new Date();
      const sbp = m.systolicBp || '';
      const dbp = m.diastolicBp || '';
      const map = (sbp && dbp) ? Math.round(+dbp + (+sbp - +dbp) / 3) : '';
      const pp = (sbp && dbp) ? (+sbp - +dbp) : '';
      return `${m.id || ''},${d.toLocaleDateString()},${d.toLocaleTimeString()},${sbp},${dbp},${map},${pp},${m.glucoseMgDl || ''},${m.heartRateBpm || ''},${m.weightKg || ''},${m.sleepHours || ''},${m.waterIntakeLiters || ''},${m.exerciseMinutes || ''}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `health_metrics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-semibold border border-sky-500/30">
            <LineChartIcon className="w-3.5 h-3.5 text-sky-400" /> My Daily Health Tracker
          </div>
          <h1 className="text-2xl font-bold">My Health Numbers & Trends</h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Easily track your blood pressure, blood sugar levels, heart rate, and weight with simple, clear charts.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={exportCSV}
            className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-sky-400" /> Export Data
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Health Numbers
          </button>
        </div>
      </div>

      {/* Snapshot Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{latestSbp}/{latestDbp}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">mmHg</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getBpStatus(latestSbp, latestDbp).color}`}>
              {getBpStatus(latestSbp, latestDbp).label}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>MAP: <strong className="text-slate-700 dark:text-slate-200">{latestMap} mmHg</strong></span>
            <span>Pulse: <strong className="text-slate-700 dark:text-slate-200">{latestPulsePressure} mmHg</strong></span>
          </div>
        </div>

        {/* Glucose Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fasting Glucose</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{latest?.glucoseMgDl || 95}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">mg/dL</span>
          </div>
          <div className="mt-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getGlucoseStatus(latest?.glucoseMgDl || 95).color}`}>
              {getGlucoseStatus(latest?.glucoseMgDl || 95).label}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Target: &lt;100 mg/dL fasting
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resting Heart Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{latest?.heartRateBpm || 72}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">BPM</span>
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
              Normal Sinus Rhythm
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Target: 60 - 100 BPM at rest
          </div>
        </div>

        {/* Body Weight Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Body Weight & Sleep</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{latest?.weightKg || 75}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-500" /> {latest?.sleepHours || 7.5}h sleep</span>
            <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-sky-500" /> {latest?.waterIntakeLiters || 2.5}L water</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Exercise: <strong className="text-slate-700 dark:text-slate-200">{latest?.exerciseMinutes || 30} mins</strong>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-6">
        {/* Navigation Tabs & Time Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('bp')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'bp'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Pressure & MAP
            </button>
            <button
              onClick={() => setActiveTab('glucose')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'glucose'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-emerald-500" /> Fasting Glucose
            </button>
            <button
              onClick={() => setActiveTab('heartRate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'heartRate'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-500" /> Heart Rate
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'weight'
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-purple-500" /> Weight
            </button>
            <button
              onClick={() => setActiveTab('lifestyle')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'lifestyle'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-teal-500" /> Sleep & Hydration
            </button>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto text-xs">
            {(['7d', '30d', '90d', 'all'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  timeFilter === tf
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View */}
        {chartData.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Activity className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 text-sm">No biometric records matching the selected time filter</p>
            <p className="text-xs">Click "Log Vital Reading" to add new health data.</p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'bp' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 160]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any, name: string) => {
                      if (name === 'systolicBp') return [`${value} mmHg`, 'Systolic BP'];
                      if (name === 'diastolicBp') return [`${value} mmHg`, 'Diastolic BP'];
                      if (name === 'map') return [`${value} mmHg`, 'Mean Arterial Pressure (MAP)'];
                      return [value, name];
                    }}
                  />
                  <ReferenceLine y={120} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Elevated (120)', position: 'insideTopRight', fill: '#f43f5e', fontSize: 10 }} />
                  <ReferenceLine y={80} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'Optimal DBP (80)', position: 'insideBottomRight', fill: '#3b82f6', fontSize: 10 }} />
                  <Area type="monotone" dataKey="systolicBp" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSystolic)" />
                  <Area type="monotone" dataKey="diastolicBp" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDiastolic)" />
                  <Line type="monotone" dataKey="map" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                </AreaChart>
              ) : activeTab === 'glucose' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 160]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} mg/dL`, 'Fasting Glucose']}
                  />
                  <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Prediabetes Threshold (100)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={126} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Diabetes Threshold (126)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                  <Area type="monotone" dataKey="glucose" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGlucose)" />
                </AreaChart>
              ) : activeTab === 'heartRate' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 120]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} BPM`, 'Heart Rate']}
                  />
                  <ReferenceLine y={60} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Resting Min (60)', position: 'insideBottomRight', fill: '#94a3b8', fontSize: 10 }} />
                  <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Resting Max (100)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10 }} />
                  <Area type="monotone" dataKey="heartRate" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorHeart)" />
                </AreaChart>
              ) : activeTab === 'weight' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} kg`, 'Weight']}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any, name: string) => {
                      if (name === 'sleep') return [`${value} hrs`, 'Sleep Duration'];
                      if (name === 'water') return [`${value} L`, 'Water Intake'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="sleep" fill="#6366f1" radius={[8, 8, 0, 0]} name="sleep" />
                  <Bar dataKey="water" fill="#38bdf8" radius={[8, 8, 0, 0]} name="water" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Clinical Interpretation Guide Banner */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-500 shrink-0" />
            <span>
              {activeTab === 'bp' && 'Mean Arterial Pressure (MAP) represents average tissue perfusion pressure. Target optimal MAP is 70–100 mmHg.'}
              {activeTab === 'glucose' && 'Fasting blood sugar of 70–99 mg/dL is normal. Readings of 100–125 mg/dL reflect pre-diabetic insulin resistance.'}
              {activeTab === 'heartRate' && 'Resting sinus heart rate between 60–100 BPM reflects healthy autonomic cardiovascular function.'}
              {activeTab === 'weight' && 'Consistent longitudinal morning weigh-ins track fat loss and hydration equilibrium.'}
              {activeTab === 'lifestyle' && 'Adults require 7–9 hours of sleep per night and 2.2–3.0 liters of daily hydration for optimal cellular clearance.'}
            </span>
          </div>
          <span className="font-semibold text-teal-600 dark:text-teal-400 shrink-0">AHA & ADA Clinical Reference Criteria</span>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Recorded Physiological Logs</h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{metrics.length} Total Records</span>
        </div>

        {metrics.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No health metrics recorded yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click "Add Health Numbers" to record your first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Blood Pressure</th>
                  <th className="px-6 py-4">MAP & Pulse</th>
                  <th className="px-6 py-4">Fasting Glucose</th>
                  <th className="px-6 py-4">Heart Rate</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Sleep & Water</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {metrics.map((m) => {
                  const sbp = m.systolicBp || 120;
                  const dbp = m.diastolicBp || 80;
                  const map = Math.round(dbp + (sbp - dbp) / 3);
                  const pp = sbp - dbp;
                  const bpClass = getBpStatus(sbp, dbp);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {m.recordedAt ? new Date(m.recordedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{sbp}/{dbp} mmHg</div>
                        <span className={`inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${bpClass.color}`}>
                          {bpClass.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>MAP: <strong className="text-slate-800">{map}</strong> mmHg</div>
                        <div className="text-slate-400 text-[10px]">Pulse: {pp} mmHg</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{m.glucoseMgDl ? `${m.glucoseMgDl} mg/dL` : '—'}</span>
                        {m.glucoseMgDl && (
                          <div className="text-[10px] text-slate-400">
                            {m.glucoseMgDl >= 100 ? 'Elevated' : 'Optimal'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {m.heartRateBpm ? `${m.heartRateBpm} BPM` : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {m.weightKg ? `${m.weightKg} kg` : '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{m.sleepHours ? `${m.sleepHours} hrs` : '—'}</div>
                        <div className="text-slate-400 text-[10px]">{m.waterIntakeLiters ? `${m.waterIntakeLiters} L` : ''}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Vital Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Record New Vital Reading</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add latest physiological measurements to your health log.</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMetric} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    min={60}
                    max={250}
                    required
                    value={form.systolicBp || ''}
                    onChange={(e) => setForm({ ...form, systolicBp: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    min={40}
                    max={150}
                    required
                    value={form.diastolicBp || ''}
                    onChange={(e) => setForm({ ...form, diastolicBp: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    min={40}
                    max={500}
                    value={form.glucoseMgDl || ''}
                    onChange={(e) => setForm({ ...form, glucoseMgDl: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="95"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    min={30}
                    max={220}
                    value={form.heartRateBpm || ''}
                    onChange={(e) => setForm({ ...form, heartRateBpm: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="72"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={20}
                    max={300}
                    value={form.weightKg || ''}
                    onChange={(e) => setForm({ ...form, weightKg: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="75.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Sleep Duration (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={24}
                    value={form.sleepHours || ''}
                    onChange={(e) => setForm({ ...form, sleepHours: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="7.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Water Intake (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={10}
                    value={form.waterIntakeLiters || ''}
                    onChange={(e) => setForm({ ...form, waterIntakeLiters: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Exercise (mins)</label>
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={form.exerciseMinutes || ''}
                    onChange={(e) => setForm({ ...form, exerciseMinutes: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Recording...' : 'Save Vital Reading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
