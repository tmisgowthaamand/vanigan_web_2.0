import React from 'react';
import { Sparkles } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <section className="relative pt-36 pb-16 bg-white overflow-hidden" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            {/* Decorative background blurs to fill emptiness */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87722]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

            <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
                <nav className="inline-flex items-center gap-2 bg-[#FFF8F0] border border-[#E87722]/10 px-4 py-2 rounded-full mb-6">
                    <Sparkles size={14} className="text-[#E87722]" />
                    <span className="text-[11px] font-bold text-[#E87722] uppercase tracking-[0.12em]">Premium Portal</span>
                </nav>

                <h1 className="text-[40px] md:text-[56px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] mb-6 max-w-3xl mx-auto">
                    {title.split(' ').map((word, i) => (
                        <span key={i} className={i === title.split(' ').length - 1 ? "text-[#E87722]" : ""}>
                            {word}{' '}
                        </span>
                    ))}
                </h1>

                {subtitle && (
                    <p className="max-w-2xl mx-auto text-[17px] text-[#4B5563] font-normal leading-[1.7]">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHeader;
