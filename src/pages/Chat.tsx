import React, { useState, useEffect, useRef } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Send, User, LogOut, Phone, X } from 'lucide-react';

interface Message {
  id: number;
  email: string;
  content: string;
  created_at: string;
}

export default function Chat() {
  const [email, setEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('chat_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onopen = () => {
      console.log('Connected to chat server');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'init') {
          setMessages(data.messages);
        } else if (data.type === 'new_message') {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from chat server');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      localStorage.setItem('chat_email', email.trim());
      setIsLoggedIn(true);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_email');
    setIsLoggedIn(false);
    setEmail('');
    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({
      type: 'message',
      email,
      content: newMessage.trim()
    }));

    setNewMessage('');
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone.trim() || !smsMessage.trim()) return;

    setIsSendingSms(true);
    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: smsPhone,
          message: `[Team Apex] ${email.split('@')[0]}: ${smsMessage}`
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('SMS sent successfully!');
        setShowSmsModal(false);
        setSmsMessage('');
      } else {
        alert(`Failed to send SMS: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('An unexpected error occurred while sending SMS.');
    } finally {
      setIsSendingSms(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isLoggedIn) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Team Chat</h1>
            <p className="text-slate-500 mt-2">Enter your email to join the conversation</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Team Chat</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Connected as {email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmsModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Send SMS</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <User className="w-12 h-12 mb-4 opacity-20" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.email === email;
              const showHeader = index === 0 || messages[index - 1].email !== msg.email;
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {showHeader && (
                    <span className="text-xs font-medium text-slate-500 mb-1 px-1">
                      {isMe ? 'You' : msg.email.split('@')[0]}
                    </span>
                  )}
                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                className="w-full max-h-32 min-h-[44px] px-4 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none outline-none transition-all text-sm"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* SMS Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                Send SMS to Sri Lanka
              </h2>
              <button 
                onClick={() => setShowSmsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendSms} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0771234567 or +94771234567"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter a valid Sri Lankan mobile number.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your SMS message here..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  rows={4}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Your email prefix will be added automatically.
                </p>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingSms || !smsPhone.trim() || !smsMessage.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isSendingSms ? 'Sending...' : 'Send SMS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
