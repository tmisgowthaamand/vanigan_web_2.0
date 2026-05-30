import React from 'react';

const SectionTitle = ({ title }) => {
    return (
        <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
            <div className="w-16 h-1 bg-rose-600 mt-4 rounded-full" />
        </div>
    );
};

export default SectionTitle;
