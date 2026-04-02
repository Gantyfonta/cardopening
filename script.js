import React, { useState, useEffect, useCallback, useMemo } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'https://esm.sh/framer-motion@10';
import * as Lucide from 'https://esm.sh/lucide-react@0.344.0';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

// --- Constants & Data ---
const Rarity = {
    COMMON: "Common",
    UNCOMMON: "Uncommon",
    RARE: "Rare",
    ULTRA_RARE: "Ultra Rare",
    SECRET_RARE: "Secret Rare",
};

const CARD_POOL = [
    { id: "1", name: "Luminox", rarity: Rarity.COMMON, type: "Fire", hp: 60, description: "A small fox with a tail that glows like a candle.", imageUrl: "https://picsum.photos/seed/flamefox/400/600" },
    { id: "2", name: "Shellshulk", rarity: Rarity.COMMON, type: "Water", hp: 70, description: "It hides in its shell to avoid predators.", imageUrl: "https://picsum.photos/seed/aquaturtle/400/600" },
    { id: "3", name: "Bloomhare", rarity: Rarity.COMMON, type: "Grass", hp: 70, description: "It hides among the tall wildflowers, its ears camouflaged to look like budding clovers.", imageUrl: "https://picsum.photos/seed/leafbunny/400/600" },
    { id: "4", name: "Boltcheek", rarity: Rarity.COMMON, type: "Electric", hp: 60, description: "It stores electricity in its cheeks.", imageUrl: "https://picsum.photos/seed/sparkmouse/400/600" },
    { id: "5", name: "Umbrafel", rarity: Rarity.UNCOMMON, type: "Dark", hp: 80, description: "It blends perfectly into the night.", imageUrl: "SprootMon Art/umbrafel.png" },
    { id: "6", name: "Iron Golem", rarity: Rarity.UNCOMMON, type: "Steel", hp: 120, description: "A heavy construct made of ancient metal.", imageUrl: "https://picsum.photos/seed/irongolem/400/600" },
    { id: "7", name: "Solar Dragon", rarity: Rarity.RARE, type: "Dragon", hp: 150, description: "A legendary dragon that draws power from the sun.", imageUrl: "https://picsum.photos/seed/solardragon/400/600" },
    { id: "8", name: "Lunar Phoenix", rarity: Rarity.RARE, type: "Psychic", hp: 130, description: "It rises from the ashes under the full moon.", imageUrl: "https://picsum.photos/seed/lunarphoenix/400/600" },
    { id: "9", name: "Cosmic Whale", rarity: Rarity.ULTRA_RARE, type: "Water", hp: 200, description: "A giant creature that swims through the stars.", imageUrl: "https://picsum.photos/seed/cosmicwhale/400/600" },
    { id: "10", name: "Void Reaper", rarity: Rarity.SECRET_RARE, type: "Dark", hp: 180, description: "A mysterious entity from the edge of the universe.", imageUrl: "https://picsum.photos/seed/voidreaper/400/600" },
    { id: "11", name: "Thunder Hawk", rarity: Rarity.UNCOMMON, type: "Electric", hp: 90, description: "Its wings create thunderclaps when it dives.", imageUrl: "https://picsum.photos/seed/thunderhawk/400/600" },
    { id: "12", name: "Stone Titan", rarity: Rarity.UNCOMMON, type: "Fighting", hp: 140, description: "A mountain that came to life.", imageUrl: "https://picsum.photos/seed/stonetitan/400/600" },
    { id: "13", name: "Crystal Deer", rarity: Rarity.RARE, type: "Psychic", hp: 110, description: "Its antlers are made of pure diamond.", imageUrl: "https://picsum.photos/seed/crystaldeer/400/600" },
    { id: "14", name: "Magma Core", rarity: Rarity.RARE, type: "Fire", hp: 160, description: "The living heart of a volcano.", imageUrl: "https://picsum.photos/seed/magmacore/400/600" },
    { id: "15", name: "Wind Spirit", rarity: Rarity.COMMON, type: "Normal", hp: 40, description: "A gentle breeze that took form.", imageUrl: "https://picsum.photos/seed/windspirit/400/600" },
    { id: "16", name: "Frost Owl", rarity: Rarity.UNCOMMON, type: "Water", hp: 80, description: "Its feathers are as cold as ice.", imageUrl: "https://picsum.photos/seed/frostowl/400/600" },
    { id: "17", name: "Earth Golem", rarity: Rarity.COMMON, type: "Fighting", hp: 100, description: "A sturdy guardian made of clay and stone.", imageUrl: "https://picsum.photos/seed/earthgolem/400/600" },
    { id: "18", name: "Star Sprite", rarity: Rarity.RARE, type: "Psychic", hp: 60, description: "It fell from a shooting star.", imageUrl: "https://picsum.photos/seed/starsprite/400/600" },
    { id: "19", name: "Abyssal Serpent", rarity: Rarity.ULTRA_RARE, type: "Dragon", hp: 190, description: "It dwells in the deepest parts of the ocean.", imageUrl: "https://picsum.photos/seed/abyssalserpent/400/600" },
    { id: "20", name: "Golden King", rarity: Rarity.SECRET_RARE, type: "Steel", hp: 250, description: "The ruler of a forgotten golden empire.", imageUrl: "https://picsum.photos/seed/goldenking/400/600" },
];

