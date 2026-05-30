import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.5,
                delay,
                type: 'spring',
                stiffness: 100
            }}
            whileHover={{ y: -8, boxShadow: 'var(--shadow-xl)', borderColor: 'rgba(255, 61, 77, 0.2)' }}
            className={className}
            style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--spacing-md)',
                height: '100%',
                border: '1px solid var(--border)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden'
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;
