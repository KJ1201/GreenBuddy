import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '../../components/ui';
import AuthLayout from '../../components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.fullName,
                        role: 'student'
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // Trigger automatically handles user creation in 'users' table
                navigate('/profile');
            }

        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Movement"
            subtitle="Start your sustainable engineering journey"
        >
            <form onSubmit={handleSignUp} className="space-y-6 text-left">
                {error && (
                    <div className="p-3 text-sm font-bold text-red-800 bg-red-50 border-2 border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                        <Input
                            name="fullName"
                            required
                            placeholder="Jane Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <Input
                            name="email"
                            type="email"
                            required
                            placeholder="you@school.edu"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <Input
                            name="password"
                            type="password"
                            required
                            placeholder="Create a strong password"
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full h-12 text-lg font-black uppercase italic tracking-tighter"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Create Account'}
                </Button>

                <div className="text-center text-sm font-bold text-gray-500">
                    Already have an account? <Link to="/login" className="text-black underline decoration-2 underline-offset-4">Log In</Link>
                </div>
            </form>
        </AuthLayout>
    );
}
