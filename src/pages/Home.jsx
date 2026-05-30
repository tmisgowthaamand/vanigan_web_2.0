import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    ArrowRight, CheckCircle, BookOpen, Users2, TrendingUp,
    Calendar, MessageCircle, Wallet, ArrowUpRight, Sparkles
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import BusinessCard from '../components/BusinessCard';
import { businessService } from '../services/api';

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Section Fade-In Wrapper ─── */
const FadeIn = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className={className}
    >
        {children}
    </motion.div>
);

const Home = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, searches: 125000, leads: 85000 });

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await businessService.getAll();
                // API return format is { businesses: [], total: X }
                const list = Array.isArray(data) ? data : (data.businesses || []);
                setBusinesses(list.slice(0, 3));
            } catch (err) {
                console.error('Home: Failed to fetch featured businesses', err);
            }
            finally { setLoading(false); }
        };
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                if (data && data.total) {
                    setStats(prev => ({ ...prev, total: data.total }));
                }
            } catch (err) {
                console.error('Home: Failed to fetch stats', err);
            }
        };
        fetchFeatured();
        fetchStats();
    }, []);

    return (
        <main className="bg-white min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <HeroSection />

            {/* ════════════════════════════════════════════
                SECTION 1: "Tell us your story" — Funding CTA
               ════════════════════════════════════════════ */}
            <section className="bg-[#FFF8F0] py-20 md:py-28">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="bg-white rounded-[20px] p-10 md:p-14 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles size={20} className="text-[#E87722]" />
                                    <span className="text-[13px] font-bold text-[#E87722] uppercase tracking-[0.12em]">AI-Powered</span>
                                </div>
                                <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A2E] leading-[1.15] tracking-[-0.01em] mb-5">
                                    Promote your listing,<br />
                                    <span className="text-[#E87722]">Free for all businesses</span>
                                </h2>
                                <p className="text-[16px] text-[#4B5563] leading-[1.7] mb-8 max-w-md">
                                    Register your business on Tamil Nadu's fastest growing network.
                                    Reach thousands of potential customers and traders today.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link to="/add-business" className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white h-[48px] px-7 rounded-lg text-[15px] font-bold hover:bg-[#2D2D44] transition-colors">
                                        Try Start right <ArrowRight size={16} />
                                    </Link>
                                    <Link to="/about" className="inline-flex items-center gap-2 text-[#4B5563] h-[48px] px-5 rounded-lg text-[15px] font-medium hover:text-[#1A1A2E] transition-colors">
                                        Learn more
                                    </Link>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Impact Metrics */}
                        <FadeIn delay={0.2} className="w-full lg:w-1/2">
                            <p className="text-[13px] font-bold text-[#E87722] uppercase tracking-[0.12em] mb-3">Impact that matters</p>
                            <h3 className="text-[24px] font-extrabold text-[#1A1A2E] mb-10 leading-tight">
                                Every year, Vanigan simplifies your journey <br className="hidden md:block" />to trusted business support.
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { value: stats.searches, suffix: '+', label: 'Business searches' },
                                    { value: stats.total > 0 ? stats.total : 50000, suffix: '+', label: 'Verified listings' },
                                    { value: stats.leads, suffix: '+', label: 'Direct leads generated' }
                                ].map((m, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-[36px] md:text-[44px] font-extrabold text-[#1A1A2E] leading-none mb-2">
                                            <AnimatedCounter end={m.value} suffix={m.suffix} />
                                        </div>
                                        <p className="text-[14px] text-[#6B7280] font-medium">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: "Support for all"
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1280px] mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-[36px] md:text-[48px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] mb-5">
                                Business listing for all
                            </h2>
                            <p className="text-[17px] text-[#4B5563] font-normal max-w-xl mx-auto leading-[1.7]">
                                No matter your industry, from retail to manufacturing, list your business and connect with the community.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Calendar size={28} />,
                                title: 'Events and workshops',
                                desc: 'Attend practical events and network with fellow founders of the community.',
                                color: '#E87722',
                                bg: '#FFF8F0'
                            },
                            {
                                icon: <MessageCircle size={28} />,
                                title: 'Connections and advice',
                                desc: 'Make connections and share advice with other members of the small business community.',
                                color: '#2B7A78',
                                bg: '#F0FAF9'
                            },
                            {
                                icon: <Wallet size={28} />,
                                title: 'Funding and grants',
                                desc: 'Access financial support to take your business to the next level.',
                                color: '#3D5A80',
                                bg: '#F0F4FA'
                            }
                        ].map((card, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div
                                    className="rounded-[20px] p-8 md:p-10 h-full border border-[#F3F4F6] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-pointer"
                                    style={{ backgroundColor: card.bg }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        {card.icon}
                                    </div>
                                    <h3 className="text-[20px] font-bold text-[#1A1A2E] mb-3">{card.title}</h3>
                                    <p className="text-[15px] text-[#4B5563] leading-[1.7] font-normal">{card.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: "Why join?" Tabs
               ════════════════════════════════════════════ */}
            <section className="bg-[#F9FAFB] py-20 md:py-28">
                <div className="max-w-[1280px] mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-[36px] md:text-[48px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] mb-5">
                                Why list on Vanigan?
                            </h2>
                            <p className="text-[17px] text-[#4B5563] font-normal max-w-lg mx-auto leading-[1.7]">
                                Tamil Nadu's premier business listing platform for traders and associates.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles size={24} />,
                                title: 'Register Business',
                                desc: "List your business for free on India's most trusted traders and associates platform.",
                                items: ['Free business listing', 'Verified membership', 'WhatsApp connectivity'],
                                color: '#E87722'
                            },
                            {
                                icon: <Users2 size={24} />,
                                title: 'Trader Network',
                                desc: 'Expand your network and connect with thousands of traders and associates across Tamil Nadu.',
                                items: ['Local district networks', 'B2B collaborations', 'Industry-specific groups'],
                                color: '#2B7A78'
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: 'Business Growth',
                                desc: 'Get the visibility your business deserves. Track leads and grow your brand presence online.',
                                items: ['Lead generation', 'Verified business badge', 'SEO-friendly profile'],
                                color: '#3D5A80'
                            }
                        ].map((col, i) => (
                            <FadeIn key={i} delay={i * 0.12}>
                                <div className="bg-white rounded-[20px] p-8 md:p-10 h-full border border-[#F3F4F6] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6" style={{ backgroundColor: col.color }}>
                                        {col.icon}
                                    </div>
                                    <h3 className="text-[22px] font-bold text-[#1A1A2E] mb-3">{col.title}</h3>
                                    <p className="text-[15px] text-[#4B5563] leading-[1.7] mb-6">{col.desc}</p>
                                    <ul className="space-y-3">
                                        {col.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: col.color }} />
                                                <span className="text-[14px] font-medium text-[#1A1A2E]">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.3}>
                        <div className="text-center mt-14">
                            <p className="text-[15px] text-[#4B5563] mb-4 font-medium">Ready to get started?</p>
                            <Link
                                to="/add-business"
                                className="inline-flex items-center gap-2 bg-[#E87722] text-white h-[48px] px-8 rounded-lg text-[15px] font-bold hover:bg-[#D36B1E] transition-colors"
                            >
                                Join for free
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: Featured Businesses
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1280px] mx-auto px-6">
                    <FadeIn>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                            <div>
                                <h2 className="text-[36px] md:text-[48px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] mb-4">
                                    Latest member stories
                                </h2>
                                <p className="text-[17px] text-[#4B5563] font-normal max-w-xl leading-[1.7]">
                                    Meet the community and discover what they have achieved with membership.
                                </p>
                            </div>
                            <Link
                                to="/business-list"
                                className="flex items-center gap-2 text-[14px] font-bold text-[#E87722] hover:text-[#D36B1E] transition-colors group whitespace-nowrap"
                            >
                                More member stories <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-[380px] bg-[#F9FAFB] rounded-[20px] animate-pulse" />
                            ))
                        ) : businesses.length > 0 ? (
                            businesses.map(biz => <BusinessCard key={biz._id || biz.id} business={biz} />)
                        ) : (
                            <div className="col-span-3 text-center py-16 text-[#9CA3AF] text-[16px] font-medium">
                                No featured businesses available yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 5: Final CTA
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-[#1A1A2E]">
                <div className="max-w-[800px] mx-auto px-6 text-center">
                    <FadeIn>
                        <h2 className="text-[36px] md:text-[48px] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-6">
                            Ready to join the<br />
                            <span className="text-[#E87722]">Vanigan Community?</span>
                        </h2>
                        <p className="text-[17px] text-[#9CA3AF] font-normal leading-[1.7] mb-10 max-w-lg mx-auto">
                            The first step to growing your business in Tamil Nadu is getting verified.
                            It only takes 2 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/add-business"
                                className="inline-flex items-center gap-2 bg-[#E87722] text-white h-[52px] px-10 rounded-lg text-[16px] font-bold hover:bg-[#D36B1E] transition-colors"
                            >
                                Join for free
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 border border-[#4B5563] text-[#D1D5DB] h-[52px] px-10 rounded-lg text-[16px] font-bold hover:border-white hover:text-white transition-colors"
                            >
                                See how it works
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
};

export default Home;
