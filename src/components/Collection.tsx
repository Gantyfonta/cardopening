import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card as CardType, Collection as CollectionType, Rarity } from "../types";
import { CARD_POOL } from "../constants";
import { Card } from "./Card";
import { cn } from "../lib/utils";
import { Search, Filter, LayoutGrid, LayoutList, Trophy, Info } from "lucide-react";

interface CollectionProps {
  collection: CollectionType;
}

export const Collection: React.FC<CollectionProps> = ({ collection }) => {
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState<Rarity | "All">("All");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const filteredCards = CARD_POOL.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = filterRarity === "All" || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const totalCards = CARD_POOL.length;
  const ownedCount = CARD_POOL.filter(c => collection[c.id]).length;
  const progress = Math.round((ownedCount / totalCards) * 100);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 pb-24">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-zinc-100">Collection</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Trophy size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{ownedCount} / {totalCards} Cards</span>
            </div>
            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-zinc-100" 
              />
            </div>
            <span className="text-xs font-black text-zinc-100">{progress}%</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-zinc-700 transition-colors w-full md:w-64"
            />
          </div>
          
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 overflow-x-auto">
            {["All", ...Object.values(Rarity)].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity as any)}
                className={cn(
                  "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  filterRarity === rarity 
                    ? "bg-zinc-100 text-zinc-950" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredCards.map((card) => {
          const count = collection[card.id] || 0;
          const isOwned = count > 0;

          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
              onClick={() => isOwned && setSelectedCard(card)}
            >
              <div className={cn(
                "relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-500",
                isOwned ? "cursor-pointer hover:scale-105" : "grayscale opacity-40 brightness-50"
              )}>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay for owned cards */}
                {isOwned && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Owned: {count}</span>
                    <span className="text-xs font-bold text-white truncate">{card.name}</span>
                  </div>
                )}

                {/* Rarity Indicator */}
                <div className={cn(
                  "absolute top-2 right-2 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                  card.rarity === Rarity.COMMON && "bg-zinc-400",
                  card.rarity === Rarity.UNCOMMON && "bg-blue-400",
                  card.rarity === Rarity.RARE && "bg-purple-400",
                  card.rarity === Rarity.ULTRA_RARE && "bg-pink-400",
                  card.rarity === Rarity.SECRET_RARE && "bg-yellow-400"
                )} />
              </div>
              
              {!isOwned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 rotate-[-15deg]">Locked</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
          <Info size={48} strokeWidth={1} />
          <p className="text-sm font-bold uppercase tracking-widest">No cards found matching your filters</p>
        </div>
      )}

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card card={selectedCard} />
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Close</span>
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">×</div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
