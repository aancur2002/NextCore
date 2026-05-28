import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Settings, Save, CheckCircle } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    admin_email: '',
    contact_email: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    social_instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('Current password and new password (min 6 chars) are required.');
      setPasswordSaving(false);
      return;
    }

    try {
      await api.put('/auth/password', passwordData);
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-500" /> System Settings
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Manage SMTP configurations and Public UI variables</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Settings successfully saved!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Email / SMTP Section */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">Email & SMTP Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">SMTP Host</label>
              <input type="text" name="smtp_host" value={settings.smtp_host} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">SMTP Port</label>
              <input type="text" name="smtp_port" value={settings.smtp_port} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">SMTP User (Email)</label>
              <input type="text" name="smtp_user" value={settings.smtp_user} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">SMTP Password (App Password)</label>
              <input type="password" name="smtp_pass" value={settings.smtp_pass} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Admin Notification Email</label>
              <input type="text" name="admin_email" value={settings.admin_email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
          </div>
        </div>

        {/* Public Website Settings Section */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">Public Website Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Public Contact Email</label>
              <input type="text" name="contact_email" value={settings.contact_email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Facebook Link</label>
              <input type="text" name="social_facebook" value={settings.social_facebook} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Twitter Link</label>
              <input type="text" name="social_twitter" value={settings.social_twitter} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">LinkedIn Link</label>
              <input type="text" name="social_linkedin" value={settings.social_linkedin} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Instagram Link</label>
              <input type="text" name="social_instagram" value={settings.social_instagram} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Security / Password Section */}
      <form onSubmit={handleSavePassword} className="space-y-8 mt-12">
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">Security / Change Password</h2>
          
          {passwordError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs mb-4">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/20 text-green-400 text-xs flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4" /> Password updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs" />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-cyan-500 hover:text-cyan-500 text-[var(--text-primary)] transition-all disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" /> {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
