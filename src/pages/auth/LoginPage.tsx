import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '../../components/ui';
import AuthLayout from '../../components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = location.state?.from?.pathname || '/profile';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your harvest journey"
        >
            <form onSubmit={handleLogin} className="space-y-6 text-left">
                {error && (
                    <div className="p-3 text-sm font-bold text-red-800 bg-red-50 border-2 border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <Input
                            type="email"
                            required
                            placeholder="you@school.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <Input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-2 border-gray-300 text-black focus:ring-black" />
                        <span className="text-gray-500">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-pastel-coral hover:underline">Forgot?</Link>
                </div>

                <Button
                    variant="primary"
                    className="w-full h-12 text-lg font-black uppercase italic tracking-tighter"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Enter Lab'}
                </Button>

                <div className="text-center text-sm font-bold text-gray-500">
                    New to ReLoop? <Link to="/signup" className="text-black underline decoration-2 underline-offset-4">Join the Crew</Link>
                </div>
            </form>
        </AuthLayout>
    );
}
