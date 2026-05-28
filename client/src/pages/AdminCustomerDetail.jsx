import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Calendar,
  FileText,
  Monitor,
  Edit3,
  Save,
  X,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function AdminCustomerDetail() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editable form state
  const [form, setForm] = useState({});

  // Extract customer ID from URL
  const pathParts = window.location.pathname.split('/');
  const customerId = pathParts[pathParts.length - 1];

  const loadCustomer = async () => {
    try {
      const result = await api.get(`/customers/${customerId}`);
      setData(result);
      setForm({
        name: result.profile.name || '',
        email: result.profile.email || '',
        phone: result.profile.phone || '',
        address: result.profile.address || '',
        organization: result.profile.organization || '',
        customer_type: result.profile.customer_type || 'individual',
        amc_status: result.profile.amc_status || 'none',
        amc_start: result.profile.amc_start ? result.profile.amc_start.split('T')[0] : '',
        amc_end: result.profile.amc_end ? result.profile.amc_end.split('T')[0] : '',
        notes: result.profile.notes || '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load customer details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear AMC dates if switching to none/expired
    if (field === 'amc_status' && value !== 'active') {
      setForm(prev => ({ ...prev, [field]: value, amc_start: '', amc_end: '' }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload = { ...form };
      // Don't send empty password
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      const result = await api.put(`/customers/${customerId}`, payload);
      setSuccessMsg(result.message || 'Customer updated successfully.');
      setEditing(false);
      // Reload fresh data
      await loadCustomer();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrorMsg('');
    // Reset form to original data
    if (data) {
      setForm({
        name: data.profile.name || '',
        email: data.profile.email || '',
        phone: data.profile.phone || '',
        address: data.profile.address || '',
        organization: data.profile.organization || '',
        customer_type: data.profile.customer_type || 'individual',
        amc_status: data.profile.amc_status || 'none',
        amc_start: data.profile.amc_start ? data.profile.amc_start.split('T')[0] : '',
        amc_end: data.profile.amc_end ? data.profile.amc_end.split('T')[0] : '',
        notes: data.profile.notes || '',
        password: ''
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading customer details...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{errorMsg || 'Customer not found.'}</p>
        <Link to="/admin/customers" className="text-cyan-400 hover:underline text-sm">← Back to Customer Registry</Link>
      </div>
    );
  }

  const { profile, devices, tickets } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/customers" 
            className="p-2 rounded-xl glass-card hover:bg-[var(--bg-card)] transition-colors border border-[var(--border-color)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{profile.name}</h1>
            <p className="text-xs text-[var(--text-muted)]">{profile.organization || 'Individual'} &bull; {profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            isAdmin && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Customer
              </button>
            )
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs transition-all"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-black font-bold text-xs hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="glass-panel rounded-2xl border border-[var(--border-color)] p-6">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Full Name</label>
                {editing ? (
                  <input 
                    type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Email Address</label>
                {editing ? (
                  <input 
                    type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-500" />{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Phone</label>
                {editing ? (
                  <input 
                    type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-cyan-500" />{profile.phone}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Organization</label>
                {editing ? (
                  <input 
                    type="text" value={form.organization} onChange={(e) => handleChange('organization', e.target.value)}
                    placeholder="Company or organization name"
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-cyan-500" />{profile.organization || 'Not specified'}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Address</label>
                {editing ? (
                  <input 
                    type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-500" />{profile.address || 'Not specified'}</p>
                )}
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Customer Type</label>
                {editing ? (
                  <select 
                    value={form.customer_type} onChange={(e) => handleChange('customer_type', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                  </select>
                ) : (
                  <span className="px-2.5 py-0.5 rounded text-xxs font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {profile.customer_type || 'individual'}
                  </span>
                )}
              </div>

              {/* Reset Password (Edit mode only) */}
              {editing && (
                <div>
                  <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3" /> Reset Password
                  </label>
                  <input 
                    type="text" value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-amber-500/30 text-[var(--text-primary)] text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xxs text-amber-400 mt-1">Only fill this if you want to change the password.</p>
                </div>
              )}
            </div>
          </div>

          {/* AMC Contract Card */}
          <div className="glass-panel rounded-2xl border border-[var(--border-color)] p-6">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> AMC Contract
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AMC Status */}
              <div>
                <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">AMC Status</label>
                {editing ? (
                  <select 
                    value={form.amc_status} onChange={(e) => handleChange('amc_status', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="none">No AMC</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase inline-block ${
                    profile.amc_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    profile.amc_status === 'expired' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-slate-500/10 text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {profile.amc_status || 'none'}
                  </span>
                )}
              </div>

              {/* AMC Start */}
              {(editing ? form.amc_status === 'active' : profile.amc_status === 'active') && (
                <>
                  <div>
                    <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">Start Date</label>
                    {editing ? (
                      <input 
                        type="date" value={form.amc_start} onChange={(e) => handleChange('amc_start', e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {profile.amc_start ? new Date(profile.amc_start).toLocaleDateString() : 'Not set'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xxs font-semibold text-[var(--text-muted)] uppercase mb-1">End Date</label>
                    {editing ? (
                      <input 
                        type="date" value={form.amc_end} onChange={(e) => handleChange('amc_end', e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-red-400" />
                        {profile.amc_end ? new Date(profile.amc_end).toLocaleDateString() : 'Not set'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="glass-panel rounded-2xl border border-[var(--border-color)] p-6">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Internal Notes
            </h2>
            {editing ? (
              <textarea 
                value={form.notes} onChange={(e) => handleChange('notes', e.target.value)}
                rows="4"
                placeholder="Add internal notes about this customer..."
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-cyan-500 focus:outline-none transition-colors"
              />
            ) : (
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{profile.notes || 'No notes.'}</p>
            )}
          </div>
        </div>

        {/* RIGHT: Devices + Tickets Summary */}
        <div className="space-y-6">
          {/* Devices Card */}
          <div className="glass-panel rounded-2xl border border-[var(--border-color)] p-5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Registered Devices ({devices.length})
            </h3>
            {devices.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No devices in vault.</p>
            ) : (
              <div className="space-y-2">
                {devices.map(device => (
                  <div key={device.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs">
                    <span className="block font-bold text-[var(--text-primary)]">{device.nickname}</span>
                    <span className="text-[var(--text-muted)]">{device.device_type} &bull; {device.os}</span>
                    {device.anydesk_id && <span className="block text-cyan-400 font-mono mt-1">AnyDesk: {device.anydesk_id}</span>}
                    {device.teamviewer_id && <span className="block text-cyan-400 font-mono">TeamViewer: {device.teamviewer_id}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tickets Card */}
          <div className="glass-panel rounded-2xl border border-[var(--border-color)] p-5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Support Tickets ({tickets.length})
            </h3>
            {tickets.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No tickets created by this customer.</p>
            ) : (
              <div className="space-y-2">
                {tickets.slice(0, 10).map(ticket => (
                  <Link 
                    key={ticket.id} 
                    to={`/admin/tickets/${ticket.id}`}
                    className="block p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-cyan-400">{ticket.ticket_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xxs font-bold uppercase ${
                        ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                        ticket.status === 'Closed' ? 'bg-slate-500/10 text-slate-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>{ticket.status}</span>
                    </div>
                    <span className="text-[var(--text-secondary)] line-clamp-1">{ticket.subject}</span>
                  </Link>
                ))}
                {tickets.length > 10 && (
                  <p className="text-xxs text-[var(--text-muted)] text-center pt-1">+ {tickets.length - 10} more tickets</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
