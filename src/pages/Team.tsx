import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const teamMembers = [
  { name: 'Namal Dharmarathne', role: 'Trainer/Coach', email: 'namal@example.com', phone: '+94 77 529 9444', dob: '1980 / 05 / 12', location: 'HQ' },
  { name: 'Buveendra Illangage', role: 'Adviser', email: 'buveendra@example.com', phone: '+94 70 467 1515', dob: '1975 / 11 / 23', location: 'HQ' },
  { name: 'Nelusha Pushpawela', role: 'Facilitator - Steering Team', email: 'nelusha@example.com', phone: '+94 71 308 3444', dob: '1985 / 08 / 14', location: 'HQ' },
  { name: 'Nuwan Jayawickrama', role: 'Member', email: 'nuwan@example.com', phone: '+94 71 153 0822', dob: '1988 / 02 / 28', location: 'HQ' },
  { name: 'Nimmi Thanuja', role: 'Adviser - HR & Conference Room / Team Leader - F Guard', email: 'nimmi@example.com', phone: '+94 70 667 7282', dob: '1982 / 09 / 10', location: 'HQ' },
  { name: 'Ravi Thevarapperuma', role: 'Member', email: 'ravi@example.com', phone: '+94 74 041 2563', dob: '1979 / 12 / 05', location: 'HQ' },
  { name: 'Sumudu Sandaruwan', role: 'APEIRO Team Leader', email: 'sumudu@example.com', phone: '+94 74 349 4437', dob: '1990 / 04 / 17', location: 'HQ' },
  { name: 'Heshani Fernando', role: 'Communicator - Steering & HR & Conference Room', email: 'heshani@example.com', phone: '+94 70 667 7281', dob: '1992 / 07 / 22', location: 'HQ' },
  { name: 'Uthpala Chandrasekara', role: 'Member', email: 'uthapala@example.com', phone: '+94 76 935 9563', dob: '1987 / 03 / 08', location: 'HQ' },
  { name: 'Hiruni Kavindya', role: 'Member', email: 'hiruni@example.com', phone: '+94 71 234 5678', dob: '1995 / 10 / 15', location: 'HQ' },
  { name: 'Ravira Nimsara Kaluarachchi', role: 'Member', email: 'ravira@example.com', phone: '+94 70 667 7280', dob: '1993 / 06 / 25', location: 'HQ' },
  { name: 'Steve Dawson', role: 'Team Leader - Steering Team', email: 'stevedfd123@gmali.com', phone: '0772480528', dob: '1981 / 01 / 30', location: 'HQ' },
  { name: 'Geeth Kahandugoda', role: 'Member', email: 'geeth@example.com', phone: '+94 75 471 0554', dob: '1986 / 12 / 12', location: 'HQ' },
  { name: 'Gayan Ranathunga', role: 'Member', email: 'gayan@example.com', phone: '+94 71 132 0464', dob: '1984 / 05 / 19', location: 'HQ' },
  { name: 'Ruwan Kumara', role: 'Member', email: 'kumara@example.com', phone: '+94 77 798 6003', dob: '1989 / 08 / 03', location: 'HQ' },
  { name: 'Sampath', role: 'Member', email: 'sampath@example.com', phone: '+94 77 397 4618', dob: '1983 / 11 / 07', location: 'HQ' },
];

export default function Team() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <PageWrapper>
      <div className="bg-black min-h-screen -m-4 md:-m-8 p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">MEET TEAM APEX</h1>
          <p className="text-slate-400 mt-2">Team members and contact information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-700 cursor-pointer"
              onClick={() => setExpandedId(expandedId === idx ? null : idx)}
            >
              <AnimatePresence mode="wait">
                {expandedId === idx ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-slate-800"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-400">{member.role}</p>
                        </div>
                      </div>
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full name</span>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact No</span>
                        <a href={`tel:${member.phone}`} className="text-indigo-400 hover:text-indigo-300 hover:underline" onClick={(e) => e.stopPropagation()}>{member.phone}</a>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email address</span>
                        <a href={`mailto:${member.email}`} className="text-indigo-400 hover:text-indigo-300 hover:underline" onClick={(e) => e.stopPropagation()}>{member.email}</a>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DOB</span>
                        <span className="text-white font-medium">{member.dob}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <p className="text-sm font-medium text-indigo-400">{member.role}</p>
                    </div>
                    <div className="text-slate-500 shrink-0">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
