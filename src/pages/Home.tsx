import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Droplets, 
  Car, 
  Sofa, 
  Scissors, 
  Home as HomeIcon, 
  Loader2, 
  MapPin, 
  Facebook, 
  Instagram,
  ShieldCheck,
  Award
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { cn } from '../lib/utils';

// Custom TikTok Icon SVG path to ensure it always renders without dependency issues
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Map DB service names → icons
const SERVICE_ICONS: Record<string, React.ElementType> = {
  'Carpets':                       Sparkles,
  'Mattress':                      CheckCircle2,
  'Vehicles':                      Car,
  'Rug Rejuvenation':              Scissors,
  'High Pressure (Outdoor)':       Droplets,
  'Upholstery Cleaning (Couches and Chairs)': Sofa,
  'Curtains':                      Sparkles,
};

export default function Home() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stores/deep-cleaning')
      .then(res => res.json())
      .then(data => { setStoreData(data); setLoading(false); })
      .catch(err => { console.error('Error fetching store data:', err); setLoading(false); });
  }, []);

  useEffect(() => {
    if (storeData?.pageTitle) {
      document.title = storeData.pageTitle;
    } else {
      document.title = "Professional Deep Soft Cleaning Services | CleanDeep";
    }
    if (storeData?.pageDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', storeData.pageDescription);
    }
  }, [storeData]);

  // Fallback hardcoded services (used only if DB returns none)
  const fallbackServices = [
    { title: 'Carpets',                       description: 'Deep cleaning that removes embedded dirt, allergens, and tough stains for a fresh look and feel.',          icon: Sparkles,      price: null },
    { title: 'Mattress',                      description: 'Thorough sanitisation to eliminate dust mites, bacteria, and allergens, ensuring a healthier sleep.',       icon: CheckCircle2,  price: null },
    { title: 'Vehicles',                      description: 'Interior deep cleaning that lifts stains from seats, floors, and roofs, leaving your car spotless.',        icon: Car,           price: null },
    { title: 'Rug Rejuvenation',              description: 'Specialised treatment to revive delicate rugs, restoring their original vibrant patterns and texture.',     icon: Scissors,      price: null },
    { title: 'High Pressure (Outdoor)',       description: 'Powerful cleaning for roofs, windows, paving, and exterior walls to remove mould and grime.',              icon: Droplets,      price: null },
    { title: 'Upholstery Cleaning (Couches and Chairs)', description: 'Deep fabric cleaning that removes odours and stains, giving new life to your lounge and dining sets.',     icon: Sofa,          price: null },
    { title: 'Curtains',                      description: 'Gentle yet effective cleaning that removes dust and pollutants without harming the fabric.',                icon: Sparkles,      price: null },
  ];

  const displayServices = storeData?.services?.length > 0
    ? storeData.services.map((s: any) => ({
        title: s.name,
        description: s.description,
        icon: SERVICE_ICONS[s.name] || Sparkles,
        price: s.price,
      }))
    : fallbackServices;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold text-slate-800">Preparing storefront...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 py-3 px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-500">CleanDeep</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-2 hidden xs:block">Deep Soft Cleaning</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
              <a href="#how-we-operate" className="hover:text-emerald-600 transition-colors">How We Operate</a>
              <a href="#about" className="hover:text-emerald-600 transition-colors">About Us</a>
              <a href="#testimonials" className="hover:text-emerald-600 transition-colors">Testimonials</a>
            </div>
            <a href="#booking" className="bg-emerald-500 text-white px-5 py-2.5 text-sm rounded-full hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 font-bold">
              Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 overflow-hidden bg-white">
        {storeData?.heroImageUrl && storeData?.heroImageEnabled !== false && (
          <div className="absolute inset-0 z-0 overflow-hidden">
             <img 
               src={storeData.heroImageUrl} 
               referrerPolicy="no-referrer" 
               className="w-full h-full object-cover blur-sm scale-105" 
               style={{ opacity: (storeData?.heroImageOpacity ?? 10) / 100 }}
               alt="Hero Background"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50" />
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
               {storeData?.tagline || "Premium Deep Soft Cleaning"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
               {storeData?.heroHeadline || "CleanDeep - Deep Soft Cleaning"}
            </h1>
            
            {/* Mission Statement */}
            <div className="relative p-6 bg-white/80 border border-slate-100 rounded-2xl text-slate-700 italic leading-relaxed text-base sm:text-lg shadow-sm mb-8">
               <Sparkles className="absolute -top-3 -left-3 text-emerald-400 animate-pulse" size={28} />
               {storeData?.missionText || "What truly sets us apart is not just the quality of our cleaning, but the way we work with people and the efficiency we bring to every job."}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Call / WhatsApp</p>
                  <p className="text-sm font-bold text-slate-800">{storeData?.contactPhone || "0670240972"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email Us</p>
                  <p className="text-sm font-bold text-slate-800 break-all">{storeData?.contactEmail || "cleandeep.za@gmail.com"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Our Area</p>
                  <p className="text-sm font-bold text-slate-800">{storeData?.address || "2 Second Street Maitland"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            id="booking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <BookingForm className="w-full max-w-lg shadow-2xl shadow-slate-200/80 border border-slate-100" storeSlug="deep-cleaning" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 px-4 sm:px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              {storeData?.servicesHeadline || "Our Specialised Services"}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {storeData?.servicesDescription || "Professional deep cleaning solutions for every surface. From delicate upholstery to industrial carpets, we bring excellence to every job."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayServices.map((item, index) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-emerald-500">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
                </div>
                {item.price && (
                  <p className="mt-6 text-emerald-600 font-bold text-base">From R{Number(item.price).toFixed(0)}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Operate Section */}
      <section id="how-we-operate" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">How We Operate</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Our simple three-step process makes getting your space clean completely hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Send Us Details via Book Now</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Submit images or a short description of the area or items that need cleaning through our website.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Free Assessment & Quote</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our team reviews the details and visits your location to assess the job and provide a free quote.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Choose to Go Ahead</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If you are happy with the quote, we begin the cleaning service. If not, no problem — we leave and you pay nothing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      {storeData?.galleryImages && (storeData.galleryImages as any[]).length > 0 && (
        <section className="py-16 px-4 sm:px-6 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
                Real Results
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">See the CleanDeep Difference</h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">Before &amp; after — every job, every time.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(storeData.galleryImages as { url: string; caption?: string }[]).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group rounded-2xl overflow-hidden bg-slate-100 aspect-video shadow-sm border border-slate-200"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Result ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-semibold">{img.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Google Reviews Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
              <Star size={12} className="fill-current text-emerald-600" />
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Honest Reviews from our Customers
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">See what our clients say about our cleaning specialists.</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Adrian Johnson */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-center mb-4 relative">
                  <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    AJ
                  </div>
                  {/* Google badge overlay */}
                  <div className="absolute -bottom-1 right-[calc(50%-28px)] bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm">Adrian Johnson</p>
                  <p className="text-[10px] text-slate-400 font-medium">2 months ago</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-current" />)}
                  </div>
                  {/* Verified badge */}
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed text-center italic">
                  "I had a great experience working with Mika, The Granite Guy. From the start, Mika was attentive, patient, and incredibly..."
                </p>
              </div>
              <div className="text-center mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">Read more</span>
              </div>
            </div>

            {/* Card 2: Desiree Stroud */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-center mb-4 relative">
                  <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    DS
                  </div>
                  <div className="absolute -bottom-1 right-[calc(50%-28px)] bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm">Desiree Stroud</p>
                  <p className="text-[10px] text-slate-400 font-medium">3 months ago</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-current" />)}
                  </div>
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed text-center italic">
                  "I was very impressed with Mikaeel. Company The Granite Guy! From the time he took my call to enquire a quotation to installatio..."
                </p>
              </div>
              <div className="text-center mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">Read more</span>
              </div>
            </div>

            {/* Card 3: Rechardo Rix */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-center mb-4 relative">
                  <div className="w-14 h-14 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    RR
                  </div>
                  <div className="absolute -bottom-1 right-[calc(50%-28px)] bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm">Rechardo Rix</p>
                  <p className="text-[10px] text-slate-400 font-medium">3 months ago</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-current" />)}
                  </div>
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed text-center italic">
                  "From the start, Mikaeel was highly professional, punctual, well-organised, and clear in all communication...."
                </p>
              </div>
              <div className="text-center mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">Read more</span>
              </div>
            </div>

            {/* Card 4: Ancunel Janse van Rensburg */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-center mb-4 relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                    alt="Ancunel avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div className="absolute -bottom-1 right-[calc(50%-28px)] bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm text-center">Ancunel Janse van Rensburg</p>
                  <p className="text-[10px] text-slate-400 font-medium">3 months ago</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-current" />)}
                  </div>
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed text-center italic">
                  "My mom always says: if sounds too good to be true, it probably is. But this is the exception. I contacted the Granite Guy late on..."
                </p>
              </div>
              <div className="text-center mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">Read more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 bg-white overflow-hidden relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10" />
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
               {storeData?.aboutHeading || "Our Journey & Core Values"}
            </h2>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <div className="prose prose-slate max-w-none text-base sm:text-lg">
                {storeData?.aboutUsText ? (
                  <p className="whitespace-pre-wrap">{storeData.aboutUsText}</p>
                ) : (
                  <>
                    <p>
                      CleanDeep was born from the vision of young entrepreneurs who wanted to redefine service excellence in South Africa. Guided by our Islamic school mentor, we embarked on this journey with a commitment to something deeper than just cleaning.
                    </p>
                    <p>
                      At the heart of everything we do are the values of <strong>honesty, fairness, trust, and ihsaan</strong> (excellence). We believe that being thorough in our work is an act of integrity, and we treat every home and office with the same respect we would our own.
                    </p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {["Honesty", "Fairness", "Trust", "Ihsaan"].map(v => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm uppercase tracking-wider">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:pl-16">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-video sm:aspect-square bg-slate-100 border border-slate-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800"
                alt="CleanDeep Professional Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-950/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Content — freeform blocks added via the admin Page Builder */}
      {Array.isArray(storeData?.customBlocks) && (storeData.customBlocks as any[]).length > 0 && (
        <section className="relative py-16 px-4 sm:px-6 bg-white border-t border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto relative" style={{ minHeight: 560 }}>
            {(storeData.customBlocks as any[]).map((block) => (
              <div
                key={block.id}
                className="absolute"
                style={{ left: `${block.x}%`, top: `${block.y}%`, width: `${block.width}%` }}
              >
                {block.type === 'text' ? (
                  <p
                    className={cn(
                      'whitespace-pre-wrap break-words font-medium',
                      block.fontSize === 'sm' && 'text-sm',
                      block.fontSize === 'md' && 'text-base',
                      block.fontSize === 'lg' && 'text-xl',
                      block.fontSize === 'xl' && 'text-3xl font-bold'
                    )}
                    style={{ color: block.color || '#1e293b' }}
                  >
                    {block.content}
                  </p>
                ) : (
                  <img src={block.content} referrerPolicy="no-referrer" alt="" className="w-full h-auto rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-black text-white mb-4 block">CleanDeep</span>
            <p className="max-w-sm mb-6 text-sm">
              Professional deep soft cleaning services for carpets, mattresses, vehicles, and upholstery. Guided by honesty, fairness, and excellence.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              <a href={storeData?.facebookUrl || "https://www.facebook.com/share/1E9N7NCcUe/?mibextid=wwXIfr"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href={storeData?.instagramUrl || "https://www.instagram.com/cleandeep_cpt1?igsh=MWE4a2h4bDlwMXdvOQ%3D%3D&utm_source=qr"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href={storeData?.tiktokUrl || "https://www.tiktok.com/@cleandeep_cpt1?is_from_webapp=1&sender_device=pc"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                <TikTokIcon className="w-[18px] h-[18px]" />
              </a>
            </div>
            
            <p className="flex items-center gap-2 text-xs">
              <HomeIcon size={14} /> Made with pride in South Africa 🇿🇦
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li>{storeData?.contactEmail || "cleandeep.za@gmail.com"}</li>
              <li>{storeData?.contactPhone || "0670240972"}</li>
              <li>{storeData?.address || "2 Second Street Maitland"}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#services" className="hover:text-emerald-500 transition-colors">Services</a></li>
              <li><a href="#how-we-operate" className="hover:text-emerald-500 transition-colors">How We Operate</a></li>
              <li><a href="#about" className="hover:text-emerald-500 transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="hover:text-emerald-500 transition-colors">Testimonials</a></li>
              <li><a href="#booking" className="hover:text-emerald-500 transition-colors">Book Now</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} CleanDeep (Pty) Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
