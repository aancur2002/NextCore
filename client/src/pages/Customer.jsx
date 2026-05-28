import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  FileText,
  Key,
  User,
  LogOut,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Send,
  Star,
  Monitor,
  Calendar,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export function CustomerLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-[var(--border-color)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
          <div className="bg-cyan-500 p-1.5 rounded-lg text-black">
            <Monitor className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-cyan-400 font-mono">CLIENT PORTAL</span>
        </div>

        <nav className="flex-grow p-4 space-y-2 text-sm font-semibold">
          <Link to="/portal" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-cyan-500" /> Dashboard
          </Link>
          <Link to="/portal/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <FileText className="w-5 h-5 text-cyan-500" /> My Tickets
          </Link>
          <Link to="/portal/vault" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <Key className="w-5 h-5 text-cyan-500" /> Stored Devices (Vault)
          </Link>
          <Link to="/portal/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <User className="w-5 h-5 text-cyan-500" /> My Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--border-color)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-950/20 hover:text-red-400 text-[var(--text-muted)] text-sm font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main container */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 glass-panel border-b border-[var(--border-color)] px-6 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-2">
            <Link to="/portal" className="font-extrabold text-cyan-400 tracking-wider text-sm font-mono">PORTAL</Link>
          </div>
          <div className="hidden md:block text-sm font-semibold text-[var(--text-muted)]">
            Welcome back, <span className="text-[var(--text-primary)] font-bold">{user?.name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-card hover:bg-[var(--bg-card)] hover:text-cyan-500 transition-colors border border-[var(--border-color)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link 
              to="/portal/tickets/new" 
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/20"
            >
              <PlusCircle className="w-4 h-4" /> Open Ticket
            </Link>
            <button 
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function CustomerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileData = await api.get('/customers/me/profile');
        setProfile(profileData);
        
        const ticketsData = await api.get('/tickets');
        setTickets(ticketsData);
      } catch (err) {
        console.error('Error fetching customer dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading dashboard...</div>;
  }

  const openTickets = tickets.filter(t => ['Open', 'Assigned', 'In Progress', 'On Hold'].includes(t.status));
  const resolvedTickets = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-[#070a12]">
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-widest">Customer Hub</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Hello, {user?.name}!</h1>
          <p className="text-[var(--text-muted)] text-sm max-w-xl">
            Track your open support requests, view technicians notes, and consult stored AnyDesk credentials below.
          </p>
        </div>
        {/* AMC ribbon */}
        {profile?.amc_status === 'active' && (
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm shadow-cyan-950">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> AMC Coverage Active
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">Open Tickets</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{openTickets.length}</span>
          </div>
          <div className="bg-amber-500/10 p-3.5 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">Resolved (History)</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{resolvedTickets.length}</span>
          </div>
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">AMC Status</span>
            <span className={`text-base font-bold capitalize block ${profile?.amc_status === 'active' ? 'text-cyan-400' : 'text-[var(--text-muted)]'}`}>
              {profile?.amc_status === 'active' ? 'Active' : 'No Active AMC'}
            </span>
            {profile?.amc_end && (
              <span className="text-xxs text-[var(--text-muted)] font-mono">Expires: {new Date(profile.amc_end).toLocaleDateString()}</span>
            )}
          </div>
          <div className="bg-cyan-500/10 p-3.5 rounded-xl text-cyan-400 border border-cyan-500/20">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Tickets List */}
      <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
          <h3 className="font-bold text-[var(--text-primary)]">Active Support Tickets</h3>
          <Link to="/portal/tickets" className="text-xs text-cyan-400 font-semibold hover:underline">
            View All
          </Link>
        </div>

        {openTickets.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">
            No active support tickets. Need help with hardware, CCTV, or WiFi? Click "Open Ticket" above!
          </div>
        ) : (
          <div className="divide-y divide-gray-900">
            {openTickets.slice(0, 3).map((ticket) => (
              <Link 
                key={ticket.id} 
                to={`/portal/tickets/${ticket.id}`}
                className="p-5 flex items-center justify-between hover:bg-[var(--bg-card)] transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{ticket.ticket_number}</span>
                    <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
                      ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      ticket.priority === 'High' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                      'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm group-hover:text-cyan-400 transition-colors">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Category: <span className="text-[var(--text-secondary)] font-medium">{ticket.category}</span> &bull; Assigned Tech: <span className="text-cyan-400">{ticket.assigned_staff_name || 'Dispatch Pending'}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xxs font-bold uppercase ${
                    ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    ticket.status === 'On Hold' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {ticket.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await api.get('/tickets');
        setTickets(data);
      } catch (err) {
        console.error('Error fetching tickets list:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading tickets...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Support Ticket History</h1>
          <p className="text-xs text-[var(--text-muted)]">All your submitted repairs, camera adjustments, and network tickets.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">
            You have not submitted any support tickets yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                  <th className="p-4">Ticket Number</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-cyan-400">{ticket.ticket_number}</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] max-w-xs truncate">{ticket.subject}</td>
                    <td className="p-4 text-[var(--text-secondary)] text-xs">{ticket.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
                        ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                        ticket.priority === 'High' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                        'bg-slate-500/15 text-slate-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xxs uppercase font-bold ${
                        ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ticket.status === 'Closed' ? 'bg-slate-800 text-slate-400' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[var(--text-muted)]">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/portal/tickets/${ticket.id}`}
                        className="px-3 py-1 rounded bg-[var(--bg-card)] hover:bg-cyan-500 hover:text-black font-semibold text-xs transition-colors"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomerTicketDetail() {
  const { id } = useParamsWrapper(); // We will implement a small helper for this to avoid hook parsing issues.
  const [ticketData, setTicketData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [error, setError] = useState('');

  // Workaround: React router match params
  const pathParts = window.location.pathname.split('/');
  const ticketId = pathParts[pathParts.length - 1];

  const fetchTicket = async () => {
    try {
      const data = await api.get(`/tickets/${ticketId}`);
      setTicketData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/tickets/${ticketId}/updates`, { message: commentText, is_public: true });
      setCommentText('');
      await fetchTicket(); // reload comments & status
    } catch (err) {
      alert(err.message || 'Failed to post reply.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePostFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await api.post(`/tickets/${ticketId}/feedback`, { rating: feedbackRating, comment: feedbackComment });
      setFeedbackComment('');
      await fetchTicket(); // reload feedback status
      alert('Thank you for your rating!');
    } catch (err) {
      alert(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading ticket status...</div>;
  }

  if (error || !ticketData) {
    return <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">{error || 'Ticket not found.'}</div>;
  }

  const { ticket, updates, feedback } = ticketData;

  // Determine timeline checkmarks
  const statuses = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const currentStatusIdx = statuses.indexOf(ticket.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Main Details and Comments */}
      <div className="lg:col-span-2 space-y-6">
        {/* Main Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
              {ticket.ticket_number}
            </span>
            <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
              ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400' : 'bg-slate-800 text-[var(--text-muted)]'
            }`}>
              {ticket.priority} Priority
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">{ticket.subject}</h2>
          
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>

          <div className="text-xs text-[var(--text-muted)] flex gap-4">
            <span>Opened: <b className="text-[var(--text-secondary)]">{new Date(ticket.created_at).toLocaleString()}</b></span>
            <span>Category: <b className="text-cyan-400">{ticket.category}</b></span>
          </div>
        </div>

        {/* Real-time visual timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
          <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wide font-mono text-cyan-400">Live Support Timeline</h3>
          
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
            {/* Horizontal Line background for desktop */}
            <div className="absolute top-8 left-6 right-6 h-0.5 bg-[var(--bg-card)] hidden sm:block -z-10" />

            {statuses.map((status, idx) => {
              const isActive = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div key={status} className="flex sm:flex-col items-center gap-3 sm:text-center z-10 w-full sm:w-auto">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                    isCurrent ? 'bg-cyan-500 border-cyan-400 text-black shadow-md shadow-cyan-900/40' :
                    isActive ? 'bg-slate-900 border-cyan-500/50 text-cyan-400' :
                    'bg-slate-950 border-[var(--border-color)] text-gray-600'
                  }`}>
                    {isActive ? '✓' : idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <span className={`block text-xs font-bold font-mono uppercase tracking-wider ${isActive ? 'text-[var(--text-primary)]' : 'text-gray-600'}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Updates Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-6">
          <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wide font-mono text-cyan-400">Technician Discussion Feed</h3>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {updates.length === 0 ? (
              <div className="text-center py-6 text-[var(--text-muted)] text-xs">
                No updates or comments yet. You can submit a reply to message the technician below.
              </div>
            ) : (
              updates.map((update) => (
                <div 
                  key={update.id}
                  className={`p-4 rounded-xl border max-w-[85%] ${
                    update.author_role === 'customer' 
                      ? 'bg-cyan-950/20 border-cyan-500/10 text-[var(--text-secondary)] ml-auto' 
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4 text-xxs font-semibold mb-2">
                    <span className={update.author_role === 'customer' ? 'text-cyan-400 font-bold' : 'text-purple-400 font-bold'}>
                      {update.author_name} ({update.author_role === 'customer' ? 'You' : 'IT Staff'})
                    </span>
                    <span className="text-[var(--text-muted)] font-mono">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{update.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Comment submission form */}
          {ticket.status !== 'Closed' && (
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a message to your technician..."
                required
                className="flex-grow px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <button 
                type="submit"
                disabled={submittingComment}
                className="px-4 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right Sidebar - Technician assignation, SLA, Feedback */}
      <div className="space-y-6">
        {/* Ticket Info Sidebar */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
          <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono text-cyan-400">Service Assignment</h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Current Status:</span>
              <span className="font-bold text-[var(--text-primary)]">{ticket.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Assigned Technician:</span>
              <span className="font-bold text-cyan-400">{ticket.assigned_staff_name || 'Assignation Pending'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">SLA Due Date:</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{ticket.sla_due ? new Date(ticket.sla_due).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Feedback rating panel */}
        {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 space-y-4 bg-cyan-950/5">
            <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" /> Rate Service Quality
            </h4>
            
            {feedback ? (
              <div className="text-xs text-[var(--text-secondary)] space-y-2">
                <div className="flex items-center gap-1">
                  <span className="text-[var(--text-muted)]">Your Rating:</span>
                  <div className="flex text-amber-400">
                    {[...Array(feedback.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current text-current" />)}
                  </div>
                </div>
                {feedback.comment && (
                  <p className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] italic">
                    "{feedback.comment}"
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handlePostFeedback} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">Select Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setFeedbackRating(val)}
                        className="text-amber-400 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Star className={`w-5 h-5 ${feedbackRating >= val ? 'fill-current' : 'text-gray-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share a short comment about your support experience..."
                  rows="3"
                  className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Workaround function for router param parsing
function useParamsWrapper() {
  return { id: window.location.pathname.split('/').pop() };
}

export function CustomerNewTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'Hardware',
    priority: 'Medium',
    subject: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.subject || !formData.description) {
      setError('Please fill in Subject and Detailed Description.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/tickets', formData);
      alert('Support ticket opened successfully!');
      navigate('/portal/tickets');
    } catch (err) {
      setError(err.message || 'Failed to open ticket.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Open a Support Ticket</h1>
        <p className="text-xs text-[var(--text-muted)]">Need help repairing a PC, configuring networking, or mounting a CCTV? Let us know!</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Hardware">Hardware Sales & Repair</option>
              <option value="Network">Business/Home Network</option>
              <option value="CCTV">CCTV Security NVR</option>
              <option value="Software">Software & OS Setup</option>
              <option value="Remote">Remote AnyDesk support</option>
              <option value="Other">Other general request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Urgency Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Low">Low - General query</option>
              <option value="Medium">Medium - Routine servicing</option>
              <option value="High">High - Impaired operations</option>
              <option value="Urgent">Urgent - Business stopped</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Subject / Issue Summary</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Boss computer has BSOD loop"
            required
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Detailed Description</label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please detail the exact issue. Specify computer brand, printer models, or any specific symptoms."
            required
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4.5 rounded-xl font-bold bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Opening Support Ticket...' : 'Open Ticket'}
        </button>
      </form>
    </div>
  );
}

export function CustomerVault() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    device_type: 'Desktop',
    anydesk_id: '',
    teamviewer_id: '',
    os: 'Windows 11',
    hardware_notes: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const loadVault = async () => {
    try {
      const data = await api.get('/customers/me/devices');
      setDevices(data);
    } catch (err) {
      console.error('Error fetching stored devices:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVault();
  }, []);

  const openModal = (device = null) => {
    if (device) {
      setCurrentDevice(device);
      setFormData({
        nickname: device.nickname || '',
        device_type: device.device_type || 'Desktop',
        anydesk_id: device.anydesk_id || '',
        teamviewer_id: device.teamviewer_id || '',
        os: device.os || 'Windows 11',
        hardware_notes: device.hardware_notes || '',
        notes: device.notes || ''
      });
    } else {
      setCurrentDevice(null);
      setFormData({
        nickname: '',
        device_type: 'Desktop',
        anydesk_id: '',
        teamviewer_id: '',
        os: 'Windows 11',
        hardware_notes: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDevice(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveDevice = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentDevice) {
        await api.put(`/customers/me/devices/${currentDevice.id}`, formData);
      } else {
        await api.post('/customers/me/devices', formData);
      }
      closeModal();
      await loadVault();
    } catch (err) {
      alert(err.message || 'Failed to save device.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device from your vault?')) {
      try {
        await api.delete(`/customers/me/devices/${id}`);
        await loadVault();
      } catch (err) {
        alert(err.message || 'Failed to delete device.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading Remote Device Vault...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Remote Device Vault</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Your registered AnyDesk / TeamViewer IDs. Secured and encrypted for 1-click remote support from technicians.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-8 text-center text-[var(--text-muted)] text-sm">
            No remote access devices registered. Add your first device to enable remote support.
          </div>
        ) : (
          devices.map((dev) => (
            <div key={dev.id} className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button onClick={() => openModal(dev)} className="p-2 rounded-lg bg-[var(--bg-secondary)] text-cyan-400 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </button>
                <button onClick={() => handleDelete(dev.id)} className="p-2 rounded-lg bg-[var(--bg-secondary)] text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete
                </button>
                <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400">
                  <Monitor className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xxs uppercase font-mono text-cyan-400 tracking-widest block font-bold">{dev.device_type}</span>
                  <h3 className="font-extrabold text-[var(--text-primary)] text-lg pr-24">{dev.nickname}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-xxs font-semibold">ANYDESK ID</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono text-sm">{dev.anydesk_id || 'N/A'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-xxs font-semibold">TEAMVIEWER ID</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono text-sm">{dev.teamviewer_id || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-[var(--text-muted)] pt-2">
                  <p>Operating System: <strong className="text-[var(--text-secondary)]">{dev.os}</strong></p>
                  {dev.hardware_notes && <p>Hardware Specs: <strong className="text-[var(--text-secondary)]">{dev.hardware_notes}</strong></p>}
                  {dev.notes && <p className="italic text-[var(--text-muted)]">"{dev.notes}"</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-in relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">
              {currentDevice ? 'Edit Device' : 'Add Remote Device'}
            </h2>
            
            <form onSubmit={handleSaveDevice} className="space-y-4 text-sm">
              <div>
                <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">Device Nickname *</label>
                <input 
                  type="text" name="nickname" value={formData.nickname} onChange={handleFormChange} required
                  placeholder="e.g. Boss PC, Reception Computer"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">Device Type</label>
                  <select name="device_type" value={formData.device_type} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none">
                    <option value="Desktop">Desktop PC</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Server">Server</option>
                    <option value="POS">POS System</option>
                  </select>
                </div>
                <div>
                  <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">Operating System</label>
                  <input 
                    type="text" name="os" value={formData.os} onChange={handleFormChange} placeholder="Windows 11"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">AnyDesk ID</label>
                  <input 
                    type="text" name="anydesk_id" value={formData.anydesk_id} onChange={handleFormChange} placeholder="123 456 789"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">TeamViewer ID</label>
                  <input 
                    type="text" name="teamviewer_id" value={formData.teamviewer_id} onChange={handleFormChange} placeholder="123 456 789"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">Hardware Specs (Optional)</label>
                <input 
                  type="text" name="hardware_notes" value={formData.hardware_notes} onChange={handleFormChange} placeholder="e.g. i5 12th Gen, 16GB RAM, 512GB SSD"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-1">Additional Notes</label>
                <textarea 
                  name="notes" value={formData.notes} onChange={handleFormChange} rows="2" placeholder="Password hint or location details..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors mt-4 disabled:opacity-50"
              >
                {saving ? 'Saving...' : (currentDevice ? 'Update Device' : 'Add Device')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    contact_email: ''
  });

  // Password Form State
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await api.get('/customers/me/profile');
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || '',
        contact_email: data.contact_email || ''
      });
    } catch (err) {
      console.error('Error loading customer profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/customers/me/profile', formData);
      alert('Profile updated successfully!');
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = (e) => {
    setPwdData({ ...pwdData, [e.target.name]: e.target.value });
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdMsg('New passwords do not match.');
      return;
    }
    setPwdSaving(true);
    setPwdMsg('');
    try {
      await api.put('/auth/password', {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      setPwdMsg('Password updated successfully!');
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg(err.message || 'Failed to update password.');
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">My Profile Details</h1>
        <p className="text-xs text-[var(--text-muted)]">Update your contact information and physical address.</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Portal Username / Login Email (Read Only)</label>
            <input 
              type="text" 
              value={profile?.email || ''} 
              disabled 
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed text-xs font-mono"
            />
            <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">To change your login email, contact Admin.</p>
          </div>

          <div>
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Contact Email (Optional)</label>
            <input 
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleProfileChange}
              placeholder="Alternative email for updates"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Full Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Registered Phone</label>
            <input 
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Company / Shop (Read Only)</label>
            <input 
              type="text" 
              value={profile?.organization || 'Individual Customer'} 
              disabled 
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Installation Address</label>
            <input 
              type="text"
              name="address"
              value={formData.address}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Support Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleProfileChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>

      {/* Security Section */}
      <div className="pt-4">
        <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-4">Security & Password</h2>
        <form onSubmit={handlePwdSubmit} className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
          {pwdMsg && (
            <div className={`p-4 rounded-xl text-xs font-semibold ${pwdMsg.includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {pwdMsg}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Current Password</label>
              <input 
                type="password"
                name="currentPassword"
                value={pwdData.currentPassword}
                onChange={handlePwdChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">New Password</label>
              <input 
                type="password"
                name="newPassword"
                value={pwdData.newPassword}
                onChange={handlePwdChange}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xxs uppercase font-mono text-[var(--text-muted)] font-bold block mb-2">Confirm New Password</label>
              <input 
                type="password"
                name="confirmPassword"
                value={pwdData.confirmPassword}
                onChange={handlePwdChange}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdSaving}
            className="w-full py-3 mt-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-xs hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            {pwdSaving ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
