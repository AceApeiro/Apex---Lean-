import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Target, TrendingUp, Zap, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function LeanManagement() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Strategic Growth
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Guided by our Chairman Mr. Buveendra Illangage's vision for organizational growth and corporate social responsibility, we have charted a definitive path forward.
          </p>
        </div>

        {/* Growth Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">540</h3>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Short Term</p>
            <p className="text-slate-600 text-sm">Increase current workforce of 180 by threefold</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">1,500</h3>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Medium Term (5 Yrs)</p>
            <p className="text-slate-600 text-sm">Expanding our regional footprint and capabilities</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">40,000</h3>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Long Term (10 Yrs)</p>
            <p className="text-slate-600 text-sm">Building a nation of winners and champions</p>
          </div>
        </div>

        {/* Apeiro Methodology */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Apeiro Methodology</h2>
            <p className="text-indigo-300 font-medium tracking-wide uppercase">The Gold Standard.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="text-4xl font-black text-indigo-500/30">1</div>
              <h4 className="text-lg font-bold text-white">Extraction</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Identifying processes that stifle your growth.</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-indigo-500/30">2</div>
              <h4 className="text-lg font-bold text-white">Cultivation</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Replacing legacy struggle with industry best results.</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-indigo-500/30">3</div>
              <h4 className="text-lg font-bold text-white">Integration</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Seamlessly bridging the gap to achievements.</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-indigo-500/30">4</div>
              <h4 className="text-lg font-bold text-white">Scaling</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Ensuring long-term sustainability and profits.</p>
            </div>
          </div>
        </div>

        {/* Operational Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2">Operational Excellence</p>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">Adapting to<br/>Lean Management</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                To achieve our ambitious goals, we are fundamentally restructuring our processes, strategies, and overhauling our operations. Our shift in focus is centered around adapting Lean Management principles to eliminate waste, optimize workflows, and deliver unparalleled value.
              </p>
              <p>
                We are transforming our employees' workplace processes by empowering them with the right tools and methodologies. Lean is the engine driving this evolution—ensuring that every action adds value, every process is streamlined, and our teams operate at peak efficiency. This isn't just a structural change; it's a cultural revolution towards continuous improvement.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <Zap className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-slate-900">Continuous Flow</span>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <span className="font-bold text-slate-900">Waste Elimination</span>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-slate-900">Kaizen Culture</span>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <Target className="w-8 h-8 text-amber-600" />
              <span className="font-bold text-slate-900">Quality Built-In</span>
            </div>
          </div>
        </div>

        {/* 5S Adaptation */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Lean Management & 5S Adaptation</h2>
              <p className="text-lg text-slate-600">
                Utilizing timely tools in our journey to achieve the vision, sustainment, and continuous growth.
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600">
              <p>
                As we navigate an era of unprecedented digital innovation, our company is embarking on a comprehensive transformation journey centered around Lean Management implementation and the 5S methodology.
              </p>
              <p>
                This strategic pivot is a fundamental realignment of our corporate culture. By adapting 5S principles (Sort, Set in order, Shine, Standardize, Sustain) alongside timely Lean tools, we are eliminating waste, optimizing workflows, and laying the groundwork for enhanced productivity.
              </p>
              <p>
                Our journey towards achieving our ultimate vision relies heavily on sustainment and growth. Through continuous improvement practices, we empower our workforce to focus on delivering exceptional value, driving operational excellence, and pioneering the next generation of solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Vision & Growth</h4>
                  <p className="text-sm text-slate-500 mt-1">Driving operational excellence through clarity, discipline, and continuous improvement.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Timely Tools</h4>
                  <p className="text-sm text-slate-500 mt-1">Equipping our teams with the right methodologies for sustainable success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 5S Pillars */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">The 5S Pillars</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: 1, title: 'Sort (Seiri)', desc: 'Eliminate unnecessary items from the workspace to reduce clutter and confusion.' },
              { num: 2, title: 'Set in order (Seiton)', desc: 'Organize remaining items for efficient use, ensuring everything has a place.' },
              { num: 3, title: 'Shine (Seiso)', desc: 'Clean and inspect the work area regularly to maintain high standards.' },
              { num: 4, title: 'Standardize (Seiketsu)', desc: 'Create consistent procedures and visual controls for the first 3 S\'s.' },
              { num: 5, title: 'Sustain (Shitsuke)', desc: 'Maintain and review standards continuously, fostering a culture of discipline and growth.' }
            ].map((pillar) => (
              <div key={pillar.num} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
                <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-50 group-hover:text-indigo-50 transition-colors z-0">
                  {pillar.num}
                </div>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
