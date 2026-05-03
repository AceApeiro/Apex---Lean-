import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Heart, Award, Send, User, CheckSquare, Edit2, Save, X, History } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, logAudit } from '../firebase';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Reactions {
  thumbsUp: number;
  heart: number;
  award: number;
}

interface BlogPost {
  title: string;
  content: string;
  date: string;
}

interface BlogHistory {
  id: string;
  title: string;
  content: string;
  edited_by: string;
  edited_at: string;
}

export default function Blog() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.email?.split('@')[0] || '');
  const [reactions, setReactions] = useState<Reactions>({ thumbsUp: 0, heart: 0, award: 0 });
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [tasks, setTasks] = useState<{id: string, text: string, completed: boolean}[]>([]);
  
  const [post, setPost] = useState<BlogPost>({ title: '', content: '', date: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [history, setHistory] = useState<BlogHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch Comments
    const commentsQuery = query(collection(db, 'blog_comments'), orderBy('timestamp', 'asc'));
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    }, (error) => {
      console.error('Firestore Error fetching comments: ', error);
    });

    // Fetch Reactions
    const reactionsRef = doc(db, 'blog_reactions', 'main');
    const unsubscribeReactions = onSnapshot(reactionsRef, (doc) => {
      if (doc.exists()) {
        setReactions(doc.data() as Reactions);
      }
    }, (error) => {
      console.error('Firestore Error fetching reactions: ', error);
    });

    // Fetch Post
    const postRef = doc(db, 'blog_posts', 'main');
    const unsubscribePost = onSnapshot(postRef, async (docSnap) => {
      if (docSnap.exists()) {
        setPost(docSnap.data() as BlogPost);
      } else {
        // Initialize default post if it doesn't exist
        const defaultPost = {
          title: 'Second Seiri Day Completed',
          content: `Great teamwork and coordination!\n\nNimmi was annoyed she didn't get the opportunity to sing at the Seiri day. Ravira was prepared too with his tabla... he says we missed a treat. Better luck next time guys!\n\n> Sumudu has recovered from Dengue, at least he says so... Some say it was a miracle and the platelet increase was a result of the fright of the catheter... this could definitely be looked at as a cure... wonder if Mr. Namal will consider this a KPI. Way to go APEX!`,
          date: 'March 20, 2026'
        };
        try {
          await setDoc(postRef, defaultPost);
          setPost(defaultPost);
        } catch (e) {
          console.error('Failed to initialize default post', e);
        }
      }
    }, (error) => {
      console.error('Firestore Error fetching post: ', error);
    });

    // Fetch Tasks
    const tasksQuery = query(collection(db, 'blog_tasks'), orderBy('id', 'asc'));
    const unsubscribeTasks = onSnapshot(tasksQuery, async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default tasks
        const defaultTasks = [
          { text: 'Quantify progress of the work completed', completed: false },
          { text: 'Ensure continuous growth for smooth transition', completed: false },
          { text: 'Identify loopholes and strategies to overcome them', completed: false },
          { text: 'Devise an execution plan to reach the next goal', completed: false }
        ];
        try {
          for (let i = 0; i < defaultTasks.length; i++) {
            await setDoc(doc(db, 'blog_tasks', `task_${i}`), {
              id: `task_${i}`,
              ...defaultTasks[i]
            });
          }
        } catch (e) {
          console.error('Failed to initialize default tasks', e);
        }
      } else {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {id: string, text: string, completed: boolean})));
      }
    }, (error) => {
      console.error('Firestore Error fetching tasks: ', error);
    });

    // Fetch History
    const historyQuery = query(collection(db, 'blog_post_history'), orderBy('edited_at', 'desc'));
    const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogHistory)));
    }, (error) => {
      console.error('Firestore Error fetching history: ', error);
    });

    const savedUserReactions = localStorage.getItem('blog_user_reactions');
    if (savedUserReactions) {
      try {
        const parsed = JSON.parse(savedUserReactions);
        if (parsed && typeof parsed === 'object') setUserReactions(parsed);
      } catch (e) {
        console.error('Failed to parse user reactions', e);
      }
    }

    return () => {
      unsubscribeComments();
      unsubscribeReactions();
      unsubscribeTasks();
      unsubscribePost();
      unsubscribeHistory();
    };
  }, [user]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    try {
      await addDoc(collection(db, 'blog_comments'), {
        author: authorName.trim(),
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      });
      await logAudit('CREATE_COMMENT', `Added comment by ${authorName.trim()}`);
      setNewComment('');
    } catch (e) {
      console.error('Failed to add comment', e);
    }
  };

  const toggleReaction = async (type: keyof Reactions) => {
    const isReacted = userReactions[type];
    
    const newReactions = {
      ...reactions,
      [type]: isReacted ? Math.max(0, reactions[type] - 1) : reactions[type] + 1
    };
    
    const newUserReactions = {
      ...userReactions,
      [type]: !isReacted
    };

    // Optimistic update
    setReactions(newReactions);
    setUserReactions(newUserReactions);
    localStorage.setItem('blog_user_reactions', JSON.stringify(newUserReactions));

    try {
      await setDoc(doc(db, 'blog_reactions', 'main'), newReactions);
      await logAudit('UPDATE_REACTION', `Toggled reaction ${type}`);
    } catch (e) {
      console.error('Failed to update reactions', e);
      // Revert on failure
      setReactions(reactions);
      setUserReactions(userReactions);
      localStorage.setItem('blog_user_reactions', JSON.stringify(userReactions));
    }
  };

  const toggleTask = async (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const newCompletedState = !taskToToggle.completed;
    
    // Optimistic update
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: newCompletedState } : t);
    setTasks(newTasks);

    try {
      await updateDoc(doc(db, 'blog_tasks', id), { completed: newCompletedState });
      await logAudit('UPDATE_TASK', `Marked task ${id} as ${newCompletedState ? 'completed' : 'pending'}`);
    } catch (e) {
      console.error('Failed to toggle task', e);
      // Revert on failure
      setTasks(tasks);
    }
  };

  const handleSavePost = async () => {
    try {
      const editedBy = user?.email?.split('@')[0] || 'Unknown';
      await updateDoc(doc(db, 'blog_posts', 'main'), {
        title: editTitle,
        content: editContent,
      });
      await addDoc(collection(db, 'blog_post_history'), {
        title: editTitle,
        content: editContent,
        edited_by: editedBy,
        edited_at: new Date().toISOString()
      });
      await logAudit('UPDATE_POST', `Updated blog post "${editTitle}"`);
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to save post', e);
    }
  };

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Apex Blog</h1>
          <p className="text-slate-500 mt-2">Updates, achievements, and strategy sessions.</p>
        </div>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-slate-900 leading-tight border-b border-slate-200 focus:border-blue-500 focus:ring-0 px-0 py-2 bg-transparent"
                  placeholder="Post Title"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[300px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Post Content (Markdown supported)"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSavePost}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <header className="border-b border-slate-100 pb-6 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-3">
                      <span className="bg-blue-50 px-3 py-1 rounded-full">Team Update</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{post.date}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                      {post.title}
                    </h2>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Edit History"
                      >
                        <History className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditTitle(post.title);
                          setEditContent(post.content);
                          setIsEditing(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </header>

                {showHistory && history.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <History className="w-4 h-4" /> Edit History
                    </h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {history.map((h) => (
                        <div key={h.id} className="text-sm text-slate-600 border-l-2 border-slate-300 pl-3 py-1">
                          <p className="font-medium text-slate-800">{h.edited_by}</p>
                          <p className="text-xs text-slate-500">{new Date(h.edited_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prose prose-slate max-w-none text-slate-700 space-y-6 whitespace-pre-wrap">
                  {post.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('> ')) {
                      return (
                        <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
                          <p className="m-0">{paragraph.substring(2)}</p>
                        </div>
                      );
                    }
                    return <p key={idx}>{paragraph}</p>;
                  })}
                </div>
              </>
            )}
          </div>
        </motion.article>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 space-y-6">
            <header className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-3">
                <span className="bg-indigo-50 px-3 py-1 rounded-full">Strategy Session & Review</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">March 3, 2026</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Next "Team - Apex" Training cum Strategy Session & Last Week in Review
              </h2>
            </header>

            <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  📅 Upcoming Session Details
                </h3>
                <div className="relative flex overflow-x-hidden group">
                  <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-2 group-hover:[animation-play-state:paused]">
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Date:</strong> Tuesday, 3rd March 2026
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Event:</strong> "Team - Apex" Training cum strategy session
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Date:</strong> Tuesday, 3rd March 2026
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Event:</strong> "Team - Apex" Training cum strategy session
                    </span>
                  </div>
                  <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-2 group-hover:[animation-play-state:paused]">
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Date:</strong> Tuesday, 3rd March 2026
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Event:</strong> "Team - Apex" Training cum strategy session
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Date:</strong> Tuesday, 3rd March 2026
                    </span>
                    <span className="font-medium text-indigo-900 text-lg">
                      <strong>Event:</strong> "Team - Apex" Training cum strategy session
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Last Week in Review</h3>
              
              <h4 className="text-lg font-semibold text-slate-800 mt-6">Notable Performances During the Last Few Weeks</h4>
              
              <p>
                "Team Apex" did a remarkable job implementing the Sort / Seiri - as per the astute adjudication given by Mr. Namal; and the performance was summed up as a great success. Awesome job "Team Apex" exemplary teamwork and coordination set the platform for a great performance.
              </p>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg my-6">
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">🌟</span>
                    <span>Mature leadership skills shown by <strong>Uthpala</strong> under the awesome guidance of <strong>Nimmi</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">🌟</span>
                    <span>Great work by <strong>Heshani</strong> for keeping everyone motivated and on their toes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">🌟</span>
                    <span><strong>Sumudu</strong> did a wonderful job by making sure all the necessary equipment, tools and goods were sourced and set up on time.</span>
                  </li>
                </ul>
              </div>

              <p className="font-medium text-slate-800">
                Thanks Mr. B and Mr. N for their constant support and advice.
              </p>

              <h4 className="text-lg font-semibold text-slate-800 mt-8">The Next Phase</h4>
              
              <p>
                Next phase: quantifying progress of the work completed and making sure that its continuous growth is achieved to ensure the smooth transition to the next phase; which is maintaining the progress and striving for continuous improvement.
              </p>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 text-amber-900 my-6">
                <p className="font-medium">
                  Complacency can ruin all the hard work so we need to keep the momentum, quantify success and achievements, identify loopholes and strategies to overcome them, and devise an execution plan to reach the next goal and target.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 m-0">Next Phase Execution Plan</h4>
                  <span className="text-sm font-bold text-indigo-600">{progress}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${task.completed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'}`}>
                        {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-left text-sm font-medium ${task.completed ? 'line-through opacity-70' : ''}`}>{task.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-lg font-bold text-center text-indigo-600 mt-8">
                Good Luck to all of us !
              </p>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <button 
                onClick={() => toggleReaction('thumbsUp')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  userReactions.thumbsUp 
                    ? "bg-blue-50 text-blue-600 border-blue-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                <ThumbsUp className={cn("w-4 h-4", userReactions.thumbsUp && "fill-current")} />
                {reactions.thumbsUp}
              </button>
              <button 
                onClick={() => toggleReaction('heart')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  userReactions.heart 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                <Heart className={cn("w-4 h-4", userReactions.heart && "fill-current")} />
                {reactions.heart}
              </button>
              <button 
                onClick={() => toggleReaction('award')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  userReactions.award 
                    ? "bg-amber-50 text-amber-600 border-amber-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                <Award className={cn("w-4 h-4", userReactions.award && "fill-current")} />
                {reactions.award}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-slate-50 p-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Comments ({comments.length})
            </h3>

            <div className="space-y-6 mb-8">
              {comments.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{comment.author}</div>
                        <div className="text-xs text-slate-500">{new Date(comment.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm pl-11">{comment.text}</p>
                  </motion.div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Enter your name"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or feedback..."
                    rows={3}
                    className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || !authorName.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.article>
      </div>
    </PageWrapper>
  );
}
