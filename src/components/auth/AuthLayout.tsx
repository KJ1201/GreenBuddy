import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Recycle } from 'lucide-react';
import { Card } from '../ui';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pastel-coral/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-blue/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Recycle className="w-10 h-10" />
                        <span className="text-2xl font-bold italic tracking-tighter uppercase">RELOOP</span>
                    </div>
                </div>

                <Card variant="white" padding="xl" className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{title}</h1>
                        {subtitle && <p className="text-gray-500 font-medium">{subtitle}</p>}
                    </div>
                    {children}
                </Card>
            </motion.div>
        </div>
    );
}
