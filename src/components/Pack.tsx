import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card as CardType } from "../types";
import { Card } from "./Card";
import { cn } from "../lib/utils";
import { Sparkles, PackageOpen, ChevronRight, ChevronLeft } from "lucide-react";

interface PackProps {
  cards: CardType[];
  onComplete: () => void;
  isNewCard: (id: string) => boolean;
}

export const Pack: React.FC<PackProps> = ({ cards, onComplete, isNewCard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTearing, setIsTearing] = useState(false);

  const handleOpen = () => {
    setIsTearing(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsTearing(false);
    }, 1000);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="pack"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: isTearing ? 1.1 : 1, 
              opacity: 1, 
              y: 0,
              rotate: isTearing ? [0, -2, 2, -2, 2, 0] : 0
            }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
            className="relative w-64 h-96 cursor-pointer group"
            onClick={handleOpen}
          >
            {/* Pack Visual */}
            <div className="absolute inset-0 bg-zinc-900 rounded-2xl border-4 border-zinc-800 card-shadow overflow-hidden flex flex-col items-center justify-center gap-6">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-transparent to-zinc-800 opacity-50" />
              <div className="relative z-10 p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-700">
                  <PackageOpen size={40} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-black tracking-tighter uppercase text-zinc-300">Standard Pack</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">5 Cards Inside</span>
                </div>
              </div>
              
              <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="w-full h-1 bg-zinc-700 flex gap-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-1 h-full bg-zinc-600" />
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-4 flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 animate-bounce">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tap to Open</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-12 w-full max-w-4xl"
          >
            <div className="relative flex items-center justify-center w-full">
              {/* Card Navigation */}
              <div className="absolute inset-y-0 left-0 flex items-center z-20">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={cn(
                    "p-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-all",
                    currentIndex === 0 && "opacity-0 pointer-events-none"
                  )}
                >
                  <ChevronLeft size={32} />
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center z-20">
                <button
                  onClick={handleNext}
                  className="p-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Card Stack / Display */}
              <div className="relative w-64 h-96">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={cards[currentIndex].id}
                    initial={{ x: 300, opacity: 0, rotate: 10, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ x: -300, opacity: 0, rotate: -10, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card 
                      card={cards[currentIndex]} 
                      isNew={isNewCard(cards[currentIndex].id)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2">
              {cards.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === currentIndex ? "w-8 bg-zinc-100" : "w-2 bg-zinc-800"
                  )}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">
                Card {currentIndex + 1} of {cards.length}
              </span>
              {currentIndex === cards.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onComplete}
                  className="mt-4 px-8 py-3 bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-colors"
                >
                  Finish Opening
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
