import React from 'react';
import { MapPin, Phone, LayoutGrid, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BusinessCard = ({ business }) => {
    const id = business._id || business.id;
    const {
        name,
        category,
        subCategory,
        avgRating,
        address,
        phone,
        district,
        assembly,
        image,
        verified = true
    } = business;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-2 hover:border-[#E87722]/30 transition-all duration-500 group flex flex-col h-full"
        >
            {/* Image */}
            <div className="h-56 bg-gradient-to-br from-[#FFF8F0] to-[#F9FAFB] flex items-center justify-center relative overflow-hidden group-hover:bg-[#FFF8F0] transition-colors duration-500">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(232,119,34,0.08)] text-[#E87722]/40 group-hover:text-[#E87722] transition-colors duration-500">
                        <LayoutGrid size={32} strokeWidth={1.5} />
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    {verified && (
                        <div className="bg-[#059669] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm backdrop-blur-md bg-opacity-90">
                            <CheckCircle size={12} /> VERIFIED
                        </div>
                    )}
                </div>

                {avgRating > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-[#E5E7EB]">
                        <span className="text-[#F59E0B] text-[13px] font-bold">★</span>
                        <span className="text-[12px] font-bold text-[#1A1A2E]">{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
                {/* Decorative glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#E87722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="mb-4 relative z-10">
                    <p className="text-[11px] font-bold text-[#E87722] uppercase tracking-[0.15em] mb-2">
                        {category}
                    </p>
                    <h3 className="text-[19px] font-extrabold text-[#1A1A2E] leading-tight line-clamp-2 group-hover:text-[#E87722] transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                    {(address || district) && (
                        <div className="flex items-start gap-3 text-[#6B7280]">
                            <MapPin size={16} className="text-[#9CA3AF] mt-0.5 shrink-0 group-hover:text-[#E87722]/70 transition-colors" />
                            <p className="text-[13.5px] font-medium leading-relaxed line-clamp-2">
                                {[...new Set([assembly || address, district])].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                            <Phone size={16} className="text-[#9CA3AF] shrink-0 group-hover:text-[#E87722]/70 transition-colors" />
                            <p className="text-[13.5px] font-bold tracking-wide">{phone}</p>
                        </div>
                    )}
                </div>

                <div className="pt-5 border-t border-[#F3F4F6] mt-auto relative z-10">
                    <Link
                        to={`/business/${id}`}
                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] px-6 py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 group-hover:bg-[#E87722] group-hover:border-[#E87722] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(232,119,34,0.2)] transition-all duration-300"
                    >
                        View Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default BusinessCard;