const RARITY_CHANCES = {
    [Rarity.COMMON]: 0.6,
    [Rarity.UNCOMMON]: 0.25,
    [Rarity.RARE]: 0.1,
    [Rarity.ULTRA_RARE]: 0.04,
    [Rarity.SECRET_RARE]: 0.01,
};

const STORAGE_KEY = "pocket-card-collector-v1";

// --- Components ---

const Card = ({ card, isNew, className, onClick }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct); y.set(yPct);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return html`
        <${motion.div}
            className=${`relative w-64 h-96 cursor-pointer perspective-1000 ${className || ""}`}
            onMouseMove=${handleMouseMove}
            onMouseLeave=${handleMouseLeave}
            onClick=${() => { setIsFlipped(!isFlipped); onClick?.(); }}
            animate=${{ rotateY: isFlipped ? 180 : 0 }}
            transition=${{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
            <${motion.div} style=${{ rotateX, rotateY }} className="w-full h-full relative preserve-3d">
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-zinc-900 border-4 border-zinc-800 shadow-2xl">
                    <div className="p-3 flex justify-between items-center bg-zinc-800/50">
                        <span className="font-bold text-sm truncate max-w-[120px]">${card.name}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-zinc-400">HP</span>
                            <span className="font-bold text-lg">${card.hp}</span>
                        </div>
                    </div>
                    <div className="relative h-48 bg-zinc-800 overflow-hidden">
                        <img src=${card.imageUrl} className="w-full h-full object-cover" />
                        ${card.rarity === Rarity.RARE && html`<div className="absolute inset-0 holographic-rare pointer-events-none" />`}
                        ${card.rarity === Rarity.ULTRA_RARE && html`<div className="absolute inset-0 holographic-ultra pointer-events-none" />`}
                        ${card.rarity === Rarity.SECRET_RARE && html`<div className="absolute inset-0 holographic-secret pointer-events-none" />`}
                    </div>
                    <div className="p-4 flex flex-col gap-2 h-full">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">${card.type} Type</span>
                        <p className="text-xs text-zinc-400 italic leading-relaxed">"${card.description}"</p>
                        <div className="mt-auto flex justify-between items-end pb-8">
                            <span className="text-xs font-bold text-zinc-400">${card.rarity}</span>
                            ${isNew && html`<span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-black rounded uppercase animate-pulse">New!</span>`}
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-zinc-900 border-4 border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden" style=${{ transform: "rotateY(180deg)" }}>
                    <div className="relative flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full border-8 border-zinc-700 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-zinc-700" /></div>
                        <span className="font-black text-zinc-700 tracking-[0.2em] uppercase text-xl">Pocket</span>
                    </div>
                </div>
            <//>
        <//>
    `;
};

const Pack = ({ cards, onComplete, isNewCard }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpen = () => { setIsOpen(true); };
    const handleNext = () => { if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1); else onComplete(); };

    return html`
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
            <${AnimatePresence} mode="wait">
                ${!isOpen ? html`
                    <${motion.div} key="pack" initial=${{ scale: 0.8, opacity: 0 }} animate=${{ scale: 1, opacity: 1 }} exit=${{ scale: 1.5, opacity: 0 }} className="relative w-64 h-96 cursor-pointer group" onClick=${handleOpen}>
                        <div className="absolute inset-0 bg-zinc-900 rounded-2xl border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-6">
                            <div className="p-8 flex flex-col items-center gap-4 text-center">
                                <span className="text-xl font-black tracking-tighter uppercase text-zinc-300">Standard Pack</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">5 Cards Inside</span>
                            </div>
                            <div className="absolute bottom-4 flex items-center gap-2 text-zinc-500 animate-bounce"><span className="text-[10px] font-black uppercase tracking-widest">Tap to Open</span></div>
                        </div>
                    <//>
                ` : html`
                    <${motion.div} key="cards" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} className="flex flex-col items-center gap-12 w-full max-w-4xl">
                        <div className="relative w-64 h-96">
                            <${AnimatePresence} mode="popLayout">
                                <${motion.div} key=${cards[currentIndex].id} initial=${{ x: 300, opacity: 0 }} animate=${{ x: 0, opacity: 1 }} exit=${{ x: -300, opacity: 0 }} onClick=${handleNext}>
                                    <${Card} card=${cards[currentIndex]} isNew=${isNewCard(cards[currentIndex].id)} />
                                <//>
                            <//>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Card ${currentIndex + 1} of ${cards.length}</span>
                            <button onClick=${handleNext} className="mt-4 px-8 py-3 bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-full">${currentIndex === cards.length - 1 ? 'Finish' : 'Next Card'}</button>
                        </div>
                    <//>
                `}
            <//>
        </div>
    `;
};

const Collection = ({ collection, onSelectCard }) => {
    return html`
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 pb-24">
            <h1 className="text-4xl font-black tracking-tighter uppercase text-zinc-100">Collection</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                ${CARD_POOL.map((card) => {
                    const count = collection[card.id] || 0;
                    const isOwned = count > 0;
                    return html`
                        <div key=${card.id} className=${`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-500 ${isOwned ? "cursor-pointer hover:scale-105" : "grayscale opacity-40 brightness-50"}`} onClick=${() => isOwned && onSelectCard(card)}>
                            <img src=${card.imageUrl} className="w-full h-full object-cover" />
                            ${isOwned && html`<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end"><span className="text-[10px] font-black uppercase text-zinc-400">x${count}</span><span className="text-xs font-bold text-white truncate">${card.name}</span></div>`}
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
};

const App = () => {
    const [view, setView] = useState("opening");
    const [collection, setCollection] = useState({});
    const [currentPack, setCurrentPack] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setCollection(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    }, [collection]);

    const generatePack = () => {
        const pack = [];
        for (let i = 0; i < 5; i++) {
            const rand = Math.random();
            let cumulative = 0, selectedRarity = Rarity.COMMON;
            for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
                cumulative += chance;
                if (rand <= cumulative) { selectedRarity = rarity; break; }
            }
            const rarityPool = CARD_POOL.filter(c => c.rarity === selectedRarity);
            pack.push(rarityPool[Math.floor(Math.random() * rarityPool.length)]);
        }
        setCurrentPack(pack);
        setView("opening");
    };

    const handlePackComplete = () => {
        const newCollection = { ...collection };
        currentPack.forEach(card => { newCollection[card.id] = (newCollection[card.id] || 0) + 1; });
        setCollection(newCollection);
        setCurrentPack(null);
        setView("collection");
    };

    return html`
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <${Lucide.Package} size=${18} className="text-zinc-950" />
                    </div>
                    <span className="font-black tracking-tighter uppercase text-xl">Pocket Collector</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                    <${Lucide.Sparkles} size=${14} className="text-yellow-500" />
                    <span className="text-xs font-black uppercase tracking-widest">
                        ${Object.keys(collection).length} / ${CARD_POOL.length}
                    </span>
                </div>
            </header>

            <main className="flex-1 pt-24 pb-32">
                <${AnimatePresence} mode="wait">
                    ${view === "opening" ? html`
                        <div key="opening" className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                            ${currentPack ? html`
                                <${Pack} cards=${currentPack} onComplete=${handlePackComplete} isNewCard=${id => !collection[id]} />
                            ` : html`
                                <button onClick=${generatePack} className="px-12 py-6 bg-zinc-100 text-zinc-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">Open Pack</button>
                            `}
                        </div>
                    ` : html`
                        <${Collection} key="collection" collection=${collection} onSelectCard=${setSelectedCard} />
                    `}
                <//>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-center gap-8">
                <button 
                    onClick=${() => setView("opening")} 
                    className=${`flex flex-col items-center gap-1 transition-colors ${view === "opening" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    <${Lucide.Package} size=${24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Packs</span>
                </button>
                <button 
                    onClick=${() => setView("collection")} 
                    className=${`flex flex-col items-center gap-1 transition-colors ${view === "collection" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    <${Lucide.LayoutGrid} size=${24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Collection</span>
                </button>
            </nav>

            ${selectedCard && html`
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick=${() => setSelectedCard(null)}>
                    <${Card} card=${selectedCard} />
                </div>
            `}
        </div>
    `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
