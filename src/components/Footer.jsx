import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
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
            className="bg-lacquer-deep border-t border-rule"
            style={{ fontFamily: 'var(--ks-font-body)' }}
        >
            {/* Gold + patina seam — the final brand signature */}
            <div className="ks-seam" />

            {/* Newsletter Strip */}
            <div className="border-b border-rule">
                <div className="max-w-[1320px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="ks-eyebrow mb-2">Subscribe to the Vanigan newsletter</p>
                        <p className="text-[14px] text-muted font-normal">
                            Get the latest news, business insights and resources straight to your inbox.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="ks-input flex-1 min-w-0 md:flex-none md:w-[280px] h-[48px]!"
                        />
                        <button className="ks-button ks-button-primary min-h-12! px-6! text-[14px]! shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Link Grid */}
            <div className="max-w-[1320px] mx-auto px-6 py-14">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                    {/* Brand Column */}
                    <div className="lg:w-[28%] lg:pr-12">
                        <Link to="/" className="flex items-center gap-2 mb-5">
                            <img src="https://vanigan.org/front/images/home/tnvslogo.png" alt="Vanigan" className="h-9 w-auto" />
                            <span
                                className="text-[20px] text-champagne uppercase"
                                style={{ fontFamily: 'var(--ks-font-wordmark)', fontWeight: 500, letterSpacing: '0.12em' }}
                            >
                                Vanigan<span className="text-kinpaku">.org</span>
                            </span>
                        </Link>
                        <p className="text-[14px] text-muted leading-[1.7] mb-6 max-w-[240px]">
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
                                    className="w-9 h-9 rounded-full border border-rule flex items-center justify-center text-muted hover:text-kinpaku hover:border-rule-strong transition-colors"
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
                                <h4 className="ks-mono text-[12px] text-champagne mb-5">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.path}
                                                className="text-[14px] font-normal text-muted hover:text-kinpaku transition-colors"
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
            <div className="border-t border-rule">
                <div className="max-w-[1320px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[13px] text-faint font-normal">
                        © 2026 Vanigan.org. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[13px] text-faint font-normal">
                        <Globe size={14} /> English (IN)
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
