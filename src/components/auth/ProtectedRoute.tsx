import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth.store';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
    const { user, loading, initialize } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-pastel-coral" />
                <p className="font-black uppercase tracking-widest text-gray-400">Verifying Access...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
