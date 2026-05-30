import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const FeatureCard = ({ icon: Icon, title, description, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "p-8 glass-card group hover:border-primary/50 transition-all duration-500",
                className
            )}
        >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
};

export default FeatureCard;
