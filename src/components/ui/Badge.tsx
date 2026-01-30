import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    variant?: 'blue' | 'coral' | 'yellow' | 'pink' | 'peach' | 'black' | 'white';
    shape?: 'pill' | 'rounded';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, children, variant = 'blue', shape = 'pill', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border-2 border-black transition-transform duration-200 hover:scale-105";

        const shapes = {
            pill: 'rounded-full',
            rounded: 'rounded-lg',
        };

        const variantStyles = {
            blue: { backgroundColor: 'var(--color-pastel-blue)' },
            coral: { backgroundColor: 'var(--color-pastel-coral)' },
            yellow: { backgroundColor: 'var(--color-pastel-yellow)' },
            pink: { backgroundColor: 'var(--color-pastel-pink)' },
            peach: { backgroundColor: 'var(--color-pastel-peach)' },
            black: { backgroundColor: '#000000', color: '#FFFFFF' },
            white: { backgroundColor: '#FFFFFF', color: '#000000' },
        };

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    shapes[shape],
                    className
                )}
                style={variantStyles[variant]}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;
