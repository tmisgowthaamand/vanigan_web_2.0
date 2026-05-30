import React from 'react';
import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => {
    const sections = [
        { id: "collect", title: "1. Information We Collect", content: "We collect information that you provide directly to us when you register a business, create an account, or contact us. This may include your name, email address, phone number, and business details." },
        { id: "use", title: "2. How We Use Your Information", content: "We use the information we collect to provide and maintain our services, to verify business listings, to communicate with you about your account, and to show your business to potential customers." },
        { id: "cookies", title: "3. Cookies Policy", content: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier." },
        { id: "sharing", title: "4. Data Sharing", content: "We do not sell your personal data to third parties. We may share your information with service providers who perform services for us, or when required by law to protect our rights or the safety of others." },
        { id: "security", title: "5. Data Security", content: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal information." },
        { id: "rights", title: "6. Your Rights", content: "You have the right to access, update, or delete the information we have on you. You can do this by contacting us at support@vanigan.org. We will respond to your request within a reasonable timeframe." },
        { id: "contact", title: "7. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at support@vanigan.org or visit us at 50, Surya Avenue Main Road, Kuruniji Nagar Ext, Chrompet, Chennai - 600044." }
    ];

    return (
        <main className="bg-white min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <PageHeader
                title="Privacy Policy"
                subtitle="How we handle your information securely and responsibly."
            />

            <section className="py-24">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0 sticky top-32 h-fit">
                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4B5563] mb-6">On This Page</h4>
                            <ul className="flex flex-col gap-4">
                                {sections.map(s => (
                                    <li key={s.id}>
                                        <a href={`#${s.id}`} className="text-[14px] font-bold text-[#6B7280] hover:text-[#E87722] transition-colors">{s.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 space-y-12">
                            {sections.map(s => (
                                <section key={s.id} id={s.id} className="scroll-mt-32">
                                    <h3 className="text-[24px] font-extrabold text-[#1A1A2E] mb-4">{s.title}</h3>
                                    <p className="text-[16px] text-[#4B5563] leading-[1.8]">{s.content}</p>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
