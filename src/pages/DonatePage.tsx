import { useNavigate } from 'react-router-dom';
import { Recycle, GraduationCap, MapPin, ExternalLink, ArrowLeft, Heart, Sparkles, Sprout, BookOpen } from 'lucide-react';
import { Button, Card, Badge, Navbar } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface Charity {
    id: string;
    name: string;
    focus: string;
    location: string;
    impact: string;
    neededParts: string[];
    color: string;
}

const mockCharities: Charity[] = [
    {
        id: '1',
        name: 'Stem Labs for All',
        focus: 'Robotics & STEM',
        location: 'Surat, Gujarat',
        impact: 'Provides kits to 50+ rural schools for practical electronics training.',
        neededParts: ['Motors', 'Wires', 'Lenses'],
        color: 'var(--color-pastel-coral)'
    },
    {
        id: '2',
        name: 'The Restart Project',
        focus: 'Community Repair',
        location: 'Mumbai, MH',
        impact: 'Trains local youth in repair skills, giving devices and components a second life.',
        neededParts: ['Screens', 'Buttons', 'Casings'],
        color: 'var(--color-pastel-blue)'
    },
    {
        id: '3',
        name: 'OpenSource Hardware Kids',
        focus: 'Makerspaces',
        location: 'Bangalore, KA',
        impact: 'Free hardware access for budding makers in disadvantaged urban areas.',
        neededParts: ['Sensors', 'Speakers', 'Cables'],
        color: 'var(--color-pastel-yellow)'
    }
];

export default function DonatePage() {
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
                        <Badge variant="coral" className="mb-6 uppercase italic font-black text-xs tracking-widest">
                            Circular Philanthropy
                        </Badge>
                        <h1 className="text-[7.5rem] font-black uppercase italic tracking-tighter leading-[0.8]">
                            Empower<br />
                            <span style={{ color: 'var(--color-pastel-coral)' }}>Learning</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-medium text-gray-500 max-w-md italic leading-tight"
                    >
                        Turn your e-waste into a classroom legacy. Donate verified components to schools and local makerspaces.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="white" padding="xl" className="mb-24 border-4 border-black border-b-[16px] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-coral/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-pastel-coral border-4 border-black flex items-center justify-center shrink-0 rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <GraduationCap className="w-16 h-16 text-white" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Why it matters?</h2>
                                <p className="text-xl font-medium text-gray-600 leading-relaxed max-w-3xl">
                                    Educational labs often struggle to source basic electronic parts for robotics and STEM programs. Your harvested items like <span className="text-black font-black uppercase">motors, displays, and sensors</span> become raw materials for local pioneers.
                                </p>
                                <div className="flex items-center gap-3 mt-8">
                                    <Sparkles className="w-6 h-6 text-pastel-coral" />
                                    <span className="font-black uppercase italic tracking-widest text-sm underline decoration-pastel-coral decoration-4 underline-offset-4">Bonus: Earn 2x XP for all verified donations</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <AnimatePresence>
                        {mockCharities.map((charity, index) => (
                            <motion.div
                                key={charity.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                whileHover={{ y: -8 }}
                            >
                                <Card
                                    variant="white"
                                    padding="xl"
                                    className="h-full flex flex-col border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative group"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-pastel-coral transition-colors">{charity.name}</h3>
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                                <MapPin className="w-4 h-4 text-pastel-coral" />
                                                {charity.location}
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-black flex items-center justify-center shrink-0">
                                            {index === 0 ? <Sprout className="w-8 h-8" /> : index === 1 ? <Recycle className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                        </div>
                                    </div>

                                    <Badge variant="blue" className="mb-6 w-fit uppercase font-black tracking-widest text-[10px]">{charity.focus}</Badge>

                                    <p className="mb-8 text-lg font-medium text-gray-500 italic leading-snug">
                                        "{charity.impact}"
                                    </p>

                                    <div className="mb-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Urgent Subsystems Required:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {charity.neededParts.map(part => (
                                                <Badge key={part} variant="white" shape="rounded" className="px-4 py-2 text-xs font-black uppercase border-black/10 group-hover:border-black/50 transition-colors">
                                                    {part}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8 border-t-2 border-black/5 flex gap-4">
                                        <Button variant="primary" className="flex-1 h-14 text-lg font-black italic uppercase tracking-tighter active:border-b-0 border-b-4">
                                            Donate Harvest <Heart className="ml-2 w-5 h-5 fill-current" />
                                        </Button>
                                        <Button variant="secondary" className="w-14 h-14 p-0 flex items-center justify-center border-b-4"><ExternalLink className="w-6 h-6" /></Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-32 text-center p-20 border-4 border-dashed border-black/10 rounded-[3rem]">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 opacity-30">More Labs Arriving Soon</h2>
                    <p className="font-bold text-gray-300 uppercase tracking-widest text-xs">Connecting 500+ local educational makerspaces by Q4 2026</p>
                </div>
            </div>
        </div>
    );
}
