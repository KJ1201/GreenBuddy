import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, Leaf, ShieldAlert, Navigation, Zap } from 'lucide-react';
import { Button, Card, Badge, Navbar } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface Center {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    distance: string;
    typesHandled: string[];
    status: 'open' | 'closing-soon' | 'closed';
}

const mockCenters: Center[] = [
    {
        id: '1',
        name: 'GreenEarth Recycling Hub',
        address: '420, Industrial Area, Surat',
        phone: '+91 98765 43210',
        hours: '9:00 AM - 6:00 PM',
        distance: '2.4 km away',
        typesHandled: ['Batteries', 'Casings', 'CRT Monitors'],
        status: 'open'
    },
    {
        id: '2',
        name: 'SafeDispose E-Waste Center',
        address: 'Plot 12, Ring Road, Mumbai',
        phone: '+91 91234 56789',
        hours: '10:00 AM - 8:00 PM',
        distance: '5.1 km away',
        typesHandled: ['PCBs', 'Batteries', 'Large Appliances'],
        status: 'closing-soon'
    }
];

export default function RecyclePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="container mx-auto px-8 py-20 max-w-6xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-12 hover:opacity-100 opacity-50 transition-opacity font-black uppercase text-xs tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                </button>

                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Badge variant="yellow" className="mb-6 uppercase italic font-black text-xs tracking-widest">
                            Hazardous Mitigation
                        </Badge>
                        <h1 className="text-[7.5rem] font-black uppercase italic tracking-tighter leading-[0.8]">
                            Safe<br />
                            <span style={{ color: 'var(--color-pastel-blue)' }}>Disposal</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-medium text-gray-500 max-w-md italic leading-tight"
                    >
                        Harvest completed. Now ensure toxic bypass materials reach the right certified facilities.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="white" padding="lg" className="mb-24 border-4 border-black border-b-[16px] bg-pastel-yellow/5">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-pastel-yellow border-4 border-black flex items-center justify-center shrink-0 -rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <ShieldAlert className="w-16 h-16 text-black" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Toxic Protocol Recall</h2>
                                <p className="text-xl font-medium text-gray-600 leading-relaxed max-w-3xl">
                                    Leftover casings, fragmented PCBs, and hazardous items like old batteries contain <span className="text-black font-black uppercase">Lead, Mercury, and Cadmium</span>. Never dump these in residential waste.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-12 flex items-center gap-4">
                    <Leaf className="w-10 h-10 text-pastel-blue" />
                    Verified Extraction Hubs
                </h2>

                <div className="space-y-12">
                    <AnimatePresence>
                        {mockCenters.map((center, index) => (
                            <motion.div
                                key={center.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                            >
                                <Card
                                    variant="white"
                                    padding="lg"
                                    className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-12">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-pastel-blue transition-colors">{center.name}</h3>
                                                <Badge variant={center.status === 'open' ? 'blue' : 'coral'} className="uppercase font-black tracking-widest text-[10px]">
                                                    {center.status.replace('-', ' ')}
                                                </Badge>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 italic">
                                                        <MapPin className="w-5 h-5 text-pastel-blue" />
                                                        {center.address}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 italic">
                                                        <Phone className="w-5 h-5 text-pastel-blue" />
                                                        {center.phone}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 italic">
                                                        <Clock className="w-5 h-5 text-pastel-blue" />
                                                        {center.hours}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 italic">
                                                        <Navigation className="w-5 h-5 text-pastel-blue" />
                                                        {center.distance}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-80 pt-8 md:pt-0 md:border-l-4 border-black/5 md:pl-12 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Certified Streams:</p>
                                                <div className="flex flex-wrap gap-2 mb-8">
                                                    {center.typesHandled.map(type => (
                                                        <Badge key={type} variant="white" shape="rounded" className="px-3 py-1 text-[10px] font-black uppercase border-black/10">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <Button variant="primary" className="w-full h-14 text-lg font-black italic uppercase tracking-tighter border-b-4 active:border-b-0">
                                                Route Navigation <Zap className="ml-2 w-5 h-5 fill-current" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-32 text-center py-20 bg-gray-50 border-4 border-black rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-32 h-32 bg-pastel-blue/10 blur-3xl rounded-full"></div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Can't Find a Center?</h2>
                    <p className="text-gray-500 font-medium italic mb-8">We can arrange a certified doorstep hazardous waste pickup for bulk harvests.</p>
                    <Button variant="secondary" size="lg" className="px-12 font-black uppercase italic tracking-tighter">Schedule Pickup</Button>
                </div>
            </div>
        </div>
    );
}
