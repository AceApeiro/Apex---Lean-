import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BookOpen, History, RefreshCw, Layout, CheckSquare, Target, Lightbulb, Users, ShieldAlert, Award, ListChecks, Kanban, TrendingUp, Sparkles } from 'lucide-react';
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
          {leanTopics.map((item) => (
            activeTab === item.id && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                </div>
                {item.content}
              </motion.div>
            )
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
