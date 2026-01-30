import { useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Loader2, LogOut, User, BookOpen, ShoppingBag, Trophy } from 'lucide-react';
import { Button } from './index';
import { useAuthStore } from '../../lib/auth.store';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface NavbarProps {
    className?: string;
    showLinks?: boolean;
    children?: React.ReactNode;
}

export default function Navbar({ className, showLinks = true, children }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading, signOut } = useAuthStore();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const NavContent = (
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Recycle className="w-8 h-8 text-pastel-green" />
                <span className="text-xl font-bold tracking-tighter uppercase flex items-center">
                    RELOOP
                </span>
            </button>

            {showLinks && (
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => navigate('/devices')}
                        className={cn(
                            "flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-pastel-coral transition-colors",
                            location.pathname === '/devices' && "text-pastel-coral"
                        )}
                    >
                        <BookOpen className="w-4 h-4" />
                        Devices
                    </button>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className={cn(
                            "flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-pastel-blue transition-colors",
                            location.pathname === '/marketplace' && "text-pastel-blue"
                        )}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Marketplace
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className={cn(
                            "flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-pastel-yellow transition-colors",
                            location.pathname === '/leaderboard' && "text-pastel-yellow"
                        )}
                    >
                        <Trophy className="w-4 h-4" />
                        Leaderboard
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4">
                {children}
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : user ? (
                    <>
                        <Button variant="secondary" size="md" className="hidden sm:inline-flex" onClick={() => navigate('/profile')}>
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </Button>
                        <button
                            onClick={handleSignOut}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500" />
                        </button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" size="md" onClick={() => navigate('/login')}>Login</Button>
                        <Button variant="primary" size="md" onClick={() => navigate('/signup')}>Sign Up</Button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <nav className={cn("sticky top-0 bg-white border-b-2 border-black px-8 py-4 z-50", className)}>
            {NavContent}
        </nav>
    );
}

// Export a motion version for the landing page
export const MotionNavbar = motion.create(Navbar);
