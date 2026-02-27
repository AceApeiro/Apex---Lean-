import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Heart, Award, Send, User, CheckSquare } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../lib/utils';

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

export default function Blog() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [reactions, setReactions] = useState<Reactions>({ thumbsUp: 0, heart: 0, award: 0 });
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Quantify progress of the work completed', completed: false },
    { id: 2, text: 'Ensure continuous growth for smooth transition', completed: false },
    { id: 3, text: 'Identify loopholes and strategies to overcome them', completed: false },
    { id: 4, text: 'Devise an execution plan to reach the next goal', completed: false }
  ]);

  useEffect(() => {
    const savedComments = localStorage.getItem('qa001_blog_comments');
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error('Failed to parse comments', e);
      }
    }

    const savedReactions = localStorage.getItem('qa001_blog_reactions');
    if (savedReactions) {
      try {
        setReactions(JSON.parse(savedReactions));
      } catch (e) {
        console.error('Failed to parse reactions', e);
      }
    }

    const savedUserReactions = localStorage.getItem('qa001_blog_user_reactions');
    if (savedUserReactions) {
      try {
        setUserReactions(JSON.parse(savedUserReactions));
      } catch (e) {
        console.error('Failed to parse user reactions', e);
      }
    }

    const savedTasks = localStorage.getItem('qa001_blog_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
  }, []);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem('qa001_blog_comments', JSON.stringify(newComments));
  };

  const saveReactions = (newReactions: Reactions, newUserReactions: Record<string, boolean>) => {
    setReactions(newReactions);
    setUserReactions(newUserReactions);
    localStorage.setItem('qa001_blog_reactions', JSON.stringify(newReactions));
    localStorage.setItem('qa001_blog_user_reactions', JSON.stringify(newUserReactions));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName.trim(),
      text: newComment.trim(),
      timestamp: new Date().toLocaleString(),
    };

    saveComments([...comments, comment]);
    setNewComment('');
  };

  const toggleReaction = (type: keyof Reactions) => {
    const isReacted = userReactions[type];
    
    const newReactions = {
      ...reactions,
      [type]: isReacted ? Math.max(0, reactions[type] - 1) : reactions[type] + 1
    };
    
    const newUserReactions = {
      ...userReactions,
      [type]: !isReacted
    };

    saveReactions(newReactions, newUserReactions);
  };

  const toggleTask = (id: number) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    localStorage.setItem('qa001_blog_tasks', JSON.stringify(newTasks));
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
                "Team Apex" did a remarkable job implementing the Sort / Seiri - as per the astute adjudication given by Mr. Namal; and the performance was summed up as a great success. Awesome job "Team Apex" exemplary team work and coordination set the platform for a great performance.
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
                Next phase quantifying progress of the work completed and making sure that its continuous growth is achieved to ensure the smooth transition to the next phase; which is maintaining the progress and striving for continuous improvement.
              </p>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 text-amber-900 my-6">
                <p className="font-medium">
                  Complacency can ruin all the hard work so we need to keep the momentum, quantify success and achievements and identify loopholes and strategies to overcome them and devise an execution plan to reach the next goal and target.
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
                        <div className="text-xs text-slate-500">{comment.timestamp}</div>
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
