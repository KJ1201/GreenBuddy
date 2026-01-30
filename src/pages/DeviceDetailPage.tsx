import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGeminiPricing } from '../lib/gemini';
import { Recycle, ArrowLeft, Zap, Award, Loader2, PlayCircle, ShieldCheck } from 'lucide-react';
import { Button, Card, Badge, Navbar } from '../components/ui';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { motion } from 'framer-motion';

type Device = Database['public']['Tables']['devices']['Row'];
type Component = Database['public']['Tables']['device_components']['Row'];

export default function DeviceDetailPage() {
    const navigate = useNavigate();
    const { deviceId } = useParams();
    const [device, setDevice] = useState<Device | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [pricesINR, setPricesINR] = useState<Record<string, number>>({});
    const [totalYieldINR, setTotalYieldINR] = useState<number | null>(null);
    const [evaluating, setEvaluating] = useState(false);

    useEffect(() => {
        const fetchDeviceData = async () => {
            if (!deviceId) return;
            setLoading(true);
            try {
                // Fetch device
                const { data: devData, error: devError } = await supabase
                    .from('devices')
                    .select('*')
                    .eq('id', deviceId)
                    .single();

                if (devError) throw devError;
                setDevice(devData);

                // Fetch components
                const { data: compData, error: compError } = await supabase
                    .from('device_components')
                    .select('*')
                    .eq('device_id', deviceId);

                if (compError) throw compError;
                setComponents(compData);
            } catch (err) {
                console.error('Error fetching device details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();
    }, [deviceId]);

    useEffect(() => {
        const evaluateComponents = async () => {
            if (!device || components.length === 0 || evaluating) return;
            setEvaluating(true);
            try {
                const componentList = components.map(c => `- ${c.name} (${c.type}) - Current Est: ₹${c.value}`).join('\n');
                const prompt = `You are a gadget valuation expert for the Indian secondary market.
                Estimate the individual resale values in INR for these specific components harvested from a "${device.name}".
                Consider the current Indian market conditions.
                Return ONLY JSON with a mapping of component name to value in INR, and a "total_yield_inr" field.
                Components:\n${componentList}`;

                const parsed = await fetchGeminiPricing(prompt);

                // Map by name (assuming names are unique for the device for mapping purposes)
                const mapping: Record<string, number> = {};
                components.forEach(c => {
                    if (parsed[c.name]) {
                        mapping[c.id] = parsed[c.name];
                    } else {
                        // Fallback if AI renamed something
                        mapping[c.id] = Math.ceil(parseFloat(String(c.value)));
                    }
                });

                setPricesINR(mapping);
                setTotalYieldINR(parsed.total_yield_inr || Object.values(mapping).reduce((a, b) => a + b, 0));
            } catch (err) {
                console.error('AI Valuation failed:', err);
                const fallback: Record<string, number> = {};
                let total = 0;
                components.forEach(c => {
                    const val = Math.ceil(parseFloat(String(c.value)));
                    fallback[c.id] = val;
                    total += val;
                });
                setPricesINR(fallback);
                setTotalYieldINR(total);
            } finally {
                setEvaluating(false);
            }
        };

        if (device && components.length > 0) {
            evaluateComponents();
        }
    }, [device, components]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-pastel-coral" />
                <p className="font-black uppercase tracking-widest text-gray-400">Loading Blueprint...</p>
            </div>
        );
    }

    if (!device) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center p-12 border-4 border-black rounded-3xl">
                    <h1 className="text-4xl font-black uppercase italic mb-4">Device Not Found</h1>
                    <Button onClick={() => navigate('/devices')}>
                        Back to Catalog
                    </Button>
                </div>
            </div>
        );
    }

    const getSafetyTierInfo = (tier: string | null) => {
        switch (tier) {
            case 'GREEN':
                return { color: 'blue', text: 'Low voltage environment. Safe for beginners with standard precautions.', gradient: 'from-blue-50 to-white' };
            case 'YELLOW':
                return { color: 'yellow', text: 'Contains moving parts/springs. Requires moderate mechanical caution.', gradient: 'from-yellow-50 to-white' };
            case 'RED':
                return { color: 'coral', text: 'Hazardous materials or high-voltage capacitors. Certification required.', gradient: 'from-orange-50 to-white' };
            default:
                return { color: 'blue', text: 'Follow standard safety protocols.', gradient: 'from-gray-50 to-white' };
        }
    };

    const safetyInfo = getSafetyTierInfo(device.safety_tier);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="container mx-auto px-8 py-12">
                <button
                    onClick={() => navigate('/devices')}
                    className="flex items-center gap-2 mb-12 hover:opacity-70 transition-opacity font-black uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Catalog</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Badge variant="coral" className="mb-6 uppercase italic font-black text-xs tracking-widest">
                            {device.type?.toUpperCase()} HARVEST
                        </Badge>
                        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
                            {device.name}
                        </h1>
                        <p className="text-xl font-medium text-gray-600 mb-8 leading-relaxed">
                            {device.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <Card variant="white" padding="md" className="flex flex-col gap-1 border-b-8">
                                <span className="text-[10px] font-black uppercase opacity-40">Difficulty</span>
                                <span className="text-xl font-black uppercase italic">{device.difficulty}</span>
                            </Card>
                            <Card variant="white" padding="md" className="flex flex-col gap-1 border-b-8">
                                <span className="text-[10px] font-black uppercase opacity-40">Safety Tier</span>
                                <span className="text-xl font-black uppercase italic" style={{ color: `var(--color-pastel-${safetyInfo.color})` }}>
                                    {device.safety_tier}
                                </span>
                            </Card>
                        </div>

                        <div className={`p-6 border-2 border-black rounded-2xl mb-12 bg-gradient-to-br ${safetyInfo.gradient}`}>
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-black uppercase tracking-widest text-xs mb-2">Safety Directive</p>
                                    <p className="font-medium text-gray-700 leading-snug">{safetyInfo.text}</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="h-20 px-12 text-3xl italic font-black uppercase tracking-tighter border-b-8 active:border-b-2"
                            onClick={async () => {
                                const { data: { user } } = await supabase.auth.getUser();
                                if (user) {
                                    const { data, error } = await supabase
                                        .from('teardown_sessions')
                                        .insert({
                                            user_id: user.id,
                                            device_id: deviceId,
                                            status: 'in_progress'
                                        } as any)
                                        .select()
                                        .single();

                                    if (data && !error) {
                                        navigate(`/device/${deviceId}/teardown?sessionId=${data.id}`);
                                        return;
                                    }
                                }
                                navigate(`/device/${deviceId}/teardown`);
                            }}
                        >
                            Start Extraction <PlayCircle className="ml-2 w-8 h-8" />
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-gray-50 rounded-[4rem] flex items-center justify-center border-4 border-black relative overflow-hidden group">
                            {device.image_url ? (
                                <img src={device.image_url} alt={device.name} className="w-full h-full object-cover" />
                            ) : (
                                <Recycle className="w-48 h-48 text-gray-100 group-hover:rotate-12 transition-transform duration-700" />
                            )}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                </div>

                <div className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-[5rem] font-black uppercase italic tracking-tighter leading-none mb-4">
                                Component <br />
                                <span style={{ color: 'var(--color-pastel-coral)' }}>Map</span>
                            </h2>
                            <p className="text-xl font-medium text-gray-500">
                                This device contains elements essential for robotics, IoT, and high-precision optics.
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Estimated Yield</span>
                            <span className="text-8xl font-black text-pastel-coral tabular-nums leading-none tracking-tighter">
                                {totalYieldINR ? `₹${totalYieldINR.toLocaleString('en-IN')}` : `₹${parseFloat(String(device.total_value)).toLocaleString('en-IN')}`}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {components.map((component, idx) => (
                            <motion.div
                                key={component.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card
                                    variant="white"
                                    padding="lg"
                                    className="h-full hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="bg-gray-100 px-3 py-1 rounded border border-black text-[10px] font-black uppercase tracking-widest">{component.type}</div>
                                        <div className="text-4xl font-black text-pastel-coral italic">
                                            {pricesINR[component.id] ? `₹${pricesINR[component.id].toLocaleString('en-IN')}` : `₹${parseFloat(String(component.value)).toLocaleString('en-IN')}`}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{component.name}</h3>
                                    <p className="font-medium text-gray-600 mb-8 leading-relaxed">
                                        {component.description}
                                    </p>

                                    <div className="mt-auto p-4 bg-pastel-blue/20 rounded-2xl border-2 border-pastel-blue">
                                        <div className="flex gap-3">
                                            <Award className="w-5 h-5 flex-shrink-0" />
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Impact Potential</span>
                                                <p className="text-sm font-bold text-gray-700">Perfect for secondary educational projects in robotics and motion control.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <Card variant="pastel-blue" padding="lg" className="mb-24 relative overflow-hidden border-4">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                            <div className="flex items-center gap-8 flex-col md:flex-row">
                                <div className="w-24 h-24 rounded-3xl bg-white border-4 border-black flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <Zap className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">XP Available</h3>
                                    <p className="text-xl font-medium opacity-70">Complete this teardown to climb the global leaderboard.</p>
                                </div>
                            </div>
                            <div className="flex gap-12 font-black italic">
                                <div className="text-center">
                                    <div className="text-7xl leading-none">{components.length * 50}</div>
                                    <div className="text-xs uppercase tracking-widest opacity-60">XP TOTAL</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-7xl leading-none">{components.length}</div>
                                    <div className="text-xs uppercase tracking-widest opacity-60">BADGES</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
