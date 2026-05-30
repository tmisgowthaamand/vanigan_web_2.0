import React from 'react';
import { cn } from '../utils/cn';

const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-md active:scale-[0.98]',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98]',
        outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary active:scale-[0.98]',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs font-bold',
        md: 'px-6 py-3 text-sm font-bold',
        lg: 'px-8 py-4 text-base font-bold',
    };

    return (
        <button
            disabled={disabled}
            className={cn(
                'inline-flex items-center justify-center rounded-lg transition-all duration-200 selection:bg-primary/30',
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
