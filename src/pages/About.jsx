import React from 'react';
import PageHeader from '../components/PageHeader';
import { Smartphone, ShieldCheck, Globe } from 'lucide-react';

const About = () => {
    return (
        <main className="bg-white min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <PageHeader
                title="Empowering Local Commerce"
                subtitle="Vanigan is dedicated to building the digital future for local businesses in Tamil Nadu, fostering growth and connecting communities since 2012."
            />

            {/* AI Platform Section */}
            <section className="py-24">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h4 className="text-[#E87722] text-[13px] font-bold uppercase tracking-[0.12em] mb-4">India's Leading</h4>
                            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A2E] mb-8 leading-[1.1] tracking-[-0.01em]">
                                India’s Leading <span className="text-[#E87722] italic">AI-Powered</span> Business Intelligence Platform
                            </h2>
                            <p className="text-[#4B5563] mb-10 text-[16px] leading-[1.7] max-w-lg">
                                Vanigan directory based platform provides you with an AI based insights that will help you monitor and track your business.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { title: 'Multi-Platform Access', icon: Smartphone, desc: 'Install our app from play store for daily usage and quick checkouts.' },
                                    { title: 'Verified Business Intelligence', icon: ShieldCheck, desc: 'Check reviews and ratings from our experts before you contact any service providers.' },
                                    { title: 'Digital Visibility', icon: Globe, desc: 'Spread your business name around tamil nadu and get more views for your shop/services.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] flex items-center justify-center text-[#E87722] shrink-0">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A1A2E] text-[18px] mb-1">{item.title}</h4>
                                            <p className="text-[14px] text-[#6B7280] font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 bg-[#F9FAFB] rounded-[36px] p-6 border border-[#F3F4F6] shadow-sm">
                            <div className="bg-white p-8 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className="aspect-[4/3] bg-[#F9FAFB] rounded-[20px] flex gap-4 items-center justify-center italic text-[#9CA3AF] border border-[#E5E7EB]">
                                    <ShieldCheck size={40} className="text-[#E87722]" /> App Screenshot
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Core Values */}
            <section className="py-24 bg-[#F9FAFB]">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A2E] tracking-[-0.01em] mb-4">Our Core Values</h2>
                        <p className="text-[#4B5563] text-[16px]">The standards that guide our every step.</p>
                        <div className="w-12 h-1.5 bg-[#E87722] rounded-full mx-auto mt-6" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Innovation', desc: 'We constantly strive to develop new solutions that help our local businesses grow in the digital age.' },
                            { title: 'Trust', desc: 'Authenticity is at our core. We ensure every listing meets our high standards of verification.' },
                            { title: 'Community', desc: 'Our platform is built by the community, for the community. Your growth is our growth.' }
                        ].map((val, i) => (
                            <div key={i} className="bg-white p-10 rounded-[20px] border border-[#F3F4F6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center transition-all hover:shadow-md hover:-translate-y-1">
                                <h4 className="text-[20px] font-extrabold text-[#1A1A2E] mb-4">{val.title}</h4>
                                <p className="text-[#6B7280] text-[15px] leading-[1.7]">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The People Behind Vanigan */}
            <section className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A2E] tracking-[-0.01em] mb-4">The People Behind Vanigan</h2>
                        <p className="text-[#4B5563] text-[16px]">Driven leaders in technology and business development.</p>
                        <div className="w-12 h-1.5 bg-[#E87722] rounded-full mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { name: 'Sathish Kumar', role: 'CEO & Founder' },
                            { name: 'Priya Rajan', role: 'Chief Operating Officer' },
                            { name: 'Arun Vijay', role: 'Head of Marketing' },
                            { name: 'Meera Nair', role: 'Public Relations' }
                        ].map((person, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-32 h-32 bg-[#F9FAFB] border border-[#F3F4F6] rounded-full mx-auto mb-6 flex items-center justify-center text-[#9CA3AF] italic font-bold group-hover:bg-[#FFF8F0] transition-colors">
                                    Photo
                                </div>
                                <h4 className="font-extrabold text-[#1A1A2E] text-[18px] mb-1">{person.name}</h4>
                                <p className="text-[12px] text-[#E87722] font-bold uppercase tracking-wider">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
