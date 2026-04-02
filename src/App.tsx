import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card as CardType, Collection as CollectionType, Rarity } from "./types";
import { CARD_POOL, RARITY_CHANCES } from "./constants";
import { Pack } from "./components/Pack";
import { Collection } from "./components/Collection";
import { cn } from "./lib/utils";
import { Package, LayoutGrid, Settings, Sparkles, Info, RefreshCw } from "lucide-react";

const STORAGE_KEY = "pocket-card-collector-v1";

export default function App() {
  const [view, setView] = useState<"opening" | "collection">("opening");
  const [collection, setCollection] = useState<CollectionType>({});
  const [currentPack, setCurrentPack] = useState<CardType[] | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Load collection from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load collection", e);
      }
    }
  }, []);

  // Save collection to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  const generatePack = useCallback(() => {
    const pack: CardType[] = [];
    const CARDS_PER_PACK = 5;

    for (let i = 0; i < CARDS_PER_PACK; i++) {
      // Determine rarity
      const rand = Math.random();
      let cumulative = 0;
      let selectedRarity = Rarity.COMMON;

      for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
        cumulative += chance;
        if (rand <= cumulative) {
          selectedRarity = rarity as Rarity;
          break;
        }
      }

      // Pick random card of that rarity
      const rarityPool = CARD_POOL.filter((c) => c.rarity === selectedRarity);
      const card = rarityPool[Math.floor(Math.random() * rarityPool.length)];
      pack.push(card);
    }

    setCurrentPack(pack);
    setIsOpening(true);
    setShowWelcome(false);
  }, []);

  const handlePackComplete = () => {
    if (!currentPack) return;

    const newCollection = { ...collection };
    currentPack.forEach((card) => {
      newCollection[card.id] = (newCollection[card.id] || 0) + 1;
    });

    setCollection(newCollection);
    setCurrentPack(null);
    setIsOpening(false);
    setView("collection");
  };

  const isNewCard = (id: string) => !collection[id];

  const resetGame = () => {
    if (confirm("Are you sure you want to reset your collection? This cannot be undone.")) {
      setCollection({});
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Nav / Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
            <Package size={18} className="text-zinc-950" />
          </div>
          <span className="font-black tracking-tighter uppercase text-xl">Pocket Collector</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={resetGame}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reset Collection"
          >
            <RefreshCw size={18} />
          </button>
          <div className="h-8 w-[1px] bg-zinc-900" />
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-widest">
              {Object.keys(collection).length} / {CARD_POOL.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32">
        <AnimatePresence mode="wait">
          {view === "opening" ? (
            <motion.div
              key="opening"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh] px-6"
            >
              {isOpening && currentPack ? (
                <Pack 
                  cards={currentPack} 
                  onComplete={handlePackComplete} 
                  isNewCard={isNewCard}
                />
              ) : (
                <div className="flex flex-col items-center gap-8 text-center max-w-md">
                  {showWelcome && (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-5xl font-black tracking-tighter uppercase text-zinc-100 italic">
                        Start Your Journey
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        Open packs to collect rare cards, complete your collection, and discover legendary creatures.
                      </p>
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePack}
                    className="group relative px-12 py-6 bg-zinc-100 text-zinc-950 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-white to-zinc-200 animate-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-1">
                      <span className="text-lg font-black uppercase tracking-widest">Open Pack</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">5 Cards Inside</span>
                    </div>
                  </motion.button>

                  <div className="flex items-center gap-2 text-zinc-600">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Packs refresh instantly for this demo</span>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Collection collection={collection} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setView("opening")}
          className={cn(
            "flex flex-col items-center gap-1 px-8 py-2 rounded-xl transition-all",
            view === "opening" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Package size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Packs</span>
          {view === "opening" && (
            <motion.div layoutId="nav-indicator" className="absolute bottom-2 w-1 h-1 rounded-full bg-zinc-100" />
          )}
        </button>

        <button
          onClick={() => setView("collection")}
          className={cn(
            "flex flex-col items-center gap-1 px-8 py-2 rounded-xl transition-all",
            view === "collection" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <LayoutGrid size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Collection</span>
          {view === "collection" && (
            <motion.div layoutId="nav-indicator" className="absolute bottom-2 w-1 h-1 rounded-full bg-zinc-100" />
          )}
        </button>
      </nav>

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800/20 blur-[120px]" />
      </div>
    </div>
  );
}
