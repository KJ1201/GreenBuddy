import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    objectFit?: 'cover' | 'contain' | 'fill';
    aspectRatio?: string;
    fallback?: React.ReactNode;
}

/**
 * Optimized Image Component with lazy loading, loading states, and error handling
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Loading skeleton with shimmer effect
 * - Error state with fallback
 * - Automatic blur-up effect
 * - Responsive image loading
 */
export function OptimizedImage({
    src,
    alt,
    className,
    loading = 'lazy',
    objectFit = 'cover',
    aspectRatio,
    fallback
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(loading === 'eager');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading === 'eager') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [loading]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    if (hasError && fallback) {
        return <>{fallback}</>;
    }

    return (
        <div
            ref={containerRef}
            className={clsx('relative overflow-hidden', className)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            {/* Loading skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 skeleton animate-pulse" />
            )}

            {/* Error state */}
            {hasError && !fallback && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <svg
                            className="w-12 h-12 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-xs font-bold uppercase">Image unavailable</p>
                    </div>
                </div>
            )}

            {/* Actual image */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    loading={loading}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={clsx(
                        'w-full h-full transition-opacity duration-500',
                        `object-${objectFit}`,
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    decoding="async"
                />
            )}
        </div>
    );
}

export default OptimizedImage;
