import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Users, PlusCircle, Trash2, UserCheck, UserX, X, Key } from 'lucide-react';

export function AdminStaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password change state
  const [changingPasswordId, setChangingPasswordId] = useState(null);
  const [newStaffPassword, setNewStaffPassword] = useState('');

  const fetchStaff = async () => {
    try {
      const data = await api.get('/staff');
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/staff', { name, email, phone, password, role: 'staff' });
      resetForm();
      await fetchStaff();
    } catch (err) {
      alert(err.message || 'Failed to create staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this staff member? They will no longer be able to log in.')) return;
    try {
      await api.delete(`/staff/${id}`);
      await fetchStaff();
    } catch (err) {
      alert(err.message || 'Failed to deactivate staff member.');
    }
  };

  const handleChangePassword = async (e, id) => {
    e.preventDefault();
    if (!newStaffPassword || newStaffPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    
    try {
      await api.put(`/staff/${id}/password`, { newPassword: newStaffPassword });
      alert('Password changed successfully.');
      setChangingPasswordId(null);
      setNewStaffPassword('');
    } catch (err) {
      alert(err.message || 'Failed to change password.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading staff directory...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Staff Management</h1>
          <p className="text-xs text-[var(--text-muted)]">Manage technicians and support staff. Assign them to tickets for dispatch.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
          {staff.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No staff members registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xxs font-mono text-cyan-400 uppercase tracking-widest">
                    <th className="p-4">Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="p-4">
                        <span className="block font-bold text-[var(--text-primary)]">{s.name}</span>
                        <span className="text-xxs text-[var(--text-muted)] capitalize">{s.role}</span>
                      </td>
                      <td className="p-4">
                        <span className="block text-xs font-mono text-[var(--text-secondary)]">{s.phone}</span>
                        <span className="text-xxs text-[var(--text-muted)]">{s.email}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase ${
                          s.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {s.is_active ? <><UserCheck className="w-3 h-3" /> Active</> : <><UserX className="w-3 h-3" /> Inactive</>}
                        </span>
                      </td>
                      <td className="p-4 text-xxs font-mono text-[var(--text-muted)]">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {s.is_active && (
                            <button
                              onClick={() => handleDeactivate(s.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                              title="Deactivate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setChangingPasswordId(s.id);
                              setNewStaffPassword('');
                            }}
                            className="p-2 rounded-lg hover:bg-cyan-500/10 text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
                            title="Change Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Panel (Add Staff or Change Password) */}
        <div>
          {changingPasswordId ? (
            <form onSubmit={(e) => handleChangePassword(e, changingPasswordId)} className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/5 space-y-4 text-xs animate-fade-in relative">
              <button type="button" onClick={() => setChangingPasswordId(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xxs uppercase font-mono text-cyan-400 font-bold block mb-1">Change Staff Password</span>
                <p className="text-[var(--text-muted)] mb-4">Set a new password for {staff.find(s => s.id === changingPasswordId)?.name}.</p>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">New Password (min 6 chars) *</label>
                <input
                  type="text" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} required
                  placeholder="Enter new password"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors"
              >
                Update Password
              </button>
            </form>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/5 space-y-4 text-xs animate-fade-in relative">
              <button type="button" onClick={resetForm} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xxs uppercase font-mono text-cyan-400 font-bold block mb-1">New Staff Member</span>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Full Name *</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="e.g. Bikash Gurung"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Email *</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="e.g. bikash@nextcore.com"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Phone *</label>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  placeholder="e.g. 9845012345"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Password *</label>
                <input
                  type="text" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Simple login password"
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Creating...' : 'Add Staff Member'}
              </button>
            </form>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] text-center text-[var(--text-muted)] text-xs py-12">
              Click "Add Staff" to register a new technician or support member.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
