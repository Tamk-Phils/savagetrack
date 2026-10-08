"use client";

import { ShieldCheck, Globe, Zap, ChevronDown, MapPin, Search, Package, Truck, Ship, Plane, Clock, Phone, Mail, ArrowRight, Check, Train, Box, Award, Users, BarChart3, Layers, Compass, Cpu, Stethoscope, Sun, Factory, ShoppingBag, Quote, Calendar, Newspaper, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import TrackingSearch from "@/components/TrackingSearch";

// --- Custom Counter Component for Statistics ---
const AnimatedCounter = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(end * easeOut));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// --- FAQ Component ---
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex justify-between items-center text-left group transition-colors cursor-pointer"
      >
        <span className="text-base md:text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0 group-hover:scale-125 transition-transform" />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 group-hover:text-emerald-700 shrink-0 ml-4"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate-600 text-sm leading-relaxed pl-5 font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Standard Animation Props based on User Spec ---
// "starts slightly below final position with 0 opacity, fades in sliding upward"
// "smooth ease-out transition of 600–800ms"
// "triggered when element enters viewport"
const revealProps: any = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerRevealProps = (delay: number): any => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut", delay }
});

export default function Home() {
  const quickFeaturesRef = useRef<HTMLDivElement>(null);

  const scrollToQuickFeatures = () => {
    quickFeaturesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans pt-20 md:pt-28 overflow-x-hidden">
      
      {/* 1. HERO SECTION - Animated Parallax Experience */}
      <section className="relative min-h-[85vh] flex flex-col justify-center py-16 md:py-24 overflow-hidden bg-slate-950 text-white">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2000"
            alt="Vanguard Freight Global Cargo Shipping"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-emerald-950/40" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Copy - Staggered Reveals */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div {...staggerRevealProps(0.1)} className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700/90 backdrop-blur-sm text-white font-extrabold text-xs uppercase tracking-wider shadow-lg border border-emerald-400/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Locate Your Parcel Anywhere Anytime
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  Welcome to Your Comprehensive <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500 drop-shadow-sm">
                    Shipping and Logistics
                  </span> Solution!
                </h1>

                <p className="text-slate-200 text-base md:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  We offer a range of services including land, sea, and air freight, along with warehousing solutions. Let us simplify your logistics needs.
                </p>
              </motion.div>

              <motion.div {...staggerRevealProps(0.3)} className="flex flex-wrap gap-4 pt-2">
                <Link href="/usage" className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-xs md:text-sm px-7 py-4 rounded-xl shadow-xl transition-all flex items-center gap-2.5 group cursor-pointer border border-emerald-500/50">
                  <span>View Services</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/quote" className="bg-white/10 hover:bg-white/20 text-white font-black text-xs md:text-sm px-7 py-4 rounded-xl border border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-xl">
                  Get a Free Quote
                </Link>
              </motion.div>
            </div>

            {/* Right Hero Tracking Box - Smooth Entrance */}
            <motion.div {...staggerRevealProps(0.4)} className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-white/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-slate-900 space-y-5">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                    <Zap size={14} className="text-emerald-500" />
                    Enter the Consignment No.
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Track Your Shipment</h3>
                  <p className="text-slate-500 text-sm font-medium">Ex: 12345 or VTX948210394</p>
                </div>
                <TrackingSearch />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center cursor-pointer"
          onClick={scrollToQuickFeatures}
        >
          <span className="text-[10px] font-black tracking-widest text-white/80 uppercase mb-2 flex items-center gap-1">
            Scroll Down
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center p-1 backdrop-blur-sm bg-slate-900/20">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. [NEW] COMPANY STATISTICS SECTION */}
      <section className="py-14 bg-white border-b border-slate-100 relative z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100">
            {[
              { label: "Offices Worldwide", value: 124, suffix: "+" },
              { label: "Countries Served", value: 180, suffix: "" },
              { label: "Professional Workers", value: 4500, suffix: "+" },
              { label: "Years of Experience", value: 25, suffix: "+" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                {...staggerRevealProps(i * 0.1)}
                className="text-center space-y-1 py-2"
              >
                <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex justify-center items-end gap-1">
                  <AnimatedCounter end={stat.value} />
                  <span className="text-emerald-700 text-3xl md:text-4xl">{stat.suffix}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUICK FEATURE CARDS */}
      <section ref={quickFeaturesRef} className="relative z-30 max-w-7xl mx-auto px-6 py-16 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Supply Chain Solutions",
              desc: "Optimize your operations with our tailored supply chain solutions. From procurement to distribution, we streamline your logistics workflow.",
              icon: Layers,
              href: "/usage#logistics"
            },
            {
              title: "End-to-End Transportation",
              desc: "Experience seamless logistics from start to finish with our end-to-end transportation services. Trust us to handle your cargo with care.",
              icon: Truck,
              href: "/usage#road"
            },
            {
              title: "Contract Logistics",
              desc: "Delegate your logistics operations to the experts. With our contract logistics services, we manage your warehousing & fulfillment seamlessly.",
              icon: Box,
              href: "/usage#warehouse"
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              {...staggerRevealProps(i * 0.15)}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-2 transition-all duration-300 space-y-5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300 shadow-sm">
                <card.icon size={26} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{card.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {card.desc}
              </p>
              <Link href={card.href} className="inline-flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider group-hover:gap-3 transition-all pt-2">
                Learn More <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. DEDICATED TRACKING SECTION */}
      <section className="py-24 bg-emerald-700 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <motion.div {...revealProps} className="max-w-7xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-600/50 backdrop-blur-sm text-xs font-black uppercase tracking-widest text-white border border-emerald-400/50">
            REAL TIME CONSIGNMENT MONITORING
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Track Your Shipment</h2>
          <p className="text-emerald-100 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Track your shipment easily! Enter your tracking number here to get real-time updates on your delivery status and GPS satellite coordinates.
          </p>
          
          <div className="max-w-xl mx-auto pt-8">
            <div className="bg-white p-5 rounded-[2rem] shadow-2xl text-slate-900 border border-white/20">
              <TrackingSearch />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. ABOUT US - GLOBAL & LOCAL SERVICES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...revealProps} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">WHO WE ARE</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Dive into Our Comprehensive Service Offerings
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              At Vanguard Freight & Cargo, we are more than just a shipping and logistics company – we are your trusted partner in navigating the complexities of global trade and commerce. With a rich history and a forward-thinking approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div {...staggerRevealProps(0.1)} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Global Service</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Comprehensive international shipping solutions with a vast network covering multiple continents, expertise in customs clearance, and multimodal transportation options.
                </p>
              </div>
              <ul className="space-y-3 pt-2 text-sm font-bold text-slate-700">
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Multimodal International Transit Corridors</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Real-Time Satellite Waybill Surveillance</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Automated Export Customs Clearance</li>
              </ul>
              <div className="pt-4">
                <Link href="/usage" className="inline-flex items-center gap-2 text-white bg-emerald-700 hover:bg-emerald-800 font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-md transition-all group-hover:px-8">
                  Discover More <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div {...staggerRevealProps(0.2)} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform">
                <Compass size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Local Service</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Reliable domestic shipping services with last-mile delivery, expedited options, strategically located regional distribution centers, and personalized customer support.
                </p>
              </div>
              <ul className="space-y-3 pt-2 text-sm font-bold text-slate-700">
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Door-to-Door Last-Mile Delivery Scans</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Regional Climate-Controlled Distribution</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-emerald-700 shrink-0" /> Dedicated Local Courier Specialists</li>
              </ul>
              <div className="pt-4">
                <Link href="/usage" className="inline-flex items-center gap-2 text-white bg-emerald-700 hover:bg-emerald-800 font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-md transition-all group-hover:px-8">
                  Discover More <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. SERVICE PORTFOLIO (8 Cards) */}
      <section className="py-24 bg-slate-100/50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...revealProps} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">SERVICE PORTFOLIO</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Empower your business with better logistics
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Air Freight", desc: "Dedicated express air transport corridors guaranteeing rapid transit.", icon: Plane, img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?q=80&w=800", href: "/usage#air" },
              { title: "Road Transport", desc: "Nationwide ground shipping with continuous GPS tracking.", icon: Truck, img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800", href: "/usage#road" },
              { title: "Ocean Freight", desc: "International maritime container shipping with customs clearance.", icon: Ship, img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800", href: "/usage#ocean" },
              { title: "Rail Freight", desc: "Eco-friendly long-distance bulk rail transit solutions.", icon: Train, img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800", href: "/usage#rail" },
              { title: "Warehousing", desc: "Strategic climate-controlled storage & inventory fulfillment.", icon: Box, img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800", href: "/usage#warehouse" },
              { title: "Packaging", desc: "Industrial protective packaging & custom crating options.", icon: Package, img: "https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=800", href: "/usage#packaging" },
              { title: "Logistics Solution", desc: "End-to-end supply chain integration & route optimization.", icon: Layers, img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800", href: "/usage#logistics" },
              { title: "Cargo Insurance", desc: "Full transit policy coverage protecting high-value shipments.", icon: ShieldCheck, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800", href: "/usage#insurance" },
            ].map((service, i) => (
              <motion.div
                key={i}
                {...staggerRevealProps((i % 4) * 0.15)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-500" />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 rounded-2xl flex items-center justify-center text-emerald-700 shadow-lg backdrop-blur-md group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                      <service.icon size={22} />
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{service.desc}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link href={service.href} className="inline-flex items-center gap-2 text-slate-400 font-extrabold text-xs uppercase tracking-wider group-hover:text-emerald-700 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPETITIVE ADVANTAGES */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...staggerRevealProps(0.1)} className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-400/30 px-3 py-1.5 rounded-full inline-block">EXCELLENCE & INNOVATION</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Competitive Advantages To The Largest Companies!
              </h2>
            </div>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
              At Vanguard Freight & Cargo, our mission is simple yet profound: to provide unparalleled shipping and logistics services that exceed our customers’ expectations at every turn. Through a relentless pursuit of excellence, innovation, and customer satisfaction, we aim to empower businesses of all sizes to thrive in today’s dynamic marketplace.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Global Reach</h4>
                  <p className="text-slate-400 text-sm mt-1">Expanding your business across borders seamlessly.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Maximum Security</h4>
                  <p className="text-slate-400 text-sm mt-1">Full protection and insurance for your cargo.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...staggerRevealProps(0.3)}>
            <div className="relative h-[450px] rounded-[2rem] overflow-hidden border border-slate-700 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200"
                alt="Vanguard Freight & Cargo Excellence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. SPECIALIZED SECTORS SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...revealProps} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">SPECIALIZED INDUSTRIES</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Tailored Logistics for Key Sectors
            </h2>
            <p className="text-slate-500 text-base">Providing domain-specific supply chain solutions across critical global industries.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Automotive", desc: "Just-in-time auto parts delivery, vehicle transport, and assembly line supply.", icon: Truck, href: "/quote" },
              { title: "Technology", desc: "High-security transit for microchips, server hardware, and consumer electronics.", icon: Cpu, href: "/quote" },
              { title: "Healthcare", desc: "Temperature-monitored cold-chain shipping for medical supplies and pharmaceuticals.", icon: Stethoscope, href: "/quote" },
              { title: "Renewable Energy", desc: "Heavy transport for wind turbine blades, solar equipment, and power grids.", icon: Sun, href: "/quote" },
              { title: "Industrial", desc: "Heavy machinery freight, raw material transport, and plant logistics.", icon: Factory, href: "/quote" },
              { title: "Retail / Fashion", desc: "Rapid e-commerce fulfillment, store distribution, and seasonal inventory logistics.", icon: ShoppingBag, href: "/quote" },
            ].map((sector, i) => (
              <motion.div
                key={sector.title}
                {...staggerRevealProps(i * 0.1)}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-sm mb-5">
                  <sector.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">{sector.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-4">{sector.desc}</p>
                <Link href={sector.href} className="inline-flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                  Get Quote <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. [NEW] LATEST NEWS & INSIGHTS (PORTFOLIO/BLOG) */}
      <section className="py-24 bg-slate-100/50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...revealProps} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">NEWS & INSIGHTS</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Latest from Vanguard Freight
              </h2>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-slate-900 bg-white border border-slate-200 hover:border-emerald-700 hover:text-emerald-700 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all shrink-0">
              View All Articles <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                date: "Aug 24, 2026", 
                title: "State of Global Supply Chains: Navigating 2026 Challenges", 
                category: "Industry Insights",
                img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800"
              },
              { 
                date: "Aug 18, 2026", 
                title: "How Satellite GPS is Revolutionizing Parcel Tracking", 
                category: "Technology",
                img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
              },
              { 
                date: "Aug 10, 2026", 
                title: "Sustainable Shipping: Reducing Carbon Footprints in Freight", 
                category: "Sustainability",
                img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800"
              }
            ].map((article, i) => (
              <motion.div 
                key={i} 
                {...staggerRevealProps(i * 0.15)}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 shadow-sm">
                    {article.category}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                    <Calendar size={14} /> {article.date}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <Link href="/about" className="inline-flex items-center gap-1 text-slate-500 font-bold text-sm hover:text-emerald-700 transition-colors pt-2">
                    Read Article <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. [NEW] INFINITE MARQUEE PARTNER LOGOS */}
      <section className="py-16 bg-white overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">TRUSTED BY GLOBAL PARTNERS & CARRIERS</span>
        </div>
        <div className="relative flex overflow-x-hidden w-full">
          <motion.div
            className="flex whitespace-nowrap gap-16 md:gap-32 items-center px-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* Array of Partner text/logos repeated for infinite scroll effect */}
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex gap-16 md:gap-32 items-center">
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">FEDEX</span>
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">DHL EXPRESS</span>
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">MAERSK</span>
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">USPS LOGISTICS</span>
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">UPS GLOBAL</span>
                <span className="text-2xl md:text-3xl font-black text-slate-300 tracking-tighter uppercase">AMAZON FREIGHT</span>
              </div>
            ))}
          </motion.div>
          {/* Gradient Masks for smooth fade on edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-emerald-600 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...revealProps} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">CUSTOMER SUCCESS STORIES</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Hear from our global clients
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Vanguard Freight transformed our cross-border supply chain. Their real-time satellite tracking eliminated our port clearance delays.",
                name: "Marcus Vance",
                role: "Global Supply VP",
                company: "Apex Logistics"
              },
              {
                quote: "Their air freight express guarantees 24-hour turnaround for our urgent electronics cargo. Total peace of mind.",
                name: "Sarah Jenkins",
                role: "Operations Director",
                company: "TechExpress"
              },
              {
                quote: "Contract warehousing and fulfillment with Vanguard Freight reduced our storage overhead by 30% while improving last-mile delivery times.",
                name: "David Chen",
                role: "Logistics Manager",
                company: "Oceanica Freight"
              }
            ].map((test, i) => (
              <motion.div
                key={i}
                {...staggerRevealProps(i * 0.15)}
                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex gap-1 text-emerald-400">
                     {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-base">{test.name}</p>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">{test.role}, {test.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...revealProps} className="text-center mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our FAQs</h2>
          </motion.div>

          <motion.div {...revealProps} className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl">
            <FAQItem
              question="How do I track my shipment with Vanguard Freight & Cargo?"
              answer="Simply enter your Consignment No. (e.g. 12345 or VTX948210394) into the search box at the top of this page and click 'Track Now' to see live status updates and satellite coordinates."
            />
            <FAQItem
              question="What shipping & freight services does Vanguard Freight offer?"
              answer="Vanguard Freight & Cargo offers end-to-end transportation services including Air Freight, Ocean Freight, Road Express, Rail Transit, Warehouse Storage, Packaging, and Cargo Insurance."
            />
            <FAQItem
              question="How often is consignment tracking updated?"
              answer="Our satellite tracking system updates location coordinates and checkpoint scan events in real time as cargo moves through our global network."
            />
            <FAQItem
              question="How do I get a custom shipping quote?"
              answer="Click the 'Get a Quote' button in the navigation bar to submit your cargo weight, origin, and destination details for instant pricing."
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
