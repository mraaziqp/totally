import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Upload,
  Settings,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Send,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
  storeSlug: string;
  storeName: string;
}

export default function AdminDashboard({ storeSlug, storeName }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'images' | 'pages' | 'settings'>('email');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string }>>([]);

  // Test Email Function
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

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // In production, upload to cloud storage
        // For now, show local preview
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [
              ...prev,
              {
                url: event.target?.result as string,
                name: file.name,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{storeName} - Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Manage emails, images, pages, and settings</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2 py-4">
            {[
              { id: 'email', label: 'Email Manager', icon: Mail },
              { id: 'images', label: 'Image Gallery', icon: ImageIcon },
              { id: 'pages', label: 'Page Manager', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                  activeTab === id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* EMAIL MANAGER TAB */}
        {activeTab === 'email' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
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
                    <strong>What this does:</strong> Sends a test email to verify your Resend email service is working
                    correctly. Check your inbox (including spam folder) to confirm delivery.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* IMAGE GALLERY TAB */}
        {activeTab === 'images' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                Upload Images
              </h3>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                      <Upload size={32} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">Click to upload images</p>
                      <p className="text-sm text-slate-500">Or drag and drop (JPG, PNG, WebP)</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Uploaded Images ({uploadedImages.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                        <button
                          onClick={() =>
                            setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PAGE MANAGER TAB */}
        {activeTab === 'pages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Manage Pages
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Hero Section', description: 'Main banner and headline' },
                  { name: 'Services', description: 'Your services and descriptions' },
                  { name: 'About Us', description: 'Story and company values' },
                  { name: 'Gallery', description: 'Images and portfolio' },
                  { name: 'Contact', description: 'Contact information and form' },
                ].map((page) => (
                  <div
                    key={page.name}
                    className="p-4 border border-slate-200 rounded-xl hover:border-purple-500 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{page.name}</p>
                      <p className="text-sm text-slate-500">{page.description}</p>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Settings size={20} className="text-slate-600" />
                Email Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Admin Email</label>
                  <input
                    type="email"
                    defaultValue="admin@cleandeep.co.za"
                    disabled
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Booking Email</label>
                  <input
                    type="email"
                    defaultValue="bookings@cleandeep.co.za"
                    disabled
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Email Service:</strong> Resend is configured and active. All booking confirmations and admin
                    notifications are automatically sent.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
