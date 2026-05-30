import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            title: 'Business List',
            path: '/business-list',
            submenu: [
                { name: 'Search Directory', path: '/business-list' },
                { name: 'Verified Traders', path: '/business-list' },
                { name: 'Local Shops', path: '/business-list' }
            ]
        },
        {
            title: 'My Business',
            path: '/my-business',
            submenu: [
                { name: 'Dashboard', path: '/my-business' },
                { name: 'Add Listing', path: '/add-business' },
                { name: 'Manage Results', path: '/my-business' }
            ]
        },
        {
            title: 'Community',
            path: '/joining',
            submenu: [
                { name: 'Trader Network', path: '/joining' },
                { name: 'Trade Events', path: '/events' },
                { name: 'Join with us', path: '/add-business' }
            ]
        },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : ''
                }`}
            style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}
        >
            <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <img
                            src="https://vanigan.org/front/images/home/tnvslogo.png"
                            alt="Vanigan"
                            className="h-9 w-auto"
                        />
                        <span className="text-[18px] font-extrabold text-[#1A1A2E] tracking-tight">
                            Vanigan<span className="text-[#E87722]">.org</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-7">
                        {navLinks.map((link) => (
                            <div key={link.title} className="relative group">
                                <Link
                                    to={link.path}
                                    className="text-[15px] font-medium text-[#4B5563] hover:text-[#1A1A2E] transition-colors flex items-center gap-1"
                                >
                                    {link.title}
                                    <ChevronDown size={14} className="text-[#9CA3AF] group-hover:text-[#4B5563] group-hover:rotate-180 transition-all duration-200" />
                                </Link>
                                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white border border-[#E5E7EB] shadow-xl rounded-lg py-2 w-48">
                                        {link.submenu.map(item => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="block px-4 py-2.5 text-[14px] font-medium text-[#4B5563] hover:text-[#1A1A2E] hover:bg-[#F9FAFB] transition-all"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-5">
                    <div className="hidden md:flex items-center gap-5">
                        <button className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] hover:bg-[#E5E7EB] transition-colors">
                            <Search size={18} strokeWidth={2} />
                        </button>
                        <Link to="/add-business" className="text-[14px] font-medium text-[#4B5563] hover:text-[#1A1A2E] transition-colors whitespace-nowrap">
                            Add Business
                        </Link>
                        <Link to="/login" className="text-[14px] font-medium text-[#4B5563] hover:text-[#1A1A2E] transition-colors">
                            Login
                        </Link>
                    </div>

                    <button
                        onClick={() => navigate('/add-business')}
                        className="bg-[#E87722] text-white h-[40px] px-6 rounded-[8px] text-[14px] font-bold hover:bg-[#D36B1E] transition-colors whitespace-nowrap"
                    >
                        Join for free
                    </button>

                    <button
                        className="lg:hidden text-[#1A1A2E] ml-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden bg-white border-t border-[#E5E7EB] shadow-lg"
                    >
                        <div className="p-6 flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <div key={link.title}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-[17px] font-semibold text-[#1A1A2E] block mb-2"
                                    >
                                        {link.title}
                                    </Link>
                                    <div className="pl-4 flex flex-col gap-1 border-l-2 border-[#F3F4F6]">
                                        {link.submenu.map(item => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-[14px] text-[#6B7280] font-medium py-1"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 mt-2 border-t border-[#F3F4F6] flex flex-col gap-3">
                                <Link to="/login" className="text-[16px] font-semibold text-[#1A1A2E]">Login</Link>
                                <button
                                    onClick={() => { navigate('/add-business'); setIsMenuOpen(false); }}
                                    className="w-full bg-[#E87722] text-white py-3.5 rounded-lg font-bold text-[16px]"
                                >
                                    Join for free
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
