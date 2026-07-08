import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Layout,
  ArrowLeft,
  Lock,
  Loader2,
  Save,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  LogOut,
  X,
  Plus,
  Mail,
  Send,
  Check,
  Package,
  Zap,
  KeyRound,
  Trash2,
  Pencil
} from 'lucide-react';
const renderNotes = (notes: string | null) => {
  if (!notes) return '—';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = notes.match(urlRegex) || [];
  const cleanText = notes.replace(urlRegex, '').trim();
  return (
    <div className="space-y-1">
      <span className="text-xs text-slate-600 block whitespace-pre-line leading-relaxed">{cleanText || 'Details:'}</span>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {urls.map((url, idx) => (
            <a 
              key={idx} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-colors shrink-0"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TenantDashboard() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [activeTab, setActiveTab] = useState<'leads' | 'cms' | 'services' | 'email' | 'settings'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
  const [savingService, setSavingService] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({
    pageTitle: '',
    pageDescription: '',
    heroHeadline: '',
    tagline: '',
    missionText: '',
    heroImageUrl: '',
    servicesHeadline: 'Our Specialised Services',
    servicesDescription: '',
    aboutHeading: 'Our Journey & Core Values',
    aboutUsText: '',
    testimonialText: '',
    testimonialAuthor: '',
    testimonialAuthorRole: '',
    deliveryNote: '',
    contactPhone: '',
    contactEmail: '',
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: '',
    address: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Leads
      const leadsRes = await fetch(`/api/admin/leads?storeSlug=${storeSlug}`, {
        headers: { 'x-admin-password': password },
      });
      const leadsData = await leadsRes.json();
      setLeads(leadsData);

      // Fetch Store Info
      const storeRes = await fetch(`/api/stores/${storeSlug}`);
      const storeInfo = await storeRes.json();
      setStoreData(storeInfo);

      // Fetch Services
      if (storeInfo.services) {
        setServices(storeInfo.services);
      }

      setCmsForm({
        pageTitle: storeInfo.pageTitle || '',
        pageDescription: storeInfo.pageDescription || '',
        heroHeadline: storeInfo.heroHeadline || '',
        tagline: storeInfo.tagline || '',
        missionText: storeInfo.missionText || '',
        heroImageUrl: storeInfo.heroImageUrl || '',
        servicesHeadline: storeInfo.servicesHeadline || 'Our Specialised Services',
        servicesDescription: storeInfo.servicesDescription || '',
        aboutHeading: storeInfo.aboutHeading || 'Our Journey & Core Values',
        aboutUsText: storeInfo.aboutUsText || '',
        testimonialText: storeInfo.testimonialText || '',
        testimonialAuthor: storeInfo.testimonialAuthor || '',
        testimonialAuthorRole: storeInfo.testimonialAuthorRole || '',
        deliveryNote: storeInfo.deliveryNote || '',
        contactPhone: storeInfo.contactPhone || '',
        contactEmail: storeInfo.contactEmail || '',
        instagramUrl: storeInfo.instagramUrl || '',
        facebookUrl: storeInfo.facebookUrl || '',
        tiktokUrl: storeInfo.tiktokUrl || '',
        address: storeInfo.address || '',
      });
      setGalleryImages(Array.isArray(storeInfo.galleryImages) ? storeInfo.galleryImages : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setEmailStatus('error');
      setStatusMessage('Please enter an email address');
      return;
    }

    setEmailStatus('sending');
    setStatusMessage('Sending test email...');

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailStatus('success');
        setStatusMessage(`✅ Test email sent to ${testEmail}! Check your inbox.`);
        setTimeout(() => setTestEmail(''), 2000);
      } else {
        setEmailStatus('error');
        setStatusMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setEmailStatus('error');
      setStatusMessage('Failed to send test email. Check your connection.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [storeSlug, isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLeads([]);
    setStoreData(null);
  };

  const handleLogin = async () => {
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, storeSlug }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || 'Incorrect password');
      }
    } catch (error) {
      setAuthError('Failed to reach the server. Please try again.');
    }
  };

  const handleCmsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/stores/${storeSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ ...cmsForm, galleryImages })
      });
      if (response.ok) {
        const updated = await response.json();
        setStoreData(updated);
        alert('Storefront updated successfully!');
      } else {
        const data = await response.json().catch(() => ({}));
        alert(`Failed to update storefront: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Failed to update storefront');
    } finally {
      setSaving(false);
    }
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({ name: '', description: '', price: '' });
  };

  const handleSaveService = async () => {
    if (!serviceForm.name.trim()) {
      alert('Service name is required');
      return;
    }
    setSavingService(true);
    try {
      const isEditing = Boolean(editingService);
      const res = await fetch('/api/admin/services', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          ...(isEditing ? { id: editingService.id } : {}),
          storeSlug,
          name: serviceForm.name,
          description: serviceForm.description,
          price: serviceForm.price,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setServices(prev =>
          isEditing ? prev.map(s => (s.id === saved.id ? saved : s)) : [...prev, saved]
        );
        resetServiceForm();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to save service');
      }
    } catch (error) {
      alert('Failed to save service');
    } finally {
      setSavingService(false);
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({
      name: service.name || '',
      description: service.description || '',
      price: service.price !== null && service.price !== undefined ? String(service.price) : '',
    });
  };

  const handleDeleteService = async (service: any) => {
    if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: service.id, storeSlug }),
      });
      if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== service.id));
        if (editingService?.id === service.id) resetServiceForm();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete service');
      }
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('New password and confirmation do not match');
      return;
    }
    setPasswordChangeStatus('saving');
    setPasswordChangeMessage('');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSlug, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordChangeStatus('success');
        setPasswordChangeMessage('Password updated successfully. Use it next time you log in.');
        setPassword(newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus('error');
        setPasswordChangeMessage(data.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('Failed to reach the server. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true);
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotPasswordMessage(data.message);
      } else {
        setForgotPasswordError(data.error || 'Failed to send password reset request.');
      }
    } catch (error) {
      setForgotPasswordError('Failed to reach the server. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>

          {!forgotPasswordMode ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{storeSlug?.replace(/-/g, ' ').toUpperCase()} ADMIN</h2>
              <p className="text-slate-500 mb-8 text-sm">Enter the tenant password to manage your unit</p>
              <div className="space-y-4">
                <input 
                  type="password" 
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleLogin();
                  }}
                />
                {authError && (
                  <p className="text-sm font-medium text-rose-600 -mt-2">{authError}</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  Unlock Dashboard
                </button>
                <button
                  onClick={() => {
                    setForgotPasswordMode(true);
                    setForgotPasswordMessage('');
                    setForgotPasswordError('');
                  }}
                  className="inline-block mt-4 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">FORGOT PASSWORD</h2>
              <p className="text-slate-500 mb-6 text-sm">
                A temporary password will be sent to the email address registered for this unit.
              </p>
              
              <div className="space-y-4">
                {forgotPasswordMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-left flex gap-3 text-green-800 text-sm">
                    <Check className="text-green-600 shrink-0 mt-0.5" size={18} />
                    <p>{forgotPasswordMessage}</p>
                  </div>
                )}
                
                {forgotPasswordError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-left flex gap-3 text-rose-800 text-sm">
                    <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                    <p>{forgotPasswordError}</p>
                  </div>
                )}

                {!forgotPasswordMessage && (
                  <button
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Reset Password Email
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setForgotPasswordMode(false)}
                  className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold text-slate-900">Loading your command center...</p>
      </div>
    );
  }

  const isGifting = storeSlug === 'gifting';
  const brandColor = isGifting ? 'bg-rose-500' : 'bg-emerald-500';
  const brandText = isGifting ? 'text-rose-600' : 'text-emerald-600';
  const brandBgLight = isGifting ? 'bg-rose-50' : 'bg-emerald-50';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
               <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{storeData?.name || storeSlug}</h1>
              <p className="text-sm text-slate-500">Manage leads and storefront content</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={16} /> Logout
            </button>

            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('leads')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'leads' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Users size={16} /> Leads
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'email' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Mail size={16} /> Email
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'services' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Package size={16} /> Services
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'cms' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Layout size={16} /> Pages
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'settings' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <KeyRound size={16} /> Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {activeTab === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Service</p>
                    <h3 className="text-2xl font-bold text-slate-900">Resend</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Check size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                    <h3 className="text-2xl font-bold text-slate-900">Active</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <Send size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Domain</p>
                    <h3 className="text-lg font-bold text-slate-900">cleandeep.co.za</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Mail size={20} className="text-green-600" />
                Test Email Service
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Test Email Address</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your-email@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={handleSendTestEmail}
                      disabled={emailStatus === 'sending'}
                      className={cn(
                        'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2',
                        emailStatus === 'sending'
                          ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      )}
                    >
                      {emailStatus === 'sending' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Test Email
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {statusMessage && (
                  <div
                    className={cn(
                      'p-4 rounded-xl flex gap-3 items-start',
                      emailStatus === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    )}
                  >
                    <div className={emailStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {emailStatus === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <p className={emailStatus === 'success' ? 'text-green-800' : 'text-red-800'}>{statusMessage}</p>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>What this does:</strong> Sends a test email to verify your Resend email service is working correctly. Check your inbox (including spam folder) to confirm delivery. Customer booking confirmations will be sent automatically.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Your Services / Products
                </h3>

                {services && services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{service.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                            {service.price !== null && service.price !== undefined && (
                              <p className="text-sm font-bold text-green-600 mt-2">R{parseFloat(service.price).toFixed(2)}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleEditService(service)}
                              className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service)}
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Package size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No services configured yet</p>
                    <p className="text-sm mt-2">Add your first service using the form</p>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-blue-600" />
                  {editingService ? 'Edit Service' : 'Add Service'}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Deep Carpet Clean"
                      value={serviceForm.name}
                      onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea
                      className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Briefly describe this service..."
                      value={serviceForm.description}
                      onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price (R)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="Optional"
                      value={serviceForm.price}
                      onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveService}
                      disabled={savingService}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2",
                        savingService ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {savingService ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {editingService ? 'Update' : 'Add'}
                    </button>
                    {editingService && (
                      <button
                        onClick={resetServiceForm}
                        className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <KeyRound size={20} className="text-slate-700" />
                Login & Password
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Change the password used to access the <strong>{storeSlug}</strong> dashboard at{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/admin/{storeSlug}</code>.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>

                {passwordChangeMessage && (
                  <div
                    className={cn(
                      'p-4 rounded-xl flex gap-3 items-start',
                      passwordChangeStatus === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    )}
                  >
                    <div className={passwordChangeStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {passwordChangeStatus === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <p className={passwordChangeStatus === 'success' ? 'text-green-800' : 'text-red-800'}>{passwordChangeMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordChangeStatus === 'saving'}
                  className={cn(
                    "w-full py-3 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2",
                    passwordChangeStatus === 'saving' ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
                  )}
                >
                  {passwordChangeStatus === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
                  Update Password
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", brandBgLight, brandText)}>
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
                  <h3 className="text-2xl font-bold text-slate-900">{leads.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600")}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Requests</p>
                  <h3 className="text-2xl font-bold text-slate-900">{leads.filter(l => l.status === 'NEW').length}</h3>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-white">
                  <h3 className="text-lg font-bold text-slate-900">Your Incoming Leads</h3>
               </div>
               <div className="overflow-x-auto">
                 {leads.length === 0 ? (
                   <div className="p-20 text-center text-slate-400">
                      <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold">No leads yet. They'll appear here once customers book.</p>
                   </div>
                 ) : (
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-slate-50/50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100">
                         <th className="px-6 py-4">Customer</th>
                         <th className="px-6 py-4">Location</th>
                         <th className="px-6 py-4">Date Requested</th>
                         <th className="px-6 py-4">Details</th>
                         <th className="px-6 py-4">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {leads.map((lead) => (
                         <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                             <div>
                               <p className="text-sm font-bold text-slate-800">{lead.customerName}</p>
                               <p className="text-xs text-slate-500">{lead.customerEmail}</p>
                               <p className="text-xs text-slate-500">{lead.customerPhone}</p>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-slate-500">
                               <MapPin size={14} />
                               <span className="text-sm">{lead.location}</span>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-slate-500">
                               <Calendar size={14} />
                               <span className="text-sm">{lead.requestedDate ? new Date(lead.requestedDate).toLocaleDateString() : 'N/A'}</span>
                             </div>
                           </td>
                            <td className="px-6 py-4 max-w-xs">
                              {renderNotes(lead.notes)}
                            </td>
                           <td className="px-6 py-4">
                             <span className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-bold border",
                               lead.status === 'NEW' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-50 text-slate-700 border-slate-100"
                             )}>
                               {lead.status}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cms' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleCmsUpdate} className="space-y-8">
                {/* 0. Page Settings */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10", brandColor)} />
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>0</span>
                    Page Settings
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Page Title (Browser Tab & Meta)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="e.g. Premium Cleaning Services | Clean Deep"
                        value={cmsForm.pageTitle}
                        onChange={e => setCmsForm({...cmsForm, pageTitle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Page Description (Meta/SEO)</label>
                      <textarea
                        className="w-full h-20 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Brief description for search engines..."
                        value={cmsForm.pageDescription}
                        onChange={e => setCmsForm({...cmsForm, pageDescription: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 1. Hero Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10", brandColor)} />
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>1</span>
                    Hero & Branding
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Contact Phone / WhatsApp</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. 072 359 1276"
                          value={cmsForm.contactPhone}
                          onChange={e => setCmsForm({...cmsForm, contactPhone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Contact Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. info@totally.co.za"
                          value={cmsForm.contactEmail}
                          onChange={e => setCmsForm({...cmsForm, contactEmail: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Physical Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="e.g. Cape Town, South Africa"
                        value={cmsForm.address}
                        onChange={e => setCmsForm({...cmsForm, address: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Facebook Page URL</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. https://facebook.com/cleandeep"
                          value={cmsForm.facebookUrl}
                          onChange={e => setCmsForm({...cmsForm, facebookUrl: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Instagram URL</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. https://instagram.com/cleandeep"
                          value={cmsForm.instagramUrl}
                          onChange={e => setCmsForm({...cmsForm, instagramUrl: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">TikTok URL</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. https://tiktok.com/@cleandeep"
                          value={cmsForm.tiktokUrl}
                          onChange={e => setCmsForm({...cmsForm, tiktokUrl: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Hero Banner Image (URL)</label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                            placeholder="https://images.unsplash.com/..."
                            value={cmsForm.heroImageUrl}
                            onChange={e => setCmsForm({...cmsForm, heroImageUrl: e.target.value})}
                          />
                        </div>
                        {cmsForm.heroImageUrl && (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img src={cmsForm.heroImageUrl} referrerPolicy="no-referrer" alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Small Tagline (Optional)</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. Premium Cleaning Service"
                          value={cmsForm.tagline}
                          onChange={e => setCmsForm({...cmsForm, tagline: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Hero Main Headline</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="Headline..."
                          value={cmsForm.heroHeadline}
                          onChange={e => setCmsForm({...cmsForm, heroHeadline: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Mission Statement / Intro</label>
                      <textarea 
                        className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Summarize your mission..."
                        value={cmsForm.missionText}
                        onChange={e => setCmsForm({...cmsForm, missionText: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Delivery / Availability Note <span className="text-rose-400">(Gifting)</span></label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="e.g. Free delivery within Panorama & Plattekloof area"
                        value={cmsForm.deliveryNote}
                        onChange={e => setCmsForm({...cmsForm, deliveryNote: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Services Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>2</span>
                    Services Grid
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Section Heading</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="e.g. Our Specialised Services"
                        value={cmsForm.servicesHeadline}
                        onChange={e => setCmsForm({...cmsForm, servicesHeadline: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Section Description (Optional)</label>
                      <textarea
                        className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Brief intro to your services..."
                        value={cmsForm.servicesDescription}
                        onChange={e => setCmsForm({...cmsForm, servicesDescription: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. About & Story Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>3</span>
                    About & Values Section
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Section Title</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="Our Story..."
                        value={cmsForm.aboutHeading}
                        onChange={e => setCmsForm({...cmsForm, aboutHeading: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">The Full Story</label>
                      <textarea 
                        className="w-full h-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Tell your story..."
                        value={cmsForm.aboutUsText}
                        onChange={e => setCmsForm({...cmsForm, aboutUsText: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Testimonials */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>4</span>
                    Client Testimonial
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Feedback Quote</label>
                      <textarea 
                        className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Enter client testimonial text..."
                        value={cmsForm.testimonialText}
                        onChange={e => setCmsForm({...cmsForm, testimonialText: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Client Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. Moulana Luqmaan"
                          value={cmsForm.testimonialAuthor}
                          onChange={e => setCmsForm({...cmsForm, testimonialAuthor: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Client Role / Label</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. Community Leader"
                          value={cmsForm.testimonialAuthorRole}
                          onChange={e => setCmsForm({...cmsForm, testimonialAuthorRole: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Gallery Images */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>5</span>
                    Gallery Images & Media
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-2">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <ImageIcon size={14} /> How to Add Images
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Method 1:</strong> Paste a direct image URL (e.g., from Unsplash, Imgur, or your hosting)</li>
                      <li><strong>Method 2:</strong> Upload files to <code className="bg-white px-2 py-0.5 rounded text-slate-500">public/images/{storeSlug}/</code> folder, then reference as <code className="bg-white px-2 py-0.5 rounded text-slate-500">/images/{storeSlug}/photo.jpg</code></li>
                      <li><strong>First image:</strong> Will display larger (featured) on service pages</li>
                      <li><strong>Captions:</strong> Optional - adds text overlay to images in gallery</li>
                    </ul>
                  </div>

                  <div className="space-y-3 mb-4">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        {img.url && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder="Image URL (https://... or /images/gifting/photo.jpg)"
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-colors"
                          value={img.url}
                          onChange={e => {
                            const updated = [...galleryImages];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setGalleryImages(updated);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          className="w-40 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-colors"
                          value={img.caption}
                          onChange={e => {
                            const updated = [...galleryImages];
                            updated[idx] = { ...updated[idx], caption: e.target.value };
                            setGalleryImages(updated);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setGalleryImages([...galleryImages, { url: '', caption: '' }])}
                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Image
                  </button>
                </div>

                <div className="sticky bottom-6 z-20">
                  <button 
                    disabled={saving}
                    className={cn(
                      "w-full py-4 rounded-2xl text-white font-bold transition-all shadow-2xl flex items-center justify-center gap-4",
                      brandColor,
                      saving ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-emerald-500/40"
                    )}
                  >
                    {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                    <span className="text-lg">
                      {saving ? "Publishing Updates..." : "Save & Publish Storefront"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview Guide</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Updates to text and images are reflected instantly on the main storefront once you click "Publish".
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <a 
                      href={`/services/${storeSlug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors"
                    >
                      View Live StoreFront <ArrowLeft size={14} className="rotate-180" />
                    </a>
                  </div>
                </div>
                <div className={cn("absolute -bottom-12 -right-12 w-32 h-32 blur-3xl opacity-20 rounded-full", brandColor)} />
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-4">Editing Tips</h4>
                <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                  <li>Keep headlines punchy (under 60 chars)</li>
                  <li>Mission statements should be focused and trustworthy</li>
                  <li>Story content builds personal connection with customers</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
