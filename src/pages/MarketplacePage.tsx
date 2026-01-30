import { useState, useEffect } from 'react';
import { fetchGeminiPricing } from '../lib/gemini';
import { Heart, Search, Filter, TrendingUp, Zap, Loader2, Package, Globe, ShieldCheck } from 'lucide-react';
import { Button, Card, Badge, Input, OptimizedImage, Navbar } from '../components/ui';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { motion, AnimatePresence } from 'framer-motion';

type Listing = Database['public']['Tables']['marketplace_listings']['Row'];

export default function MarketplacePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingHarvest, setPendingHarvest] = useState<{ device: string, components: any[] } | null>(null);
    const [pricesINR, setPricesINR] = useState<Record<string, number>>({});
    const [converting, setConverting] = useState(false);

    // Form State
    const [newListing, setNewListing] = useState({
        name: '',
        price: '',
        condition: 'Mint',
        type: 'Motor',
        description: '',
        seller_name: 'guest_maker',
        image_url: ''
    });

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('marketplace_listings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    // Filter out already listed items from pending harvest
    useEffect(() => {
        const harvestData = sessionStorage.getItem('pending_harvest');
        if (harvestData && listings.length > 0) {
            try {
                const parsed = JSON.parse(harvestData);
                if (parsed.components && parsed.components.length > 0) {
                    // Filter out components that are already listed based on exact name match for this user
                    // Note: In a real app we'd use a more robust ID, but for this demo name + seller check is okay
                    const existingNames = new Set(listings.filter(l => l.seller_name === 'guest_maker').map(l => l.name));
                    const remainingComponents = parsed.components.filter((c: any) => !existingNames.has(c.name));

                    if (remainingComponents.length > 0) {
                        setPendingHarvest({ ...parsed, components: remainingComponents });
                    } else {
                        setPendingHarvest(null);
                        sessionStorage.removeItem('pending_harvest');
                    }
                }
            } catch (e) {
                console.error('Failed to parse harvest data', e);
            }
        } else if (harvestData && listings.length === 0 && !loading) {
            // Initial load state where verify harvest logic still holds
            try {
                const parsed = JSON.parse(harvestData);
                if (parsed.components && parsed.components.length > 0) {
                    setPendingHarvest(parsed);
                }
            } catch (e) { }
        }
    }, [listings, loading]);

    useEffect(() => {
        const convertPrices = async () => {
            if (listings.length === 0 || converting) return;
            setConverting(true);
            try {
                const prompt = `You are a gadget valuation expert for the Indian secondary market. 
                Based on these components and their current (possibly estimated) prices in INR, suggest a "Premium AI-Verified" resale price for each. 
                Be realistic about Indian market rates.
                Return ONLY JSON: { "id": price_inr, ... }.
                Listings: ${listings.map(l => `${l.id}: ${l.name} (${l.price} INR)`).join(', ')}`;

                const parsed = await fetchGeminiPricing(prompt);
                setPricesINR(parsed);
            } catch (err) {
                console.error('AI pricing failed:', err);
                // Values are already in INR - use them directly
                const fallback: Record<string, number> = {};
                listings.forEach(l => {
                    fallback[l.id] = Math.ceil(parseFloat(String(l.price)));
                });
                setPricesINR(fallback);
            } finally {
                setConverting(false);
            }
        };

        if (listings.length > 0) {
            convertPrices();
        }
    }, [listings]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('marketplace_listings')
                .insert([{
                    ...newListing,
                    price: parseFloat(newListing.price),
                    is_verified: true // Default for demo
                }]);

            if (error) throw error;


            // Update local state and storage
            if (pendingHarvest) {
                const updatedComponents = pendingHarvest.components.filter(c => c.name !== newListing.name);
                if (updatedComponents.length > 0) {
                    const updatedHarvest = { ...pendingHarvest, components: updatedComponents };
                    setPendingHarvest(updatedHarvest);
                    sessionStorage.setItem('pending_harvest', JSON.stringify(updatedHarvest));
                } else {
                    setPendingHarvest(null);
                    sessionStorage.removeItem('pending_harvest');
                }
            }

            setShowRegisterModal(false);
            fetchListings(); // Refresh
            setNewListing({
                name: '',
                price: '',
                condition: 'Mint',
                type: 'Motor',
                description: '',
                seller_name: 'guest_maker',
                image_url: ''
            });
        } catch (err) {
            console.error('Error registering part:', err);
        }
    };

    const filteredListings = listings.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <AnimatePresence>
                {showRegisterModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setShowRegisterModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card
                                variant="white"
                                padding="lg"
                                className="w-full relative border-4 max-h-[85vh] overflow-y-auto custom-scrollbar"
                            >
                                <button
                                    onClick={() => setShowRegisterModal(false)}
                                    className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors font-black text-xl leading-none"
                                >
                                    ✕
                                </button>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-1">Register Part</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6">List your AI-verified harvest</p>

                                {pendingHarvest && (
                                    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="blue" className="text-[9px] tracking-widest px-2">RECENT HARVEST: {pendingHarvest.device.toUpperCase()}</Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {pendingHarvest.components.map((comp: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setNewListing({
                                                        ...newListing,
                                                        name: comp.name,
                                                        price: comp.suggestedPrice.toString(),
                                                        condition: comp.condition,
                                                        type: comp.type,
                                                        description: `High-quality ${comp.name} harvested from a ${pendingHarvest.device}. AI-Verified condition: ${comp.condition}.`,
                                                        image_url: comp.image_url || ''
                                                    })}
                                                    className="p-3 rounded-xl border-2 border-black hover:bg-pastel-blue/10 hover:border-pastel-blue transition-all text-left flex flex-col gap-1 group"
                                                >
                                                    <span className="text-[9px] font-black uppercase tracking-tighter group-hover:text-pastel-blue">{comp.name}</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-black italic tracking-tighter">₹{comp.suggestedPrice}</span>
                                                        <Badge variant="blue" className="text-[8px] py-0 px-1">{comp.condition}</Badge>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    setPendingHarvest(null);
                                                    sessionStorage.removeItem('pending_harvest');
                                                }}
                                                className="text-[9px] font-bold uppercase underline hover:text-pastel-coral transition-colors"
                                            >
                                                Clear harvest history
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-4 text-left">
                                    <Input
                                        label="Component Name"
                                        placeholder="e.g. NEMA 17 Stepper"
                                        required
                                        value={newListing.name}
                                        onChange={e => setNewListing({ ...newListing, name: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Price (₹)"
                                            type="number"
                                            placeholder="800"
                                            required
                                            value={newListing.price}
                                            onChange={e => setNewListing({ ...newListing, price: e.target.value })}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Condition</label>
                                            <select
                                                className="flex h-12 w-full rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                                value={newListing.condition}
                                                onChange={e => setNewListing({ ...newListing, condition: e.target.value })}
                                            >
                                                <option>Mint</option>
                                                <option>Good</option>
                                                <option>Fair</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Input
                                        label="Description"
                                        placeholder="Brief details about the part..."
                                        value={newListing.description}
                                        onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                                    />

                                    <div className="p-4 rounded-2xl border-4 border-dashed border-black/10 bg-gray-50 text-center">
                                        <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center mx-auto mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">AI Sync Optimization</p>
                                        <p className="text-[9px] opacity-40 uppercase font-bold mt-1">Found 3 matching verifications in your history</p>
                                    </div>

                                    <Button variant="primary" size="lg" className="w-full mt-4 h-14 text-xl font-black italic uppercase tracking-tighter border-b-8 active:border-b-0">
                                        Publish Listing
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-8 py-12">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <Badge variant="coral" className="mb-6 uppercase italic font-black text-xs tracking-widest">Global Supply Chain</Badge>
                        <h1 className="text-[7rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-8">
                            Market<br />
                            <span style={{ color: 'var(--color-pastel-coral)' }}>Place</span>
                        </h1>
                        <p className="text-2xl font-medium text-gray-500 max-w-xl">
                            The definitive source for AI-verified salvaged components. Reduce waste, build cheaper.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search parts..."
                                className="pl-12 h-16 border-b-8"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" size="lg" className="h-16 px-8 border-b-8">
                            <Filter className="w-5 h-5 mr-2" /> Filter
                        </Button>
                        {pendingHarvest && (
                            <Button
                                variant="primary"
                                size="lg"
                                className="h-16 px-8 border-b-8 animate-pulse"
                                onClick={() => setShowRegisterModal(true)}
                            >
                                <Package className="w-5 h-5 mr-2" /> Register Parts ({pendingHarvest.components.length})
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-pastel-coral" />
                        <p className="font-black uppercase tracking-widest text-gray-400">Scanning Database...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredListings.map((listing, idx) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card
                                    variant="white"
                                    padding="none"
                                    className="overflow-hidden border-4 border-black hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col group h-[520px]"
                                >
                                    <div className="aspect-[1.5] bg-gray-50 flex items-center justify-center border-b-4 border-black relative overflow-hidden flex-shrink-0">
                                        {listing.image_url ? (
                                            <OptimizedImage
                                                src={listing.image_url}
                                                alt={listing.name}
                                                className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                                                objectFit="cover"
                                                loading="lazy"
                                                fallback={<Package className="w-24 h-24 text-gray-100" />}
                                            />
                                        ) : (
                                            <Package className="w-24 h-24 text-gray-100 group-hover:rotate-12 transition-transform duration-700" />
                                        )}
                                        <Badge variant="black" className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> AI VERIFIED
                                        </Badge>
                                        <div className="absolute top-4 right-4 text-4xl font-black italic tracking-tighter" style={{ color: 'rgba(0,0,0,0.05)' }}>
                                            {listing.type.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between overflow-hidden">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 mr-2">
                                                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-1 truncate">{listing.name}</h3>
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                                                        Seller: <span className="text-black underline">@{listing.seller_name}</span>
                                                    </p>
                                                </div>
                                                <div className="text-2xl font-black text-pastel-coral italic tracking-tighter">
                                                    {pricesINR[listing.id] ? (
                                                        `₹${pricesINR[listing.id].toLocaleString('en-IN')}`
                                                    ) : (
                                                        `₹${parseFloat(String(listing.price)).toLocaleString('en-IN')}`
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <Badge variant="yellow" className="px-2 py-0 text-[8px] font-black uppercase">{listing.condition}</Badge>
                                                <Badge variant="peach" className="px-2 py-0 text-[8px] font-black uppercase">{listing.type}</Badge>
                                            </div>

                                            <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                                {listing.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-dashed border-gray-100">
                                            <Button variant="primary" size="md" className="flex-1 h-12 text-sm font-black uppercase italic tracking-wider border-b-4 active:border-b-0">
                                                Acquire
                                            </Button>
                                            <Button variant="secondary" size="md" className="w-12 h-12 border-b-4 active:border-b-0 p-0 flex items-center justify-center">
                                                <Heart className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-16 rounded-[3rem] border-4 border-black bg-pastel-yellow relative overflow-hidden shadow-[24px_24px_0px_0px_rgba(0,0,0,0.05)]"
                >
                    <div className="absolute -right-12 -bottom-12 opacity-5 rotate-12">
                        <Globe className="w-96 h-96" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <TrendingUp className="w-16 h-16 mx-auto mb-10 text-black/20" />
                        <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
                            Building a Circular <br />
                            <span style={{ color: 'var(--color-pastel-coral)' }}>Global Future</span>
                        </h2>
                        <p className="text-2xl font-medium text-gray-700 mb-12">
                            Every component listed here represents a localized harvest that reduces carbon footprint by <b>84%</b> compared to new manufacturing.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Button variant="primary" size="lg" className="h-16 px-12 text-xl font-black uppercase italic border-b-8">View Impact Report</Button>
                            <Button variant="secondary" size="lg" className="h-16 px-12 text-xl font-black uppercase italic border-b-8">Join the Maker Network</Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
