import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGeminiPricing } from '../lib/gemini';
import { Filter, TrendingUp, Loader2, Recycle } from 'lucide-react';
import { Button, Card, Badge, OptimizedImage } from '../components/ui';
import Navbar from '../components/ui/Navbar';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { motion, AnimatePresence } from 'framer-motion';

type Device = Database['public']['Tables']['devices']['Row'] & {
    component_count?: number;
};

export default function DeviceCatalogPage() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [pricesINR, setPricesINR] = useState<Record<string, number>>({});
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        const fetchDevices = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('devices')
                    .select('*, device_components(*)');

                if (error) throw error;

                const processedDevices = data.map(d => ({
                    ...d,
                    component_count: (d.device_components as any).length || 0
                }));

                setDevices(processedDevices);
            } catch (err) {
                console.error('Error fetching devices:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    useEffect(() => {
        const estimateValues = async () => {
            if (devices.length === 0 || converting) return;
            setConverting(true);
            try {
                // Prepare context for Gemini
                // Prepare context for Gemini
                const deviceContext = devices.map(d => {
                    const comps = (d as any).device_components;
                    const compNames = comps ? comps.map((c: any) => c.name).join(', ') : 'unknown components';
                    return `Device: ${d.name}, Components: ${compNames}, Estimated Value: ₹${d.total_value}`;
                }).join('\n');

                const prompt = `You are a gadget valuation expert for the Indian secondary market. 
                Based on the following devices and their internal components, estimate a realistic "total salvage value" in INR if these parts were harvested and sold individually. 
                Be realistic about Indian market rates and component desirability.
                Return ONLY JSON: { "device_id": price_inr, ... }.
                Devices:\n${deviceContext}`;

                const parsed = await fetchGeminiPricing(prompt);
                setPricesINR(parsed);
            } catch (err) {
                console.error('AI Valuation failed:', err);
                // Fallback: use database values which are already in INR
                const fallback: Record<string, number> = {};
                devices.forEach(d => {
                    fallback[d.id] = Math.ceil(parseFloat(String(d.total_value)));
                });
                setPricesINR(fallback);
            } finally {
                setConverting(false);
            }
        };

        if (devices.length > 0) {
            estimateValues();
        }
    }, [devices]);

    const filteredDevices = difficultyFilter === 'all'
        ? devices
        : devices.filter(d => d.difficulty === difficultyFilter);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': case 'easy': return 'blue';
            case 'intermediate': case 'medium': return 'yellow';
            case 'advanced': case 'hard': return 'coral';
            default: return 'blue';
        }
    };

    const getSafetyTierColor = (tier: string | null) => {
        switch (tier) {
            case 'GREEN': return 'blue';
            case 'YELLOW': return 'yellow';
            case 'RED': return 'coral';
            default: return 'blue';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <Navbar />

            <div className="container mx-auto px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Device Catalog</h1>
                    <p className="text-xl font-medium max-w-2xl text-gray-600">
                        Select a device to begin your harvesting journey. Each device contains high-value components verified by Gemini AI.
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-6 mb-12">
                    <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                        <Filter className="w-4 h-4" />
                        <span>Filter By:</span>
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl border-2 border-black">
                        {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficultyFilter(diff)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${difficultyFilter === diff
                                    ? 'bg-black text-white'
                                    : 'hover:bg-black/5'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Device Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-pastel-coral" />
                        <p className="font-bold text-gray-400 uppercase tracking-widest">Hydrating Catalog...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredDevices.map((device, idx) => (
                                <motion.div
                                    key={device.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card
                                        variant="white"
                                        padding="none"
                                        className="group hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer overflow-hidden"
                                        onClick={() => navigate(`/device/${device.id}`)}
                                    >
                                        <div className="aspect-video bg-gray-50 flex items-center justify-center border-b-2 border-black relative overflow-hidden">
                                            {device.image_url ? (
                                                <OptimizedImage
                                                    src={device.image_url}
                                                    alt={device.name}
                                                    className="w-full h-full"
                                                    objectFit="cover"
                                                    loading="lazy"
                                                    fallback={<Recycle className="w-16 h-16 text-gray-200" />}
                                                />
                                            ) : (
                                                <Recycle className="w-16 h-16 text-gray-200 group-hover:rotate-45 transition-transform duration-500" />
                                            )}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <Badge variant={getDifficultyColor(device.difficulty || 'beginner')} shape="rounded" className="font-black text-[10px]">
                                                    {(device.difficulty || 'beginner').toUpperCase()}
                                                </Badge>
                                                <Badge variant={getSafetyTierColor(device.safety_tier)} shape="rounded" className="font-black text-[10px]">
                                                    {device.safety_tier || 'GREEN'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{device.name}</h3>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-black text-pastel-coral">
                                                        {pricesINR[device.id] ? (
                                                            `₹${pricesINR[device.id].toLocaleString('en-IN')}`
                                                        ) : (
                                                            `₹${parseFloat(String(device.total_value)).toLocaleString('en-IN')}`
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold opacity-40">Est. Value</span>
                                                </div>
                                            </div>

                                            <p className="text-sm font-medium text-gray-600 mb-6 line-clamp-2">
                                                {device.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t-2 border-black mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                    <span className="text-xs font-black uppercase tracking-widest">HVI 84/100</span>
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded border border-black">{device.component_count} Components</span>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredDevices.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 border-4 border-black border-dashed rounded-3xl"
                    >
                        <p className="text-2xl font-black uppercase italic" style={{ color: 'var(--color-text-secondary)' }}>
                            No devices discovered in this tier.
                        </p>
                        <Button variant="secondary" className="mt-6" onClick={() => setDifficultyFilter('all')}>View All Devices</Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
