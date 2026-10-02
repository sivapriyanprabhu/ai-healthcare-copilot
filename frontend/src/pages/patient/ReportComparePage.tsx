import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { reportService, ReportComparison } from '../../services/reportService';
import { GitCompare, ArrowLeft, TrendingUp, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function ReportComparePage() {
  const [searchParams] = useSearchParams();
  const [comparison, setComparison] = useState<ReportComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idsStr = searchParams.get('ids');
    if (idsStr) {
      const ids = idsStr.split(',').map((id) => parseInt(id)).filter(Boolean);
      if (ids.length >= 2) {
        fetchComparison(ids);
      }
    }
  }, [searchParams]);

  const fetchComparison = async (ids: number[]) => {
    try {
      setLoading(true);
      const data = await reportService.compareReports(ids);
      setComparison(data);
    } catch (err) {
      console.error('Failed to load report comparison', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!comparison || comparison.reports.length < 2) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Select At Least 2 Reports to Compare</h3>
        <Link to="/reports" className="mt-4 inline-block text-sky-600 font-semibold hover:underline">
          Back to Reports List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/reports" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Medical Reports
      </Link>

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-8 rounded-3xl shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
          <GitCompare className="w-3.5 h-3.5" /> Longitudinal Trend Comparison
        </div>
        <h1 className="text-2xl font-bold">Multi-Report Metric Comparison</h1>
        <p className="text-slate-300 text-sm mt-1">Comparing {comparison.reports.length} diagnostic reports across historical sampling dates.</p>
      </div>

      {/* AI Trend Explanation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-600" /> AI Longitudinal Evaluation
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed">{comparison.aiTrendExplanation}</p>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-base">Metric Comparison Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Laboratory Metric</th>
                {comparison.reports.map((r) => (
                  <th key={r.id} className="px-6 py-4">
                    <div>{r.title}</div>
                    <div className="text-[10px] font-normal text-slate-400">{new Date(r.uploadedAt).toLocaleDateString()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.keys(comparison.metricTrends).map((metricName) => {
                const points = comparison.metricTrends[metricName];
                return (
                  <tr key={metricName} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-bold text-slate-900">{metricName}</td>
                    {comparison.reports.map((r) => {
                      const rDate = new Date(r.uploadedAt).toISOString().split('T')[0];
                      const val = points.find((p) => p.date === rDate || true); // best match
                      const isAbnormal = val?.status !== 'NORMAL';
                      return (
                        <td key={r.id} className="px-6 py-4">
                          <span className={`font-semibold ${isAbnormal ? 'text-amber-700' : 'text-slate-800'}`}>
                            {val?.numericValue ? val.numericValue : '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
