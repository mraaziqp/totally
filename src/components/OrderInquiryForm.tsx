import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, ShoppingBag, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderInquiryFormProps {
  className?: string;
  storeSlug: string;
}

export default function OrderInquiryForm({ className, storeSlug }: OrderInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: '',
    notes: ''
  });

  const productTypes = ["Custom Bags", "Branded Doormats", "Corporate Gifting", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          location: 'Studio / Online',
          storeSlug: storeSlug,
          notes: `${formData.productType}: ${formData.notes}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('An error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("bg-white p-10 rounded-3xl border border-slate-100 shadow-xl text-center", className)}
      >
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Received!</h3>
        <p className="text-slate-600 mb-8">We've received your request for <span className="font-bold">{formData.productType}</span>. One of our specialists will be in touch within 24 hours.</p>
        <button 
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', productType: '', notes: '' }); }}
          className="text-rose-600 font-bold hover:underline"
        >
          Send another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className={cn("bg-white p-8 rounded-3xl border border-slate-100 shadow-xl", className)}>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Project Inquiry</h3>
        <p className="text-slate-500 text-sm">Tell us about your custom gifting needs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-rose-400" /> Full Name
          </label>
          <input
            required
            type="text"
            placeholder="Jane Doe"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} className="text-rose-400" /> Email
            </label>
            <input
              required
              type="email"
              placeholder="jane@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} className="text-rose-400" /> Phone
            </label>
            <input
              required
              type="tel"
              placeholder="082 123 4567"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag size={14} className="text-rose-400" /> Product Type
          </label>
          <select
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800"
            value={formData.productType}
            onChange={e => setFormData({...formData, productType: e.target.value})}
          >
            <option value="">Select a category</option>
            {productTypes.map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} className="text-rose-400" /> Design Ideas / Notes
          </label>
          <textarea
            required
            placeholder="Tell us about your brand, colors, and quantity requirements..."
            className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800 resize-none"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-rose-500 text-white font-bold py-4 rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Inquiry"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
