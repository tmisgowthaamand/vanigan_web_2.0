import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = ['How to start a business', 'Funding opportunities', 'Networking events', 'Legal advice', 'Marketing help'];

    const slides = [
        {
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
            bg: '#E87722',
            quote: '"Vanigan has been monumental in starting my business."',
            name: 'Junaid S.',
            title: 'Founder of TechSolutions'
        },
        {
            image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
            bg: '#2B7A78',
            quote: '"The community support here is exactly what I needed to grow."',
            name: 'Priya M.',
            title: 'Co-founder of GreenLeaf'
        },
        {
            image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800',
            bg: '#3D5A80',
            quote: '"Resources provided by Vanigan are world-class and easy to follow."',
            name: 'Anish K.',
            title: 'Owner, CraftBrew Co.'
        }
    ];

    const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

    useEffect(() => {
        const t = setInterval(nextSlide, 7000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setPlaceholderIndex((p) => (p + 1) % placeholders.length), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <section
            className="pt-[72px] bg-white"
            style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}
        >
            <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-24 lg:py-32">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-8">

                    {/* ─── LEFT COLUMN ─── */}
                    <div className="w-full lg:w-[55%] lg:pr-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-[40px] sm:text-[52px] md:text-[64px] font-extrabold text-[#1A1A2E] leading-[1.08] tracking-[-0.02em] mb-8"
                        >
                            Connect with trusted{' '}
                            <span className="text-[#E87722]">traders</span> and
                            associates in Tamil Nadu
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-[17px] md:text-[19px] text-[#4B5563] leading-[1.6] mb-12 max-w-[520px] font-normal"
                        >
                            The largest platform to find verified businesses and list yours for free.
                            Built for modern shops, traders, and small business associates.
                        </motion.p>

                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <p className="text-[#E87722] font-bold text-[16px] mb-4">
                                I am looking for...
                            </p>
                            <div className="max-w-[500px]">
                                <div className="flex items-center border border-[#D1D5DB] rounded-xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus-within:border-[#E87722] focus-within:shadow-[0_4px_24px_rgba(232,119,34,0.12)] transition-all">
                                    <div className="pl-5 pr-3 text-[#9CA3AF]">
                                        <Search size={22} />
                                    </div>
                                    <div className="flex-1 relative h-[52px] flex items-center">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-full bg-transparent outline-none text-[16px] text-[#1A1A2E] font-medium"
                                        />
                                        {!searchQuery && (
                                            <div className="absolute inset-0 flex items-center pointer-events-none">
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={placeholderIndex}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -8 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="text-[#9CA3AF] text-[16px] font-medium"
                                                    >
                                                        {placeholders[placeholderIndex]}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/business-list?search=${searchQuery}`)}
                                        className="h-[42px] px-7 mr-[5px] bg-[#E87722] text-white rounded-lg text-[15px] font-bold hover:bg-[#D36B1E] transition-colors shrink-0"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT COLUMN (Enterprise Nation exact layout) ─── */}
                    <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[420px]">

                            {/* Navigation arrows ABOVE the image */}
                            <div className="flex items-center justify-end gap-2 mb-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-9 h-9 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#6B7280] hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-9 h-9 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#6B7280] hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Image Frame Container */}
                            <div className="relative">
                                {/* Decorative: Yellow Triangle (top-left) */}
                                <div
                                    className="absolute -top-6 -left-6 w-[70px] h-[70px] z-0"
                                    style={{
                                        backgroundColor: '#F6C843',
                                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                        transform: 'rotate(-30deg)'
                                    }}
                                />

                                {/* Decorative: Blue Shape (bottom-right) */}
                                <div
                                    className="absolute -bottom-5 -right-5 w-[60px] h-[90px] z-0"
                                    style={{
                                        backgroundColor: '#3D7EC7',
                                        clipPath: 'polygon(20% 0%, 100% 15%, 80% 100%, 0% 85%)',
                                        transform: 'rotate(10deg)'
                                    }}
                                />

                                {/* Main Image */}
                                <div className="relative z-10 aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSlide}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0"
                                            style={{ backgroundColor: slides[currentSlide].bg }}
                                        >
                                            <img
                                                src={slides[currentSlide].image}
                                                alt="Community member"
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Quote Below Image */}
                            <div className="mt-8 text-center px-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-[17px] md:text-[19px] font-semibold text-[#1A1A2E] leading-[1.5] mb-2">
                                            {slides[currentSlide].quote}
                                        </p>
                                        <p className="text-[14px] text-[#E87722] font-bold">
                                            {slides[currentSlide].name}
                                        </p>
                                        <p className="text-[13px] text-[#6B7280] font-medium">
                                            {slides[currentSlide].title}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
