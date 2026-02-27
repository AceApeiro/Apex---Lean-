import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageWrapper } from '../components/PageWrapper';

interface Audit {
  id: string;
  date: string;
  auditor: string;
  area: string;
  score: number;
  status: string;
  findings: string;
}

export default function QCAudit() {
  const [audits, setAudits] = useState<Audit[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">QC Audit Reports</h1>
          <p className="text-slate-500 mt-2">Track quality control and QA001 compliance audits.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm">
          <ClipboardCheck className="w-4 h-4" />
          New Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Audits</p>
            <p className="text-2xl font-bold text-slate-900">{audits.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Score</p>
            <p className="text-2xl font-bold text-slate-900">
              {audits.length > 0 ? `${Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length)}%` : '0%'}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Actions</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                <th className="p-4">Audit ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Area</th>
                <th className="p-4">Auditor</th>
                <th className="p-4">Score</th>
                <th className="p-4">Findings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((audit, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm text-slate-500 font-mono font-medium">{audit.id}</td>
                  <td className="p-4 text-sm text-slate-700">{audit.date}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{audit.area}</td>
                  <td className="p-4 text-sm text-slate-700">{audit.auditor}</td>
                  <td className="p-4">
                    <div className={cn(
                      'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border',
                      getScoreColor(audit.score)
                    )}>
                      {audit.score}%
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={audit.findings}>
                    {audit.findings}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {audits.length === 0 && (
          <div className="text-center p-12">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No QC Audits recorded yet.</p>
            <p className="text-slate-400 text-sm mt-1">Click "New Audit" to create one.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
