import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PageWrapper } from '../components/PageWrapper';
import { Trophy, Plus, ExternalLink, Trash2, Presentation, Globe, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';

interface TrophyItem {
  id: string;
  title: string;
  description: string;
  type: 'presentation' | 'webpage';
  url: string;
  thumbnail?: string;
  createdAt: any;
}

export function HallOfFame() {
  const { isAdmin } = useAuth();
  const [trophies, setTrophies] = useState<TrophyItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTrophy, setNewTrophy] = useState({
    title: '',
    description: '',
    type: 'presentation' as 'presentation' | 'webpage',
    url: '',
    thumbnail: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'trophies'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trophyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TrophyItem[];
      setTrophies(trophyData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTrophy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrophy.title || !newTrophy.url) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, 'trophies', editingId), {
          title: newTrophy.title,
          description: newTrophy.description,
          type: newTrophy.type,
          url: newTrophy.url,
          thumbnail: newTrophy.thumbnail
        });
      } else {
        await addDoc(collection(db, 'trophies'), {
          ...newTrophy,
          createdAt: serverTimestamp()
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setNewTrophy({ title: '', description: '', type: 'presentation', url: '', thumbnail: '' });
    } catch (error) {
      console.error('Error saving trophy:', error);
      alert('Failed to save trophy. Please try again.');
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setNewTrophy(prev => ({ ...prev, thumbnail: dataUrl }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
        break;
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this from the Trophy Hall?')) {
      try {
        await deleteDoc(doc(db, 'trophies', id));
      } catch (error) {
        console.error('Error deleting trophy:', error);
      }
    }
  };

  const handleEdit = (trophy: TrophyItem) => {
    setEditingId(trophy.id);
    setNewTrophy({
      title: trophy.title,
      description: trophy.description || '',
      type: trophy.type,
      url: trophy.url,
      thumbnail: trophy.thumbnail || ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to format Google Slides URL for embedding
  const getEmbedUrl = (url: string, type: string) => {
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (type === 'presentation' && formattedUrl.includes('docs.google.com/presentation')) {
      return formattedUrl.replace(/\/edit.*$/, '/embed?start=false&loop=false&delayms=3000');
    }
    return formattedUrl;
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Hall of Fame
          </h1>
          <p className="text-slate-600 mt-2">Celebrate our achievements and view project presentations.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              if (isAdding) {
                setEditingId(null);
                setNewTrophy({ title: '', description: '', type: 'presentation', url: '', thumbnail: '' });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {isAdding && !editingId ? 'Cancel' : 'Add Trophy'}
          </button>
        )}
      </div>

      {isAdding && isAdmin && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8"
          onSubmit={handleAddTrophy}
          onPaste={handlePaste}
        >
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Trophy / Presentation' : 'Add New Trophy / Presentation'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={newTrophy.title}
                onChange={e => setNewTrophy({...newTrophy, title: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Q1 Lean Achievements"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={newTrophy.type}
                onChange={e => setNewTrophy({...newTrophy, type: e.target.value as 'presentation' | 'webpage'})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="presentation">Presentation (Google Slides)</option>
                <option value="webpage">Webpage Widget</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
              <input
                type="url"
                required
                value={newTrophy.url}
                onChange={e => setNewTrophy({...newTrophy, url: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={newTrophy.type === 'presentation' ? "https://docs.google.com/presentation/d/..." : "https://example.com"}
              />
              <p className="text-xs text-slate-500 mt-1">
                {newTrophy.type === 'presentation' 
                  ? "For PPTs, please upload to Google Slides and paste the link here. Make sure the link is set to 'Anyone with the link can view'."
                  : "Enter the full URL of the webpage. Note: Some sites (like Google) block embedding for security reasons."}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea
                value={newTrophy.description}
                onChange={e => setNewTrophy({...newTrophy, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail Screenshot (Optional)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <span className="text-xs text-slate-400 whitespace-nowrap">Or paste an image (Ctrl+V)</span>
              </div>
              {newTrophy.thumbnail && (
                <div className="mt-3 relative inline-block">
                  <img src={newTrophy.thumbnail} alt="Thumbnail preview" className="h-32 rounded-lg border border-slate-200 object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewTrophy(prev => ({ ...prev, thumbnail: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewTrophy({ title: '', description: '', type: 'presentation', url: '', thumbnail: '' });
              }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingId ? 'Update Trophy' : 'Save Trophy'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {trophies.map((trophy) => (
          <motion.div
            key={trophy.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            {trophy.thumbnail && (
              <div className="w-full h-48 sm:h-64 bg-slate-100 border-b border-slate-200 relative">
                <img 
                  src={trophy.thumbnail} 
                  alt={`${trophy.title} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${trophy.type === 'presentation' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {trophy.type === 'presentation' ? <Presentation className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{trophy.title}</h3>
                  {trophy.description && <p className="text-sm text-slate-500 mt-1">{trophy.description}</p>}
                  <a 
                    href={trophy.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline mt-1.5 block truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
                    title={trophy.url}
                  >
                    {trophy.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={trophy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleEdit(trophy)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trophy.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 bg-slate-100 min-h-[300px] relative">
              <iframe
                src={getEmbedUrl(trophy.url, trophy.type)}
                className="absolute inset-0 w-full h-full border-0 bg-white"
                allowFullScreen
                title={trophy.title}
              />
            </div>
          </motion.div>
        ))}

        {trophies.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Trophy Hall is Empty</h3>
            <p className="text-slate-500 mt-1">Add presentations and webpages to showcase your team's achievements.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
