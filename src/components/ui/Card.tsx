import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'padding' | 'variant'> {
    children?: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'white' | 'pastel-blue' | 'pastel-coral' | 'pastel-yellow' | 'pastel-pink' | 'pastel-peach';
    delay?: number;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, padding = 'md', variant = 'white', delay = 0, ...props }, ref) => {
        const baseStyles = "rounded-2xl transition-all duration-300";

        const variants = {
            white: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            'pastel-blue': "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            'pastel-coral': "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            'pastel-yellow': "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            'pastel-pink': "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            'pastel-peach': "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        };

        const variantStyles = {
            white: {},
            'pastel-blue': { backgroundColor: 'var(--color-pastel-blue)' },
            'pastel-coral': { backgroundColor: 'var(--color-pastel-coral)' },
            'pastel-yellow': { backgroundColor: 'var(--color-pastel-yellow)' },
            'pastel-pink': { backgroundColor: 'var(--color-pastel-pink)' },
            'pastel-peach': { backgroundColor: 'var(--color-pastel-peach)' },
        };

        const paddings = {
            none: 'p-0',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
            xl: 'p-12',
        };

        return (
            <motion.div
                ref={ref as any}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay }}
                whileHover={{ y: -4 }}
                className={cn(
                    baseStyles,
                    variants[variant],
                    paddings[padding],
                    className
                )}
                style={variantStyles[variant]}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
