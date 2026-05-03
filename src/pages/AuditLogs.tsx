import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Activity, Search, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';

interface AuditLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

export default function AuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'audit_logs'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AuditLog));
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore Error: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700 border-red-200';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (action.includes('SEND')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-600" />
          System Audit Trail
        </h1>
        <p className="text-slate-500 mt-2">
          View all tracked actions and system events.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Showing {filteredLogs.length} events
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
              <Activity className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">No logs found</p>
              <p>Try adjusting your search or perform some actions in the app.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    Action
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 break-words max-w-md">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
