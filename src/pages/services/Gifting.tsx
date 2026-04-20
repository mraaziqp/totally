import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Layout, Briefcase, Scissors, Heart, ArrowLeft, Mail, Phone, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import OrderInquiryForm from '../../components/OrderInquiryForm';

export default function Gifting() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stores/gifting')
      .then(res => res.json())
      .then(data => {
        setStoreData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching store data:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    {
      title: "Custom Bags",
      description: "From corporate promotional totes to bespoke luxury gift bags, we bring your brand to life on fabric.",
      icon: ShoppingBag,
      color: "bg-rose-50",
      textColor: "text-rose-600"
    },
    {
      title: "Branded Doormats",
      description: "Make a lasting first impression with custom-printed doormats for your home or business entrance.",
      icon: Layout,
      color: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      title: "Corporate Gift Sets",
      description: "Curated collections of high-quality products, personalised for your employees, clients, or events.",
      icon: Briefcase,
      color: "bg-rose-50",
      textColor: "text-rose-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-rose-500" />
        <p className="font-bold text-slate-800">Preparing studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 py-3 px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-rose-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-black text-rose-500">TotalLŸ</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-2 hidden xs:block">Gifting</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#about" className="hidden md:block text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors">Our Studio</a>
            <a href="#inquiry" className="bg-rose-500 text-white px-4 py-2 text-sm rounded-full hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20 font-semibold">Inquire</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 bg-white overflow-hidden">
        {storeData?.heroImageUrl && (
          <div className="absolute inset-0 z-0">
             <img 
               src={storeData.heroImageUrl} 
               referrerPolicy="no-referrer" 
               className="w-full h-full object-cover opacity-10 blur-sm scale-110" 
               alt="Gifting Hero"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-slate-50" />
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 rounded-full shadow-sm">
              <Scissors size={12} /> {storeData?.tagline || "Bespoke Craftsmanship"}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6 tracking-tighter">
               {storeData?.heroHeadline || "PersonaLŸised Gifting Studio"}
            </h1>
            
            <div className="relative p-6 sm:p-8 bg-white/40 backdrop-blur-md border border-rose-100 rounded-2xl sm:rounded-[2rem] shadow-sm">
              <p className="text-base sm:text-xl text-slate-700 italic leading-relaxed">
                 {storeData?.missionText || "Bespoke craftsmanship for your brand and home. From custom-printed doormats to corporate promotional bags, we bring your unique identity to life."}
              </p>
              <Heart className="absolute -bottom-4 -right-4 text-rose-200" size={48} fill="currentColor" />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Studio Line</p>
                    <p className="text-base font-bold text-slate-800">{storeData?.contactPhone || "[Insert Phone Number]"}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Bulk Inquiries</p>
                    <p className="text-base font-bold text-slate-800 break-all">{storeData?.contactEmail || "info@totally.co.za"}</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            id="inquiry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <OrderInquiryForm className="w-full max-w-xl shadow-2xl shadow-rose-500/10" storeSlug="gifting" />
          </motion.div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-14 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
               {storeData?.servicesHeading || "Our Creative Categories"}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-lg leading-relaxed">High-quality products designed to carry your brand or personality with elegance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-7 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center"
              >
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-sm", cat.color, cat.textColor)}>
                  <cat.icon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{cat.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {cat.description}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-50 w-full">
                   <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", cat.color, cat.textColor)}>
                     Premium Quality Guaranteed
                   </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story & Values */}
      <section id="about" className="py-14 px-4 sm:px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
             <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tighter">
                {storeData?.aboutHeading || "Crafted with Purpose."}
             </h2>
             <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                {storeData?.aboutUsText ? (
                  <p className="whitespace-pre-wrap">{storeData.aboutUsText}</p>
                ) : (
                  <>
                    <p className="text-slate-600 leading-relaxed">
                      TotalLŸ Gifting Studio was founded by young South African entrepreneurs with a vision to merge local craftsmanship with global excellence (**Ihsaan**).
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Mentored by an Islamic school leader, our core principles of **Honesty, Fairness, and Trust** are woven into every bag, mat, and gift set we produce. We don't just print products; we help you tell your story.
                    </p>
                  </>
                )}
             </div>
             <div className="flex gap-4 mt-10">
                {[1,2,3,4].map(i => <div key={i} className={cn("w-16 h-1.5 rounded-full", i === 1 ? "bg-rose-500" : "bg-rose-100")} />)}
             </div>
          </div>
          <div className="relative">
             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="aspect-square bg-rose-50 rounded-[5rem] flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-rose-200 relative shadow-inner shadow-rose-200/50"
             >
                <div className="absolute top-8 right-8">
                   <Star className="text-rose-400 opacity-20" size={100} fill="currentColor" />
                </div>
                
                {storeData?.testimonialText ? (
                  <div className="relative z-10">
                    <p className="text-2xl text-slate-800 font-medium italic leading-relaxed mb-8">
                       "{storeData.testimonialText}"
                    </p>
                    <div>
                       <p className="font-bold text-slate-900 text-xl">{storeData.testimonialAuthor || "Verified Studio Client"}</p>
                       <p className="text-rose-500 font-bold uppercase tracking-widest text-xs mt-1">{storeData.testimonialAuthorRole || "Premium Partner"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <Star className="text-rose-500 mb-6 mx-auto" size={64} fill="currentColor" />
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">TotalLŸ Artisan Guarantee</h3>
                    <p className="text-slate-500 italic max-w-xs text-lg">"Every item is personally inspected for quality before it leaves our Cape Town studio."</p>
                  </div>
                )}
             </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-center md:text-left">
           <div>
              <span className="text-2xl font-black text-rose-500 mb-4 block">TotalLŸ Gifting</span>
              <p className="max-w-xs mx-auto md:mx-0">Bringing identity to life through personalised craftsmanship.</p>
           </div>
           <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigation</h4>
              <Link to="/" className="hover:text-rose-400 transition-colors">Main Project Hub</Link>
              <Link to="/services/deep-cleaning" className="hover:text-rose-400 transition-colors">Deep Cleaning</Link>
           </div>
           <div className="md:text-right">
              <p className="text-white font-bold mb-2 tracking-wide uppercase text-xs">South Africa Studio</p>
              <p>Cape Town, ZA</p>
              <p className="mt-6 text-slate-600">© {new Date().getFullYear()} TotalLŸ (Pty) Ltd.</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
