import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ArrowLeft,
  Lock,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const [activeStore, setActiveStore] = useState('deep-cleaning');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const stores = [
    { id: 'deep-cleaning', name: 'Deep Cleaning' },
    { id: 'pressure-cleaning', name: 'High Pressure' },
    { id: 'gifting', name: 'Gifting' }
  ];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/leads?storeSlug=${activeStore}`, {
        headers: { 'x-admin-password': password },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [activeStore, isAuthenticated]);

  const stats = [
    { label: 'New Leads (Total)', value: leads.length.toString(), change: 'Live', icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Jobs', value: leads.filter(l => l.status === 'NEW').length.toString(), change: 'Pending', icon: <Briefcase size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Revenue (Est)', value: 'Coming Soon', change: 'Tracking TBD', icon: <TrendingUp size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'QUOTED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const filteredLeads = searchQuery.trim()
    ? leads.filter(l =>
        l.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leads;

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLeads([]);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'NEW': return <AlertCircle size={12} />;
      case 'QUOTED': return <Clock size={12} />;
      case 'COMPLETED': return <CheckCircle2 size={12} />;
      default: return null;
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h2>
          <p className="text-slate-500 mb-8 text-sm">Please enter the command center password</p>
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
            <Link to="/" className="inline-block mt-4 text-sm text-slate-500 hover:text-emerald-500">
               Return to Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay for small screens could be added here */}
      
      {/* Static Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">T</div>
          <span className="text-xl font-black text-slate-900 tracking-tight">TotalLŸ</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors mb-4 border border-slate-100">
            <ArrowLeft size={20} /> Back to Website
          </Link>
          <a href="#" className="flex items-center gap-3 p-3 text-emerald-600 bg-emerald-50 rounded-xl font-semibold">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <div className="pt-2 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Stores</div>
          <Link to="/admin/deep-cleaning" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-sm">
            <Briefcase size={16} /> Deep Cleaning
          </Link>
          <Link to="/admin/pressure-cleaning" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-sm">
            <Briefcase size={16} /> High Pressure
          </Link>
          <Link to="/admin/gifting" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-sm">
            <Briefcase size={16} /> Gifting
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 w-full rounded-xl transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">Administrator</div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64 bg-slate-50"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-800">TotalŸ Admin</p>
                   <p className="text-xs text-slate-500">cleandeep.co.za</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
             </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
          
          {/* Store Selector & Metrics Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 self-start">
              {stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => setActiveStore(store.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    activeStore === store.id 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  )}
                >
                  {store.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter size={16} /> Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                Generate Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow cursor-default"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky left-0 right-0">
               <h3 className="text-lg font-bold text-slate-900">Recent Service Requests</h3>
               <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
                 View All Requests <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
               </button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                   <Loader2 size={40} className="animate-spin text-emerald-500" />
                   <p className="font-medium">Fetching real-time leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                   <AlertCircle size={40} />
                   <p className="font-medium">No leads found for this business unit yet.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead, idx) => (
                      <motion.tr 
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                               {lead.customerName.split(' ').map((n: string) => n[0]).join('')}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-slate-800">{lead.customerName}</p>
                               <p className="text-xs text-slate-500">{lead.customerEmail}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{lead.customerPhone || '—'}</span>
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
                            "px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit",
                            getStatusStyles(lead.status)
                          )}>
                            {getStatusIcon(lead.status)}
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <MoreHorizontal size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 text-center">
               <p className="text-xs text-slate-400 font-medium tracking-wide">Showing {filteredLeads.length} of {leads.length} request entries in command center</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
