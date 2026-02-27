import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, FileText, Save, Trash2 } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

interface ActionItem {
  id: string;
  text: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Minute {
  id: number;
  date: string;
  time: string;
  attendees: string;
  discussion: string;
  actionItems: ActionItem[];
}

const INITIAL_MINUTES: Minute[] = [];

export default function WeeklyMinutes() {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMinute, setNewMinute] = useState({
    date: '',
    time: '',
    attendees: '',
    discussion: '',
    actionItems: ''
  });

  useEffect(() => {
    const fetchMinutes = async () => {
      try {
        const response = await fetch('/api/minutes');
        if (response.ok) {
          const data = await response.json();
          const parsedData = data.map((m: any) => ({
            ...m,
            actionItems: typeof m.actionItems === 'string' ? JSON.parse(m.actionItems) : m.actionItems
          }));
          setMinutes(parsedData.length > 0 ? parsedData : INITIAL_MINUTES);
        } else {
          setMinutes(INITIAL_MINUTES);
        }
      } catch (e) {
        console.error('Failed to fetch minutes', e);
        setMinutes(INITIAL_MINUTES);
      }
      setLoading(false);
    };
    
    fetchMinutes();
    const interval = setInterval(fetchMinutes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async () => {
    if (newMinute.date && newMinute.discussion) {
      const actionItemsArray: ActionItem[] = newMinute.actionItems
        .split('\n')
        .filter(item => item.trim() !== '')
        .map((text, i) => ({
          id: `${Date.now()}-${i}`,
          text: text.trim(),
          status: 'Pending'
        }));

      try {
        const response = await fetch('/api/minutes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newMinute, actionItems: actionItemsArray })
        });
        if (response.ok) {
          const savedMinute = await response.json();
          setMinutes([{ ...savedMinute, actionItems: actionItemsArray }, ...minutes]);
          setIsAdding(false);
          setNewMinute({ date: '', time: '', attendees: '', discussion: '', actionItems: '' });
        }
      } catch (e) {
        console.error('Failed to save minute', e);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete these minutes?')) {
      try {
        await fetch(`/api/minutes/${id}`, { method: 'DELETE' });
        setMinutes(minutes.filter(m => m.id !== id));
      } catch (e) {
        console.error('Failed to delete minute', e);
      }
    }
  };

  const toggleActionStatus = async (minuteId: number, actionId: string) => {
    setMinutes(currentMinutes => {
      const minute = currentMinutes.find(m => m.id === minuteId);
      if (!minute) return currentMinutes;

      const newActionItems = minute.actionItems.map(item => {
        if (item.id === actionId) {
          const nextStatus = item.status === 'Pending' ? 'In Progress' : item.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...item, status: nextStatus as 'Pending' | 'In Progress' | 'Completed' };
        }
        return item;
      });

      // Fire and forget the API call
      fetch(`/api/minutes/${minuteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionItems: newActionItems })
      }).catch(e => console.error('Failed to update action item status', e));

      return currentMinutes.map(m => m.id === minuteId ? { ...m, actionItems: newActionItems } : m);
    });
  };

  if (loading) return null;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Weekly Minutes</h1>
          <p className="text-slate-500 mt-2">Record and track weekly QA001 meeting minutes and action items.</p>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Minutes
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">New Meeting Minutes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Date
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
            <label className="text-sm font-medium text-slate-700">Action Items</label>
            <textarea
              rows={3}
              value={newMinute.actionItems}
              onChange={(e) => setNewMinute({ ...newMinute, actionItems: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Minutes
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {minutes.map((minute) => (
          <div key={minute.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group">
            <button 
              onClick={() => handleDelete(minute.id)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-14">
              <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {minute.date}</span>
                {minute.time && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {minute.time}</span>}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">Attendees:</span> {minute.attendees}
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Discussion</h3>
                <div className="text-slate-700 text-sm leading-relaxed space-y-1">
                  {minute.discussion.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Action Items</h3>
                <div className="text-slate-700 text-sm leading-relaxed space-y-2">
                  {minute.actionItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <button
                        onClick={() => toggleActionStatus(minute.id, item.id)}
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
                </div>
              </div>
            </div>
          </div>
        ))}
        {minutes.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No meeting minutes recorded yet.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
