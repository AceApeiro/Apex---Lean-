import { useState, useEffect, useMemo } from 'react';
import { Users, Target, Activity, CheckCircle2, ArrowRight, BookOpen, Clock, MessageSquare, Monitor, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { PageWrapper } from '../components/PageWrapper';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useLanguage();
  const [detailedData, setDetailedData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=692796767&single=true&output=csv&cb=${Date.now()}`);
        if (!response.ok) return;
        const text = await response.text();
        
        const rows = text.split("\n").slice(1);
        const parsedTasks = rows.map(line => {
          const c = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
          return {
            progress: (c[6]?.toString() || "0").replace('%','').trim() || "0",
            days: parseInt(c[7]) || 0,
            status: c[8]?.trim() || "",
            area: c[1] || ""
          };
        }).filter(x => x.area);
        
        setDetailedData(parsedTasks);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = detailedData.length;
    const completed = detailedData.filter(x => parseInt(x.progress) === 100).length;
    const incomplete = total - completed;
    const safe = detailedData.filter(x => x.status === 'Safe' && parseInt(x.progress) < 100).length;
    const assistance = detailedData.filter(x => x.status === 'Assistance Needed' && parseInt(x.progress) < 100).length;
    const monitor = detailedData.filter(x => x.status === 'Monitor' && parseInt(x.progress) < 100).length;
    const overdue = detailedData.filter(x => x.days <= 0 && x.status !== 'Assistance Needed' && parseInt(x.progress) < 100).length;

    const getPct = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

    return { 
      total, 
      completed, completedPct: getPct(completed),
      incomplete, incompletePct: getPct(incomplete),
      safe, safePct: getPct(safe),
      assistance, assistancePct: getPct(assistance),
      monitor, monitorPct: getPct(monitor),
      overdue, overduePct: getPct(overdue)
    };
  }, [detailedData]);

  return (
    <PageWrapper isDashboard={true}>
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative shrink-0"
        >
          <motion.img 
            src="https://i.imgur.com/EIU6acp.png" 
            alt="AOS Logo" 
            className="relative h-12 sm:h-16 w-48 sm:w-64 object-fill drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('app.title')}</h1>
          <p className="text-slate-500 mt-2">{t('app.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full mb-2">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Total Tasks</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.completed} <span className="text-sm text-slate-400 font-normal">({stats.completedPct}%)</span></p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Completed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-full mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.incomplete} <span className="text-sm text-slate-400 font-normal">({stats.incompletePct}%)</span></p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Incomplete</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.safe} <span className="text-sm text-slate-400 font-normal">({stats.safePct}%)</span></p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Safe</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-red-100 text-red-600 rounded-full mb-2">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.assistance} <span className="text-sm text-slate-400 font-normal">({stats.assistancePct}%)</span></p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Assistance Needed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-full mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.overdue} <span className="text-sm text-slate-400 font-normal">({stats.overduePct}%)</span></p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Overdue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AOS Dashboard Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">{t('home.aosDashboard')}</h2>
            </div>
            <Link to="/aos" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              {t('home.viewFull')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center bg-slate-900 text-white min-h-[200px]">
            <h3 className="font-['Orbitron'] text-xl tracking-widest text-[#0099ff] mb-2">APEX OPERATING SYSTEM</h3>
            <p className="text-slate-400 text-sm mb-4">{t('home.liveKpi')}</p>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00e676]">{stats.completed}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{t('home.done')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff9100]">{stats.safe}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{t('home.safe')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff3333]">{stats.monitor}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{t('home.monitor')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Minutes Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">{t('home.recentMinutes')}</h2>
            </div>
            <Link to="/minutes" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-sm font-medium text-slate-900">March 16, 2026</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Mr. Namal gave instructions to Steve. Heshani about future plans and operation procedures. Nimmi to be updated by Steve...</p>
              </div>
              <div className="border-l-2 border-slate-200 pl-4">
                <p className="text-sm font-medium text-slate-900">March 9, 2026</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Discussed a value addition point. Held a discussion regarding the CCP. Discussed Steve's website...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Blog Post Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">{t('home.latestBlog')}</h2>
            </div>
            <Link to="/blog" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              {t('home.readMore')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">2 Seiri Day Completed</h3>
            <p className="text-sm text-slate-600 line-clamp-3 mb-4">
              Great teamwork and coordination. Nimmi was annoyed she didn't get the opportunity to sing at the Seiri day. Ravira was prepared too with his tabla... he says we missed a treat. Better luck next time guys...
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">Team Update</span>
              <span>•</span>
              <span>March 2026</span>
            </div>
          </div>
        </div>

        {/* Content 5S Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">{t('home.5sContent')}</h2>
            </div>
            <Link to="/content" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              {t('home.learnMore')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="font-bold text-amber-700">Seiri</p>
                <p className="text-xs text-amber-600 mt-1">{t('home.sort')}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="font-bold text-amber-700">Seiton</p>
                <p className="text-xs text-amber-600 mt-1">{t('home.setInOrder')}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="font-bold text-amber-700">Seiso</p>
                <p className="text-xs text-amber-600 mt-1">{t('home.shine')}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="font-bold text-amber-700">Seiketsu</p>
                <p className="text-xs text-amber-600 mt-1">{t('home.standardize')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
