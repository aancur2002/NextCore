import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  PublicLayout, 
  Home, 
  Services, 
  Contact, 
  About 
} from './pages/Public';
import { BlogList, BlogDetail } from './pages/Blog';
import { api } from './utils/api';
import { 
  CustomerLayout, 
  CustomerDashboard, 
  CustomerTickets, 
  CustomerTicketDetail, 
  CustomerNewTicket,
  CustomerVault,
  CustomerProfile 
} from './pages/Customer';
import { 
  AdminLayout, 
  AdminDashboard, 
  AdminLeads, 
  AdminTickets, 
  AdminTicketDetail,
  AdminCustomers 
} from './pages/Admin';
import { AdminBlogManager } from './pages/AdminBlog';
import { AdminStaffManager } from './pages/AdminStaff';
import { AdminAddClient } from './pages/AdminAddClient';
import { AdminCustomerDetail } from './pages/AdminCustomerDetail';
import { AdminSettings } from './pages/AdminSettings';
import { ThemeProvider } from './context/ThemeContext';
import { Cpu, Lock } from 'lucide-react';

// Login Page Component
function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin' || loggedUser.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetMessage(res.message || 'Password reset email sent if account exists.');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-xl relative z-10 animate-fade-in text-[var(--text-primary)]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <img src="/logo.png" alt="NextCore Logo" className="h-10 w-auto hover:scale-105 transition-transform" />
          </Link>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Client & Tech Portal Sign In</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Enter your registered credentials to track IT repairs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Username / Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ram@sharma.com"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs transition-colors"
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Portal Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none text-xs transition-colors"
              />
            </div>
          )}

          {resetMessage && (
            <div className="p-3.5 rounded-xl bg-green-950/40 border border-green-500/20 text-green-400 text-xs font-semibold">
              {resetMessage}
            </div>
          )}

          {isForgotPassword ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || !email}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Send Temporary Password'}
              </button>
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setResetMessage(''); setError(''); }}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-900/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {loading ? 'Authenticating session...' : 'Sign In to Portal'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-cyan-500 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 border-t border-[var(--border-color)] pt-6 text-center text-xxs text-gray-500">
          <span className="flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-600" /> Stored sessions expire after 24 hours of inactivity.
          </span>
        </div>
      </div>
    </div>
  );
}

// Protected Route wrappers
function RequireAuth({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-gray-400">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
            </Route>

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Customer Portal Routes (Requires role: customer) */}
            <Route 
              path="/portal" 
              element={
                <RequireAuth allowedRoles={['customer']}>
                  <CustomerLayout />
                </RequireAuth>
              }
            >
              <Route index element={<CustomerDashboard />} />
              <Route path="tickets" element={<CustomerTickets />} />
              <Route path="tickets/new" element={<CustomerNewTicket />} />
              <Route path="tickets/:id" element={<CustomerTicketDetail />} />
              <Route path="vault" element={<CustomerVault />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Admin / CRM Panel Routes (Requires roles: admin, staff) */}
            <Route 
              path="/admin" 
              element={
                <RequireAuth allowedRoles={['admin', 'staff']}>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="tickets/:id" element={<AdminTicketDetail />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="customers/:id" element={<AdminCustomerDetail />} />
              <Route path="blog" element={<AdminBlogManager />} />
              <Route path="staff" element={<AdminStaffManager />} />
              <Route path="add-client" element={<AdminAddClient />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
