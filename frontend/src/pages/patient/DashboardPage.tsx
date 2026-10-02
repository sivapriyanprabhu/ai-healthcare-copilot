import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { healthMetricService, DashboardSummary } from '../../services/healthMetricService';
import { HealthMetric } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import InteractiveHealthScore from '../../components/interactive/InteractiveHealthScore';
import DailyHabitsTracker from '../../components/interactive/DailyHabitsTracker';
import MindfulBreathingModal from '../../components/interactive/MindfulBreathingModal';
import BodyAreaSymptomPicker from '../../components/interactive/BodyAreaSymptomPicker';
import ThemeToggle from '../../components/ThemeToggle';
import {
  Heart,
  Droplet,
  Brain,
  Gauge,
  Sparkles,
  ChevronRight,
  Plus,
  ShieldCheck,
  TrendingUp,
  Clock,
  Calendar,
  Activity,
  FileText,
  MessageSquare,
  AlertCircle,
  X,
  CheckCircle2,
  Smile,
  Wind
} from 'lucide-react';

export default function DashboardPage() {
  const { t, tRisk } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quick vitals entry
  const [newMetric, setNewMetric] = useState<HealthMetric>({
    systolicBp: 120,
    diastolicBp: 80,
    glucoseMgDl: 95,
    heartRateBpm: 72,
    weightKg: 72,
    sleepHours: 7.5,
    waterIntakeLiters: 2.5,
    exerciseMinutes: 30
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await healthMetricService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await healthMetricService.recordMetric(newMetric);
      setModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to record metric', err);
    } finally {
      setSaving(false);
    }
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting_morning', 'Good Morning');
    if (hour < 17) return t('greeting_afternoon', 'Good Afternoon');
    return t('greeting_evening', 'Good Evening');
  };

  const displayName = user?.fullName || 'Alex';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Determine overall risk
  const overallRiskLevel = summary?.cardiovascularRiskCategory || 'LOW';
  const riskBadgeConfig = {
    LOW: {
      label: tRisk('LOW'),
      icon: '🟢',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
      pillClass: 'bg-emerald-500',
      badgeText: 'Low Risk'
    },
    MODERATE: {
      label: tRisk('MODERATE'),
      icon: '🟡',
      bgClass: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300',
      pillClass: 'bg-amber-500',
      badgeText: 'Moderate Risk'
    },
    HIGH: {
      label: tRisk('HIGH'),
      icon: '🔴',
      bgClass: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800 text-rose-800 dark:text-rose-300',
      pillClass: 'bg-rose-500',
      badgeText: 'High Risk'
    }
  };

  const activeRiskConfig = riskBadgeConfig[overallRiskLevel as keyof typeof riskBadgeConfig] || riskBadgeConfig.LOW;

  // Quick Health Check Modules (2x2 Grid)
  const healthCheckModules = [
    {
      id: 'heart',
      name: t('heart_disease', 'Heart Disease'),
      subtitle: t('heart_subtitle', 'Cardiovascular risk'),
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-100 dark:border-rose-900/40',
      path: '/risk-prediction?condition=heart-disease'
    },
    {
      id: 'diabetes',
      name: t('diabetes', 'Diabetes'),
      subtitle: t('diabetes_subtitle', 'Blood glucose risk'),
      icon: Droplet,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-100 dark:border-sky-900/40',
      path: '/risk-prediction?condition=diabetes'
    },
    {
      id: 'stroke',
      name: t('stroke', 'Stroke'),
      subtitle: t('stroke_subtitle', 'Cerebrovascular risk'),
      icon: Brain,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-100 dark:border-purple-900/40',
      path: '/risk-prediction?condition=stroke'
    },
    {
      id: 'hypertension',
      name: t('hypertension', 'Blood Pressure'),
      subtitle: t('hypertension_subtitle', 'Hypertension analysis'),
      icon: Gauge,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-100 dark:border-teal-900/40',
      path: '/risk-prediction?condition=hypertension'
    },
  ];

  // Recent Activity Items
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Heart Disease Assessment',
      time: 'Today',
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50',
      status: 'Completed - ' + activeRiskConfig.badgeText,
      link: '/risk-prediction?condition=heart-disease'
    },
    {
      id: 'act-2',
      title: 'Medical Report Analyzed',
      time: 'Yesterday',
      icon: FileText,
      iconColor: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50',
      status: 'Biomarkers normal range',
      link: '/reports'
    },
    {
      id: 'act-3',
      title: 'AI Health Consultation',
      time: '2 days ago',
      icon: MessageSquare,
      iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50',
      status: 'Lifestyle recommendations saved',
      link: '/chat'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* 1. TOP SECTION: Greeting, Quick Zen Breathing & User Avatar */}
      <section className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>How are you feeling today?</span>
            <Smile className="w-3.5 h-3.5 text-amber-500 inline" />
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="switch" />

          <button
            onClick={() => setBreathingOpen(true)}
            className="px-3 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95 transition-all"
            title="1-Min Mindful Box Breathing"
          >
            <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">1-Min Zen Breathing</span>
            <span className="sm:hidden">Zen</span>
          </button>

          <Link
            to="/profile"
            className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-teal-600/20 ring-2 ring-white dark:ring-slate-800 shrink-0 active:scale-95 transition-transform"
          >
            {userInitial}
          </Link>
        </div>
      </section>

      {/* 2. INTERACTIVE WELLNESS CALIBRATION GAUGE */}
      <InteractiveHealthScore
        score={summary?.healthScore ? Math.round(summary.healthScore) : (summary?.riskScore ? Math.round(summary.riskScore) : 84)}
        onExploreMetrics={() => navigate('/risk-prediction')}
      />

      {/* 3. QUICK VITALS CALIBRATION STRIP */}
      <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        
        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Current Biometric Vitals
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${activeRiskConfig.bgClass}`}>
              {activeRiskConfig.badgeText}
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95 transition-all shadow-xs"
            title="Log Vitals"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Vitals</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
          <div className="glass-panel-interactive bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Blood Pressure</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {summary?.latestMetric?.systolicBp ? `${summary.latestMetric.systolicBp}/${summary.latestMetric.diastolicBp}` : '120/80'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">mmHg</span>
            </div>
          </div>
          <div className="glass-panel-interactive bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Blood Sugar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {summary?.latestMetric?.glucoseMgDl || 95}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">mg/dL</span>
            </div>
          </div>
          <div className="glass-panel-interactive bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Heart Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {summary?.latestMetric?.heartRateBpm || 72}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">bpm</span>
            </div>
          </div>
          <div className="glass-panel-interactive bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Weight</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {summary?.latestMetric?.weightKg || 72}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DAILY HABITS & HYDRATION TRACKER */}
      <DailyHabitsTracker />

      {/* 5. INTERACTIVE BODY AREA SYMPTOM TRIAGE */}
      <BodyAreaSymptomPicker />

      {/* 3. QUICK HEALTH CHECK: 2x2 Responsive Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('quick_health_check', 'Quick Health Check')}
          </h2>
          <Link
            to="/risk-prediction"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
          >
            <span>All Assessments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {healthCheckModules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`p-4 sm:p-5 rounded-3xl glass-panel glass-panel-interactive border ${item.borderColor} shadow-sm hover:shadow-xl transition-all active:scale-[0.98] flex flex-col justify-between group min-h-[130px] relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-11 h-11 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. COMPACT AI HEALTHCARE ASSISTANT CARD */}
      <section className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-teal-700/20 relative overflow-hidden border border-teal-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-pulse-slow" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-teal-100 border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Clinical Copilot</span>
            </div>
            <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              Ask questions about your symptoms, lab reports, or risks.
            </h3>
            <p className="text-xs text-teal-100/90 max-w-lg leading-relaxed">
              Real-time conversational medical intelligence in English, Spanish, Hindi, French, and 6+ languages.
            </p>
          </div>

          <Link
            to="/chat"
            className="px-5 py-3 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-extrabold text-xs shadow-lg shadow-black/10 shrink-0 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <span>{t('chat_with_ai', 'Chat with AI')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. RECENT ACTIVITY TIMELINE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('recent_activity', 'Recent Activity')}
          </h2>
          <span className="text-xs text-slate-400">Past 7 days</span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-lg">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.id}
                  to={act.link}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${act.iconColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {act.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {act.time}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No recent health activity
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Complete your first risk assessment to view your personalized health timeline.
            </p>
            <button
              onClick={() => navigate('/risk-prediction')}
              className="px-4 py-2 rounded-2xl bg-teal-600 text-white font-bold text-xs"
            >
              Start Health Check
            </button>
          </div>
        )}
      </section>

      {/* QUICK VITALS LOGGING MODAL SHEET */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Today's Vitals</h3>
                <p className="text-xs text-slate-400">Keep your AI health copilot calibrated</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMetric} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newMetric.systolicBp || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, systolicBp: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newMetric.diastolicBp || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, diastolicBp: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newMetric.glucoseMgDl || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, glucoseMgDl: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newMetric.heartRateBpm || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, heartRateBpm: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={newMetric.weightKg || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Sleep (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    inputMode="decimal"
                    value={newMetric.sleepHours || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, sleepHours: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Vitals'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINDFUL BREATHING MODAL */}
      <MindfulBreathingModal
        isOpen={breathingOpen}
        onClose={() => setBreathingOpen(false)}
      />

    </div>
  );
}
