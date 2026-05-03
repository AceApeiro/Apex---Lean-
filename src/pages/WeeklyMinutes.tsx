import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, FileText, Save, Trash2, Edit2, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, logAudit } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface ActionItem {
  id: string;
  text: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Minute {
  id: string;
  date: string;
  time: string;
  attendees: string;
  discussion: string;
  actionItems: ActionItem[];
  createdAt?: string;
}

const INITIAL_MINUTES = [
  {
    "date": "2026-03-23",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. Further work to be completed on theva's and Steve's X guard apps with the guidance of Mr. N and Mr. B - In Progress\n2. Team members suggestion and recommendations to be noted as well\n3. Also team members were randomly given an attribute of TIMDOWNS to research and present next week. - In progess\n4. Nimmi and Geeth need to prepare separate presentaions on - Pareto Theory and E.I emotional intelligence -  In progess",
    "actionItems": [
      { "id": "csv-0-1", "text": "Improve and finalize theva's and Steve's ideas. Team members to provide their persective. Mr. Nelusha and Mr. B to help and guide with completion", "status": "In Progress" },
      { "id": "csv-0-2", "text": "Nimmi and Geeth need to prepare separate presentaions on - Pareto Theory and E.I emotional intelligence -  In progess", "status": "Pending" },
      { "id": "csv-0-3", "text": "Each team member to research the atttinbute they were give and present them", "status": "In Progress" }
    ]
  },
  {
    "date": "2026-03-16",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. Mr. Namal gave instructions to Steve. Heshani about future plans and operation procedures. Nimmi to be updated by Steve - task\n2. Also Heshani to prepare presentation on DOWNTIME, everyone else to research and learn one attribute of it - completed presentation\n3. Theva to do 5S presentation and Geeth to act as backup\n4. Also Mr. Namal gave strict instructions to use one dashboard as a data source for all tasks\n5. Also pointed out changes required to presentations etc.\n6. A poll to be done Sunday evening for attendance\n7. Theva to do safety first aid and X guard orientation/app with the assistance of Steve\n8. Future db and systems and processes to be part of the AOS - operating system",
    "actionItems": [
      { "id": "csv-2-1", "text": "Theva to do a presentaiotn on 5S. Back up Geeth", "status": "Completed" },
      { "id": "csv-2-2", "text": "Presentation on TIMWOODS by Heshani", "status": "Completed" },
      { "id": "csv-2-3", "text": "Dashboard to be updated with all tasks and used centrally-", "status": "Completed" },
      { "id": "csv-2-4", "text": "Poll to be posted to confirn attendance for monday's meeting  -", "status": "Completed" },
      { "id": "csv-2-5", "text": "Theva to do improve / develop safety first aid and X guard orientation/app with the assistance of Steve", "status": "Completed" },
      { "id": "csv-2-6", "text": "dashboard  to be renames as AOS", "status": "Completed" },
      { "id": "csv-2-7", "text": "Nimmi to be updated with new strategies", "status": "Completed" }
    ]
  },
  {
    "date": "2026-03-13",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. Held a discussion regarding the CCP.\n2. Discussed Steve’s website, which was developed for Lean purposes.\n3. Reviewed monitoring team KPIs along with individual team members.\n4. Assigned Heshani as the communicator for the Lean Steering Team.\n5. Conducted Prabhashi’s meeting and completed a related activity.",
    "actionItems": [
      { "id": "csv-4-1", "text": "content and progeress ti be updated regularly", "status": "Completed" },
      { "id": "csv-4-2", "text": "Categorize new tasks", "status": "Completed" }
    ]
  },
  {
    "date": "2026-03-03",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. An overview of the orientation program was discussed.\n2. The Key Performance Indicators (KPI) and performance expectations were explained and discussed.\n3. The team discussed what is most essential among the Middle Team, Management, and Operations Team. After the discussion, everyone agreed that the Middle Team and Management are the most critical.\n4. The concept of WIIFM (What’s In It For Me) was explained to the team.",
    "actionItems": []
  },
  {
    "date": "2026-02-23",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. It was planned to clean the HR room and the conference room.\n2. Two members attended the HR room cleaning, while four members attended the conference room cleaning and started the work.\n3. During the morning tea break and lunch break, the team sang karaoke songs and spent some enjoyable time together.\n4. In the evening, after finishing the cleaning activities, the team discussed the work done and the events of the day.",
    "actionItems": []
  },
  {
    "date": "2026-02-16",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. Discussed the 5 stage holders.\n2. A Lean Steering Team was appointed. (Steve - Leader, Nelusha - Facilitator, Buveendra & Namal - Advisors)\n3. An activity on the Kindergarten of Problem Solving was assigned.\n4. Roles were assigned for that activity. (Uthpala - Team Leader, Sumudu - Facilitator, Heshani - Communicator)\n5. Started by cleaning the HR department and the conference room.\n6. Conducted a 5S walk in the HR department and the conference room, identified the existing issues, and documented them.",
    "actionItems": [
      { "id": "csv-10-1", "text": "Tasks assignes and the Seiri day to be completed as discussed", "status": "Completed" }
    ]
  },
  {
    "date": "2026-02-09",
    "time": "09:00",
    "attendees": "Team",
    "discussion": "1. Discussed matters related to Operations, the Middle Team, and Top Management.\n2. Reviewed key points from the previous meeting. An activity was assigned to document the discussed points.\n3. Presented gifts to Uthpala and Steve.\n4. Discussed overall productivity and performance matters.\n5. Assigned an activity to Mr. Nelusha.\n6. Steve was instructed to brief the members who were absent last week on the matters discussed during the meeting.\n7. Documented the discussion points from the last meeting.\n8. 2/23/2025\n9. (start seiri day)\n10. It was planned to clean the HR room and the conference room.\n11. Two members attended the HR room cleaning, while four members attended the conference room cleaning and started the work.\n12. During the morning tea break and lunch break, the team sang karaoke songs and spent some enjoyable time together.\n13. In the evening, after finishing the cleaning activities, the team discussed the work done and the events of the day.\n14. 3/3/2025\n15. An overview of the orientation program was discussed.\n16. The Key Performance Indicators (KPI) and performance expectations were explained and discussed.\n17. The team discussed what is most essential among the Middle Team, Management, and Operations Team. After the discussion, everyone agreed that the Middle Team and Management are the most critical.\n18. The concept of WIIFM (What’s In It For Me) was explained to the team.\n19. 9/3/2025\n20. Discussed a value addition point.\n21. Held a discussion regarding the CCP.\n22. Discussed Steve’s website, which was developed for Lean purposes.\n23. Reviewed monitoring team KPIs along with individual team members.\n24. Assigned Heshani as the communicator for the Lean Steering Team.\n25. Conducted Prabhashi’s meeting and completed a related activity.",
    "actionItems": [
      { "id": "csv-12-1", "text": "Mr. Neilusha to conduct Task", "status": "Completed" },
      { "id": "csv-12-2", "text": "Absentees to be updated on new content and learning material", "status": "Pending" }
    ]
  }
];

export default function WeeklyMinutes() {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [viewDate, setViewDate] = useState<Date>(() => {
    // Default to the current month if in the same year, else keep the latest date
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [newMinute, setNewMinute] = useState({
    date: '',
    time: '09:00',
    attendees: 'Team',
    discussion: '',
    actionItems: ''
  });
  const [existingActionItems, setExistingActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'minutes'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default minutes if completely empty
        try {
          for (const min of INITIAL_MINUTES) {
            await addDoc(collection(db, 'minutes'), {
              ...min,
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.error('Failed to initialize default minutes', e);
        }
      } else {
        const minutesData = snapshot.docs.map(doc => {
          const data = doc.data();
          let parsedActionItems = [];
          try {
            parsedActionItems = typeof data.actionItems === 'string' ? JSON.parse(data.actionItems) : data.actionItems;
            if (!Array.isArray(parsedActionItems)) {
              parsedActionItems = [];
            }
          } catch (e) {
            console.error('Failed to parse action items for minute', doc.id, e);
          }
          return {
            id: doc.id,
            date: data.date,
            time: data.time || '',
            attendees: data.attendees || '',
            discussion: data.discussion || '',
            actionItems: parsedActionItems,
            createdAt: data.createdAt
          } as Minute;
        });
        setMinutes(minutesData);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore Error: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const forceLoadData = async () => {
    if (!confirm('This will replace all current minutes with the CSV data. Continue?')) return;
    setLoading(true);
    try {
      // Delete all existing
      for (const m of minutes) {
        await deleteDoc(doc(db, 'minutes', m.id));
      }
      // Add INITIAL_MINUTES
      for (const m of INITIAL_MINUTES) {
        await addDoc(collection(db, 'minutes'), {
          ...m,
          createdAt: new Date().toISOString()
        });
      }
      alert('Data loaded successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to load data');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (newMinute.date && newMinute.discussion) {
      const actionItemsArray: ActionItem[] = newMinute.actionItems
        .split('\n')
        .filter(item => item.trim() !== '')
        .map((text, i) => {
          const existing = existingActionItems.find(item => item.text === text.trim());
          if (existing) return existing;
          return {
            id: `${Date.now()}-${i}`,
            text: text.trim(),
            status: 'Pending'
          };
        });

      try {
        const minuteData = {
          date: newMinute.date,
          time: newMinute.time,
          attendees: newMinute.attendees,
          discussion: newMinute.discussion,
          actionItems: actionItemsArray,
          updatedAt: new Date().toISOString()
        };

        if (editingId) {
          await updateDoc(doc(db, 'minutes', editingId), minuteData);
          await logAudit('UPDATE_MINUTES', `Updated minutes for ${newMinute.date}`);
        } else {
          await addDoc(collection(db, 'minutes'), {
            ...minuteData,
            createdAt: new Date().toISOString()
          });
          await logAudit('CREATE_MINUTES', `Created minutes for ${newMinute.date}`);
        }
        
        setIsAdding(false);
        setEditingId(null);
        setSelectedDate(newMinute.date);
        
        // Update calendar view to the new minute's month
        const [y, m, d] = newMinute.date.split('-');
        setViewDate(new Date(parseInt(y), parseInt(m) - 1, 1));

        setNewMinute({ date: '', time: '09:00', attendees: 'Team', discussion: '', actionItems: '' });
        setExistingActionItems([]);
      } catch (e) {
        console.error('Failed to save minute', e);
        alert('An error occurred while saving minutes.');
      }
    } else {
      alert('Please fill in the required fields: Date and Discussion Points.');
    }
  };

  const handleEdit = (minute: Minute) => {
    setNewMinute({
      date: minute.date,
      time: minute.time || '',
      attendees: minute.attendees || '',
      discussion: minute.discussion,
      actionItems: minute.actionItems.map(item => item.text).join('\n')
    });
    setExistingActionItems(minute.actionItems);
    setEditingId(minute.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const minute = minutes.find(m => m.id === id);
      await deleteDoc(doc(db, 'minutes', id));
      if (minute) {
        await logAudit('DELETE_MINUTES', `Deleted minutes for ${minute.date}`);
      }
      setIsAdding(false);
      setEditingId(null);
      setDeletingId(null);
    } catch (e) {
      console.error('Failed to delete minute', e);
    }
  };

  const toggleActionStatus = async (minuteId: string, actionId: string) => {
    const minute = minutes.find(m => m.id === minuteId);
    if (!minute) return;

    const newActionItems = minute.actionItems.map(item => {
      if (item.id === actionId) {
        const nextStatus = item.status === 'Pending' ? 'In Progress' : item.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...item, status: nextStatus as 'Pending' | 'In Progress' | 'Completed' };
      }
      return item;
    });

    try {
      await updateDoc(doc(db, 'minutes', minuteId), {
        actionItems: newActionItems
      });
      const updatedItem = newActionItems.find(item => item.id === actionId);
      if (updatedItem) {
        await logAudit('UPDATE_ACTION_ITEM', `Updated action item status to ${updatedItem.status}`);
      }
    } catch (error) {
      console.error('Error updating action status:', error);
    }
  };

  const exportToSheets = async (minute: Minute) => {
    const scriptUrl = localStorage.getItem('googleAppsScriptUrl') || window.prompt('Please enter your Google Apps Script Web App URL:\n\nIf you do not have one yet, check the chat for instructions on how to set it up.');
    if (!scriptUrl) return;
    localStorage.setItem('googleAppsScriptUrl', scriptUrl);

    try {
      const payload = {
        date: minute.date,
        time: minute.time,
        attendees: minute.attendees,
        discussion: minute.discussion,
        actionItems: minute.actionItems.map(item => `[${item.status}] ${item.text}`).join('\n')
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      });
      
      alert('Export triggered successfully! Check your Google Sheet in a few moments.');
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export. Please check the console for details and ensure your Apps Script URL is correct.');
    }
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
      setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center font-semibold text-slate-400 text-xs uppercase tracking-wider py-2">{d}</div>
          ))}
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="p-2" />;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasMinute = minutes.some(m => m.date === dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className={cn(
                  "h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-all border relative",
                  isSelected ? "ring-2 ring-indigo-500 ring-offset-2 border-transparent" : "border-slate-100",
                  hasMinute && !isSelected ? "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100" : "",
                  !hasMinute && !isSelected ? "bg-white text-slate-600 hover:bg-slate-50" : "",
                  isSelected && hasMinute ? "bg-indigo-600 text-white" : "",
                  isSelected && !hasMinute ? "bg-slate-800 text-white" : ""
                )}
              >
                <span className="font-medium">{day}</span>
                {hasMinute && (
                  <span className={cn("w-1.5 h-1.5 rounded-full absolute bottom-1.5", isSelected ? "bg-white" : "bg-indigo-400")} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return null;

  const selectedMinuteData = minutes.find(m => m.date === selectedDate);

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Weekly Minutes</h1>
          <p className="text-slate-500 mt-2">Record and track weekly meeting minutes and action items.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingId(null);
              setNewMinute({ date: new Date().toISOString().split('T')[0], time: '09:00', attendees: 'Team', discussion: '', actionItems: '' });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Minutes
          </button>
          
          <button
            onClick={forceLoadData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
            title="Reset and load data from CSV"
          >
            <RefreshCw className="w-4 h-4" />
            Load CSV Data
          </button>
        </div>
      </div>

      {renderCalendar()}

      <div className="space-y-4">
        {isAdding || editingId ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
              {editingId ? 'Edit Meeting Minutes' : 'New Meeting Minutes'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" /> Date
                </label>
                <input
                  type="date"
                  value={newMinute.date}
                  onChange={(e) => setNewMinute({ ...newMinute, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Time
                </label>
                <input
                  type="time"
                  value={newMinute.time}
                  onChange={(e) => setNewMinute({ ...newMinute, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Attendees</label>
              <input
                type="text"
                placeholder="e.g., Namal, Buveendra..."
                value={newMinute.attendees}
                onChange={(e) => setNewMinute({ ...newMinute, attendees: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Discussion Points
              </label>
              <textarea
                rows={4}
                value={newMinute.discussion}
                onChange={(e) => setNewMinute({ ...newMinute, discussion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Action Items (one per line)</label>
              <textarea
                rows={3}
                value={newMinute.actionItems}
                onChange={(e) => setNewMinute({ ...newMinute, actionItems: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewMinute({ date: '', time: '09:00', attendees: 'Team', discussion: '', actionItems: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        ) : selectedMinuteData ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => exportToSheets(selectedMinuteData)}
                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                title="Export to Google Sheets"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEdit(selectedMinuteData)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                title="Edit Minutes"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {deletingId === selectedMinuteData.id ? (
                <div className="flex items-center gap-2 bg-red-50 p-1 rounded-lg">
                  <span className="text-xs text-red-600 font-medium px-2">Delete?</span>
                  <button onClick={() => handleDelete(selectedMinuteData.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">Yes</button>
                  <button onClick={() => setDeletingId(null)} className="p-1 text-slate-600 hover:bg-slate-200 rounded">No</button>
                </div>
              ) : (
                <button 
                  onClick={() => setDeletingId(selectedMinuteData.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Minutes"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-14">
              <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-slate-400" /> {selectedMinuteData.date}</span>
                {selectedMinuteData.time && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {selectedMinuteData.time}</span>}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">Attendees:</span> {selectedMinuteData.attendees}
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Discussion</h3>
                <div className="text-slate-700 text-sm leading-relaxed space-y-1">
                  {selectedMinuteData.discussion.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Action Items</h3>
                <div className="text-slate-700 text-sm leading-relaxed space-y-2">
                  {selectedMinuteData.actionItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <button
                        onClick={() => toggleActionStatus(selectedMinuteData.id, item.id)}
                        className={`mt-0.5 shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
                          item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          item.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {item.status}
                      </button>
                      <span className={item.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  {selectedMinuteData.actionItems.length === 0 && (
                    <p className="text-slate-400 italic text-sm">No action items recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium mb-4">No meeting minutes recorded for {selectedDate}.</p>
            <button
              onClick={() => {
                setEditingId(null);
                setNewMinute({ date: selectedDate, time: '09:00', attendees: 'Team', discussion: '', actionItems: '' });
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Minutes for {selectedDate}
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
