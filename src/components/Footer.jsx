import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowUpRight } from 'lucide-react';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
    const footerSections = [
        {
            title: 'Company',
            links: [
                { name: 'About us', path: '/about' },
                { name: 'Contact us', path: '/contact' },
                { name: 'Careers', path: '/careers' },
                { name: 'Media Centre', path: '/media' },
                { name: 'Campaigns', path: '/campaigns' },
                { name: 'Work with us', path: '/partner' },
            ]
        },
        {
            title: 'Directory',
            links: [
                { name: 'Search Businesses', path: '/business-list' },
                { name: 'Register Business', path: '/add-business' },
                { name: 'Traders Network', path: '/traders' },
                { name: 'Verified Members', path: '/verified' },
                { name: 'Trade Events', path: '/events' },
            ]
        },
        {
            title: 'Categories',
            links: [
                { name: 'Wholesale Traders', path: '/business-list?category=Wholesale' },
                { name: 'Retail Shops', path: '/business-list?category=Retail' },
                { name: 'Professional Services', path: '/business-list?category=Professional' },
                { name: 'B2B Associates', path: '/business-list?category=B2B' },
                { name: 'Local Manufacturers', path: '/business-list?category=Industry' },
            ]
        },
        {
            title: 'Legal',
            links: [
                { name: 'Terms of use', path: '/terms' },
                { name: 'Privacy', path: '/privacy' },
                { name: 'Cookie policy', path: '/cookies' },
                { name: 'Complaints policy', path: '/complaints' },
            ]
        }
    ];

    return (
        <footer
            className="bg-white border-t border-[#E5E7EB]"
            style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}
        >
            {/* Newsletter Strip */}
            <div className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-bold text-[#E87722] uppercase tracking-[0.15em] mb-1">
                            Subscribe to the Vanigan newsletter
                        </p>
                        <p className="text-[14px] text-[#6B7280] font-normal">
                            Get the latest news, business insights and resources straight to your inbox.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="h-[44px] px-4 border border-[#D1D5DB] rounded-lg text-[14px] font-medium text-[#1A1A2E] outline-none focus:border-[#E87722] transition-colors w-full md:w-[280px]"
                        />
                        <button className="h-[44px] px-6 bg-[#E87722] text-white rounded-lg text-[14px] font-bold hover:bg-[#D36B1E] transition-colors shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Link Grid */}
            <div className="max-w-[1280px] mx-auto px-6 py-14">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                    {/* Brand Column */}
                    <div className="lg:w-[28%] lg:pr-12">
                        <Link to="/" className="flex items-center gap-2 mb-5">
                            <img src="https://vanigan.org/front/images/home/tnvslogo.png" alt="Vanigan" className="h-9 w-auto" />
                            <span className="text-[18px] font-extrabold text-[#1A1A2E] tracking-tight">
                                Vanigan<span className="text-[#E87722]">.org</span>
                            </span>
                        </Link>
                        <p className="text-[14px] text-[#6B7280] leading-[1.7] mb-6 max-w-[240px]">
                            Tamil Nadu's largest network for traders and associates to list their business and connect with customers.
                        </p>
                        <div className="flex gap-3 mb-6">
                            {[
                                { Icon: FaFacebook, href: '#' },
                                { Icon: FaXTwitter, href: '#' },
                                { Icon: FaInstagram, href: '#' },
                                { Icon: FaLinkedin, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#E87722] hover:border-[#E87722] transition-colors"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                        <a
                            href="https://play.google.com/store/apps/details?id=io.vanigan.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                alt="Get it on Google Play"
                                className="h-[44px] w-auto"
                            />
                        </a>
                    </div>

                    {/* Links */}
                    <div className="lg:w-[72%] grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h4 className="text-[13px] font-bold text-[#1A1A2E] uppercase tracking-[0.08em] mb-5">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.path}
                                                className="text-[14px] font-normal text-[#6B7280] hover:text-[#E87722] transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#E5E7EB]">
                <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[13px] text-[#9CA3AF] font-normal">
                        © 2026 Vanigan.org. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] font-normal">
                        <Globe size={14} /> English (IN)
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
