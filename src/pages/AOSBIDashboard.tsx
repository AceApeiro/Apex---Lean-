import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FileSpreadsheet, Download, BarChart3, List, TrendingUp, Filter, Search, Calendar, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageWrapper } from '../components/PageWrapper';
import { MatrixRain } from '../components/CyberEffects';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';

export default function AOSBIDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('charts');
  
  // Audit Trail State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'audit') {
      setLoadingAudit(true);
      const q = query(collection(db, 'audit_logs'), orderBy('created_at', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAuditLogs(logsData);
        setLoadingAudit(false);
      }, (error) => {
        console.error('Firestore Error fetching audit logs: ', error);
        setLoadingAudit(false);
      });

      return () => unsubscribe();
    }
  }, [activeTab, user]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => 
      (log.action?.toLowerCase() || '').includes(auditSearch.toLowerCase()) ||
      (log.details?.toLowerCase() || '').includes(auditSearch.toLowerCase())
    );
  }, [auditLogs, auditSearch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
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
  
  // Filters
  const [filterArea, setFilterArea] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Detailed Data from AOS Dashboard source
        const detailedResponse = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=692796767&single=true&output=csv&cb=${Date.now()}`);
        if (!detailedResponse.ok) throw new Error('Failed to fetch detailed data');
        const text = await detailedResponse.text();
        
        const rows = text.split("\n").slice(1);
        const parsedTasks = rows.map(line => {
          const c = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
          return {
            id: c[0] || Math.random().toString(),
            area: c[1] || "",
            problem: c[2] || "",
            stage: c[3]?.trim() || "",
            category: c[4]?.trim() || "",
            targetDate: c[5] || "",
            progress: (c[6]?.toString() || "0").replace('%','').trim() || "0",
            days: parseInt(c[7]) || 0,
            status: c[8]?.trim() || "",
            user: c[9] || ""
          };
        }).filter(x => x.area && x.problem);
        
        setDetailedData(parsedTasks);

        // Derive summary data from parsedTasks
        const roomDataMap = new Map<string, any>();
        parsedTasks.forEach(task => {
          const room = task.area || 'General';
          if (!roomDataMap.has(room)) {
            roomDataMap.set(room, { name: room, 'Priority A': 0, 'Priority B': 0, 'Priority C': 0, total: 0 });
          }
          const roomData = roomDataMap.get(room);
          roomData.total += 1;
          
          const catStr = (task.category || '').toLowerCase();
          if (catStr.includes('a-') || catStr.includes('short')) roomData['Priority A'] += 1;
          else if (catStr.includes('b-') || catStr.includes('medium')) roomData['Priority B'] += 1;
          else if (catStr.includes('c-') || catStr.includes('long')) roomData['Priority C'] += 1;
          else roomData['Priority B'] += 1; // Default to B
        });
        
        setData(Array.from(roomDataMap.values()));
        setLoading(false);

      } catch (error) {
        // Fallback data if fetch fails
        setData([
          { name: 'HR Room', 'Priority A': 11, 'Priority B': 7, 'Priority C': 7, total: 25 },
          { name: 'Conference Room', 'Priority A': 9, 'Priority B': 5, 'Priority C': 6, total: 20 }
        ]);
        setDetailedData([
          { id: '1', area: 'HR Room', problem: 'Lack of space', category: 'A', term: 'Short', targetDate: '2026-03-15', status: '100%' },
          { id: '2', area: 'Conference Room', problem: 'Remove large box', category: 'A', term: 'Short', targetDate: '2026-03-16', status: '50%' }
        ]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const tabs = [
    { id: 'charts', name: 'Chart Mode', icon: BarChart3 },
    { id: 'data', name: 'Data Mode', icon: List },
    { id: 'hybrid', name: 'Hybrid Mode', icon: TrendingUp },
    { id: 'gantt', name: 'Gantt Chart', icon: Calendar },
    { id: 'audit', name: 'Audit Trail', icon: Activity },
  ];

  // Derived data for filters
  const uniqueAreas = useMemo(() => ['All', ...Array.from(new Set(detailedData.map(t => t.area).filter(Boolean)))], [detailedData]);
  const uniqueStatuses = useMemo(() => ['All', ...Array.from(new Set(detailedData.map(t => t.status).filter(Boolean)))], [detailedData]);

  // Filtered detailed data
  const filteredDetailedData = useMemo(() => {
    return detailedData.filter(task => {
      const matchArea = filterArea === 'All' || task.area === filterArea;
      const matchStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchSearch = task.problem.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchStatus && matchSearch;
    });
  }, [detailedData, filterArea, filterStatus, searchQuery]);

  // Derived chart data from detailed data
  const statusChartData = useMemo(() => {
    const counts = detailedData.reduce((acc, curr) => {
      const status = curr.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [detailedData]);

  const areaChartData = useMemo(() => {
    const counts = detailedData.reduce((acc, curr) => {
      const area = curr.area || 'Unknown';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [detailedData]);

  const pieData = useMemo(() => {
    let a = 0, b = 0, c = 0;
    data.forEach(row => {
      a += row['Priority A'] || 0;
      b += row['Priority B'] || 0;
      c += row['Priority C'] || 0;
    });
    return [
      { name: 'Priority A (Short Term)', value: a },
      { name: 'Priority B (Medium Term)', value: b },
      { name: 'Priority C (Long Term)', value: c },
    ].filter(x => x.value > 0);
  }, [data]);

  const grandTotal = useMemo(() => {
    let a = 0, b = 0, c = 0, total = 0;
    data.forEach(row => {
      a += row['Priority A'] || 0;
      b += row['Priority B'] || 0;
      c += row['Priority C'] || 0;
      total += row.total || 0;
    });
    return { a, b, c, total };
  }, [data]);

  const progressData = useMemo(() => {
    const total = detailedData.length;
    const completed = detailedData.filter(t => parseInt(t.progress) === 100).length;
    return [
      { week: 'Start', completed: 0, total },
      { week: 'Current', completed, total }
    ];
  }, [detailedData]);

  const overallStats = useMemo(() => {
    const total = detailedData.length;
    const completed = detailedData.filter(x => parseInt(x.progress) === 100).length;
    const incomplete = total - completed;
    const safe = detailedData.filter(x => x.status === 'Safe' && parseInt(x.progress) < 100).length;
    const assistance = detailedData.filter(x => x.status === 'Assistance Needed' && parseInt(x.progress) < 100).length;
    const monitor = detailedData.filter(x => x.status === 'Monitor' && parseInt(x.progress) < 100).length;
    const overdue = detailedData.filter(x => x.days <= 0 && x.status !== 'Assistance Needed' && parseInt(x.progress) < 100).length;

    return { total, completed, incomplete, safe, assistance, monitor, overdue };
  }, [detailedData]);

  const roomSummary = useMemo(() => {
    const rooms: Record<string, any> = {};
    filteredDetailedData.forEach(t => {
      const room = t.area || 'Unknown';
      if (!rooms[room]) {
        rooms[room] = { room, total: 0, completed: 0, incomplete: 0, safe: 0, monitor: 0, assistance: 0, overdue: 0 };
      }
      rooms[room].total++;
      if (parseInt(t.progress) === 100) rooms[room].completed++;
      else {
        rooms[room].incomplete++;
        if (t.status === 'Safe') rooms[room].safe++;
        if (t.status === 'Monitor') rooms[room].monitor++;
        if (t.status === 'Assistance Needed') rooms[room].assistance++;
        if (t.days <= 0 && t.status !== 'Assistance Needed') rooms[room].overdue++;
      }
    });
    
    return Object.values(rooms).map(r => ({
      ...r,
      completedPct: r.total ? ((r.completed / r.total) * 100).toFixed(2) : '0.00',
      incompletePct: r.total ? ((r.incomplete / r.total) * 100).toFixed(2) : '0.00',
      safePct: r.total ? ((r.safe / r.total) * 100).toFixed(2) : '0.00',
      monitorPct: r.total ? ((r.monitor / r.total) * 100).toFixed(2) : '0.00',
      assistancePct: r.total ? ((r.assistance / r.total) * 100).toFixed(2) : '0.00',
      overduePct: r.total ? ((r.overdue / r.total) * 100).toFixed(2) : '0.00',
    }));
  }, [filteredDetailedData]);

  const ganttData = useMemo(() => {
    if (!filteredDetailedData.length) return { minDate: new Date(), maxDate: new Date(), tasks: [] };
    
    const tasks = filteredDetailedData.map(t => {
      const end = new Date(t.targetDate);
      if (isNaN(end.getTime())) return null;
      
      const start = new Date(end);
      start.setDate(start.getDate() - 14); // Assume 14 days duration for visualization
      
      return {
        ...t,
        start,
        end,
        progressNum: parseInt(t.progress) || 0
      };
    }).filter(Boolean) as any[];

    if (!tasks.length) return { minDate: new Date(), maxDate: new Date(), tasks: [] };

    const minDate = new Date(Math.min(...tasks.map(t => t.start.getTime())));
    const maxDate = new Date(Math.max(...tasks.map(t => t.end.getTime())));
    
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    return { minDate, maxDate, tasks };
  }, [filteredDetailedData]);

  const exportFilteredData = () => {
    if (filteredDetailedData.length === 0) return;
    const csv = Papa.unparse(filteredDetailedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_tasks_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageWrapper>
      <MatrixRain />
      <div className="relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AOS - BI - DASHBOARD</h1>
              <p className="text-slate-600 font-medium text-lg mt-2 tracking-wide">Combined visual and data analytics</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=1636228475&single=true&output=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Raw Summary
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=692796767&single=true&output=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Raw Details
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 mb-6">
        <div className="bg-[#1a73e8] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.total}</span>
          <span className="text-sm font-medium">Total Tasks</span>
        </div>
        <div className="bg-[#00e676] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.completed}</span>
          <span className="text-sm font-medium">Completed</span>
        </div>
        <div className="bg-[#ff9100] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.safe}</span>
          <span className="text-sm font-medium">Safe</span>
        </div>
        <div className="bg-[#ff3333] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.monitor}</span>
          <span className="text-sm font-medium">Monitor</span>
        </div>
        <div className="bg-[#FF2400] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.assistance}</span>
          <span className="text-sm font-medium">Assistance</span>
        </div>
        <div className="bg-[#ff0000] text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold mb-1">{overallStats.overdue}</span>
          <span className="text-sm font-medium">Overdue</span>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center justify-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === 'charts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-white">Room-wise Breakdown</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                      <Tooltip
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Priority A" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="Priority B" stackId="a" fill="#10b981" />
                      <Bar dataKey="Priority C" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-white">Overall Priorities</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-white">Tasks by Status</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Areas Bar Chart */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-white">Top 5 Areas by Task Count</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={areaChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Room Summary Table */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                  <h2 className="text-lg font-semibold text-white">Status Summary by Area</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300 text-sm font-semibold border-b border-slate-700">
                        <th className="p-4">Area</th>
                        <th className="p-4 text-center">Completed</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Total Incomplete</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Safe</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Assistance Needed</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Overdue</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Monitor</th>
                        <th className="p-4 text-center">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {roomSummary.map((row, idx) => (
                        <tr key={row.room} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-white font-medium">{row.room}</td>
                          <td className="p-4 text-center text-emerald-400">{row.completed}</td>
                          <td className="p-4 text-center text-emerald-400/70">{row.completedPct}%</td>
                          <td className="p-4 text-center text-amber-400">{row.incomplete}</td>
                          <td className="p-4 text-center text-amber-400/70">{row.incompletePct}%</td>
                          <td className="p-4 text-center text-blue-400">{row.safe}</td>
                          <td className="p-4 text-center text-blue-400/70">{row.safePct}%</td>
                          <td className="p-4 text-center text-red-400">{row.assistance}</td>
                          <td className="p-4 text-center text-red-400/70">{row.assistancePct}%</td>
                          <td className="p-4 text-center text-orange-400">{row.overdue}</td>
                          <td className="p-4 text-center text-orange-400/70">{row.overduePct}%</td>
                          <td className="p-4 text-center text-purple-400">{row.monitor}</td>
                          <td className="p-4 text-center text-purple-400/70">{row.monitorPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Tasks Table with Filters */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">Detailed Task Breakdown</h2>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm bg-slate-800 text-white border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-48 placeholder:text-slate-400"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <select 
                        value={filterArea} 
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="text-sm bg-slate-800 text-white border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {uniqueAreas.map(area => <option key={area} value={area}>{area === 'All' ? 'All Areas' : area}</option>)}
                      </select>
                      
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm bg-slate-800 text-white border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {uniqueStatuses.map(status => <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>)}
                      </select>
                    </div>

                    <button 
                      onClick={exportFilteredData}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export Filtered
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-800 z-10 shadow-sm">
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-3">Area</th>
                        <th className="p-3">Problem / Improvement</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredDetailedData.length > 0 ? (
                        filteredDetailedData.map((task, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 text-sm font-medium text-white">{task.area}</td>
                            <td className="p-3 text-sm text-slate-300">{task.problem}</td>
                            <td className="p-3 text-sm text-slate-400">{task.category}</td>
                            <td className="p-3 text-sm">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                                parseInt(task.progress) === 100 || task.status === 'Done' ? "bg-emerald-100 text-emerald-700" :
                                task.status === 'Assistance Needed' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {task.status || `${task.progress}%`}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400">
                            No tasks match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-slate-800 bg-slate-800 text-sm text-slate-400">
                  Showing {filteredDetailedData.length} of {detailedData.length} tasks
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hybrid' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-white">Room-wise Breakdown</h2>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                          cursor={{ fill: '#1e293b' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="Priority A" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Priority B" stackId="a" fill="#10b981" />
                        <Bar dataKey="Priority C" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Pie Chart */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-white">Tasks by Status</h2>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Room Summary Table */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                  <h2 className="text-lg font-semibold text-white">Status Summary by Area</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300 text-sm font-semibold border-b border-slate-700">
                        <th className="p-4">Area</th>
                        <th className="p-4 text-center">Completed</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Total Incomplete</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Safe</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Assistance Needed</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Overdue</th>
                        <th className="p-4 text-center">%</th>
                        <th className="p-4 text-center">Monitor</th>
                        <th className="p-4 text-center">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {roomSummary.map((row, idx) => (
                        <tr key={row.room} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-white font-medium">{row.room}</td>
                          <td className="p-4 text-center text-emerald-400">{row.completed}</td>
                          <td className="p-4 text-center text-emerald-400/70">{row.completedPct}%</td>
                          <td className="p-4 text-center text-amber-400">{row.incomplete}</td>
                          <td className="p-4 text-center text-amber-400/70">{row.incompletePct}%</td>
                          <td className="p-4 text-center text-blue-400">{row.safe}</td>
                          <td className="p-4 text-center text-blue-400/70">{row.safePct}%</td>
                          <td className="p-4 text-center text-red-400">{row.assistance}</td>
                          <td className="p-4 text-center text-red-400/70">{row.assistancePct}%</td>
                          <td className="p-4 text-center text-orange-400">{row.overdue}</td>
                          <td className="p-4 text-center text-orange-400/70">{row.overduePct}%</td>
                          <td className="p-4 text-center text-purple-400">{row.monitor}</td>
                          <td className="p-4 text-center text-purple-400/70">{row.monitorPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gantt' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 overflow-x-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-white">Project Timeline (Gantt)</h2>
                </div>
                
                {ganttData.tasks.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">No timeline data available.</div>
                ) : (
                  <div className="min-w-[800px]">
                    <div className="flex text-xs font-semibold text-slate-400 mb-4 border-b border-slate-800 pb-2">
                      <div className="w-48 shrink-0">Task</div>
                      <div className="flex-1 text-center">Timeline</div>
                      <div className="w-24 shrink-0 text-right">Target Date</div>
                    </div>
                    
                    {ganttData.tasks.map((task, i) => {
                      const totalDuration = ganttData.maxDate.getTime() - ganttData.minDate.getTime();
                      const leftPct = ((task.start.getTime() - ganttData.minDate.getTime()) / totalDuration) * 100;
                      const widthPct = ((task.end.getTime() - task.start.getTime()) / totalDuration) * 100;
                      
                      return (
                        <div key={task.id || i} className="flex items-center mb-4 gap-4">
                          <div className="w-48 shrink-0 truncate text-sm text-slate-300" title={task.problem}>
                            {task.problem}
                          </div>
                          <div className="flex-1 relative h-6 bg-slate-800/50 rounded-md overflow-hidden">
                            <div 
                              className="absolute top-1 bottom-1 rounded-md bg-indigo-900/40 border border-indigo-500/30 overflow-hidden"
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            >
                              <div 
                                className="h-full bg-indigo-500 rounded-sm"
                                style={{ width: `${task.progressNum}%` }}
                              />
                            </div>
                          </div>
                          <div className="w-24 shrink-0 text-xs text-slate-400 text-right">
                            {task.targetDate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-white">System Audit Trail</h2>
                  </div>
                  <div className="relative max-w-md w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {loadingAudit ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Loading audit logs...
                    </div>
                  ) : filteredAuditLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                      <Activity className="w-12 h-12 text-slate-600 mb-4" />
                      <p className="text-lg font-medium text-white">No logs found</p>
                      <p>Try adjusting your search.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-slate-800 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                            Action
                          </th>
                          <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900">
                        {filteredAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              {formatDate(log.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300 break-words max-w-md">
                              {log.details || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </PageWrapper>
  );
}
