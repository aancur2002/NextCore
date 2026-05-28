import React, { useState } from 'react';
import { api } from '../utils/api';
import { UserPlus, CheckCircle } from 'lucide-react';

export function AdminAddClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('Bharatpur, Chitwan');
  const [customerType, setCustomerType] = useState('individual');
  const [amcStatus, setAmcStatus] = useState('none');
  const [amcStart, setAmcStart] = useState('');
  const [amcEnd, setAmcEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.post('/clients', {
        name, email, phone, password, organization,
        address, customer_type: customerType,
        amc_status: amcStatus,
        amc_start: amcStatus === 'active' ? amcStart : null,
        amc_end: amcStatus === 'active' ? amcEnd : null,
        notes
      });
      setCredentials(result.credentials);
    } catch (err) {
      alert(err.message || 'Failed to create client.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setPassword('');
    setOrganization(''); setAddress('Bharatpur, Chitwan');
    setCustomerType('individual'); setAmcStatus('none');
    setAmcStart(''); setAmcEnd(''); setNotes('');
    setCredentials(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Add New Client</h1>
        <p className="text-xs text-[var(--text-muted)]">Manually register a customer with portal credentials and optional AMC contract.</p>
      </div>

      <div className="max-w-2xl">
        {credentials ? (
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Client Created Successfully!</h3>
            <p className="text-xs text-[var(--text-muted)]">Share these credentials with the client so they can access the portal.</p>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono space-y-2 text-left">
              <p className="text-[var(--text-secondary)]">Email: <strong className="text-[var(--text-primary)] select-all">{credentials.email}</strong></p>
              <p className="text-[var(--text-secondary)]">Password: <strong className="text-cyan-400 select-all">{credentials.password}</strong></p>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors"
            >
              Add Another Client
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-5 text-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400 border border-cyan-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xxs uppercase font-mono text-cyan-400 font-bold tracking-wider">Client Registration Form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="e.g. Hari Bahadur"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="e.g. hari@company.com"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  placeholder="e.g. 9855012345"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Password *</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Simple login password"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Organization (Optional)</label>
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Sharma Trading House"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Client Type</label>
                <select value={customerType} onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none">
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">AMC Status</label>
                <select value={amcStatus} onChange={(e) => setAmcStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none">
                  <option value="none">No AMC</option>
                  <option value="active">Active AMC</option>
                </select>
              </div>
            </div>

            {amcStatus === 'active' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">AMC Start</label>
                  <input type="date" value={amcStart} onChange={(e) => setAmcStart(e.target.value)} required
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">AMC End</label>
                  <input type="date" value={amcEnd} onChange={(e) => setAmcEnd(e.target.value)} required
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Notes (Optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2"
                placeholder="Internal notes about this client..."
                className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 transition-colors">
              {submitting ? 'Creating Client Profile...' : 'Register Client'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
