import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  area: string;
  problem: string;
  category: string;
  term: string;
  targetDate: string;
  status: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const savedStatuses = localStorage.getItem('task_statuses');
    if (savedStatuses) {
      try {
        setLocalStatuses(JSON.parse(savedStatuses));
      } catch (e) {
        console.error(e);
      }
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=0&single=true&output=csv');
        if (!response.ok) throw new Error('Failed to fetch tasks data');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedTasks = results.data.map((row: any, idx: number) => ({
              id: row['#REF!'] || `task-${idx}`,
              area: row['Area'] || '',
              problem: row['Problem / Improvement Point'] || '',
              category: row['Category (A-Short Term/B- Medium Term /C- Long Term)'] || '',
              term: row['Term'] || '',
              targetDate: row['Target Date'] || '',
              status: row['Status'] || '0%',
            })).filter((t: Task) => t.problem);
            setTasks(parsedTasks);
            setLoading(false);
          }
        });
      } catch (error) {
        setTasks([
          { id: '1', area: 'HR Room', problem: 'Lack of space', category: 'A', term: 'Short', targetDate: '2026-03-15', status: '100%' },
          { id: '2', area: 'Conference Room', problem: 'Remove large box', category: 'A', term: 'Short', targetDate: '2026-03-16', status: '50%' }
        ]);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === '100%') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status === '0%') return 'text-slate-600 bg-slate-50 border-slate-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getStatusIcon = (status: string) => {
    if (status === '100%') return <CheckCircle2 className="w-4 h-4" />;
    if (status === '0%') return <Circle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const toggleTaskStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === '100%' ? '0%' : '100%';
    const newStatuses = { ...localStatuses, [id]: newStatus };
    setLocalStatuses(newStatuses);
    localStorage.setItem('task_statuses', JSON.stringify(newStatuses));
  };

  const filteredTasks = tasks.map(task => ({
    ...task,
    status: localStatuses[task.id] || task.status
  })).filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.status === '100%';
    if (filter === 'In Progress') return task.status !== '100%' && task.status !== '0%';
    if (filter === 'Not Started') return task.status === '0%';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks & Tests</h1>
          <p className="text-slate-500 mt-2">Track implementation progress and markings.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          {['All', 'Not Started', 'In Progress', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                filter === f
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Area</th>
                  <th className="p-4">Problem / Improvement</th>
                  <th className="p-4">Term</th>
                  <th className="p-4">Target Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-500 font-mono">{task.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-900">{task.area}</td>
                    <td className="p-4 text-sm text-slate-700">{task.problem}</td>
                    <td className="p-4 text-sm">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium border',
                        task.category === 'A' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.category === 'B' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      )}>
                        {task.term}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{task.targetDate}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity',
                          getStatusColor(task.status)
                        )}
                        title="Click to toggle completion status"
                      >
                        {getStatusIcon(task.status)}
                        {task.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-400" />
              <p>No tasks found for the selected filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
