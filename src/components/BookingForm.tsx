import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Calendar, MapPin, User, Mail, Phone, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingFormProps {
  className?: string;
  storeSlug: string;
}

export default function BookingForm({ className, storeSlug }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    services: [] as string[],
    date: '',
  });

  const locations = ["Atlantis", "CBD", "Bellville", "Northern Suburbs", "Other"];
  const services = [
    "Carpets", "Mattress", "Vehicles", "Rug Rejuvenation", 
    "High Pressure (Outdoor)", "Upholstery", "Curtains"
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
          storeSlug: storeSlug
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
          Thank you for trusting TotalLŸ. We have received your request and our team will contact you shortly to confirm your appointment.
        </p>
        <button 
          onClick={() => { setSuccess(false); setStep(1); setFormData({ name: '', email: '', phone: '', location: '', services: [], date: '' }); }}
          className="text-emerald-600 font-bold hover:underline"
        >
          Make another booking
        </button>
      </motion.div>
    );
  }

  return (
    <div className={cn("bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden", className)}>
      <div className="bg-emerald-50 p-5 border-bottom border-emerald-100">
        <h3 className="text-lg font-bold text-slate-800">Book Your Service</h3>
        <p className="text-sm text-slate-600">Quick 2-step booking process</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className={cn("h-1 flex-1 rounded-full", step >= 1 ? "bg-emerald-400" : "bg-slate-200")} />
          <div className={cn("h-1 flex-1 rounded-full", step >= 2 ? "bg-emerald-400" : "bg-slate-200")} />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-4"
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
                  <MapPin size={16} className="text-emerald-500" /> Location
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all bg-white text-base"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                >
                  <option value="">Select a location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-4 bg-emerald-500 text-white font-semibold py-3 rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 group"
              >
                Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Select Services</label>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
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
                      <span className="text-sm text-slate-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-slate-100 text-slate-600 font-semibold py-3 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  disabled={submitting}
                  className={cn(
                    "flex-[2] bg-emerald-500 text-white font-semibold py-3 rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50",
                    submitting && "cursor-not-allowed"
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
