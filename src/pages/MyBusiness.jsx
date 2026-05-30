import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { MessageCircle, ArrowRight, ChevronLeft, Building2, MapPin, Phone, Star, ExternalLink, Loader2, ArrowUpRight, Sparkles, TrendingUp, LayoutGrid, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = ["listing", "presence", "business", "profile"];

const MyBusiness = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    // Review states
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewPhone, setReviewPhone] = useState('');
    const [businessReviews, setBusinessReviews] = useState({});

    const handleSearch = async (e) => {
        e.preventDefault();
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);
        setError('');
        setSearched(true);
        setProgress(0);
        try {
            const matches = await businessService.getByPhone(cleaned, (p) => setProgress(p));
            setResults(matches);
        } catch (err) {
            setError('Failed to connect to server. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    // Load reviews for search results
    useEffect(() => {
        if (results && results.length > 0) {
            results.forEach(async (biz) => {
                try {
                    setBusinessReviews(prev => ({
                        ...prev,
                        [biz._id]: biz.reviews || []
                    }));
                } catch (err) {
                    console.error('Error fetching reviews:', err);
                }
            });
        }
    }, [results]);

    const handleReviewSubmit = async (businessId) => {
        if (reviewRating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!reviewName.trim()) {
            alert('Please enter your name');
            return;
        }

        setSubmittingReview(true);
        try {
            await businessService.submitReview({
                businessId,
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                phone: reviewPhone
            });
            alert('Review submitted successfully!');
            const data = await businessService.getReviews(businessId);
            setBusinessReviews(prev => ({ ...prev, [businessId]: data || [] }));

            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            setReviewPhone('');
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Typography rotation state
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Stats state
    const [stats, setStats] = useState({ total: 0, searches: '125K+', leads: '85K+' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                if (data && data.total) {
                    setStats(prev => ({ ...prev, total: data.total }));
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="bg-white min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <Navbar />

            {/* ═══ HERO — Clean white style matching homepage ═══ */}
            <section className="pt-36 pb-16 bg-white overflow-hidden relative">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87722]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left — heading */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] font-bold text-[#E87722] uppercase tracking-[0.12em] flex items-center gap-2"
                            >
                                <Sparkles size={16} /> My Business Dashboard
                            </motion.p>
                            <h1 className="text-[40px] md:text-[56px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] min-h-[140px] md:min-h-[130px]">
                                Manage your <br />
                                <span className="text-[#E87722] relative inline-block whitespace-nowrap">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={wordIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="absolute left-0 top-0"
                                        >
                                            {ROTATING_WORDS[wordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="opacity-0 pointer-events-none">presence</span>
                                </span> <br />
                                for free
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-[17px] text-[#4B5563] font-normal leading-[1.7] max-w-md pt-2"
                            >
                                Access your business profile, respond to leads, and update your services. Built for modern shops, traders, and small business associates.
                            </motion.p>
                        </div>

                        {/* Right — Stats cards */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-3 gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgba(232,119,34,0.06)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-1 transition-all duration-500">
                                {[
                                    { value: stats.searches, label: 'Business searches' },
                                    { value: stats.total > 0 ? stats.total.toLocaleString() + '+' : '50K+', label: 'Verified listings' },
                                    { value: stats.leads, label: 'Direct leads' }
                                ].map((m, i) => (
                                    <div key={i} className="text-center group">
                                        <div className="text-[36px] md:text-[44px] font-extrabold text-[#1A1A2E] leading-none mb-2 group-hover:text-[#E87722] transition-colors">{m.value}</div>
                                        <p className="text-[14px] text-[#6B7280] font-medium">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ DASHBOARD SECTION ═══ */}
            <section className="py-16 bg-[#F9FAFB]">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10">

                        {/* ── Main: Phone lookup form ── */}
                        <div className="lg:col-span-7 space-y-8 absolute-z-10">
                            <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#E87722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <h2 className="text-[24px] font-extrabold text-[#1A1A2E] mb-2">Access your dashboard</h2>
                                <p className="text-[15px] text-[#4B5563] font-normal leading-[1.7] mb-8">
                                    Enter your registered phone number to manage your profile and view customer leads.
                                </p>

                                <form onSubmit={handleSearch} className="space-y-5">
                                    <div>
                                        <label className="text-[12px] font-bold text-[#1A1A2E] uppercase tracking-wider mb-2 block">Registered Mobile</label>
                                        <div className="relative group">
                                            <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#E87722] transition-colors" />
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                                                placeholder="Enter 10-digit number"
                                                className="w-full border border-[#E5E7EB] rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-[#1A1A2E] outline-none focus:border-[#E87722]/50 transition-all placeholder:text-[#9CA3AF]"
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-rose-600 text-[13px] font-medium mt-2">{error}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#E87722] text-white h-[48px] rounded-xl text-[15px] font-bold hover:bg-[#D36B1E] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <><Loader2 size={20} className="animate-spin" /> Scanning... {progress}%</>
                                        ) : (
                                            <>Access Dashboard <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Search Results */}
                            {searched && !loading && results !== null && (
                                <div className="space-y-6">
                                    {results.length === 0 ? (
                                        <div className="bg-rose-50 rounded-[20px] p-8 border border-rose-100 text-center">
                                            <p className="text-rose-600 font-bold text-[15px] mb-2">No listing found with this number.</p>
                                            <Link to="/add-business" className="text-rose-500 font-bold underline underline-offset-4">Register your business for free</Link>
                                        </div>
                                    ) : (
                                        results.map((biz) => (
                                            <motion.div
                                                key={biz._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-2 hover:border-[#E87722]/30 transition-all duration-500 group relative"
                                            >
                                                {/* Hover glow overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#E87722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]" />

                                                {/* Image Banner */}
                                                <div className="h-44 bg-gradient-to-br from-[#FFF8F0] to-[#F9FAFB] relative overflow-hidden">
                                                    {biz.image ? (
                                                        <img src={biz.image} alt={biz.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(232,119,34,0.08)] text-[#E87722]/40 group-hover:text-[#E87722] transition-colors duration-500">
                                                                <Building2 size={32} strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        {biz.active !== false && (
                                                            <div className="bg-[#059669] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm backdrop-blur-md bg-opacity-90">
                                                                <CheckCircle size={12} /> VERIFIED
                                                            </div>
                                                        )}
                                                    </div>
                                                    {biz.listingCode && (
                                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#1A1A2E] shadow-sm border border-[#E5E7EB]">
                                                            #{biz.listingCode}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Body */}
                                                <div className="p-6 relative z-10">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="text-[11px] font-bold text-[#E87722] uppercase tracking-[0.15em] mb-1">{biz.category}</p>
                                                            <h3 className="text-[20px] font-extrabold text-[#1A1A2E] leading-tight group-hover:text-[#E87722] transition-colors line-clamp-2">{biz.name}</h3>
                                                        </div>
                                                        {biz.avgRating > 0 && (
                                                            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-2.5 py-1 rounded-lg border border-[#E87722]/10 shrink-0">
                                                                <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                                                                <span className="text-[13px] font-bold text-[#1A1A2E]">{biz.avgRating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {biz.description && (
                                                        <p className="text-[13px] text-[#6B7280] leading-relaxed line-clamp-2 mb-4">{biz.description}</p>
                                                    )}

                                                    <div className="space-y-2 mb-5">
                                                        {(biz.address || biz.district) && (
                                                            <div className="flex items-start gap-2.5 text-[#6B7280]">
                                                                <MapPin size={14} className="text-[#E87722] mt-0.5 shrink-0" />
                                                                <p className="text-[13px] font-medium line-clamp-1">{[biz.address, biz.assembly, biz.district].filter(Boolean).join(', ')}</p>
                                                            </div>
                                                        )}
                                                        {biz.phone && (
                                                            <div className="flex items-center gap-2.5 text-[#6B7280]">
                                                                <Phone size={14} className="text-[#E87722] shrink-0" />
                                                                <p className="text-[13px] font-bold tracking-wide">{biz.phone}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 border-t border-[#F3F4F6] flex gap-3">
                                                        <Link
                                                            to={`/business/${biz._id}`}
                                                            className="flex-1 bg-[#E87722] text-white text-center px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#D36B1E] hover:shadow-[0_8px_16px_rgba(232,119,34,0.2)] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            View Profile <ArrowRight size={16} />
                                                        </Link>
                                                        <Link
                                                            to={`/business/${biz._id}`}
                                                            className="border border-[#E5E7EB] text-[#1A1A2E] px-5 py-3 rounded-xl text-[13px] font-bold hover:bg-[#FFF8F0] hover:border-[#E87722]/30 transition-all flex items-center gap-2"
                                                        >
                                                            <ExternalLink size={14} /> Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Why Vanigan card */}
                            <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#E87722]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-[#E87722] shadow-[0_8px_16px_rgba(232,119,34,0.2)] group-hover:scale-110 transition-transform duration-500">
                                    <Star size={28} />
                                </div>
                                <h3 className="text-[20px] font-bold text-[#1A1A2E] mb-3 relative z-10">Grow your business</h3>
                                <p className="text-[15px] text-[#4B5563] leading-[1.7] font-normal mb-6 relative z-10">
                                    Get the visibility your business deserves. Reach thousands of potential customers and traders today.
                                </p>
                                <ul className="space-y-3 relative z-10">
                                    {['Free business listing', 'Verified membership', 'WhatsApp connectivity'].map((item, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0 text-[#E87722]" />
                                            <span className="text-[14px] font-medium text-[#1A1A2E]">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tips card */}
                            <div className="bg-white rounded-[20px] p-8 border border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E87722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <h4 className="text-[12px] font-bold text-[#1A1A2E] uppercase tracking-wider mb-6 relative z-10">Performance Tips</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-5 bg-white group-hover:bg-[#FFF8F0]/60 transition-colors duration-500 rounded-xl border border-[#F3F4F6] shadow-sm">
                                        <p className="text-[14px] font-bold text-[#1A1A2E] mb-1">Complete your profile</p>
                                        <p className="text-[13px] text-[#6B7280] leading-[1.7] font-normal">
                                            Businesses with a complete description and at least 5 photos get 3x more views.
                                        </p>
                                    </div>
                                    <div className="p-5 bg-white group-hover:bg-[#FFF8F0]/60 transition-colors duration-500 rounded-xl border border-[#F3F4F6] shadow-sm">
                                        <p className="text-[14px] font-bold text-[#1A1A2E] mb-1">Respond quickly</p>
                                        <p className="text-[13px] text-[#6B7280] leading-[1.7] font-normal">
                                            Replying to customer reviews within 24 hours shows you care about your reputation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center pt-2">
                                <p className="text-[15px] text-[#4B5563] mb-4 font-medium">Ready to get started?</p>
                                <Link
                                    to="/add-business"
                                    className="inline-flex items-center gap-2 bg-[#E87722] text-white h-[48px] px-8 rounded-lg text-[15px] font-bold hover:bg-[#D36B1E] transition-colors"
                                >
                                    Join for free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MyBusiness;
