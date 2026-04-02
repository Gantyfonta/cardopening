import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Card as CardType, Rarity } from "../types";
import { cn } from "../lib/utils";
import { Shield, Zap, Flame, Droplets, Leaf, Ghost, Sword, ShieldAlert, Star } from "lucide-react";

interface CardProps {
  card: CardType;
  isNew?: boolean;
  className?: string;
  onClick?: () => void;
}

const TYPE_ICONS = {
  Fire: Flame,
  Water: Droplets,
  Grass: Leaf,
  Electric: Zap,
  Psychic: Star,
  Fighting: Sword,
  Dark: Ghost,
  Steel: Shield,
  Dragon: ShieldAlert,
  Normal: Shield,
};

const TYPE_COLORS = {
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Grass: "bg-green-500",
  Electric: "bg-yellow-400",
  Psychic: "bg-purple-500",
  Fighting: "bg-orange-700",
  Dark: "bg-zinc-800",
  Steel: "bg-zinc-400",
  Dragon: "bg-indigo-600",
  Normal: "bg-zinc-500",
};

export const Card: React.FC<CardProps> = ({ card, isNew, className, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = TYPE_ICONS[card.type];

  return (
    <motion.div
      className={cn(
        "relative w-64 h-96 cursor-pointer perspective-1000",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        setIsFlipped(!isFlipped);
        onClick?.();
      }}
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-zinc-900 border-4 border-zinc-800 card-shadow">
          {/* Card Header */}
          <div className="p-3 flex justify-between items-center bg-zinc-800/50">
            <span className="font-bold text-sm truncate max-w-[120px]">{card.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-zinc-400">HP</span>
              <span className="font-bold text-lg">{card.hp}</span>
              <div className={cn("p-1 rounded-full", TYPE_COLORS[card.type])}>
                <Icon size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Card Image */}
          <div className="relative h-48 bg-zinc-800 overflow-hidden">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Rarity Effects */}
            {card.rarity === Rarity.RARE && <div className="absolute inset-0 holographic-rare pointer-events-none" />}
            {card.rarity === Rarity.ULTRA_RARE && <div className="absolute inset-0 holographic-ultra pointer-events-none" />}
            {card.rarity === Rarity.SECRET_RARE && <div className="absolute inset-0 holographic-secret pointer-events-none" />}
          </div>

          {/* Card Body */}
          <div className="p-4 flex flex-col gap-2 h-full">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", TYPE_COLORS[card.type])} />
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{card.type} Type</span>
            </div>
            <p className="text-xs text-zinc-400 italic leading-relaxed">
              "{card.description}"
            </p>
            
            <div className="mt-auto flex justify-between items-end pb-8">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Rarity</span>
                <span className={cn(
                  "text-xs font-bold",
                  card.rarity === Rarity.COMMON && "text-zinc-400",
                  card.rarity === Rarity.UNCOMMON && "text-blue-400",
                  card.rarity === Rarity.RARE && "text-purple-400",
                  card.rarity === Rarity.ULTRA_RARE && "text-pink-400",
                  card.rarity === Rarity.SECRET_RARE && "text-yellow-400"
                )}>
                  {card.rarity}
                </span>
              </div>
              {isNew && (
                <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-black rounded uppercase animate-pulse">
                  New!
                </span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 card-inner-border pointer-events-none" />
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-zinc-900 border-4 border-zinc-800 card-shadow flex items-center justify-center overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-transparent to-transparent" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full border-8 border-zinc-700 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-zinc-700" />
            </div>
            <span className="font-black text-zinc-700 tracking-[0.2em] uppercase text-xl">Pocket</span>
          </div>
          <div className="absolute inset-0 card-inner-border pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
};
