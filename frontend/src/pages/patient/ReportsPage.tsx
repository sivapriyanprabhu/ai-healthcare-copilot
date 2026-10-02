import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { MedicalReport } from '../../types';
import {
  FileText,
  Plus,
  ChevronRight,
  Trash2,
  GitCompare,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReportsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this health report?')) return;
    try {
      await reportService.deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || 'NORMAL').toUpperCase();
    if (s.includes('ABNORMAL') || s.includes('CRITICAL') || s.includes('HIGH')) {
      return {
        label: 'Attention Needed',
        icon: AlertCircle,
        className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50'
      };
    }
    if (s.includes('BORDERLINE') || s.includes('MODERATE')) {
      return {
        label: 'Mild Variance',
        icon: AlertCircle,
        className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/50'
      };
    }
    return {
      label: 'Normal Ranges',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50'
    };
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('my_reports', 'My Reports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your health reports in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length >= 2 && (
            <Link
              to={`/reports/compare?ids=${selectedIds.join(',')}`}
              className="px-4 py-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare ({selectedIds.length})</span>
            </Link>
          )}

          <Link
            to="/reports/upload"
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Report</span>
          </Link>
        </div>
      </div>

      {/* 2. Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 3. Reports List */}
      {!loading && reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report) => {
            const statusInfo = getStatusBadge(report.overallStatus);
            const StatusIcon = statusInfo.icon;
            const isSelected = selectedIds.includes(report.id);

            return (
              <div
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Select Checkbox for comparison */}
                  <button
                    type="button"
                    onClick={(e) => toggleSelect(report.id, e)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                    title="Select to compare"
                  >
                    {isSelected && <span className="text-[10px] font-bold">✓</span>}
                  </button>

                  {/* Document Icon */}
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/40">
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {report.title || report.reportType || 'Medical Report'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(report.uploadedAt)}</span>
                      </span>
                      <span>•</span>
                      <span className="truncate">{report.reportType || 'Clinical Panel'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.className}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusInfo.label}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${report.id}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. Empty State */}
      {!loading && reports.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-14 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-100 dark:border-teal-900/40">
            <FileCheck className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
            No reports yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your first medical report to get started. Our AI will analyze your biomarkers and explain results in plain language.
          </p>

          <Link
            to="/reports/upload"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Report</span>
          </Link>
        </div>
      )}

    </div>
  );
}
