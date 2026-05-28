import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Key,
  FolderOpen,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  UserCheck,
  Building,
  Phone,
  Mail,
  Send,
  Star,
  Monitor,
  Calendar,
  Lock,
  Layers,
  BookOpen,
  UserCog,
  UserPlus,
  Settings,
  Sun,
  Moon,
  Search,
  ChevronLeft
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* Admin Sidebar */}
      <aside className="w-64 glass-panel border-r border-[var(--border-color)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-500 to-cyan-500 p-1.5 rounded-lg text-black font-extrabold">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-cyan-400 font-mono">CRM NCS PANEL</span>
        </div>

        <nav className="flex-grow p-4 space-y-2 text-sm font-semibold">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-cyan-500" /> Dashboard
          </Link>
          <Link to="/admin/leads" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <Users className="w-5 h-5 text-cyan-500" /> CRM Leads
          </Link>
          <Link to="/admin/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <FileText className="w-5 h-5 text-cyan-500" /> Support Tickets
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
            <FolderOpen className="w-5 h-5 text-cyan-500" /> Customers Directory
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
                <BookOpen className="w-5 h-5 text-cyan-500" /> Blog Manager
              </Link>
              <Link to="/admin/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
                <UserCog className="w-5 h-5 text-cyan-500" /> Staff Management
              </Link>
              <Link to="/admin/add-client" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
                <UserPlus className="w-5 h-5 text-cyan-500" /> Add Client
              </Link>
              <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] hover:text-cyan-400 transition-colors">
                <Settings className="w-5 h-5 text-cyan-500" /> System Settings
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="mb-4 text-center px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <span className="block text-xxs font-mono uppercase text-[var(--text-muted)] tracking-wider">Logged in as</span>
            <span className="text-[var(--text-primary)] font-bold text-xs capitalize">{user?.role}</span>
          </div>
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
            <span className="font-extrabold text-cyan-400 tracking-wider text-sm font-mono">CRM ADMIN</span>
          </div>
          <div className="hidden md:block text-sm font-semibold text-[var(--text-muted)]">
            NextCore HQ: <span className="text-[var(--text-primary)] font-bold">{user?.name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-card hover:bg-[var(--bg-card)] hover:text-cyan-500 transition-colors border border-[var(--border-color)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
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

export function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const leadsData = await api.get('/leads');
        setLeads(leadsData);

        const ticketsData = await api.get('/tickets');
        setTickets(ticketsData);

        const custData = await api.get('/customers');
        setCustomers(custData);
      } catch (err) {
        console.error('Error fetching admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading CRM analytics...</div>;
  }

  const newLeads = leads.filter(l => l.status === 'new');
  const openTickets = tickets.filter(t => ['Open', 'Assigned', 'In Progress', 'On Hold'].includes(t.status));
  const activeAMCs = customers.filter(c => c.amc_status === 'active');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">NextCore CRM Command HQ</h1>
        <p className="text-xs text-[var(--text-muted)]">Real-time status overview of leads, dispatches, active tickets, and AMC agreements.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">New CRM Leads</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{newLeads.length}</span>
          </div>
          <div className="bg-purple-500/10 p-3.5 rounded-xl text-purple-400 border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">Active Tickets</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{openTickets.length}</span>
          </div>
          <div className="bg-amber-500/10 p-3.5 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">Customer Registry</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{customers.length}</span>
          </div>
          <div className="bg-cyan-500/10 p-3.5 rounded-xl text-cyan-400 border border-cyan-500/20">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[var(--text-muted)] tracking-wider block mb-1">Active AMCs</span>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{activeAMCs.length}</span>
          </div>
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads widget */}
        <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
            <h3 className="font-bold text-[var(--text-primary)]">Pending Leads Pipeline</h3>
            <Link to="/admin/leads" className="text-xs text-cyan-400 font-semibold hover:underline">
              Manage Leads
            </Link>
          </div>

          {newLeads.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">
              No pending new inquiries in the pipeline.
            </div>
          ) : (
            <div className="divide-y divide-gray-900">
              {newLeads.map((lead) => (
                <div key={lead.id} className="p-5 flex items-center justify-between hover:bg-[var(--bg-card)] transition-colors">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{lead.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{lead.organization || 'Individual Inquiry'}</p>
                    <p className="text-xxs text-cyan-400 font-mono mt-0.5 capitalize">{lead.service_type} &bull; {lead.phone}</p>
                  </div>
                  <Link 
                    to="/admin/leads" 
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 font-bold text-xs transition-all shadow-md shadow-cyan-900/20"
                  >
                    Convert
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tickets dispatch widget */}
        <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
            <h3 className="font-bold text-[var(--text-primary)]">Active Support Board</h3>
            <Link to="/admin/tickets" className="text-xs text-cyan-400 font-semibold hover:underline">
              Dispatch Room
            </Link>
          </div>

          {openTickets.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">
              No open tickets. Dispatch board is empty!
            </div>
          ) : (
            <div className="divide-y divide-gray-900">
              {openTickets.slice(0, 4).map((ticket) => (
                <Link 
                  key={ticket.id} 
                  to={`/admin/tickets/${ticket.id}`}
                  className="p-5 flex items-center justify-between hover:bg-[var(--bg-card)] transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xxs font-mono text-cyan-400 font-bold">{ticket.ticket_number}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
                        ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400' :
                        ticket.priority === 'High' ? 'bg-orange-500/15 text-orange-400' :
                        'bg-slate-800 text-[var(--text-muted)]'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm group-hover:text-cyan-400 transition-colors mt-1">
                      {ticket.subject}
                    </h4>
                    <p className="text-xxs text-[var(--text-muted)] mt-0.5">
                      Client: <span className="text-[var(--text-secondary)] font-medium">{ticket.customer_name}</span> &bull; Tech: <span className="text-cyan-400 font-medium">{ticket.assigned_staff_name || 'PENDING'}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-cyan-400 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Convert lead modal/panel state
  const [selectedLead, setSelectedLead] = useState(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [amcStatus, setAmcStatus] = useState('none');
  const [amcStart, setAmcStart] = useState('');
  const [amcEnd, setAmcEnd] = useState('');
  const [converting, setConverting] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const fetchLeads = async () => {
    try {
      const data = await api.get('/leads');
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenConvert = (lead) => {
    setSelectedLead(lead);
    setAddress('Bharatpur, Chitwan');
    setNotes(`Converted from Lead reference NCS-LEAD-${lead.id}. ${lead.description}`);
    setAmcStatus('none');
    setCredentials(null);
  };

  const handleConvertLead = async (e) => {
    e.preventDefault();
    setConverting(true);
    try {
      const result = await api.post(`/leads/${selectedLead.id}/convert`, {
        address,
        notes,
        amc_status: amcStatus,
        amc_start: amcStatus === 'active' ? amcStart : null,
        amc_end: amcStatus === 'active' ? amcEnd : null
      });

      setCredentials(result.credentials);
      await fetchLeads(); // reload table
    } catch (err) {
      alert(err.message || 'Failed to convert lead.');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading leads directory...</div>;
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    lead.phone.includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] font-sans">CRM Leads Pipeline</h1>
          <p className="text-xs text-[var(--text-muted)]">Review public contact form inquiries and convert them to registered customers.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table of Leads */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm flex-grow">
              No leads match your search.
            </div>
          ) : (
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                    <th className="p-4">Lead Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Request Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="p-4">
                        <span className="block font-bold text-[var(--text-primary)]">{lead.name}</span>
                        <span className="text-xxs text-[var(--text-muted)]">{lead.organization || 'No Organization'}</span>
                      </td>
                      <td className="p-4">
                        <span className="block text-xs font-mono">{lead.phone}</span>
                        <span className="text-xxs text-[var(--text-muted)]">{lead.email || 'N/A'}</span>
                      </td>
                      <td className="p-4 uppercase font-mono text-xxs text-cyan-400">{lead.service_type}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                          lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {lead.status !== 'converted' ? (
                          <button
                            onClick={() => handleOpenConvert(lead)}
                            className="px-3 py-1 rounded bg-cyan-500 text-black hover:bg-cyan-400 font-bold text-xs transition-colors"
                          >
                            Convert
                          </button>
                        ) : (
                          <span className="text-xxs text-[var(--text-muted)] italic">Converted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {filteredLeads.length > 0 && (
            <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <span className="text-xs text-[var(--text-muted)]">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-[var(--text-primary)]">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lead conversion panel */}
        <div className="space-y-6">
          {selectedLead ? (
            <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-4 bg-cyan-950/5 relative animate-slide-in">
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>

              {credentials ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[var(--text-primary)] text-base text-center">Customer Created Successfully!</h3>
                  <p className="text-xs text-[var(--text-muted)] text-center">
                    Copy and share these setup credentials with the client so they can access their portal.
                  </p>
                  
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono space-y-2 text-[var(--text-secondary)]">
                    <p>Username: <strong className="text-[var(--text-primary)] select-all">{credentials.username}</strong></p>
                    <p>Password: <strong className="text-cyan-400 select-all">{credentials.temporaryPassword}</strong></p>
                  </div>
                  
                  <button
                    onClick={() => { setSelectedLead(null); setCredentials(null); }}
                    className="w-full py-2 bg-slate-900 hover:bg-[var(--bg-card)] text-[var(--text-primary)] rounded-xl text-xs font-bold transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConvertLead} className="space-y-4 text-xs">
                  <div>
                    <span className="text-xxs uppercase font-mono text-cyan-400 font-bold block mb-1">Converting Lead</span>
                    <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight">{selectedLead.name}</h3>
                    <p className="text-[var(--text-muted)] leading-normal mt-1 italic">"{selectedLead.description}"</p>
                  </div>

                  <div>
                    <label className="block text-[var(--text-muted)] font-semibold mb-1">Company Address *</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[var(--text-muted)] font-semibold mb-1">AMC status</label>
                      <select 
                        value={amcStatus} 
                        onChange={(e) => setAmcStatus(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="none">No AMC agreement</option>
                        <option value="active">Active AMC Contract</option>
                      </select>
                    </div>
                  </div>

                  {amcStatus === 'active' && (
                    <div className="grid grid-cols-2 gap-3 animate-fade-in">
                      <div>
                        <label className="block text-[var(--text-muted)] font-semibold mb-1">Start Date</label>
                        <input 
                          type="date" 
                          value={amcStart}
                          onChange={(e) => setAmcStart(e.target.value)}
                          required
                          className="w-full p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-muted)] font-semibold mb-1">End Date</label>
                        <input 
                          type="date" 
                          value={amcEnd}
                          onChange={(e) => setAmcEnd(e.target.value)}
                          required
                          className="w-full p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[var(--text-muted)] font-semibold mb-1">Internal Notes</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={converting}
                    className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                  >
                    {converting ? 'Creating Customer Profile...' : 'Convert Lead to Customer'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] text-center text-[var(--text-muted)] text-xs py-12">
              Select a Lead from the list to trigger portal creation and AMC profiling.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await api.get('/tickets');
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading CRM ticket queue...</div>;
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Service Tickets Queue</h1>
          <p className="text-xs text-[var(--text-muted)]">View and dispatch active support tickets. Reassign staff, monitor SLAs, and write private updates.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">
            No support tickets match your search.
          </div>
        ) : (
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                  <th className="p-4">Ticket Number</th>
                  <th className="p-4">Client / Company</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Staff</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-cyan-400">{ticket.ticket_number}</td>
                    <td className="p-4">
                      <span className="block font-semibold text-[var(--text-primary)]">{ticket.customer_name}</span>
                      <span className="text-xxs text-[var(--text-muted)]">{ticket.organization || 'Individual Customer'}</span>
                    </td>
                    <td className="p-4 text-xs font-medium text-[var(--text-secondary)] max-w-xxs truncate">{ticket.subject}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
                        ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400' :
                        ticket.priority === 'High' ? 'bg-orange-500/15 text-orange-400' :
                        'bg-slate-800 text-[var(--text-muted)]'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase ${
                        ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ticket.status === 'Closed' ? 'bg-slate-800 text-slate-400' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-cyan-400">{ticket.assigned_staff_name || 'PENDING DISPATCH'}</td>
                    <td className="p-4 text-xxs font-mono text-[var(--text-muted)]">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link 
                        to={`/admin/tickets/${ticket.id}`}
                        className="px-3 py-1 rounded bg-[var(--bg-card)] hover:bg-cyan-500 hover:text-black font-semibold text-xs transition-all border border-[var(--border-color)]"
                      >
                        Dispatch
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredTickets.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
            <span className="text-xs text-[var(--text-muted)]">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-[var(--text-primary)]">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminTicketDetail() {
  const [ticketData, setTicketData] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Workaround: React router match params
  const pathParts = window.location.pathname.split('/');
  const ticketId = pathParts[pathParts.length - 1];

  const loadTicket = async () => {
    try {
      const data = await api.get(`/tickets/${ticketId}`);
      setTicketData(data);

      // Load active staff members dynamically
      try {
        const staffData = await api.get('/staff');
        setStaffList(staffData.map(s => ({ id: s.id, name: `${s.name} (${s.role})` })));
      } catch (err) {
        console.error('Error fetching staff list, fallback to default:', err);
        setStaffList([
          { id: 2, name: 'Sandeep Thapa (Technician)' },
          { id: 3, name: 'Aayush Shrestha (Technician)' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const handleUpdateTicket = async (field, value) => {
    setDispatching(true);
    try {
      await api.patch(`/tickets/${ticketId}`, { [field]: value });
      await loadTicket(); // reload details
    } catch (err) {
      alert(err.message || 'Failed to update ticket properties.');
    } finally {
      setDispatching(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/tickets/${ticketId}/updates`, { message: commentText, is_public: isPublic });
      setCommentText('');
      await loadTicket(); // reload comments
    } catch (err) {
      alert(err.message || 'Failed to post note.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading dispatch dashboard...</div>;
  }

  if (!ticketData) {
    return <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">Ticket not found.</div>;
  }

  const { ticket, updates, devices, feedback } = ticketData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Ticket Details & Feed */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
              {ticket.ticket_number}
            </span>
            <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
              ticket.priority === 'Urgent' ? 'bg-red-500/15 text-red-400' : 'bg-slate-800 text-[var(--text-muted)]'
            }`}>
              {ticket.priority}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">{ticket.subject}</h2>
          
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] leading-relaxed">
            {ticket.description}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-[var(--border-color)] pt-4 text-[var(--text-muted)]">
            <div>
              <span className="block font-semibold uppercase text-xxs text-[var(--text-muted)] tracking-wider">Client Details</span>
              <strong className="text-[var(--text-primary)] text-sm">{ticket.customer_name}</strong>
              <p>{ticket.organization || 'Individual Customer'}</p>
              <p>{ticket.customer_phone} &bull; {ticket.customer_email}</p>
            </div>
            <div>
              <span className="block font-semibold uppercase text-xxs text-[var(--text-muted)] tracking-wider">Location / Notes</span>
              <p className="italic">"{ticket.customer_notes || 'No specific profile notes'}"</p>
            </div>
          </div>
        </div>

        {/* Remote DevicesVault quick references */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" /> Stored Client Remote Credentials
          </h4>
          
          {devices.length === 0 ? (
            <div className="text-xs text-[var(--text-muted)]">
              No remote access credentials stored for this client. You can register AnyDesk devices inside the Customer Directory.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((dev, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex justify-between items-center text-xs">
                  <div>
                    <span className="block font-bold text-[var(--text-primary)]">{dev.nickname}</span>
                    <span className="text-xxs text-[var(--text-muted)]">{dev.os} &bull; {dev.device_type}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xxs text-[var(--text-muted)] font-mono">ANYDESK ID</span>
                    <span className="font-mono text-cyan-400 font-bold select-all text-sm">{dev.anydesk_id || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Updates Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-6">
          <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wide font-mono text-cyan-400">Technician Discussion Feed</h3>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {updates.map((update) => (
              <div 
                key={update.id}
                className={`p-4 rounded-xl border max-w-[85%] ${
                  update.is_public === false 
                    ? 'bg-purple-950/20 border-purple-500/10 text-[var(--text-secondary)] ml-auto' 
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex justify-between items-center gap-4 text-xxs font-semibold mb-2">
                  <span className={update.author_role === 'customer' ? 'text-cyan-400 font-bold' : 'text-purple-400 font-bold'}>
                    {update.author_name} ({update.author_role}) {update.is_public === false && <span className="text-xxs font-mono uppercase text-purple-400 tracking-widest border border-purple-500/20 px-1 rounded ml-1 bg-purple-950">Internal Note</span>}
                  </span>
                  <span className="text-[var(--text-muted)] font-mono">
                    {new Date(update.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{update.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="space-y-4">
            <input 
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post a comment/update log..."
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:border-cyan-500 focus:outline-none transition-colors"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_public" 
                  checked={isPublic} 
                  onChange={(e) => setIsPublic(e.target.checked)} 
                  className="rounded bg-[var(--bg-card)] border-[var(--border-color)] text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <label htmlFor="is_public" className="text-xs text-[var(--text-muted)] select-none">
                  Make comment visible to Customer in portal
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={submittingComment}
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
              >
                Post Update Note
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dispatch Controls Side Panel */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 space-y-6 bg-cyan-950/5">
          <h3 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono text-cyan-400">Dispatch Room Control</h3>
          
          {/* Dispatch Assignment */}
          <div className="space-y-2">
            <label className="block text-xxs font-semibold uppercase text-[var(--text-muted)] tracking-wider">Assign Technician</label>
            <select
              value={ticket.assigned_to || ''}
              onChange={(e) => handleUpdateTicket('assigned_to', e.target.value ? parseInt(e.target.value) : null)}
              disabled={dispatching}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:outline-none text-[var(--text-primary)] font-semibold"
            >
              <option value="">Dispatch Pending...</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>

          {/* Edit status */}
          <div className="space-y-2">
            <label className="block text-xxs font-semibold uppercase text-[var(--text-muted)] tracking-wider">Service Status</label>
            <select
              value={ticket.status}
              onChange={(e) => handleUpdateTicket('status', e.target.value)}
              disabled={dispatching}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:outline-none text-[var(--text-primary)] font-semibold"
            >
              <option value="Open">Open (Pending)</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress (Diagnosing)</option>
              <option value="On Hold">On Hold (Waiting Parts)</option>
              <option value="Resolved">Resolved (Completed)</option>
              <option value="Closed">Closed (Archived)</option>
            </select>
          </div>

          {/* Edit priority */}
          <div className="space-y-2">
            <label className="block text-xxs font-semibold uppercase text-[var(--text-muted)] tracking-wider">Urgency Level</label>
            <select
              value={ticket.priority}
              onChange={(e) => handleUpdateTicket('priority', e.target.value)}
              disabled={dispatching}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs focus:outline-none text-[var(--text-primary)] font-semibold"
            >
              <option value="Low">Low - Maintenance</option>
              <option value="Medium">Medium - Standard</option>
              <option value="High">High - Core Impaired</option>
              <option value="Urgent">Urgent - Business Blocked</option>
            </select>
          </div>
        </div>

        {/* Customer Rating view if resolved */}
        {feedback && (
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 space-y-3 bg-cyan-950/5">
            <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono text-cyan-400">Customer Feedback Rating</h4>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-muted)]">Score:</span>
                <div className="flex text-amber-400">
                  {[...Array(feedback.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current text-current" />)}
                </div>
              </div>
              <p className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] italic">
                "{feedback.comment || 'No comment provided'}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Stored devices Modal state
  const [selectedCust, setSelectedCust] = useState(null);
  const [nickname, setNickname] = useState('');
  const [deviceType, setDeviceType] = useState('Desktop');
  const [anydeskId, setAnydeskId] = useState('');
  const [teamviewerId, setTeamviewerId] = useState('');
  const [os, setOs] = useState('Windows 11 Pro');
  const [hardwareNotes, setHardwareNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [registeringDevice, setRegisteringDevice] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await api.get('/customers');
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAddDevice = (cust) => {
    setSelectedCust(cust);
    setNickname('');
    setDeviceType('Desktop');
    setAnydeskId('');
    setTeamviewerId('');
    setOs('Windows 11 Pro');
    setHardwareNotes('');
    setNotes('');
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setRegisteringDevice(true);
    try {
      await api.post(`/customers/${selectedCust.id}/devices`, {
        nickname,
        device_type: deviceType,
        anydesk_id: anydeskId,
        teamviewer_id: teamviewerId,
        os,
        hardware_notes: hardwareNotes,
        notes
      });
      alert('Remote device registered successfully in client vault!');
      setSelectedCust(null);
    } catch (err) {
      alert(err.message || 'Failed to register remote device.');
    } finally {
      setRegisteringDevice(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading directory...</div>;
  }

  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cust.organization && cust.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (cust.email && cust.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    cust.phone.includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Customer Registry</h1>
          <p className="text-xs text-[var(--text-muted)]">View registered clients, monitor AMC contract durations, and register remote credentials.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm flex-grow">
              No customers match your search.
            </div>
          ) : (
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">AMC Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {paginatedCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="p-4">
                        <span className="block font-bold text-[var(--text-primary)]">{cust.name}</span>
                        <span className="text-xxs text-cyan-400 font-mono">{cust.phone} &bull; {cust.email}</span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-[var(--text-secondary)] max-w-xxs truncate">{cust.address}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                          cust.amc_status === 'active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-slate-800 text-[var(--text-muted)]'
                        }`}>
                          {cust.amc_status}
                        </span>
                        {cust.amc_status === 'active' && cust.amc_start && cust.amc_end && (
                          <div className="mt-1 text-xxs text-[var(--text-muted)] font-mono">
                            {new Date(cust.amc_start).toLocaleDateString()} to {new Date(cust.amc_end).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/customers/${cust.id}`}
                            className="px-3 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 font-bold text-xs transition-all"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleOpenAddDevice(cust)}
                            className="px-3 py-1 rounded bg-[var(--bg-card)] hover:bg-cyan-500 hover:text-black font-semibold text-xs transition-colors border border-[var(--border-color)]"
                          >
                            + Device
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {filteredCustomers.length > 0 && (
            <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <span className="text-xs text-[var(--text-muted)]">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-[var(--text-primary)]">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-[var(--bg-card)] disabled:opacity-50 transition-colors text-[var(--text-primary)]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Remote Device Registration Panel */}
        <div>
          {selectedCust ? (
            <form onSubmit={handleAddDevice} className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-4 bg-cyan-950/5 text-xs animate-slide-in relative">
              <button 
                type="button"
                onClick={() => setSelectedCust(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>

              <div>
                <span className="text-xxs uppercase font-mono text-cyan-400 font-bold block mb-1">Device Vault Registration</span>
                <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight">Client: {selectedCust.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">Device Nickname *</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    placeholder="e.g. Boss Billing Laptop"
                    className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">Device Type</label>
                  <select 
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] focus:outline-none"
                  >
                    <option value="Desktop">Desktop PC</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Server">Database Server</option>
                    <option value="POS">Billing POS</option>
                    <option value="Other">Other Machine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">AnyDesk ID</label>
                  <input 
                    type="text" 
                    value={anydeskId}
                    onChange={(e) => setAnydeskId(e.target.value)}
                    placeholder="e.g. 987 654 321"
                    className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">TeamViewer ID</label>
                  <input 
                    type="text" 
                    value={teamviewerId}
                    onChange={(e) => setTeamviewerId(e.target.value)}
                    placeholder="Optional ID"
                    className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Operating System</label>
                <input 
                  type="text" 
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Hardware specs (optional)</label>
                <input 
                  type="text" 
                  value={hardwareNotes}
                  onChange={(e) => setHardwareNotes(e.target.value)}
                  placeholder="e.g. Core i5-11th gen, 8GB RAM"
                  className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Technical Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  placeholder="e.g. Connected to main network billing printer"
                  className="w-full p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={registeringDevice}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 transition-colors"
              >
                {registeringDevice ? 'Vaulting device credentials...' : 'Register in Vault'}
              </button>
            </form>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] text-center text-[var(--text-muted)] text-xs py-12">
              Select a Customer profile from the registry to add AnyDesk or TeamViewer connection codes directly to their secure vault.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
