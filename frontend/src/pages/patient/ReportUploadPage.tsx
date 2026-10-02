import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { FileUp, UploadCloud, AlertCircle, Sparkles, FileText, Camera, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReportUploadPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('Blood Test');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 15 * 1024 * 1024) {
        setError('The selected file is too large. Please select a file smaller than 15MB.');
        return;
      }
      setError('');
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or capture a medical report (PDF or Image).');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const created = await reportService.uploadReport(file, title, reportType);
      navigate(`/reports/${created.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not analyze this report. Please ensure the document is clear and readable.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload Medical Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a lab test, blood work, or clinical summary to receive AI-powered explanations.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-2xl flex items-center gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-mobile-card space-y-5">
        
        {/* Dual Upload / Capture Options */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Choose Document
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* File Picker Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/70 dark:bg-slate-800/40 text-center active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-2"
            >
              <UploadCloud className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  PDF / Image
                </span>
                <span className="text-[10px] text-slate-400">From Device</span>
              </div>
            </button>

            {/* Mobile Camera Capture Button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/70 dark:bg-slate-800/40 text-center active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-2"
            >
              <Camera className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Scan / Camera
                </span>
                <span className="text-[10px] text-slate-400">Take Photo</span>
              </div>
            </button>
          </div>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selected File Feedback */}
          {file && (
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI analysis
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            </div>
          )}
        </div>

        {/* Title and Type Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Report Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC)"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Type of Test
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
            >
              <option value="Blood Test">Blood Test (CBC, Complete Blood Count)</option>
              <option value="Lipid Profile">Lipid Profile (Cholesterol, HDL, LDL)</option>
              <option value="Diabetes Report">Blood Sugar / HbA1c Panel</option>
              <option value="Renal Function">Kidney & Metabolic Panel</option>
              <option value="Doctor Notes">Clinical Consultation Notes</option>
              <option value="General Report">General Diagnostic Report</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing your medical report...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Read & Explain My Report</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
