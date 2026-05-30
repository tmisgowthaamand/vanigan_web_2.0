import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Active Businesses', value: '12k+' },
    { label: 'Monthly Visitors', value: '150k+' },
    { label: 'Verified Reviews', value: '45k+' },
    { label: 'Growth rate', value: '3x', suffix: 'YoY' },
];

const StatsSection = () => {
    return (
        <section className="py-20 bg-white/5 border-y border-white/5">
            <div className="container-custom">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="text-3xl md:text-5xl font-bold text-white mb-2"
                            >
                                {stat.value}
                                {stat.suffix && <span className="text-primary text-xl ml-1 font-medium">{stat.suffix}</span>}
                            </motion.div>
                            <p className="text-slate-500 font-medium text-sm md:text-base">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
