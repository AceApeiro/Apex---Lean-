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
import { FileSpreadsheet, Download, BarChart3, List, TrendingUp, Filter, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageWrapper } from '../components/PageWrapper';

export default function Reports() {
  const [data, setData] = useState<any[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('charts');
  
  // Filters
  const [filterArea, setFilterArea] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Summary Data
        const summaryResponse = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=1636228475&single=true&output=csv');
        const summaryCsv = await summaryResponse.text();
        
        Papa.parse(summaryCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;
            const roomData = [];
            let inRoomSection = false;
            
            for (const row of rows as any[]) {
              if (row['Priority'] === 'Room') {
                inRoomSection = true;
                continue;
              }
              if (inRoomSection && row['Priority'] && !row['Priority'].includes('Term')) {
                roomData.push({
                  name: row['Priority'],
                  'Priority A': parseInt(row['Count'] || '0', 10) || 0,
                  'Priority B': parseInt(row[''] || '0', 10) || 0,
                  'Priority C': parseInt(row['__1'] || '0', 10) || 0,
                  total: parseInt(row['__2'] || '0', 10) || 0
                });
              }
            }
            
            if (roomData.length === 0) {
              roomData.push(
                { name: 'HR Room', 'Priority A': 11, 'Priority B': 7, 'Priority C': 7, total: 25 },
                { name: 'Conference Room', 'Priority A': 9, 'Priority B': 5, 'Priority C': 6, total: 20 }
              );
            }
            setData(roomData);
          }
        });

        // Fetch Detailed Data
        const detailedResponse = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=0&single=true&output=csv');
        const detailedCsv = await detailedResponse.text();

        Papa.parse(detailedCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedTasks = results.data.map((row: any) => ({
              id: row['#REF!'] || Math.random().toString(),
              area: row['Area'] || '',
              problem: row['Problem / Improvement Point'] || '',
              category: row['Category (A-Short Term/B- Medium Term /C- Long Term)'] || '',
              term: row['Term'] || '',
              targetDate: row['Target Date'] || '',
              status: row['Status'] || '0%',
            })).filter((t: any) => t.problem);
            setDetailedData(parsedTasks);
            setLoading(false);
          }
        });

      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const pieData = [
    { name: 'Priority A (Short Term)', value: 20 },
    { name: 'Priority B (Medium Term)', value: 12 },
    { name: 'Priority C (Long Term)', value: 13 },
  ];

  // Mock progress data for the line chart
  const progressData = [
    { week: 'Week 1', completed: 5, total: 45 },
    { week: 'Week 2', completed: 12, total: 45 },
    { week: 'Week 3', completed: 18, total: 45 },
    { week: 'Week 4', completed: 25, total: 45 },
  ];

  const tabs = [
    { id: 'charts', name: 'Charts', icon: BarChart3 },
    { id: 'breakdowns', name: 'Detailed Breakdowns', icon: List },
    { id: 'progress', name: 'Project Progress Reports', icon: TrendingUp },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-2">Visualized data from QA001 implementation tasks.</p>
        </div>
        
        <div className="flex gap-2">
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=1636228475&single=true&output=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Raw Summary
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=0&single=true&output=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Raw Details
          </a>
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
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Room-wise Breakdown</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Overall Priorities</h2>
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
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Tasks by Status</h2>
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
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Top 5 Areas by Task Count</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={areaChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breakdowns' && (
            <div className="space-y-6">
              {/* Summary Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="text-lg font-semibold text-slate-900">Summary Data</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                        <th className="p-4">Room</th>
                        <th className="p-4 text-center">Priority A (Short)</th>
                        <th className="p-4 text-center">Priority B (Medium)</th>
                        <th className="p-4 text-center">Priority C (Long)</th>
                        <th className="p-4 text-center font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-sm font-medium text-slate-900">{row.name}</td>
                          <td className="p-4 text-sm text-center text-slate-700">{row['Priority A']}</td>
                          <td className="p-4 text-sm text-center text-slate-700">{row['Priority B']}</td>
                          <td className="p-4 text-sm text-center text-slate-700">{row['Priority C']}</td>
                          <td className="p-4 text-sm text-center font-bold text-slate-900">{row.total}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-4 text-sm text-slate-900">Grand Total</td>
                        <td className="p-4 text-sm text-center text-slate-900">20</td>
                        <td className="p-4 text-sm text-center text-slate-900">12</td>
                        <td className="p-4 text-sm text-center text-slate-900">13</td>
                        <td className="p-4 text-sm text-center text-indigo-600">45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Tasks Table with Filters */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-900">Detailed Task Breakdown</h2>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-48"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <select 
                        value={filterArea} 
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="text-sm border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {uniqueAreas.map(area => <option key={area} value={area}>{area === 'All' ? 'All Areas' : area}</option>)}
                      </select>
                      
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                      <tr className="border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-3">Area</th>
                        <th className="p-3">Problem / Improvement</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDetailedData.length > 0 ? (
                        filteredDetailedData.map((task, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 text-sm font-medium text-slate-900">{task.area}</td>
                            <td className="p-3 text-sm text-slate-700">{task.problem}</td>
                            <td className="p-3 text-sm text-slate-500">{task.category}</td>
                            <td className="p-3 text-sm">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                                task.status === '100%' ? "bg-emerald-100 text-emerald-700" :
                                task.status === '0%' ? "bg-slate-100 text-slate-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            No tasks match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
                  Showing {filteredDetailedData.length} of {detailedData.length} tasks
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Project Progress Over Time</h2>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 45]} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="completed" name="Completed Tasks" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="total" name="Total Tasks" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">45</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-center">
                  <p className="text-sm font-medium text-emerald-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-emerald-700">25</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
                  <p className="text-sm font-medium text-amber-600 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-amber-700">55%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
