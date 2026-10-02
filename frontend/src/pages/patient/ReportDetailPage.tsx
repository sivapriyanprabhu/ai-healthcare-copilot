import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { MedicalReport } from '../../types';
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Info,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReportDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchReport(parseInt(id));
  }, [id]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const data = await reportService.getReportById(reportId);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report details', err);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return { label: t('normal_and_healthy', 'Normal & Healthy'), cls: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
    if (status === 'ABNORMAL_HIGH') return { label: t('higher_than_normal', 'Higher Than Normal'), cls: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' };
    if (status === 'ABNORMAL_LOW') return { label: t('lower_than_normal', 'Lower Than Normal'), cls: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800' };
    if (status.toLowerCase().includes('attention')) return { label: t('check_with_doctor', 'Check with Doctor'), cls: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' };
    return { label: t('normal_and_healthy', 'Normal & Healthy'), cls: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Report Not Found</h3>
        <Link to="/reports" className="mt-4 inline-block text-teal-600 dark:text-teal-400 font-semibold hover:underline">
          Back to Reports List
        </Link>
      </div>
    );
  }

  const overall = formatStatus(report.overallStatus);

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <Link to="/reports" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('back', 'Back to Reports')}
      </Link>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold mb-2 border border-teal-200/60 dark:border-teal-800">
            <FileText className="w-3.5 h-3.5" /> {report.reportType || 'Lab Test'}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{report.title}</h1>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{new Date(report.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('overall_result', 'Overall')}:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${overall.cls}`}>
            {overall.label}
          </span>
        </div>
      </div>

      {/* Plain AI Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>{t('what_results_mean', 'What Your Results Mean')}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{report.aiSummary}</p>
      </div>

      {/* Extracted Lab Values Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {t('tests_results_explained', 'Test Results Explained')}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {report.values?.length || 0} {t('tests_scanned', 'Tests Scanned')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {report.values?.map((val) => {
            const statusInfo = formatStatus(val.status);
            const isAbnormal = val.status !== 'NORMAL';
            return (
              <div
                key={val.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAbnormal
                    ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{val.metricName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t('healthy_target', 'Target')}: {val.referenceRange || 'Standard'}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{val.extractedValue}</span>
                </div>

                {val.explanation && (
                  <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-start gap-1.5 leading-normal">
                    <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{val.explanation}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Doctor Questions */}
      {report.doctorQuestions && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{t('doctor_questions_title', 'Helpful Questions to Ask Your Doctor')}</span>
          </h3>
          <div className="p-4 bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 rounded-2xl text-slate-700 dark:text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-medium">
            {report.doctorQuestions}
          </div>
        </div>
      )}

      {/* Medical Safety Disclaimer */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">{t('medical_safety_notice', 'Important Notice:')}</span>
          <span className="leading-relaxed">
            {t('medical_safety_desc', 'This report summary is created to help you easily understand your test results. Always review your results with your doctor or licensed healthcare provider for official medical decisions.')}
          </span>
        </div>
      </div>
    </div>
  );
}
