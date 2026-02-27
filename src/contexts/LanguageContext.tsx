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
    'nav.content': 'Lean Content',
    'nav.games': 'Interactive Games',
    'nav.gallery': 'Gallery',
    'nav.tasks': 'Tasks & Tests',
    'nav.minutes': 'Weekly Minutes',
    'nav.reports': 'Reports & Analytics',
    'nav.audit': 'QC Audit',
    'nav.blog': 'Team Apex Blog',
    'app.title': 'Apex Problem Solving with 5S',
    'app.subtitle': 'Team "Apex" - QA001 - HR & Conference room',
  },
  si: {
    'nav.dashboard': 'උපකරණ පුවරුව',
    'nav.content': 'ලීන් අන්තර්ගතය',
    'nav.games': 'අන්තර්ක්‍රියාකාරී ක්‍රීඩා',
    'nav.gallery': 'ගැලරිය',
    'nav.tasks': 'කාර්යයන් සහ පරීක්ෂණ',
    'nav.minutes': 'සතිපතා වාර්තා',
    'nav.reports': 'වාර්තා සහ විශ්ලේෂණ',
    'nav.audit': 'තත්ත්ව පාලන විගණනය',
    'nav.blog': 'Apex කණ්ඩායමේ බ්ලොග් අඩවිය',
    'app.title': '5S සමඟ Apex ගැටළු විසඳීම',
    'app.subtitle': '"Apex" කණ්ඩායම - QA001 - මානව සම්පත් සහ සම්මන්ත්‍රණ කාමරය',
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
