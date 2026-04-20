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
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TenantDashboard() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [activeTab, setActiveTab] = useState<'leads' | 'cms'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({
    heroHeadline: '',
    tagline: '',
    missionText: '',
    aboutUsText: '',
    heroImageUrl: '',
    servicesHeading: 'Our Specialised Services',
    aboutHeading: 'Our Journey & Core Values',
    testimonialText: '',
    testimonialAuthor: '',
    testimonialAuthorRole: ''
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
      
      setCmsForm({
        heroHeadline: storeInfo.heroHeadline || '',
        tagline: storeInfo.tagline || '',
        missionText: storeInfo.missionText || '',
        aboutUsText: storeInfo.aboutUsText || '',
        heroImageUrl: storeInfo.heroImageUrl || '',
        servicesHeading: storeInfo.servicesHeading || 'Our Specialised Services',
        aboutHeading: storeInfo.aboutHeading || 'Our Journey & Core Values',
        testimonialText: storeInfo.testimonialText || '',
        testimonialAuthor: storeInfo.testimonialAuthor || '',
        testimonialAuthorRole: storeInfo.testimonialAuthorRole || ''
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [storeSlug, isAuthenticated]);

  const handleCmsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/stores/${storeSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(cmsForm)
      });
      if (response.ok) {
        const updated = await response.json();
        setStoreData(updated);
        alert('Storefront updated successfully!');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Failed to update storefront');
    } finally {
      setSaving(false);
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{storeSlug?.replace('-', ' ').toUpperCase()} ADMIN</h2>
          <p className="text-slate-500 mb-8 text-sm">Enter the tenant password to manage your unit</p>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
                  if (res.ok) setIsAuthenticated(true); else alert('Incorrect password');
                }
              }}
            />
            <button 
              onClick={async () => {
                const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
                if (res.ok) setIsAuthenticated(true); else alert('Incorrect password');
              }}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Unlock Dashboard
            </button>
          </div>
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

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => setActiveTab('leads')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'leads' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Users size={18} /> Lead Manager
            </button>
            <button 
              onClick={() => setActiveTab('cms')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'cms' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Layout size={18} /> Storefront Editor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {activeTab === 'leads' ? (
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
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleCmsUpdate} className="space-y-8">
                {/* 1. Hero Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10", brandColor)} />
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>1</span>
                    Hero & Branding
                  </h3>
                  
                  <div className="space-y-6">
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
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Section Title</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                        placeholder="e.g. Our Specialised Services"
                        value={cmsForm.servicesHeading}
                        onChange={e => setCmsForm({...cmsForm, servicesHeading: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. About & Story Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>3</span>
                    About & Values
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
