import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BookOpen, History, RefreshCw, Layout, CheckSquare, Target, Lightbulb, Users, ShieldAlert, Award, ListChecks, Kanban, TrendingUp, Sparkles, GraduationCap, Network, GitMerge, BarChart, Settings, Globe, Activity } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

const leanTopics = [
  {
    id: 'history',
    title: 'History & Coming of Age',
    icon: History,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-700 leading-relaxed">
          The concepts of Lean and 5S have deep historical roots, evolving from early manufacturing practices into a comprehensive global management philosophy.
        </p>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><History className="w-32 h-32" /></div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">The Origins of Lean</h3>
          <ul className="space-y-4 relative z-10">
            <li className="flex gap-4">
              <div className="w-16 shrink-0 font-bold text-indigo-600">1910s</div>
              <div>
                <strong className="text-slate-800">Ford's Mass Production:</strong> Henry Ford introduced the assembly line, focusing on continuous flow. However, it lacked flexibility and produced immense waste when demand shifted.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-16 shrink-0 font-bold text-indigo-600">1930s</div>
              <div>
                <strong className="text-slate-800">Toyota's Early Innovations:</strong> Kiichiro Toyoda and Taiichi Ohno visited Ford's plants and American supermarkets. They realized the need for a "pull" system (producing only what is needed) rather than Ford's "push" system.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-16 shrink-0 font-bold text-indigo-600">1950s</div>
              <div>
                <strong className="text-slate-800">Toyota Production System (TPS):</strong> Post-WWII Japan faced severe resource shortages. TPS was born out of necessity, focusing relentlessly on eliminating waste (Muda) to survive.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-16 shrink-0 font-bold text-indigo-600">1988</div>
              <div>
                <strong className="text-slate-800">The Term "Lean":</strong> John Krafcik, a researcher at MIT, first coined the term "Lean" in his article "Triumph of the Lean Production System."
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-16 shrink-0 font-bold text-indigo-600">1990</div>
              <div>
                <strong className="text-slate-800">Global Recognition:</strong> The book <em>"The Machine That Changed the World"</em> by Womack, Jones, and Roos popularized Lean globally, moving it beyond automotive manufacturing into healthcare, software, and services.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 text-xl mb-3">The Coming of Age of 5S</h3>
          <p className="text-indigo-800 mb-4">
            5S was developed in Japan as a foundational component of the Toyota Production System. It was formalized by Hiroyuki Hirano and Takashi Osada in the 1980s.
          </p>
          <p className="text-indigo-800">
            Initially seen merely as "housekeeping," 5S came of age when organizations realized it was actually a visual management system and a prerequisite for any advanced Lean implementation. Without the stability and discipline of 5S, other Lean tools (like Kanban or JIT) inevitably fail.
          </p>
        </div>
      </div>
    )
  },
  {
    id: '5s-methodology',
    title: 'The 5S Methodology',
    icon: ListChecks,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-700 leading-relaxed">
          5S is a systematic framework for workplace organization and standardization. It creates a safe, clean, and efficient environment that exposes waste and errors immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              s: '1S',
              jp: 'Seiri',
              en: 'Sort',
              desc: 'Separate needed items from unneeded items. Keep only what is necessary in the work area. Red-tagging is a common tool used here.',
              color: 'bg-red-50 border-red-200 text-red-900',
              iconColor: 'text-red-500'
            },
            {
              s: '2S',
              jp: 'Seiton',
              en: 'Set in Order',
              desc: 'A place for everything and everything in its place. Arrange needed items so they are easy to find, use, and return. Use visual cues like shadow boards.',
              color: 'bg-amber-50 border-amber-200 text-amber-900',
              iconColor: 'text-amber-500'
            },
            {
              s: '3S',
              jp: 'Seiso',
              en: 'Shine',
              desc: 'Clean the workspace and equipment regularly. Cleaning is viewed as a form of inspection to detect equipment abnormalities early.',
              color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
              iconColor: 'text-emerald-500'
            },
            {
              s: '4S',
              jp: 'Seiketsu',
              en: 'Standardize',
              desc: 'Create rules, SOPs, and visual controls to maintain the first 3S. Make the abnormal stand out from the normal.',
              color: 'bg-blue-50 border-blue-200 text-blue-900',
              iconColor: 'text-blue-500'
            },
            {
              s: '5S',
              jp: 'Shitsuke',
              en: 'Sustain',
              desc: 'Build a culture of discipline. Conduct regular audits, training, and continuous improvement to ensure 5S becomes a habit, not a one-time event.',
              color: 'bg-purple-50 border-purple-200 text-purple-900',
              iconColor: 'text-purple-500'
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn("p-5 rounded-xl border shadow-sm", item.color)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("text-2xl font-black", item.iconColor)}>{item.s}</div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{item.en}</h4>
                  <span className="text-sm opacity-75 italic">{item.jp}</span>
                </div>
              </div>
              <p className="text-sm opacity-90">{item.desc}</p>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-xl border border-slate-300 bg-slate-50 shadow-sm flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl font-black text-slate-600">+1S</div>
              <div>
                <h4 className="font-bold text-lg leading-tight text-slate-800">Safety</h4>
                <span className="text-sm text-slate-500 italic">Often added as the 6th S</span>
              </div>
            </div>
            <p className="text-sm text-slate-700">Identifying and eliminating hazards to ensure zero accidents in the workplace.</p>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 'lean-tools',
    title: 'Kaizen, Kanban & Lean Tools',
    icon: Kanban,
    content: (
      <div className="space-y-8">
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-emerald-900 text-2xl">Kaizen (Continuous Improvement)</h3>
          </div>
          <p className="text-emerald-800 mb-4">
            "Kai" means Change, and "Zen" means Good. Kaizen is the philosophy that small, ongoing positive changes can reap major improvements.
          </p>
          <ul className="space-y-2 text-emerald-900">
            <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500" /> Focuses on engaging all employees, from the CEO to the assembly line workers.</li>
            <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500" /> Encourages a culture where everyone is a problem solver.</li>
            <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500" /> Rejects the status quo: "There is always a better way."</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Kanban className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-blue-900 text-2xl">Kanban (Visual Pull System)</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Kanban translates to "signboard" or "visual card." It is a scheduling system that tells you what to produce, when to produce it, and how much to produce.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-1">Visualize Work</h4>
              <p className="text-xs text-blue-700">See bottlenecks and workflow states instantly on a board.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-1">Limit WIP</h4>
              <p className="text-xs text-blue-700">Restrict Work-In-Progress to prevent overburdening the team.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-1">Pull System</h4>
              <p className="text-xs text-blue-700">Work is pulled only when there is capacity, preventing overproduction.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">Other Essential Lean Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 text-lg mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Poka-Yoke</h4>
              <p className="text-sm text-slate-600"><strong>Mistake-Proofing.</strong> Designing a process so that a mistake cannot be made, or is immediately obvious if it is made (e.g., a USB plug that only goes in one way).</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 text-lg mb-2 flex items-center gap-2"><Users className="w-5 h-5" /> Gemba</h4>
              <p className="text-sm text-slate-600"><strong>The Real Place.</strong> The philosophy of management going to the actual place where work is done (the factory floor, the office) to observe and understand problems firsthand.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 text-lg mb-2 flex items-center gap-2"><RefreshCw className="w-5 h-5" /> JIT (Just-In-Time)</h4>
              <p className="text-sm text-slate-600">Producing exactly what is needed, exactly when it is needed, in the exact amount needed. Eliminates inventory waste.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 text-lg mb-2 flex items-center gap-2"><Target className="w-5 h-5" /> Hoshin Kanri</h4>
              <p className="text-sm text-slate-600"><strong>Policy Deployment.</strong> A strategic planning process that aligns the company's long-term goals with the daily work of every employee.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'lean-management',
    title: 'What is Lean Management?',
    icon: BookOpen,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-700 leading-relaxed">
          Lean Management is a business philosophy focused on maximizing customer value while minimizing waste. It originated from the Toyota Production System and is now widely used across manufacturing, services, IT, healthcare, and operations.
        </p>
        
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-4 text-lg">Core Objective of Lean</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Deliver more value with fewer resources',
              'Eliminate waste',
              'Improve quality',
              'Increase speed and efficiency',
              'Build a culture of continuous improvement'
            ].map((obj, i) => (
              <li key={i} className="flex items-center gap-2 text-indigo-800">
                <Target className="w-4 h-4 text-indigo-500 shrink-0" /> {obj}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">The 5 Core Principles of Lean</h3>
          <div className="space-y-4">
            {[
              { title: '1. Define Value', desc: 'Understand what the customer truly values.' },
              { title: '2. Map the Value Stream', desc: 'Identify all steps and eliminate non-value-added activities.' },
              { title: '3. Create Flow', desc: 'Ensure smooth workflow without interruptions.' },
              { title: '4. Establish Pull', desc: 'Produce only what is needed when it is needed.' },
              { title: '5. Pursue Perfection', desc: 'Continuously improve processes.' }
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex gap-4">
                <div className="w-8 h-8 shrink-0 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{i + 1}</div>
                <div>
                  <h4 className="font-bold text-slate-900">{p.title.substring(3)}</h4>
                  <p className="text-slate-600 text-sm mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">The 8 Wastes (DOWNTIME)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'D', t: 'Defects', d: 'Errors requiring correction or rework.' },
              { l: 'O', t: 'Overproduction', d: 'Producing more than needed.' },
              { l: 'W', t: 'Waiting', d: 'Idle time in processes.' },
              { l: 'N', t: 'Non-utilized Talent', d: 'Not using employee potential effectively.' },
              { l: 'T', t: 'Transportation', d: 'Unnecessary movement of materials.' },
              { l: 'I', t: 'Inventory', d: 'Excess stock beyond demand.' },
              { l: 'M', t: 'Motion', d: 'Unnecessary movement of people.' },
              { l: 'E', t: 'Extra Processing', d: 'Doing more work than required.' }
            ].map((w, i) => (
              <div key={i} className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-black text-red-600">{w.l}</span>
                  <h4 className="font-bold text-red-900">{w.t}</h4>
                </div>
                <p className="text-sm text-red-800">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'org-strategy',
    title: 'Organizational Strategy Framework',
    icon: Layout,
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">1. Operational – Tactical – Strategic Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-16 h-16" /></div>
              <h4 className="font-bold text-lg mb-2 text-indigo-300">Strategic Level</h4>
              <p className="text-slate-300 text-sm">Top management defines long-term vision, mission, policies, and core values.</p>
            </div>
            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Layout className="w-16 h-16" /></div>
              <h4 className="font-bold text-lg mb-2 text-indigo-200">Tactical Level</h4>
              <p className="text-indigo-100 text-sm">Middle management converts strategy into plans, KPIs, and departmental goals.</p>
            </div>
            <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw className="w-16 h-16" /></div>
              <h4 className="font-bold text-lg mb-2 text-emerald-200">Operational Level</h4>
              <p className="text-emerald-100 text-sm">Frontline teams execute daily tasks and ensure process compliance.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">2. Leadership & Core Values Transmission</h3>
          <p className="text-slate-700 mb-4">Top management is responsible for transmitting core values, culture, and vision to all levels of the organization.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Lead by example', 'Clear communication of expectations', 'Consistent reinforcement of values', 'Alignment between words and actions'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">3. MTS – Mindset / Tools / Skills</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">Mindset</h4>
                <p className="text-sm text-blue-800">Growth mindset, accountability, ownership.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1">Tools</h4>
                <p className="text-sm text-amber-800">Lean tools, problem-solving methods, KPIs, dashboards.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-1">Skills</h4>
                <p className="text-sm text-purple-800">Communication, analysis, leadership, technical expertise.</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">4. Emotional Intelligence (E.I)</h3>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <ul className="space-y-3">
                {['Self-awareness', 'Self-regulation', 'Empathy', 'Social skills', 'Motivation'].map((ei, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-700 font-medium">{ei}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving & Root Cause Thinking',
    icon: Lightbulb,
    content: (
      <div className="space-y-8">
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
          <h3 className="font-bold text-amber-900 text-xl mb-3 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" /> 1. Root Cause Principle
          </h3>
          <p className="text-amber-800 mb-4">
            A root cause can create multiple symptoms. It is critical to eliminate the root cause instead of repeatedly treating symptoms.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white px-3 py-1.5 rounded-full text-sm font-bold text-amber-700 shadow-sm">Use 5 Why Analysis</span>
            <span className="bg-white px-3 py-1.5 rounded-full text-sm font-bold text-amber-700 shadow-sm">Fishbone (Ishikawa) Diagram</span>
            <span className="bg-white px-3 py-1.5 rounded-full text-sm font-bold text-amber-700 shadow-sm">Data-driven investigation</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">2. Problem Solving Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
              <h4 className="font-bold text-red-900 mb-2">Unstructured (Non-Scientific)</h4>
              <p className="text-sm text-red-800">Based on intuition or quick reaction.</p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Structured (Scientific)</h4>
              <p className="text-sm text-emerald-800">Logical, data-based, systematic approach.</p>
            </div>
          </div>

          <h4 className="font-bold text-slate-800 mb-4">Structured Problem-Solving Flow:</h4>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            {['Identify the Problem', 'Understand the Problem', 'Analyze Reasons', 'Develop Strategy', 'Implement & Avoid Recurrence'].map((step, idx) => (
              <motion.div 
                key={step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className="flex-1 w-full bg-white p-3 rounded-lg shadow-sm border border-slate-200 text-center relative z-10"
              >
                <div className="text-xs font-black text-indigo-400 mb-1">STEP {idx + 1}</div>
                <h5 className="font-semibold text-slate-800 text-sm">{step}</h5>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-xl mb-3">3. Acting vs Reacting</h3>
          <p className="text-slate-700 mb-4">It is pivotal to act strategically rather than react emotionally during problematic situations.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-slate-700"><CheckSquare className="w-4 h-4 text-indigo-500" /> Preventive controls</li>
            <li className="flex items-center gap-2 text-slate-700"><CheckSquare className="w-4 h-4 text-indigo-500" /> Early warning systems</li>
            <li className="flex items-center gap-2 text-slate-700"><CheckSquare className="w-4 h-4 text-indigo-500" /> Standard Operating Procedures (SOPs)</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'stakeholders',
    title: 'Stakeholders & Motivation',
    icon: Users,
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">1. Stakeholders & Their Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Owners', desc: 'Profitability and sustainability.', color: 'bg-blue-50 border-blue-200 text-blue-900' },
              { title: 'Employees', desc: 'Salary, benefits, career growth.', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
              { title: 'Customers', desc: 'QPD – Quality, Product/Service excellence, Timely delivery.', color: 'bg-purple-50 border-purple-200 text-purple-900' },
              { title: 'Suppliers', desc: 'Timely payments and continuous business.', color: 'bg-amber-50 border-amber-200 text-amber-900' },
              { title: 'Government', desc: 'Taxes compliance and no employee disputes.', color: 'bg-slate-100 border-slate-300 text-slate-800' }
            ].map((s, i) => (
              <div key={i} className={cn("p-4 rounded-xl border", s.color)}>
                <h4 className="font-bold mb-2">{s.title}</h4>
                <p className="text-sm opacity-90">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">2. Influencing & Motivating Employees</h3>
            <ul className="space-y-3">
              {[
                'Authoritative leadership',
                'Providing tangible benefits',
                'Charismatic communication',
                'Knowledge-based credibility',
                'R & R – Reward and Recognition systems'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">3. Brainstorming Methods</h3>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Active Brainstorming</h4>
                <p className="text-sm text-indigo-800">Open discussion and idea sharing in a group setting.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Silent Brainstorming</h4>
                <p className="text-sm text-slate-700">Individual idea generation before group discussion. Prevents groupthink.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'advanced-lean',
    title: 'Advanced Lean Systems (MSc Level)',
    icon: GraduationCap,
    content: (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap className="w-32 h-32" /></div>
          <h3 className="font-bold text-2xl mb-4 relative z-10">Mastering Lean Systems</h3>
          <p className="text-indigo-100 text-lg leading-relaxed relative z-10 max-w-3xl">
            At the master's level, Lean transcends basic tools (like 5S or visual management) and becomes a holistic socio-technical system. It requires deep understanding of system dynamics, organizational psychology, and advanced statistical process control.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-600" /> 1. Value Stream Mapping (VSM) - Advanced
          </h3>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 mb-4">
              Advanced VSM goes beyond mapping material and information flow. It integrates financial flows, environmental impact (Green VSM), and digital information flows (Industry 4.0 integration).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2">Current State Analysis</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Takt Time vs. Cycle Time analysis</li>
                  <li>• OEE (Overall Equipment Effectiveness) calculation</li>
                  <li>• Identifying system bottlenecks (Theory of Constraints)</li>
                </ul>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Future State Design</h4>
                <ul className="text-sm text-indigo-800 space-y-2">
                  <li>• Designing continuous flow cells</li>
                  <li>• Implementing pull systems (Supermarkets)</li>
                  <li>• Pacemaker process identification</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">Implementation Plan</h4>
                <ul className="text-sm text-emerald-800 space-y-2">
                  <li>• Creating value stream loops</li>
                  <li>• Phased execution strategy</li>
                  <li>• KPI alignment (Lead time, WIP, Quality)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-indigo-600" /> 2. Lean Six Sigma Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-lg text-slate-800 mb-3">The DMAIC Framework</h4>
              <p className="text-sm text-slate-600 mb-4">Integrating Lean's speed with Six Sigma's quality control.</p>
              <ul className="space-y-3">
                <li className="flex gap-3"><span className="font-bold text-indigo-600 w-4">D</span><span className="text-sm text-slate-700"><strong>Define:</strong> Project charter, Voice of Customer (VOC), CTQ trees.</span></li>
                <li className="flex gap-3"><span className="font-bold text-indigo-600 w-4">M</span><span className="text-sm text-slate-700"><strong>Measure:</strong> Data collection plan, Measurement System Analysis (Gage R&R).</span></li>
                <li className="flex gap-3"><span className="font-bold text-indigo-600 w-4">A</span><span className="text-sm text-slate-700"><strong>Analyze:</strong> Hypothesis testing, ANOVA, Regression analysis, Root cause.</span></li>
                <li className="flex gap-3"><span className="font-bold text-indigo-600 w-4">I</span><span className="text-sm text-slate-700"><strong>Improve:</strong> Design of Experiments (DOE), FMEA, Pilot implementation.</span></li>
                <li className="flex gap-3"><span className="font-bold text-indigo-600 w-4">C</span><span className="text-sm text-slate-700"><strong>Control:</strong> Statistical Process Control (SPC) charts, Control plans.</span></li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-lg text-slate-800 mb-3">Advanced Statistical Tools</h4>
              <div className="space-y-4">
                <div className="border-l-2 border-purple-500 pl-3">
                  <h5 className="font-semibold text-sm text-slate-800">Process Capability (Cp, Cpk)</h5>
                  <p className="text-xs text-slate-600 mt-1">Measuring how well a process meets specifications statistically.</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <h5 className="font-semibold text-sm text-slate-800">Design of Experiments (DOE)</h5>
                  <p className="text-xs text-slate-600 mt-1">Systematic method to determine the relationship between factors affecting a process and its output.</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <h5 className="font-semibold text-sm text-slate-800">Failure Mode and Effects Analysis (FMEA)</h5>
                  <p className="text-xs text-slate-600 mt-1">Quantitative risk assessment tool to prioritize potential defects based on Severity, Occurrence, and Detection (RPN).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" /> 3. Total Productive Maintenance (TPM)
          </h3>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 mb-6">
              TPM shifts maintenance from a reactive "fix it when it breaks" approach to a proactive, company-wide strategy involving operators in daily maintenance.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Autonomous Maintenance', desc: 'Operators perform daily checks, lubrication, and minor repairs.' },
                { title: 'Planned Maintenance', desc: 'Scheduled, predictive maintenance by skilled technicians.' },
                { title: 'Quality Maintenance', desc: 'Zero defect strategy targeting equipment conditions.' },
                { title: 'Early Equipment Management', desc: 'Designing new equipment for zero maintenance and easy operability.' }
              ].map((pillar, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                  <div className="w-8 h-8 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-2">{i+1}</div>
                  <h5 className="font-bold text-sm text-slate-800 mb-1">{pillar.title}</h5>
                  <p className="text-xs text-slate-500">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-indigo-600" /> 4. Lean Leadership & Change Management
          </h3>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-amber-900 mb-3">Hoshin Kanri (Policy Deployment)</h4>
                <p className="text-sm text-amber-800 mb-3">
                  A strategic management methodology that ensures the strategic goals of a company drive progress and action at every level within that company.
                </p>
                <ul className="text-sm text-amber-900 space-y-1">
                  <li>• Catchball process (top-down and bottom-up alignment)</li>
                  <li>• X-Matrix for strategic planning</li>
                  <li>• A3 Thinking for problem solving and reporting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-3">Managing Cultural Transformation</h4>
                <p className="text-sm text-amber-800 mb-3">
                  Lean fails without cultural alignment. Advanced practitioners must master:
                </p>
                <ul className="text-sm text-amber-900 space-y-1">
                  <li>• Kotter's 8-Step Change Model</li>
                  <li>• Overcoming organizational resistance</li>
                  <li>• Psychological safety in problem reporting</li>
                  <li>• Servant Leadership principles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" /> 5. Lean Supply Chain & Logistics
          </h3>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 mb-4">
              Extending Lean principles beyond the four walls of the organization to the entire value network.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <h5 className="font-bold text-slate-800">Supplier Integration</h5>
                <p className="text-sm text-slate-600 mt-1">JIT delivery, supplier Kanban, and collaborative forecasting (CPFR).</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 py-2">
                <h5 className="font-bold text-slate-800">Lean Warehousing</h5>
                <p className="text-sm text-slate-600 mt-1">Cross-docking, optimized slotting, and visual management in distribution centers.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h5 className="font-bold text-slate-800">Risk Management</h5>
                <p className="text-sm text-slate-600 mt-1">Balancing Lean (low inventory) with supply chain resilience and agility.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-indigo-600" /> 6. Lean Product & Process Development (LPPD)
          </h3>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="text-slate-700 mb-4">
              Applying Lean to the R&D and engineering phases to create profitable value streams from the start.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3"><span className="font-bold text-indigo-600">Set-Based Concurrent Engineering:</span> <span className="text-sm text-slate-700">Exploring multiple design alternatives simultaneously rather than iterating on a single design.</span></li>
              <li className="flex gap-3"><span className="font-bold text-indigo-600">Chief Engineer System:</span> <span className="text-sm text-slate-700">A strong, entrepreneurial leader responsible for the entire product value stream.</span></li>
              <li className="flex gap-3"><span className="font-bold text-indigo-600">Knowledge Reuse:</span> <span className="text-sm text-slate-700">Capturing and standardizing engineering knowledge (A3s, trade-off curves) to accelerate future development.</span></li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'lean-metrics',
    title: 'Lean Metrics & KPIs (MSc Level)',
    icon: BarChart,
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">1. Time-Based Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
              <h4 className="font-bold text-indigo-900 mb-2">Takt Time</h4>
              <p className="text-sm text-slate-600 mb-3">The rate at which a product must be completed to meet customer demand.</p>
              <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-800">
                Takt = Available Time / Customer Demand
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
              <h4 className="font-bold text-emerald-900 mb-2">Cycle Time</h4>
              <p className="text-sm text-slate-600 mb-3">The time it takes to complete one task from start to finish.</p>
              <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-800">
                Cycle Time = Net Production Time / Units Produced
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-amber-500">
              <h4 className="font-bold text-amber-900 mb-2">Lead Time</h4>
              <p className="text-sm text-slate-600 mb-3">The total time from when a customer places an order to when they receive it.</p>
              <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-800">
                Lead Time = Order Processing + Mfg + Delivery
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">2. Overall Equipment Effectiveness (OEE)</h3>
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
            <p className="text-slate-300 mb-4">OEE is the gold standard for measuring manufacturing productivity. An OEE score of 100% means you are manufacturing only Good Parts, as fast as possible, with no Stop Time.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center font-bold text-lg">
              <div className="bg-slate-700 p-4 rounded-lg w-full">Availability<div className="text-sm font-normal text-slate-400 mt-1">Operating Time / Planned Time</div></div>
              <div className="text-slate-500">×</div>
              <div className="bg-slate-700 p-4 rounded-lg w-full">Performance<div className="text-sm font-normal text-slate-400 mt-1">Ideal Cycle Time / Actual Cycle Time</div></div>
              <div className="text-slate-500">×</div>
              <div className="bg-slate-700 p-4 rounded-lg w-full">Quality<div className="text-sm font-normal text-slate-400 mt-1">Good Count / Total Count</div></div>
              <div className="text-slate-500">=</div>
              <div className="bg-indigo-600 p-4 rounded-lg w-full text-white">OEE<div className="text-sm font-normal text-indigo-200 mt-1">World Class: 85%</div></div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">3. Quality Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
              <h4 className="font-bold text-red-900 mb-2">First Pass Yield (FPY)</h4>
              <p className="text-sm text-red-800 mb-2">The percentage of units that complete a process and meet quality guidelines without being scrapped, rerun, retested, returned or diverted into an offline repair area.</p>
            </div>
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <h4 className="font-bold text-purple-900 mb-2">Rolled Throughput Yield (RTY)</h4>
              <p className="text-sm text-purple-800 mb-2">The probability that a single unit can pass through a series of process steps free of defects. Calculated by multiplying the FPY of each individual step.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'toyota-way',
    title: 'The Toyota Way (14 Principles)',
    icon: Award,
    content: (
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            The Toyota Way is a comprehensive expression of the company's management philosophy, categorized into four main sections: Philosophy, Process, People/Partners, and Problem Solving (The 4P Model).
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-indigo-900 text-xl mb-3">Section I: Long-Term Philosophy</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Principle 1:</strong> Base your management decisions on a long-term philosophy, even at the expense of short-term financial goals.</li>
              </ul>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-emerald-900 text-xl mb-3">Section II: The Right Process Will Produce the Right Results</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Principle 2:</strong> Create continuous process flow to bring problems to the surface.</li>
                <li><strong>Principle 3:</strong> Use "pull" systems to avoid overproduction.</li>
                <li><strong>Principle 4:</strong> Level out the workload (Heijunka). Work like the tortoise, not the hare.</li>
                <li><strong>Principle 5:</strong> Build a culture of stopping to fix problems, to get quality right the first time (Jidoka).</li>
                <li><strong>Principle 6:</strong> Standardized tasks are the foundation for continuous improvement and employee empowerment.</li>
                <li><strong>Principle 7:</strong> Use visual control so no problems are hidden.</li>
                <li><strong>Principle 8:</strong> Use only reliable, thoroughly tested technology that serves your people and processes.</li>
              </ul>
            </div>

            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-bold text-amber-900 text-xl mb-3">Section III: Add Value to the Organization by Developing Your People and Partners</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Principle 9:</strong> Grow leaders who thoroughly understand the work, live the philosophy, and teach it to others.</li>
                <li><strong>Principle 10:</strong> Develop exceptional people and teams who follow your company's philosophy.</li>
                <li><strong>Principle 11:</strong> Respect your extended network of partners and suppliers by challenging them and helping them improve.</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-bold text-red-900 text-xl mb-3">Section IV: Continuously Solving Root Problems Drives Organizational Learning</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Principle 12:</strong> Go and see for yourself to thoroughly understand the situation (Genchi Genbutsu).</li>
                <li><strong>Principle 13:</strong> Make decisions slowly by consensus, thoroughly considering all options; implement decisions rapidly (Nemawashi).</li>
                <li><strong>Principle 14:</strong> Become a learning organization through relentless reflection (Hansei) and continuous improvement (Kaizen).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'lean-accounting',
    title: 'Lean Accounting & Finance',
    icon: TrendingUp,
    content: (
      <div className="space-y-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">1. Traditional vs. Lean Accounting</h3>
          <p className="text-slate-700 mb-4">Traditional standard cost accounting can actually motivate non-Lean behavior (like overproducing to absorb overhead). Lean Accounting provides accurate, timely, and understandable financial information to support Lean transformation.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
              <h4 className="font-bold text-red-800 mb-2">Traditional Accounting</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Complex standard costing</li>
                <li>• Encourages large batch production</li>
                <li>• Tracks variances (labor, material)</li>
                <li>• Financial reports are difficult for non-accountants to understand</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
              <h4 className="font-bold text-emerald-800 mb-2">Lean Accounting</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Value Stream Costing</li>
                <li>• Encourages flow and pull</li>
                <li>• Tracks actual costs at the value stream level</li>
                <li>• Plain English financial statements</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 text-xl mb-3">2. Value Stream Costing</h3>
            <p className="text-sm text-indigo-800 mb-3">
              Instead of tracking costs by department, costs are tracked by value stream. This includes all costs associated with the value stream (labor, materials, machines, support staff) without complex overhead allocations.
            </p>
            <p className="text-sm text-indigo-800 font-medium">Benefits:</p>
            <ul className="text-sm text-indigo-800 list-disc pl-5 mt-1">
              <li>Easy to understand</li>
              <li>Provides timely information</li>
              <li>Highlights the financial impact of Lean improvements</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h3 className="font-bold text-amber-900 text-xl mb-3">3. The Box Score</h3>
            <p className="text-sm text-amber-800 mb-3">
              A standard Lean Accounting report that shows a value stream's operational and financial performance on a single page.
            </p>
            <p className="text-sm text-amber-800 font-medium">Typically includes 3 sections:</p>
            <ul className="text-sm text-amber-800 list-disc pl-5 mt-1">
              <li><strong>Operational Performance:</strong> Dock-to-dock time, First Time Right, Floor space.</li>
              <li><strong>Capacity:</strong> Productive vs. Non-productive vs. Available capacity.</li>
              <li><strong>Financial Performance:</strong> Revenue, Material Cost, Conversion Cost, Value Stream Profit.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'spc-six-sigma',
    title: 'Statistical Process Control & Six Sigma',
    icon: Activity,
    content: (
      <div className="space-y-8">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-2xl mb-3 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" /> Statistical Process Control (SPC)
          </h3>
          <p className="text-slate-300 mb-4">
            SPC is an industry-standard methodology for measuring and controlling quality during the manufacturing process. Quality data is collected in the form of product or process measurements or readings from various machines or instrumentation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-bold text-cyan-300 mb-2">Common Cause Variation</h4>
              <p className="text-sm text-slate-400">Natural, expected, historical variation in a process. It is predictable within statistical limits.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-bold text-red-400 mb-2">Special Cause Variation</h4>
              <p className="text-sm text-slate-400">Unexpected variation resulting from unusual occurrences. It indicates an out-of-control process.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">Control Charts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 mb-1">X-Bar & R Chart</h4>
              <p className="text-xs text-slate-600">Used for continuous data (variables) when subgroup size is small (e.g., 2-9). Tracks the mean and range.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 mb-1">X-Bar & S Chart</h4>
              <p className="text-xs text-slate-600">Used for continuous data when subgroup size is large (10+). Tracks the mean and standard deviation.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-emerald-700 mb-1">P-Chart</h4>
              <p className="text-xs text-slate-600">Used for attribute data (pass/fail). Tracks the proportion of defective units in varying sample sizes.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-emerald-700 mb-1">C-Chart</h4>
              <p className="text-xs text-slate-600">Used for attribute data. Tracks the number of defects per unit when the sample size is constant.</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 text-xl mb-4">Six Sigma Belts & Roles</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-yellow-400 shrink-0"></div><span className="text-indigo-900"><strong>Yellow Belt:</strong> Basic understanding, participates as a project team member.</span></li>
            <li className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-green-600 shrink-0"></div><span className="text-indigo-900"><strong>Green Belt:</strong> Leads simple projects, assists Black Belts with data collection and analysis.</span></li>
            <li className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-black shrink-0"></div><span className="text-indigo-900"><strong>Black Belt:</strong> Full-time project leader, highly trained in statistical analysis and change management.</span></li>
            <li className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-slate-400 shrink-0"></div><span className="text-indigo-900"><strong>Master Black Belt:</strong> Trains and coaches Black Belts, works with leadership on strategy.</span></li>
            <li className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-blue-600 shrink-0"></div><span className="text-indigo-900"><strong>Champion:</strong> Executive sponsor who removes barriers and ensures alignment with business goals.</span></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'lean-supply-chain',
    title: 'Lean Supply Chain & Logistics',
    icon: Network,
    content: (
      <div className="space-y-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-xl mb-4 border-b pb-2">1. Extending Lean Beyond the Factory</h3>
          <p className="text-slate-700 mb-4">A Lean Supply Chain applies Lean principles (eliminating waste, creating flow, establishing pull) across the entire value stream, from raw material extraction to the final customer. It requires deep collaboration and transparency between organizations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h4 className="font-bold text-indigo-800 mb-2">Supplier Integration</h4>
              <p className="text-sm text-slate-600">Treating suppliers as partners. Sharing forecasts, production schedules, and even engineering resources to reduce lead times and improve quality.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h4 className="font-bold text-indigo-800 mb-2">JIT Logistics</h4>
              <p className="text-sm text-slate-600">Frequent, small-lot deliveries (e.g., milk runs) instead of large, infrequent shipments. Reduces inventory holding costs and space requirements.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h4 className="font-bold text-indigo-800 mb-2">Lean Warehousing</h4>
              <p className="text-sm text-slate-600">Applying 5S, visual management, and standardized work to distribution centers. Minimizing travel time and touches.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
          <h3 className="font-bold text-amber-900 text-xl mb-3">2. The Bullwhip Effect & Lean Mitigation</h3>
          <p className="text-sm text-amber-800 mb-3">
            The Bullwhip Effect is the phenomenon where small fluctuations in retail demand cause progressively larger fluctuations in demand further up the supply chain.
          </p>
          <p className="text-sm text-amber-800 font-medium">Lean Solutions:</p>
          <ul className="text-sm text-amber-800 list-disc pl-5 mt-1 space-y-1">
            <li><strong>Information Sharing:</strong> Real-time point-of-sale (POS) data shared with all tiers.</li>
            <li><strong>Smaller Batch Sizes:</strong> Reduces the "lumpiness" of orders.</li>
            <li><strong>Every Part Every Interval (EPEI):</strong> Leveling production (Heijunka) to create steady, predictable demand for suppliers.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'lppd',
    title: 'Lean Product & Process Development (LPPD)',
    icon: Lightbulb,
    content: (
      <div className="space-y-8">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-2xl mb-3 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" /> LPPD Principles
          </h3>
          <p className="text-slate-300 mb-4">
            Lean is not just for manufacturing. LPPD focuses on creating profitable value streams by developing products and their manufacturing processes simultaneously. It aims to reduce time-to-market while maximizing customer value.
          </p>
          
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-bold text-cyan-300 mb-2">1. The Chief Engineer System</h4>
              <p className="text-sm text-slate-400">A heavyweight project manager (Chief Engineer) who is responsible for the product's entire lifecycle, from concept to profitability. They have absolute authority over the product vision but lead through influence, not formal authority over the engineers.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-bold text-emerald-400 mb-2">2. Set-Based Concurrent Engineering (SBCE)</h4>
              <p className="text-sm text-slate-400">Instead of picking one design early and iterating (Point-Based), teams develop multiple alternative designs (sets) simultaneously. They gradually narrow down the options based on testing and data, making the final decision late in the process. This prevents costly late-stage redesigns.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-bold text-purple-400 mb-2">3. Cadence and Flow</h4>
              <p className="text-sm text-slate-400">Establishing a steady rhythm for development activities. Using visual management (like Obeya rooms) to track progress, identify bottlenecks, and ensure cross-functional alignment.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'lean-leadership',
    title: 'Lean Leadership & Change Management',
    icon: Users,
    content: (
      <div className="space-y-8">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 text-xl mb-4 border-b border-indigo-200 pb-2">1. The Role of a Lean Leader</h3>
          <p className="text-indigo-800 mb-4">In a Lean organization, the leader's role shifts from a traditional "command and control" director to a coach and facilitator. The primary job of a Lean leader is to develop people.</p>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-indigo-200 p-1 rounded-full shrink-0"><CheckSquare className="w-3 h-3 text-indigo-700" /></div>
              <div>
                <strong className="text-indigo-900">Go to Gemba:</strong> Leaders must spend time where the value is created to understand the actual situation, not just rely on reports.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-indigo-200 p-1 rounded-full shrink-0"><CheckSquare className="w-3 h-3 text-indigo-700" /></div>
              <div>
                <strong className="text-indigo-900">Lead with Respect:</strong> Challenging employees to improve while providing the support and psychological safety needed to fail and learn.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-indigo-200 p-1 rounded-full shrink-0"><CheckSquare className="w-3 h-3 text-indigo-700" /></div>
              <div>
                <strong className="text-indigo-900">Ask "Why?", Not "Who?":</strong> When problems occur, focus on fixing the system, not blaming the individual.
              </div>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xl mb-3">2. Hoshin Kanri (Policy Deployment)</h3>
            <p className="text-sm text-slate-600 mb-3">
              A strategic planning process that aligns the entire organization around a few key breakthrough objectives.
            </p>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li><strong>Catchball:</strong> A back-and-forth dialogue between management levels to ensure goals are realistic and understood.</li>
              <li><strong>Alignment:</strong> Ensures daily improvement activities (Kaizen) are aligned with long-term strategic goals.</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xl mb-3">3. Managing Cultural Transformation</h3>
            <p className="text-sm text-slate-600 mb-3">
              Implementing Lean tools without changing the culture will fail. True Lean transformation requires a fundamental shift in mindset.
            </p>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li><strong>Communicate the "Why":</strong> People need to understand the burning platform and the vision for the future.</li>
              <li><strong>Celebrate Small Wins:</strong> Build momentum by recognizing early successes.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'beginners',
    title: 'Lean for Beginners',
    icon: Target,
    content: (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-2xl mb-6">Important Starting Points</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Lean is a culture, not just a tool.',
              'Start small – pilot improvements in one area.',
              'Measure everything – what gets measured gets improved.',
              'Standardize before optimizing.',
              'Engage employees at all levels.',
              'Focus on value from the customer perspective.',
              'Develop leadership at every level.',
              'Sustain improvements through monitoring and audits.'
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 p-1 rounded-full shrink-0"><CheckSquare className="w-3 h-3 text-white" /></div>
                <span className="font-medium text-indigo-50">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-xl mb-6 border-b pb-2">Lean Implementation Steps for Beginners</h3>
          <div className="space-y-3">
            {[
              'Start with leadership commitment.',
              'Train teams on Lean basics.',
              'Identify one pilot process.',
              'Map the current process (Value Stream Mapping).',
              'Identify waste and improvement opportunities.',
              'Implement improvements.',
              'Measure results using KPIs.',
              'Standardize and sustain improvements.',
              'Scale across departments.'
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
              >
                <div className="w-8 h-8 shrink-0 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">{i + 1}</div>
                <span className="text-slate-800 font-medium">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

export default function Content5S() {
  const [activeTab, setActiveTab] = useState(leanTopics[0].id);

  return (
    <PageWrapper>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lean Management Program</h1>
        <p className="text-slate-500 mt-2">Comprehensive degree-level content on Lean methodologies.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 shrink-0 space-y-2">
          {leanTopics.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left',
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0">
          {leanTopics.map((item) => {
            if (activeTab !== item.id) return null;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                </div>
                {item.content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
