import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'si';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.aos': 'AOS Dashboard',
    'nav.team': 'Meet Team Apex',
    'nav.hierarchy': 'Steering Team',
    'nav.leanManagement': 'Lean Management',
    'nav.content': 'Lean Content',
    'nav.games': 'Interactive Games',
    'nav.gallery': 'Gallery',
    'nav.minutes': 'Weekly Minutes',
    'nav.reports': 'AOS - BI - DASHBOARD',
    'nav.blog': 'Team Apex Blog',
    'nav.chat': 'Team Chat',
    'nav.logs': 'System Logs',
    'nav.hallOfFame': 'Hall of Fame',
    'app.title': 'APEX -Problem Solving with 5S',
    'app.subtitle': 'KPI - Both projects (HR & Conference room and APEIRO Ops)',
    'home.projectId': 'Project ID',
    'home.totalTasks': 'Total Tasks',
    'home.teamSize': 'Team Size',
    'home.status': 'Status',
    'home.inProgress': 'In Progress',
    'home.aosDashboard': 'AOS Dashboard',
    'home.viewFull': 'View Full',
    'home.liveKpi': 'Live KPI Tracking & Analytics',
    'home.done': 'Done',
    'home.safe': 'Safe',
    'home.monitor': 'Monitor',
    'home.recentMinutes': 'Recent Minutes',
    'home.viewAll': 'View All',
    'home.latestBlog': 'Latest from Blog',
    'home.readMore': 'Read More',
    'home.5sContent': '5S Content',
    'home.learnMore': 'Learn More',
    'home.sort': 'Sort',
    'home.setInOrder': 'Set in Order',
    'home.shine': 'Shine',
    'home.standardize': 'Standardize',
    'home.attendees': 'Attendees',
    'home.quickLinks': 'Quick Links',
    'home.accessResources': 'Access project resources and tools',
    'home.leanContent': 'Lean Content',
    'home.leanContentDesc': '5S methodologies and training materials',
    'home.games': 'Interactive Games',
    'home.gamesDesc': 'Team building and learning activities',
    'home.reports': 'Reports',
    'home.reportsDesc': 'Project analytics and progress tracking',
  },
  si: {
    'nav.dashboard': 'උපකරණ පුවරුව',
    'nav.aos': 'AOS උපකරණ පුවරුව',
    'nav.team': 'Apex කණ්ඩායම හමුවන්න',
    'nav.hierarchy': 'මෙහෙයුම් කමිටුව',
    'nav.leanManagement': 'ලීන් කළමනාකරණය',
    'nav.content': 'ලීන් අන්තර්ගතය',
    'nav.games': 'අන්තර්ක්‍රියාකාරී ක්‍රීඩා',
    'nav.gallery': 'ගැලරිය',
    'nav.minutes': 'සතිපතා වාර්තා',
    'nav.reports': 'AOS - BI - DASHBOARD',
    'nav.blog': 'Apex කණ්ඩායමේ බ්ලොග් අඩවිය',
    'nav.chat': 'කණ්ඩායම් කතාබස්',
    'nav.logs': 'පද්ධති ලොග',
    'nav.hallOfFame': 'කීර්තිමත් ශාලාව',
    'app.title': 'APEX - 5S සමඟ ගැටළු විසඳීම',
    'app.subtitle': 'KPI - Both projects (HR & Conference room and APEIRO Ops)',
    'home.projectId': 'ව්‍යාපෘති හැඳුනුම්පත',
    'home.totalTasks': 'මුළු කාර්යයන්',
    'home.teamSize': 'කණ්ඩායමේ ප්‍රමාණය',
    'home.status': 'තත්ත්වය',
    'home.inProgress': 'සිදුවෙමින් පවතී',
    'home.aosDashboard': 'AOS උපකරණ පුවරුව',
    'home.viewFull': 'සම්පූර්ණ බලන්න',
    'home.liveKpi': 'සජීවී KPI ලුහුබැඳීම සහ විශ්ලේෂණ',
    'home.done': 'අවසන්',
    'home.safe': 'ආරක්ෂිතයි',
    'home.monitor': 'නිරීක්ෂණය',
    'home.recentMinutes': 'මෑත වාර්තා',
    'home.viewAll': 'සියල්ල බලන්න',
    'home.latestBlog': 'බ්ලොග් අඩවියෙන් නවතම',
    'home.readMore': 'තවත් කියවන්න',
    'home.5sContent': '5S අන්තර්ගතය',
    'home.learnMore': 'තව දැනගන්න',
    'home.sort': 'වර්ග කිරීම',
    'home.setInOrder': 'පිළිවෙලට තැබීම',
    'home.shine': 'පිරිසිදු කිරීම',
    'home.standardize': 'ප්‍රමිතිකරණය',
    'home.attendees': 'සහභාගිවන්නන්',
    'home.quickLinks': 'ඉක්මන් සබැඳි',
    'home.accessResources': 'ව්‍යාපෘති සම්පත් සහ මෙවලම් වෙත පිවිසෙන්න',
    'home.leanContent': 'ලීන් අන්තර්ගතය',
    'home.leanContentDesc': '5S ක්‍රමවේද සහ පුහුණු ද්‍රව්‍ය',
    'home.games': 'අන්තර්ක්‍රියාකාරී ක්‍රීඩා',
    'home.gamesDesc': 'කණ්ඩායම් ගොඩනැගීමේ සහ ඉගෙනීමේ ක්‍රියාකාරකම්',
    'home.reports': 'වාර්තා',
    'home.reportsDesc': 'ව්‍යාපෘති විශ්ලේෂණ සහ ප්‍රගතිය ලුහුබැඳීම',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
