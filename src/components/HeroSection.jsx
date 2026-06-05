import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const HeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
    const handleSearch = (event) => {
        event.preventDefault();
        const term = searchQuery.trim();
        navigate(term ? `/business-list?search=${encodeURIComponent(term)}` : '/business-list');
    };

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
            className="pt-[72px] bg-lacquer relative overflow-hidden"
            style={{ fontFamily: 'var(--ks-font-body)' }}
        >
            {/* Calibration grid field */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(232,119,34,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(232,119,34,0.045)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)] pointer-events-none" />

            <div className="max-w-[1320px] mx-auto px-5 sm:px-6 py-16 md:py-24 lg:py-32 relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-8">

                    {/* ─── LEFT COLUMN ─── */}
                    <div className="w-full lg:w-[55%] lg:pr-8">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="ks-eyebrow mb-6"
                        >
                            Tamil Nadu · Business Directory
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="ks-display text-[36px] sm:text-[58px] md:text-[72px] leading-[1.05] sm:leading-[1.02] mb-8"
                            style={{ fontWeight: 300 }}
                        >
                            Connect with trusted{' '}
                            <span className="text-kinpaku">traders</span> and
                            associates in Tamil Nadu
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-[17px] md:text-[19px] text-muted leading-[1.7] mb-12 max-w-[520px] font-normal"
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
                            <p className="ks-eyebrow mb-4">I am looking for...</p>
                            <div className="max-w-[500px]">
                                <form onSubmit={handleSearch} className="flex items-center border border-rule rounded-[6px] overflow-hidden bg-lacquer-deep focus-within:border-rule-strong transition-all">
                                    <div className="pl-5 pr-3 text-faint">
                                        <Search size={22} />
                                    </div>
                                    <div className="flex-1 relative h-[54px] flex items-center">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-full bg-transparent outline-none text-[16px] text-champagne font-medium"
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
                                                        className="text-faint text-[16px] font-medium"
                                                    >
                                                        {placeholders[placeholderIndex]}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="ks-button ks-button-primary shrink-0 min-h-[44px]! px-7! text-[15px]! mr-[5px]"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT COLUMN ─── */}
                    <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[420px]">

                            {/* Navigation arrows ABOVE the image */}
                            <div className="flex items-center justify-end gap-2 mb-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-9 h-9 rounded-full border border-rule flex items-center justify-center text-muted hover:border-kinpaku hover:text-kinpaku transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-9 h-9 rounded-full border border-rule flex items-center justify-center text-muted hover:border-kinpaku hover:text-kinpaku transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Image Frame Container */}
                            <div className="relative">
                                {/* Main Image */}
                                <div className="relative z-10 aspect-3/4 rounded-[8px] overflow-hidden border border-rule shadow-[0_24px_70px_rgba(2,2,1,0.55)]">
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
                                            <div className="absolute inset-0 bg-linear-to-t from-lacquer-deep/60 via-transparent to-transparent" />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Gold seam across the frame */}
                                    <div className="absolute bottom-0 left-0 right-0 ks-seam z-20" />
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
                                        <p className="text-[17px] md:text-[19px] font-medium text-champagne leading-normal mb-2">
                                            {slides[currentSlide].quote}
                                        </p>
                                        <p className="text-[14px] text-kinpaku font-semibold">
                                            {slides[currentSlide].name}
                                        </p>
                                        <p className="text-[13px] text-faint font-medium">
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
