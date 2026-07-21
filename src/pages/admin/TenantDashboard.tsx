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
  Pencil,
  Upload,
  Star,
  Eye,
  EyeOff,
  LayoutTemplate,
  Type,
  Move
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { uploadImage } from '../../lib/uploadImage';

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
  const [activeTab, setActiveTab] = useState<'leads' | 'cms' | 'services' | 'builder' | 'email' | 'settings'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [password, setPassword] = useState('totally2026');
  const [authError, setAuthError] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
  const [savingService, setSavingService] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialForm, setTestimonialForm] = useState({ authorName: '', authorRole: '', quote: '', rating: 5, avatarUrl: '', isPublished: true });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingTestimonialAvatar, setUploadingTestimonialAvatar] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Page Builder (freeform custom content blocks) state
  const [customBlocks, setCustomBlocks] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [savingBlocks, setSavingBlocks] = useState(false);
  const [blocksSaveStatus, setBlocksSaveStatus] = useState('');
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
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

  // Lead editing & client-update state
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editLeadStatus, setEditLeadStatus] = useState('');
  const [clientUpdateMsg, setClientUpdateMsg] = useState('');
  const [clientUpdateStatus, setClientUpdateStatus] = useState('');
  const [sendingUpdate, setSendingUpdate] = useState(false);
  const [savingLeadStatus, setSavingLeadStatus] = useState(false);

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({
    pageTitle: '',
    pageDescription: '',
    heroHeadline: '',
    tagline: '',
    missionText: '',
    heroImageUrl: '',
    heroImageEnabled: true,
    heroImageOpacity: 10,
    aboutImageUrl: '',
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
        heroImageEnabled: storeInfo.heroImageEnabled !== false,
        heroImageOpacity: storeInfo.heroImageOpacity ?? 10,
        aboutImageUrl: storeInfo.aboutImageUrl || '',
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
      setTestimonials(Array.isArray(storeInfo.testimonials) ? storeInfo.testimonials : []);
      setCustomBlocks(Array.isArray(storeInfo.customBlocks) ? storeInfo.customBlocks : []);
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

  const resetTestimonialForm = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ authorName: '', authorRole: '', quote: '', rating: 5, avatarUrl: '', isPublished: true });
  };

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.authorName.trim() || !testimonialForm.quote.trim()) {
      alert('Client name and quote are required');
      return;
    }
    setSavingTestimonial(true);
    try {
      const isEditing = Boolean(editingTestimonial);
      const res = await fetch('/api/admin/testimonials', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          ...(isEditing ? { id: editingTestimonial.id } : {}),
          storeSlug,
          ...testimonialForm,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setTestimonials(prev =>
          isEditing ? prev.map(t => (t.id === saved.id ? saved : t)) : [...prev, saved]
        );
        resetTestimonialForm();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to save testimonial');
      }
    } catch (error) {
      alert('Failed to save testimonial');
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleEditTestimonial = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      authorName: testimonial.authorName || '',
      authorRole: testimonial.authorRole || '',
      quote: testimonial.quote || '',
      rating: testimonial.rating || 5,
      avatarUrl: testimonial.avatarUrl || '',
      isPublished: testimonial.isPublished ?? true,
    });
  };

  const handleDeleteTestimonial = async (testimonial: any) => {
    if (!confirm(`Delete the review from "${testimonial.authorName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: testimonial.id, storeSlug }),
      });
      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== testimonial.id));
        if (editingTestimonial?.id === testimonial.id) resetTestimonialForm();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  const handleTogglePublish = async (testimonial: any) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: testimonial.id, storeSlug, isPublished: !testimonial.isPublished }),
      });
      if (res.ok) {
        const saved = await res.json();
        setTestimonials(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      }
    } catch (error) {
      console.error('Failed to toggle testimonial visibility', error);
    }
  };

  const handleUploadImage = async (file: File, target: 'about' | 'hero' | 'testimonial' | number) => {
    setUploadError('');
    if (target === 'about') setUploadingAboutImage(true);
    else if (target === 'hero') setUploadingHeroImage(true);
    else if (target === 'testimonial') setUploadingTestimonialAvatar(true);
    else setUploadingGalleryIdx(target);

    try {
      const folder = target === 'about' ? 'about' : target === 'hero' ? 'hero' : target === 'testimonial' ? 'testimonials' : 'gallery';
      const url = await uploadImage(file, storeSlug!, password, folder);
      if (target === 'about') {
        setCmsForm(prev => ({ ...prev, aboutImageUrl: url }));
      } else if (target === 'hero') {
        setCmsForm(prev => ({ ...prev, heroImageUrl: url }));
      } else if (target === 'testimonial') {
        setTestimonialForm(prev => ({ ...prev, avatarUrl: url }));
      } else {
        setGalleryImages(prev => {
          const updated = [...prev];
          updated[target] = { ...updated[target], url };
          return updated;
        });
      }
    } catch (error) {
      setUploadError((error as Error).message || 'Failed to upload image');
    } finally {
      if (target === 'about') setUploadingAboutImage(false);
      else if (target === 'hero') setUploadingHeroImage(false);
      else if (target === 'testimonial') setUploadingTestimonialAvatar(false);
      else setUploadingGalleryIdx(null);
    }
  };

  // ── Page Builder: freeform custom content blocks ──────────────────────────
  const addTextBlock = () => {
    const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newBlock = { id, type: 'text', content: 'Double-click to edit this text...', x: 35, y: 40, width: 30, fontSize: 'md', color: '#1e293b' };
    setCustomBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(id);
  };

  const addImageBlock = async (file: File) => {
    const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setUploadingBlockId(id);
    setUploadError('');
    try {
      const url = await uploadImage(file, storeSlug!, password, 'custom-blocks');
      const newBlock = { id, type: 'image', content: url, x: 35, y: 40, width: 25 };
      setCustomBlocks(prev => [...prev, newBlock]);
      setSelectedBlockId(id);
    } catch (error) {
      setUploadError((error as Error).message || 'Failed to upload image');
    } finally {
      setUploadingBlockId(null);
    }
  };

  const updateBlock = (id: string, patch: Record<string, any>) => {
    setCustomBlocks(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  };

  const deleteBlock = (id: string) => {
    setCustomBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleBlockMouseDown = (e: React.MouseEvent, block: any) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const blockPxX = (block.x / 100) * rect.width;
    const blockPxY = (block.y / 100) * rect.height;
    dragRef.current = {
      id: block.id,
      offsetX: e.clientX - rect.left - blockPxX,
      offsetY: e.clientY - rect.top - blockPxY,
    };
    setSelectedBlockId(block.id);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      let xPct = ((e.clientX - rect.left - dragRef.current.offsetX) / rect.width) * 100;
      let yPct = ((e.clientY - rect.top - dragRef.current.offsetY) / rect.height) * 100;
      xPct = Math.max(0, Math.min(95, xPct));
      yPct = Math.max(0, Math.min(95, yPct));
      const id = dragRef.current.id;
      setCustomBlocks(prev => prev.map(b => (b.id === id ? { ...b, x: xPct, y: yPct } : b)));
    };
    const handleMouseUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handlePublishBlocks = async () => {
    setSavingBlocks(true);
    setBlocksSaveStatus('');
    try {
      const response = await fetch(`/api/stores/${storeSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ customBlocks }),
      });
      if (response.ok) {
        setBlocksSaveStatus('success');
      } else {
        const data = await response.json().catch(() => ({}));
        setBlocksSaveStatus('error:' + (data.error || 'Failed to publish'));
      }
    } catch (error) {
      setBlocksSaveStatus('error:Network error');
    } finally {
      setSavingBlocks(false);
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

  const openLeadDetail = (lead: any) => {
    setSelectedLead(lead);
    setEditLeadStatus(lead.status || 'NEW');
    setClientUpdateMsg('');
    setClientUpdateStatus('');
  };

  const handleSaveLeadStatus = async () => {
    if (!selectedLead) return;
    setSavingLeadStatus(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ leadId: selectedLead.id, storeSlug, status: editLeadStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        setSelectedLead(updated);
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Failed to update status');
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setSavingLeadStatus(false);
    }
  };

  const handleSendClientUpdate = async () => {
    if (!selectedLead || !clientUpdateMsg.trim()) return;
    setSendingUpdate(true);
    setClientUpdateStatus('');
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          leadId: selectedLead.id,
          storeSlug,
          message: clientUpdateMsg,
          newStatus: editLeadStatus,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setClientUpdateStatus('success');
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: editLeadStatus } : l));
        setSelectedLead((prev: any) => ({ ...prev, status: editLeadStatus }));
      } else {
        setClientUpdateStatus('error:' + (data.error || 'Failed to send'));
      }
    } catch (e) {
      setClientUpdateStatus('error:Network error');
    } finally {
      setSendingUpdate(false);
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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{storeData?.name || storeSlug}</h1>
                <select
                  value={storeSlug}
                  onChange={(e) => window.location.href = `/admin/${e.target.value}`}
                  className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <option value="deep-cleaning">CleanDeep</option>
                  <option value="pressure-cleaning">High Pressure</option>
                  <option value="gifting">Gifting</option>
                </select>
              </div>
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
                onClick={() => setActiveTab('builder')}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'builder' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutTemplate size={16} /> Page Builder
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

        {activeTab === 'builder' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><LayoutTemplate size={18} className="text-emerald-500" /> Page Builder</h3>
                  <p className="text-xs text-slate-500 mt-1">Add text and images anywhere in this section, drag them into place, then publish.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={addTextBlock}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all"
                  >
                    <Type size={16} /> Add Text
                  </button>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer">
                    <ImageIcon size={16} /> Add Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) addImageBlock(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
              {uploadError && <p className="text-xs font-medium text-rose-600 mb-3">{uploadError}</p>}

              <div className={cn("grid gap-6", selectedBlockId ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1")}>
                {/* Canvas */}
                <div
                  ref={canvasRef}
                  onMouseDown={() => setSelectedBlockId(null)}
                  className="relative w-full rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden select-none"
                  style={{
                    height: 560,
                    backgroundImage: 'linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  {customBlocks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                      <p className="text-sm text-slate-400 font-medium">
                        <Move size={22} className="mx-auto mb-2 opacity-40" /><br />
                        This canvas is empty. Click "Add Text" or "Add Image" above, then drag it anywhere in here.
                      </p>
                    </div>
                  )}
                  {customBlocks.map(block => (
                    <div
                      key={block.id}
                      onMouseDown={e => handleBlockMouseDown(e, block)}
                      className={cn(
                        "absolute cursor-move rounded-lg transition-shadow",
                        selectedBlockId === block.id ? "ring-2 ring-emerald-500 shadow-lg z-10" : "hover:ring-1 hover:ring-slate-300"
                      )}
                      style={{ left: `${block.x}%`, top: `${block.y}%`, width: `${block.width}%` }}
                    >
                      {block.type === 'text' ? (
                        <p
                          className={cn(
                            "px-2 py-1 whitespace-pre-wrap break-words font-medium",
                            block.fontSize === 'sm' && "text-sm",
                            block.fontSize === 'md' && "text-base",
                            block.fontSize === 'lg' && "text-xl",
                            block.fontSize === 'xl' && "text-3xl font-bold"
                          )}
                          style={{ color: block.color || '#1e293b' }}
                        >
                          {block.content}
                        </p>
                      ) : (
                        <img src={block.content} referrerPolicy="no-referrer" alt="" className="w-full h-auto rounded-lg pointer-events-none" draggable={false} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected block properties */}
                {selectedBlockId && (() => {
                  const block = customBlocks.find(b => b.id === selectedBlockId);
                  if (!block) return null;
                  return (
                    <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-200 h-fit">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">{block.type === 'text' ? 'Text Block' : 'Image Block'}</p>
                        <button
                          type="button"
                          onClick={() => deleteBlock(block.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {block.type === 'text' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Text</label>
                            <textarea
                              rows={4}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none"
                              value={block.content}
                              onChange={e => updateBlock(block.id, { content: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Size</label>
                            <div className="grid grid-cols-4 gap-2">
                              {['sm', 'md', 'lg', 'xl'].map(size => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => updateBlock(block.id, { fontSize: size })}
                                  className={cn(
                                    "py-2 rounded-lg text-xs font-bold border transition-all uppercase",
                                    block.fontSize === size ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                  )}
                                >{size}</button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Color</label>
                            <input
                              type="color"
                              value={block.color || '#1e293b'}
                              onChange={e => updateBlock(block.id, { color: e.target.value })}
                              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Width</label>
                          <input
                            type="range"
                            min={10}
                            max={90}
                            value={block.width}
                            onChange={e => updateBlock(block.id, { width: Number(e.target.value) })}
                            className="w-full accent-emerald-500"
                          />
                          {uploadingBlockId === block.id && (
                            <p className="text-xs text-slate-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading...</p>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">Drag the block on the canvas to reposition it.</p>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={handlePublishBlocks}
                  disabled={savingBlocks}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    savingBlocks ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                  )}
                >
                  {savingBlocks ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {savingBlocks ? 'Publishing...' : 'Publish to Live Site'}
                </button>
                {blocksSaveStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600"><Check size={16} /> Published!</span>
                )}
                {blocksSaveStatus.startsWith('error:') && (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-rose-600"><AlertCircle size={16} /> {blocksSaveStatus.replace('error:', '')}</span>
                )}
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', value: leads.length, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'New', value: leads.filter(l => l.status === 'NEW').length, color: 'bg-blue-50 text-blue-600' },
                { label: 'Confirmed', value: leads.filter(l => l.status === 'CONFIRMED').length, color: 'bg-green-50 text-green-600' },
                { label: 'Completed', value: leads.filter(l => l.status === 'COMPLETED').length, color: 'bg-slate-50 text-slate-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={cn('grid gap-6', selectedLead ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
              {/* Bookings list */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users size={18} className="text-emerald-500" /> Bookings</h3>
                  <button onClick={fetchData} className="text-xs text-emerald-600 font-bold hover:underline">Refresh</button>
                </div>
                {leads.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <AlertCircle size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-sm">No bookings yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {leads.map(lead => {
                      const statusStyles: Record<string, string> = {
                        NEW: 'bg-blue-50 text-blue-700 border-blue-100',
                        CONTACTED: 'bg-purple-50 text-purple-700 border-purple-100',
                        CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        COMPLETED: 'bg-green-50 text-green-700 border-green-100',
                        CANCELLED: 'bg-red-50 text-red-700 border-red-100',
                      };
                      return (
                        <button
                          key={lead.id}
                          onClick={() => openLeadDetail(lead)}
                          className={cn(
                            'w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors',
                            selectedLead?.id === lead.id && 'bg-emerald-50/60'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate">{lead.customerName}</p>
                              <p className="text-xs text-slate-500">{lead.customerPhone} • {lead.location}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {lead.requestedDate ? new Date(lead.requestedDate).toLocaleDateString('en-ZA') : 'No date'} • {new Date(lead.createdAt).toLocaleDateString('en-ZA')}
                              </p>
                            </div>
                            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 mt-0.5', statusStyles[lead.status] || statusStyles.NEW)}>
                              {lead.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Booking detail + actions panel */}
              {selectedLead && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><FileText size={16} className="text-emerald-500" /> Booking Detail</h3>
                    <button onClick={() => setSelectedLead(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Customer info */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Customer</p>
                      <p className="font-bold text-slate-900">{selectedLead.customerName}</p>
                      <a href={`tel:${selectedLead.customerPhone}`} className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline">
                        <span>📞</span> {selectedLead.customerPhone}
                      </a>
                      <a href={`mailto:${selectedLead.customerEmail}`} className="flex items-center gap-2 text-slate-500 text-sm hover:underline">
                        <Mail size={14} /> {selectedLead.customerEmail}
                      </a>
                      <p className="flex items-center gap-2 text-slate-500 text-sm"><MapPin size={14} /> {selectedLead.location}</p>
                      {selectedLead.requestedDate && (
                        <p className="flex items-center gap-2 text-slate-500 text-sm"><Calendar size={14} /> {new Date(selectedLead.requestedDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      )}
                    </div>

                    {/* Notes */}
                    {selectedLead.notes && (
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Booking Details</p>
                        {renderNotes(selectedLead.notes)}
                      </div>
                    )}

                    {/* Status update */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Status</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['NEW','CONTACTED','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
                          <button
                            key={s}
                            onClick={() => setEditLeadStatus(s)}
                            className={cn(
                              'py-2 rounded-xl text-xs font-bold border transition-all',
                              editLeadStatus === s
                                ? s === 'CANCELLED' ? 'bg-red-500 text-white border-red-500'
                                  : s === 'COMPLETED' ? 'bg-green-500 text-white border-green-500'
                                  : s === 'CONFIRMED' ? 'bg-emerald-500 text-white border-emerald-500'
                                  : s === 'CONTACTED' ? 'bg-purple-500 text-white border-purple-500'
                                  : 'bg-blue-500 text-white border-blue-500'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            )}
                          >{s}</button>
                        ))}
                      </div>
                      <button
                        onClick={handleSaveLeadStatus}
                        disabled={savingLeadStatus || editLeadStatus === selectedLead.status}
                        className={cn(
                          'w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
                          savingLeadStatus || editLeadStatus === selectedLead.status
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        )}
                      >
                        {savingLeadStatus ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Status
                      </button>
                    </div>

                    {/* Send update to client */}
                    <div className="space-y-3 border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Send Update to Client</p>
                      <textarea
                        rows={4}
                        placeholder="e.g. Hi! We have confirmed your booking for Tuesday. Our team will arrive between 9am–11am. Please ensure the area is accessible."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none resize-none"
                        value={clientUpdateMsg}
                        onChange={e => setClientUpdateMsg(e.target.value)}
                      />
                      <button
                        onClick={handleSendClientUpdate}
                        disabled={sendingUpdate || !clientUpdateMsg.trim()}
                        className={cn(
                          'w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
                          sendingUpdate || !clientUpdateMsg.trim()
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                        )}
                      >
                        {sendingUpdate ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Send Update to {selectedLead.customerName.split(' ')[0]}
                      </button>
                      {clientUpdateStatus === 'success' && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-700 text-sm">
                          <Check size={16} /> Email sent successfully!
                        </div>
                      )}
                      {clientUpdateStatus.startsWith('error:') && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                          <AlertCircle size={16} /> {clientUpdateStatus.replace('error:', '')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

                    <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Hero Background Image</label>
                        <button
                          type="button"
                          onClick={() => setCmsForm({ ...cmsForm, heroImageEnabled: !cmsForm.heroImageEnabled })}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors shrink-0",
                            cmsForm.heroImageEnabled ? "bg-emerald-500" : "bg-slate-300"
                          )}
                          title={cmsForm.heroImageEnabled ? "Background image is ON — click to turn off" : "Background image is OFF — click to turn on"}
                        >
                          <span className={cn(
                            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                            cmsForm.heroImageEnabled && "translate-x-5"
                          )} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 -mt-1">A faint background image behind your hero headline. Turn it off any time without losing the uploaded photo.</p>

                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {cmsForm.heroImageUrl && (
                            <img src={cmsForm.heroImageUrl} referrerPolicy="no-referrer" alt="Hero background preview" className="w-full h-full object-cover" style={{ opacity: cmsForm.heroImageEnabled ? cmsForm.heroImageOpacity / 100 : 1 }} />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <label className={cn(
                            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all",
                            uploadingHeroImage ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
                          )}>
                            {uploadingHeroImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {uploadingHeroImage ? 'Uploading...' : 'Upload Photo'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploadingHeroImage}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage(file, 'hero');
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Opacity / Fade</label>
                              <span className="text-xs font-bold text-slate-600">{cmsForm.heroImageOpacity}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={cmsForm.heroImageOpacity}
                              disabled={!cmsForm.heroImageEnabled}
                              onChange={e => setCmsForm({ ...cmsForm, heroImageOpacity: Number(e.target.value) })}
                              className="w-full accent-emerald-500 disabled:opacity-40"
                            />
                          </div>
                        </div>
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

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">About Section Photo</label>
                      <p className="text-xs text-slate-400 -mt-1 mb-2">This is the photo shown next to your story on the live site.</p>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {cmsForm.aboutImageUrl && (
                            <img src={cmsForm.aboutImageUrl} referrerPolicy="no-referrer" alt="About preview" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className={cn(
                            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all",
                            uploadingAboutImage ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
                          )}>
                            {uploadingAboutImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {uploadingAboutImage ? 'Uploading...' : 'Upload Photo'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploadingAboutImage}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage(file, 'about');
                                e.target.value = '';
                              }}
                            />
                          </label>
                          <p className="text-[11px] text-slate-400">JPG, PNG, WEBP or GIF, up to 3MB.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Testimonials */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", brandColor)}>4</span>
                    Client Testimonials
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Add real reviews from real clients. Only <strong>published</strong> reviews appear on your live site — use the eye icon to hide one without deleting it.
                  </p>

                  {testimonials.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {testimonials.map(t => (
                        <div key={t.id} className={cn("p-4 border rounded-xl transition-colors", t.isPublished ? "border-slate-200" : "border-slate-100 bg-slate-50/50 opacity-60")}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                {t.avatarUrl && <img src={t.avatarUrl} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-900 text-sm truncate">{t.authorName}</p>
                                  <div className="flex shrink-0">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className={i <= t.rating ? "text-amber-400 fill-current" : "text-slate-200 fill-current"} />)}
                                  </div>
                                </div>
                                {t.authorRole && <p className="text-xs text-slate-400">{t.authorRole}</p>}
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.quote}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleTogglePublish(t)}
                                title={t.isPublished ? 'Published — click to hide' : 'Hidden — click to publish'}
                                className={cn(
                                  "w-9 h-9 rounded-lg transition-colors flex items-center justify-center",
                                  t.isPublished ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                )}
                              >
                                {t.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditTestimonial(t)}
                                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center justify-center"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTestimonial(t)}
                                className="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                    <p className="text-xs font-bold text-slate-700">{editingTestimonial ? 'Edit Review' : 'Add a New Review'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. Sarah Adams"
                          value={testimonialForm.authorName}
                          onChange={e => setTestimonialForm({ ...testimonialForm, authorName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role / Area (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all"
                          placeholder="e.g. Homeowner, Maitland"
                          value={testimonialForm.authorRole}
                          onChange={e => setTestimonialForm({ ...testimonialForm, authorRole: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Review Text</label>
                      <textarea
                        className="w-full h-24 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 outline-none transition-all resize-none"
                        placeholder="Paste or type what the client actually said..."
                        value={testimonialForm.quote}
                        onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Rating</label>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => setTestimonialForm({ ...testimonialForm, rating: i })}
                              className="p-0.5"
                            >
                              <Star size={22} className={i <= testimonialForm.rating ? "text-amber-400 fill-current" : "text-slate-200 fill-current"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Client Photo (Optional)</label>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
                            {testimonialForm.avatarUrl && <img src={testimonialForm.avatarUrl} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />}
                          </div>
                          <label className={cn(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all",
                            uploadingTestimonialAvatar ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-400"
                          )}>
                            {uploadingTestimonialAvatar ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            Upload
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploadingTestimonialAvatar}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage(file, 'testimonial');
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    {uploadError && <p className="text-xs font-medium text-rose-600">{uploadError}</p>}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveTestimonial}
                        disabled={savingTestimonial}
                        className={cn(
                          "px-6 py-2.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2",
                          savingTestimonial ? "bg-slate-300 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
                        )}
                      >
                        {savingTestimonial ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {editingTestimonial ? 'Update Review' : 'Add Review'}
                      </button>
                      {editingTestimonial && (
                        <button
                          type="button"
                          onClick={resetTestimonialForm}
                          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all"
                        >
                          Cancel
                        </button>
                      )}
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
                      <ImageIcon size={14} /> Show Off Your Completed Jobs
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                      <li>Click <strong>Upload a Job Photo</strong> below and pick a photo straight from your device — no need to host it anywhere else.</li>
                      <li><strong>First image:</strong> Displays larger (featured) on the live site.</li>
                      <li><strong>Captions:</strong> Optional — adds a short text overlay to the photo (e.g. "Carpet — Before & After").</li>
                    </ul>
                  </div>

                  <div className="space-y-3 mb-4">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          {img.url && <img src={img.url} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />}
                        </div>
                        <label className={cn(
                          "shrink-0 inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all",
                          uploadingGalleryIdx === idx ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-400"
                        )}>
                          {uploadingGalleryIdx === idx ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {img.url ? 'Replace' : 'Upload'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={uploadingGalleryIdx === idx}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadImage(file, idx);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-colors"
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

                  {uploadError && <p className="text-xs font-medium text-rose-600 mb-3">{uploadError}</p>}

                  <button
                    type="button"
                    onClick={() => setGalleryImages([...galleryImages, { url: '', caption: '' }])}
                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Another Photo Slot
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
