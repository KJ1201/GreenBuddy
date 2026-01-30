import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-black text-white hover:bg-gray-800 active:scale-[0.98]",
            secondary: "bg-white text-black border-2 border-black hover:bg-gray-50 active:scale-[0.98]",
            icon: "bg-white border-2 border-black hover:bg-gray-50 rounded-full p-0 active:scale-95"
        };

        const sizes = {
            sm: variant === 'icon' ? 'w-10 h-10' : 'px-4 py-2 text-sm rounded-3xl',
            md: variant === 'icon' ? 'w-12 h-12' : 'px-6 py-3 text-base rounded-3xl',
            lg: variant === 'icon' ? 'w-14 h-14' : 'px-8 py-4 text-lg rounded-3xl',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
