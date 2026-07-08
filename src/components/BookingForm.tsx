import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Calendar, MapPin, User, Mail, Phone, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingFormProps {
  className?: string;
  storeSlug: string;
}

// REST-based client uploader for Supabase storage (no package dependency)
const uploadImageToSupabase = async (file: File, storeSlug: string): Promise<string> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hhsoppbizeobeayngprn.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }

  // Clean filename to prevent spaces/special characters
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `leads/${storeSlug}/${Date.now()}_${cleanName}`;
  const url = `${supabaseUrl}/storage/v1/object/media/${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }

  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
};

export default function BookingForm({ className, storeSlug }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    services: [] as string[],
    date: '',
    notes: '',
  });

  const services = [
    "Carpets", "Mattress", "Vehicles", "Rug Rejuvenation", 
    "High Pressure (Outdoor)", "Upholstery Cleaning (Couches and Chairs)", "Curtains"
  ];

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          location: formData.location,
          requestedDate: formData.date,
          storeSlug: storeSlug,
          notes: `Services selected: ${formData.services.join(', ')}${formData.notes ? `\n\nDescription: ${formData.notes}` : ''}${uploadedImages.length > 0 ? `\n\nImages:\n${uploadedImages.join('\n')}` : ''}`
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("bg-white p-10 rounded-3xl border border-slate-100 shadow-xl text-center", className)}
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Booking Successful!</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Thank you for trusting CleanDeep. We have received your request and our team will contact you shortly to confirm your appointment.
        </p>
        <button 
          onClick={() => { 
            setSuccess(false); 
            setStep(1); 
            setFormData({ name: '', email: '', phone: '', location: '', services: [], date: '', notes: '' }); 
            setUploadedImages([]);
          }}
          className="text-emerald-600 font-bold hover:underline"
        >
          Make another booking
        </button>
      </motion.div>
    );
  }

  return (
    <div className={cn("bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden", className)}>
      {/* Header Progress */}
      <div className="bg-slate-50 border-b border-slate-100 px-8 py-5">
        <h3 className="font-bold text-slate-900 text-lg">Book Your Service</h3>
        <p className="text-xs text-slate-500 mt-0.5">Quick 2-step booking process</p>
        <div className="flex gap-2 mt-4">
          <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 1 ? "bg-emerald-500" : "bg-slate-200")} />
          <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 2 ? "bg-emerald-500" : "bg-slate-200")} />
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-emerald-500" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-emerald-500" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone size={16} className="text-emerald-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="081 234 5678"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500" /> Area (Location)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plattekloof, Bellville"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.phone || !formData.location}
                className="w-full bg-emerald-500 text-white font-semibold py-4 rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Next Step <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 block">Select Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map(service => (
                    <label 
                      key={service}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50",
                        formData.services.includes(service) ? "border-emerald-400 bg-emerald-50" : "border-slate-200"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.services.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        formData.services.includes(service) ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                      )}>
                        {formData.services.includes(service) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-700 block">
                  Brief description of service required (max 100 characters)
                </label>
                <textarea
                  placeholder="e.g. Clean 3-seater couch and 4 dining chairs..."
                  maxLength={100}
                  className="w-full h-20 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base resize-none"
                  value={formData.notes}
                  onChange={e => {
                    const val = e.target.value;
                    if (val.length <= 100) {
                      setFormData({ ...formData, notes: val });
                    }
                  }}
                />
                <p className="text-[10px] text-slate-400 text-right mt-0.5">
                  {formData.notes.length}/100 characters
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Attach Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 transition-colors relative flex flex-col items-center justify-center bg-slate-50/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      if (!e.target.files) return;
                      setUploading(true);
                      const filesArray = Array.from(e.target.files) as File[];
                      const urls: string[] = [];
                      for (const file of filesArray) {
                        try {
                          const url = await uploadImageToSupabase(file, storeSlug);
                          urls.push(url);
                        } catch (err) {
                          console.error("Failed to upload image:", err);
                          alert(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
                        }
                      }
                      setUploadedImages(prev => [...prev, ...urls]);
                      setUploading(false);
                    }}
                    disabled={uploading}
                  />
                  <div className="text-center space-y-1">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-emerald-500" size={20} />
                        <p className="text-xs font-bold text-slate-500">Uploading to Supabase...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-1">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-700">Click to upload photos</p>
                        <p className="text-[10px] text-slate-400">Supports PNG, JPG, JPEG</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Previews */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shadow hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" /> Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-base"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-slate-100 text-slate-600 font-semibold py-3 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  disabled={submitting || uploading}
                  className={cn(
                    "flex-[2] bg-emerald-500 text-white font-semibold py-3 rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
                    (submitting || uploading) && "cursor-not-allowed"
                  )}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting..." : "Submit Booking"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
