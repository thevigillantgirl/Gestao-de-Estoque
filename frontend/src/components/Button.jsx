import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-[10px] font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';

    const variants = {
        primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-lg shadow-indigo-200/50',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
        danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-lg shadow-red-200/50',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
}
