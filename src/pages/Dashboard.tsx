import { Users, Target, Activity, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageWrapper } from '../components/PageWrapper';

const teamMembers = [
  { name: 'Namal Dharamarathne', role: 'Trainer/Coach' },
  { name: 'Buveendra Illangage', role: 'Member' },
  { name: 'Nelusha Pushpawela', role: 'Member' },
  { name: 'Nuwan Jayawickarama', role: 'Member' },
  { name: 'Nimmi Thanuja', role: 'Member' },
  { name: 'Ravi Thevarapperuma', role: 'Member' },
  { name: 'Sumudu Sadaruwan', role: 'Member' },
  { name: 'Prabashawari wanigasinghe', role: 'Member' },
  { name: 'Heshani Fernanado', role: 'Member' },
  { name: 'Uthapala Chadrasekara', role: 'Member' },
  { name: 'Hiruni Kavindya', role: 'Member' },
  { name: 'Ravira Nimsara Kaluaracchi', role: 'Member' },
  { name: 'Steve Dawson', role: 'Member' },
  { name: 'Geeth Kahandugoda', role: 'Member' },
  { name: 'Gayan Ranathunga', role: 'Member' },
  { name: 'Kumara', role: 'Member' },
];

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <PageWrapper isDashboard={true}>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('app.title')}</h1>
        <p className="text-slate-500 mt-2">{t('app.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Project ID</p>
              <p className="text-xl font-bold text-slate-900">QA001</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <p className="text-xl font-bold text-slate-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Team Size</p>
              <p className="text-xl font-bold text-slate-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Status</p>
              <p className="text-xl font-bold text-slate-900">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
