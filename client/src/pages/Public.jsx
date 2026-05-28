import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { api } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { 
  Wrench, 
  Wifi, 
  Video, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  PhoneCall, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Mail, 
  ArrowRight,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Store,
  GraduationCap,
  HeartPulse,
  Home as HomeIcon
} from 'lucide-react';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [config, setConfig] = useState({
    contactEmail: 'anupghimire@gmail.com',
    socialFacebook: '',
    socialTwitter: '',
    socialLinkedin: '',
    socialInstagram: ''
  });

  React.useEffect(() => {
    api.get('/config').then(res => {
      setConfig(prev => ({ ...prev, ...res }));
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-cyan-500 selection:text-black transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Next Core System Logo" className="h-14 w-auto hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-secondary)]">
            <Link to="/" className="hover:text-cyan-500 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-cyan-500 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-cyan-500 transition-colors">Request Support</Link>
            <Link to="/about" className="hover:text-cyan-500 transition-colors">About Us</Link>
            <Link to="/blog" className="hover:text-cyan-500 transition-colors">Blog</Link>
          </nav>

          {/* Theme Switcher & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-cyan-500/50 hover:text-cyan-500 transition-all hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
            
            <Link 
              to="/login" 
              className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Client Login
            </Link>
          </div>

          {/* Mobile menu toggle controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-purple-600" />}
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-cyan-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-[var(--border-color)] px-4 pt-2 pb-6 flex flex-col gap-4 animate-fade-in text-[var(--text-secondary)]">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-2 border-b border-[var(--border-color)] hover:text-cyan-500"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-2 border-b border-[var(--border-color)] hover:text-cyan-500"
            >
              Services
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-2 border-b border-[var(--border-color)] hover:text-cyan-500"
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-2 border-b border-[var(--border-color)] hover:text-cyan-500"
            >
              Request Support
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-2 border-b border-[var(--border-color)] hover:text-cyan-500"
            >
              About Us
            </Link>
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-black"
            >
              Client Login
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] py-12 text-[var(--text-secondary)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Next Core System Logo" className="h-12 w-auto" />
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              Next Core System is an IT services and networking solutions provider based in Bharatpur, Chitwan, Nepal. Specializes in computer hardware support, network setup, and IT maintenance services for businesses and individual clients.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Our Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/services" className="hover:text-cyan-500">Hardware Repair & Sales</Link></li>
              <li><Link to="/services" className="hover:text-cyan-500">LAN & Fiber Networking</Link></li>
              <li><Link to="/services" className="hover:text-cyan-500">CCTV & IP Camera Security</Link></li>
              <li><Link to="/services" className="hover:text-cyan-500">Annual Maintenance Contracts (AMC)</Link></li>
              <li><Link to="/services" className="hover:text-cyan-500">Remote Support Sessions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/contact" className="hover:text-cyan-500">Request Support</Link></li>
              <li><Link to="/about" className="hover:text-cyan-500">Our Story</Link></li>
              <li><Link to="/login" className="hover:text-cyan-500">Client Portal Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Contact Info</h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Bharatpur, Chitwan, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>+977-9841395330, 9800000000</span>
              </li>
              <li className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{config.contactEmail}</span>
              </li>
            </ul>
            <h4 className="font-bold text-[var(--text-primary)] mb-4 mt-6">Follow Us</h4>
            <div className="flex items-center gap-4">
              {config.socialFacebook && (
                <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-panel hover:text-blue-500 hover:scale-110 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.socialTwitter && (
                <a href={config.socialTwitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-panel hover:text-cyan-400 hover:scale-110 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {config.socialLinkedin && (
                <a href={config.socialLinkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-panel hover:text-blue-600 hover:scale-110 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {config.socialInstagram && (
                <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-panel hover:text-pink-500 hover:scale-110 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)] mt-8 pt-6 text-center text-xxs text-[var(--text-muted)]">
          © 2026 Next Core System  All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background Neon Gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 mb-6">
            <Clock className="w-3.5 h-3.5" /> 2-Hour Response Time SLA Promise locally
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6 leading-tight">
            Bharatpur's Trusted <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Managed IT & Tech Backbone
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-[var(--text-secondary)] mb-10 leading-relaxed">
            Next Core System is an IT services and networking solutions provider based in Bharatpur, Chitwan, Nepal. Specializes in computer hardware support, network setup, and IT maintenance services for businesses and individual clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-900/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Request IT Support <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold glass-card hover:bg-cyan-500/10 border border-[var(--border-color)] transition-all flex items-center justify-center gap-2 cursor-pointer text-[var(--text-primary)]"
            >
              Explore Services
            </button>
          </div>
        </div>
        <div className="relative animate-fade-in group hidden lg:block">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <img src="/hardware.png" alt="NextCore Tech Environment" className="relative rounded-3xl shadow-2xl border border-[var(--border-color)] object-cover h-[450px] w-full hover:scale-[1.02] transition-transform duration-500" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16">
        <div className="glass-panel rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)] p-8 text-center">
          <div className="py-4 md:py-0">
            <span className="block text-3xl font-extrabold text-[var(--text-primary)]">500+</span>
            <span className="text-xs uppercase font-mono text-cyan-600 tracking-wider">Happy Clients</span>
          </div>
          <div className="py-4 md:py-0">
            <span className="block text-3xl font-extrabold text-[var(--text-primary)]">1,200+</span>
            <span className="text-xs uppercase font-mono text-cyan-600 tracking-wider">Tickets Resolved</span>
          </div>
          <div className="py-4 md:py-0">
            <span className="block text-3xl font-extrabold text-[var(--text-primary)]">99.8%</span>
            <span className="text-xs uppercase font-mono text-cyan-600 tracking-wider">SLA Met</span>
          </div>
          <div className="py-4 md:py-0">
            <span className="block text-3xl font-extrabold text-[var(--text-primary)]">5+ Years</span>
            <span className="text-xs uppercase font-mono text-cyan-600 tracking-wider">Active Experience</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Enterprise Grade IT Solutions</h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            Certified tech professionals covering computer hardware repair, network setup, AMC management, and remote troubleshooting.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-950/5 transition-all hover:-translate-y-1">
            <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-500 w-fit mb-6">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Hardware Sales & Repair</h3>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6">
              Professional diagnosis and repair of laptops, computers, printers, and UPS devices. Hardware upgrade installations (SSDs, RAM, power supplies).
            </p>
            <Link to="/services" className="text-cyan-500 text-xs font-semibold inline-flex items-center gap-1 hover:underline">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-950/5 transition-all hover:-translate-y-1">
            <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-500 w-fit mb-6">
              <Wifi className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Network Setup & Cabling</h3>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6">
              Structured LAN cabling, secure corporate WiFi routing setups, network rack terminations, and internet connectivity optimizations.
            </p>
            <Link to="/services" className="text-cyan-500 text-xs font-semibold inline-flex items-center gap-1 hover:underline">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-950/5 transition-all hover:-translate-y-1">
            <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-500 w-fit mb-6">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">CCTV & Security Camera</h3>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6">
              Full warehouse and office IP-camera layouts, remote live view setups on mobile devices, DVR/NVR maintenance, and backup setups.
            </p>
            <Link to="/services" className="text-cyan-500 text-xs font-semibold inline-flex items-center gap-1 hover:underline">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[var(--bg-secondary)] rounded-3xl mb-16 border border-[var(--border-color)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">How NextCore Simplifies IT</h2>
          <p className="max-w-lg mx-auto text-xs text-[var(--text-secondary)]">
            Enjoy full digital transparency. No guessing if a tech is assigned or if the issue is solved.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          <div className="text-center relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-[var(--bg-primary)] shadow-md">1</div>
            <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">Submit Request</h4>
            <p className="text-[var(--text-secondary)] text-xs">Fill out the quick support form on our website or contact us via phone/WhatsApp.</p>
          </div>
          <div className="text-center relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-[var(--bg-primary)] shadow-md">2</div>
            <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">Track Progress</h4>
            <p className="text-[var(--text-secondary)] text-xs">Receive immediate SMS/login portal credentials to track real-time technician notes.</p>
          </div>
          <div className="text-center relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-[var(--bg-primary)] shadow-md">3</div>
            <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">Ongoing SLA Safety</h4>
            <p className="text-[var(--text-secondary)] text-xs">Fast resolutions, verified by you, with optional long-term business AMC contract support.</p>
          </div>
        </div>
      </section>

      {/* Our Trusted Clients Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Our Trusted Clients</h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            We are proud to serve over 500+ businesses, schools, hospitals, and homes across the Chitwan district.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 flex flex-col items-center justify-center rounded-2xl text-center hover:scale-105 transition-transform cursor-default">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
              <Store className="w-8 h-8 text-cyan-500" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-sm">Local Businesses</span>
            <span className="text-[var(--text-muted)] text-xs">Retail & Corporate</span>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center rounded-2xl text-center hover:scale-105 transition-transform cursor-default">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
              <GraduationCap className="w-8 h-8 text-emerald-500" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-sm">Educational Inst.</span>
            <span className="text-[var(--text-muted)] text-xs">Schools & Colleges</span>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center rounded-2xl text-center hover:scale-105 transition-transform cursor-default">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <HeartPulse className="w-8 h-8 text-purple-500" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-sm">Healthcare</span>
            <span className="text-[var(--text-muted)] text-xs">Hospitals & Clinics</span>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center rounded-2xl text-center hover:scale-105 transition-transform cursor-default">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
              <HomeIcon className="w-8 h-8 text-amber-500" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-sm">Home Offices</span>
            <span className="text-[var(--text-muted)] text-xs">Individual Users</span>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">What Our Clients Say</h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            Don't just take our word for it. Here is what our clients have to say about our 2-hour SLA and transparent support tracking.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] relative">
            <div className="text-cyan-500 mb-4 opacity-50">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm italic mb-6">
              "Next Core System completely revamped our office network. We used to have dead zones and daily drops, but now our LAN and WiFi are rock solid. The portal makes it so easy to request help."
            </p>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">Ramesh K.</p>
              <p className="text-[var(--text-muted)] text-xs">Corporate Office Manager</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] relative">
            <div className="text-cyan-500 mb-4 opacity-50">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm italic mb-6">
              "My laptop's motherboard was dead and I thought I lost everything. They recovered all my data and repaired the board within 48 hours. Excellent, transparent pricing."
            </p>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">Sunita T.</p>
              <p className="text-[var(--text-muted)] text-xs">Freelance Designer</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] relative">
            <div className="text-cyan-500 mb-4 opacity-50">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm italic mb-6">
              "Their AMC service is a lifesaver for our school. Their techs are always available via TeamViewer to fix software issues immediately, and they show up quickly for hardware problems."
            </p>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">Bikash A.</p>
              <p className="text-[var(--text-muted)] text-xs">School Administrator</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export function Services() {
  const serviceCategories = [
    {
      title: 'Hardware Repair & Maintenance',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Common tasks: Cleaning dust, Thermal paste replacement, Fan replacement, BIOS troubleshooting.',
      items: ['Laptop repair', 'Motherboard repair', 'Keyboard/screen replacement', 'Power supply repair', 'RAM/SSD upgrade', 'Printer repair', 'Preventive maintenance']
    },
    {
      title: 'Hardware Upgrades',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Enhance your system performance with premium component upgrades.',
      items: ['SSD installation', 'RAM upgrade', 'GPU upgrade', 'CPU upgrade', 'Server expansion', 'Storage expansion']
    },
    {
      title: 'Data Recovery & Backup',
      icon: <FileText className="w-6 h-6" />,
      description: 'Secure your digital assets and recover lost data from failing drives.',
      items: ['Recover deleted files', 'Recover data from damaged HDD/SSD', 'Backup solutions', 'NAS storage setup']
    },
    {
      title: 'Networking Services',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Reliable and fast wired network infrastructure for businesses.',
      items: ['LAN/WAN Network Setup', 'Office network installation', 'Ethernet cabling', 'Structured cabling', 'Router & switch configuration', 'Patch panel setup']
    },
    {
      title: 'Wi-Fi & Wireless Networking',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Seamless wireless coverage without dead zones.',
      items: ['Wi-Fi router installation', 'Access point setup', 'Mesh Wi-Fi systems', 'Signal optimization', 'Guest Wi-Fi setup']
    },
    {
      title: 'Server Installation & Management',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Enterprise server setup and Active Directory management.',
      items: ['Windows Server setup', 'Linux server setup', 'Active Directory', 'File server', 'Mail server', 'Virtualization']
    },
    {
      title: 'Network Security Services',
      icon: <ShieldAlert className="w-6 h-6" />,
      description: 'Protect your network from intrusions and cyber threats.',
      items: ['Firewall configuration', 'Antivirus deployment', 'VPN setup', 'CCTV network security', 'Access control systems', 'Cybersecurity monitoring']
    },
    {
      title: 'IT Support Services',
      icon: <Wrench className="w-6 h-6" />,
      description: 'Comprehensive IT support plans for your organization.',
      items: ['AMC (Annual Maintenance Contract)', 'Regular maintenance visits', 'Emergency troubleshooting', 'Hardware replacement support', 'Remote support']
    },
    {
      title: 'Remote & On-Site Support',
      icon: <PhoneCall className="w-6 h-6" />,
      description: 'Quick assistance via remote login or on-site dispatch.',
      items: ['Remote desktop troubleshooting', 'Office visits', 'Software installation', 'Printer setup', 'Email configuration']
    },
    {
      title: 'Security & Surveillance',
      icon: <Video className="w-6 h-6" />,
      description: 'Keep your premises secure with modern surveillance.',
      items: ['CCTV camera installation', 'NVR/DVR setup', 'Biometric attendance systems', 'Door access systems', 'Smart surveillance']
    },
    {
      title: 'Cloud & Business Solutions',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Migrate to the cloud and modernize your business operations.',
      items: ['Cloud backup', 'Microsoft 365 / Google Workspace setup', 'Cloud server migration', 'ERP installation', 'POS systems', 'VoIP/IP phone systems']
    },
    {
      title: 'Enterprise & Fiber Services',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Data center solutions and fiber optic networking.',
      items: ['Rack installation', 'UPS & Cooling systems', 'Enterprise networking', 'Fiber cabling', 'Fiber splicing', 'Fiber testing', 'Long-distance networking']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">Our Professional Service Scope</h1>
        <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-sm">
          From basic laptop repairs to enterprise fiber optics and data center solutions, NextCore System is your complete IT partner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-color)] group hover:shadow-lg hover:shadow-cyan-900/10">
          <div className="h-64 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors"></div>
            <img src="/hardware.png" alt="Hardware Diagnostics & Repair" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
        <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-color)] group hover:shadow-lg hover:shadow-cyan-900/10">
          <div className="h-64 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors"></div>
            <img src="/networking.png" alt="Networking Services" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceCategories.map((category, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] hover:border-cyan-500/30 transition-all group hover:shadow-lg hover:shadow-cyan-900/10 flex flex-col h-full">
            <div className="bg-cyan-500/10 p-3.5 rounded-xl text-cyan-500 w-fit mb-6 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{category.title}</h3>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6 flex-grow">
              {category.description}
            </p>
            <div className="bg-[var(--bg-secondary)]/50 p-4 rounded-xl border border-[var(--border-color)] text-xs mt-auto">
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 glass-panel p-8 rounded-2xl border border-[var(--border-color)] bg-cyan-950/10">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 text-center">Typical Clients We Serve</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['Homes', 'Schools & colleges', 'Hospitals', 'Banks', 'Offices', 'Retail stores', 'Factories', 'Government organizations'].map((client, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-semibold">
              {client}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    service_type: 'hardware',
    description: '',
    source: 'website'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setSuccessMsg('');

    if (!formData.name || !formData.phone || !formData.description) {
      setError('Please fill in Name, Phone, and Problem Description.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/leads', formData);
      setSuccessMsg(response.message);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        organization: '',
        service_type: 'hardware',
        description: '',
        source: 'website'
      });
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-4">
          <PhoneCall className="w-3.5 h-3.5" /> Direct Digital CRM Integration
        </span>
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">Request Support / Contact Us</h1>
        <p className="max-w-lg mx-auto text-xs text-[var(--text-secondary)]">
          Have an urgent hardware, printer, or network issue? Fill this form out. An IT technician will review and contact you immediately.
        </p>
      </div>

      {successMsg ? (
        <div className="glass-panel p-8 rounded-2xl border-cyan-500/40 text-center animate-fade-in text-[var(--text-primary)]">
          <div className="w-16 h-16 bg-cyan-500/15 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Support Request Received!</h2>
          <p className="text-[var(--text-secondary)] text-xs max-w-md mx-auto mb-6">
            {successMsg}
          </p>
          <p className="text-xxs text-[var(--text-muted)] mb-6">
            A customer login credential will be provided once a technician converts your request. Feel free to follow up on <span className="text-cyan-500 font-bold">+977-9841395330</span>.
          </p>
          <button 
            onClick={() => setSuccessMsg('')}
            className="px-6 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] space-y-6 text-[var(--text-primary)]">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ram Bahadur"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nepal mobile, e.g. 98550xxxxx"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. client@domain.com"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Company / Organization Name (Optional)
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. Sharma Trading House"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              />
            </div>

            <div>
              <label htmlFor="service_type" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Service Requested *
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              >
                <option value="hardware">Hardware Repair / Component Upgrade</option>
                <option value="networking">LAN / WiFi Structured Networking</option>
                <option value="cctv">CCTV Camera Installation & NVR setup</option>
                <option value="software">Software Installation / OS formatting</option>
                <option value="remote">Remote troubleshooting session</option>
                <option value="other">Other general technical support</option>
              </select>
            </div>

            <div>
              <label htmlFor="source" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                How did you hear about us?
              </label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
              >
                <option value="website">Direct Web Search</option>
                <option value="facebook">Facebook Business Page</option>
                <option value="referral">Word-of-mouth Referral</option>
                <option value="signboard">Shop Signboard in Bharatpur</option>
                <option value="other">Other Source</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
              Problem Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide details of your issue (e.g. Printer EPSON LQ-310 is printing blank pages, or WiFi router keeps rebooting...)"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none transition-colors text-xs"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-900/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Submitting Support Request...' : 'Send Support Request'}
          </button>
        </form>
      )}
    </div>
  );
}

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-fade-in text-[var(--text-primary)]">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Pioneering IT Excellence in <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Bharatpur</span>
        </h1>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          Next Core System is not just an IT support company. We are your dedicated technology partners, ensuring your business operations never face a hurdle. From enterprise-grade networking to precise hardware diagnostics, we build the digital backbone of Chitwan.
        </p>
      </div>

      {/* Image & Mission Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <img src="/team_servers.png" alt="Our IT Team" className="relative rounded-3xl shadow-2xl border border-[var(--border-color)] object-cover w-full h-[400px] hover:scale-[1.01] transition-transform duration-500" />
        </div>
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <Info className="w-6 h-6 text-cyan-500" /> Our Mission
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              To provide extremely reliable, transparent, and fast IT services to businesses and individuals in Nepal. We believe technology should be an enabler, not a bottleneck. Our strict SLA tracking and transparent support portal mean you are never left guessing when your tech will be back online.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="font-bold text-3xl text-cyan-500 mb-1">500+</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Clients Served</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="font-bold text-3xl text-cyan-500 mb-1">10+</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Expert Techs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Services visual highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-color)] flex flex-col">
          <img src="/office_network.png" alt="Network Setup" className="w-full h-64 object-cover" />
          <div className="p-8 flex-grow">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Structured Networking</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We design and implement robust LAN and wireless networks tailored for corporate offices, hospitals, and educational campuses. Our certified technicians ensure every cable is perfectly managed and every switch is optimally configured for zero-packet-loss performance.
            </p>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-color)] flex flex-col">
          <img src="/repair_tech.png" alt="Hardware Repair" className="w-full h-64 object-cover" />
          <div className="p-8 flex-grow">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Precision Hardware Repair</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Our state-of-the-art repair lab handles everything from simple RAM upgrades to complex motherboard micro-soldering. We don't just replace parts; we diagnose at the component level to save you money and extend the life of your critical hardware.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Promise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] lg:col-span-1 flex flex-col justify-center">
          <h3 className="font-bold text-2xl text-[var(--text-primary)] mb-6">Our Core Promise</h3>
          <ul className="space-y-6 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-4">
              <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[var(--text-primary)] mb-1">Maximum Uptime</strong>
                Proactive diagnostics to prevent breakdowns.
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[var(--text-primary)] mb-1">Secure Vaulting</strong>
                Stored remote configs for instant technician access.
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[var(--text-primary)] mb-1">Total Transparency</strong>
                Live web portal to track your support history.
              </div>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold text-2xl text-[var(--text-primary)] mb-2">Our Location</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Headquartered in the heart of Bharatpur near the Chaubiskoti intersection. This strategic location allows our rapid-response teams to dispatch and reach any client inside Bharatpur, Hakimchowk, or Narayangarh within our strict 2-hour SLA.
              </p>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-500 bg-cyan-950/30 px-4 py-2 rounded-lg border border-cyan-500/20">
                <MapPin className="w-4 h-4" /> Bharatpur, Chitwan, Nepal
              </div>
            </div>
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-inner h-64 shrink-0">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://maps.google.com/maps?q=Bharatpur,%20Chitwan,%20Nepal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                title="Map of Bharatpur, Chitwan, Nepal"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
