import { useState } from "react";
import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";

export interface StackedCard {
  id: string;
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

interface StackedCardsProps {
  cards: StackedCard[];
}

export function StackedCards({ cards: initialCards }: StackedCardsProps) {
  const [cards, setCards] = useState<StackedCard[]>(initialCards);

  const sendToBack = (id: string) => {
    setCards((prev) => {
      const cardIndex = prev.findIndex((c) => c.id === id);
      if (cardIndex === -1) return prev;

      const newCards = [...prev];
      const [targetCard] = newCards.splice(cardIndex, 1);
      // La enviamos al fondo de la pila (primer elemento del array)
      newCards.unshift(targetCard);
      return newCards;
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo, cardId: string) => {
    const threshold = 80;
    if (Math.abs(info.offset.x) > threshold) {
      sendToBack(cardId);
    }
  };

  // Configuración de la posición y rotación de cada carta según su distancia del frente
  const getCardTransform = (indexFromTop: number) => {
    if (indexFromTop === 0) {
      // CARTA PRINCIPAL (Al frente, centrada y recta)
      return { x: 0, y: 0, rotate: 0, scale: 1 };
    }
    if (indexFromTop === 1) {
      // 2ª CARTA (Atrás a la IZQUIERDA)
      return { x: -60, y: 8, rotate: -15, scale: 0.96 };
    }
    if (indexFromTop === 2) {
      // 3ª CARTA (Atrás a la DERECHA)
      return { x: 60, y: 8, rotate: 15, scale: 0.96 };
    }

    // Para 4+ cartas, alternamos abriéndolas más hacia los lados
    const isOdd = indexFromTop % 2 !== 0;
    const sideMultiplier = isOdd ? -1 : 1;
    const step = Math.ceil(indexFromTop / 2);

    return {
      x: sideMultiplier * (50 + step * 20),
      y: 8 + step * 4,
      rotate: sideMultiplier * (12 + step * 4),
      scale: 0.95 - step * 0.02,
    };
  };

  return (
    // Contenedor con espacio suficiente para que las cartas traseras sobresalgan sin cortarse
    <div className="relative mx-auto h-120 w-full max-w-sm px-12 pt-6">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;
        const indexFromTop = cards.length - 1 - index;
        const transform = getCardTransform(indexFromTop);

        return (
          <motion.div
            key={card.id}
            layout
            style={{
              zIndex: index, // La carta superior tiene el zIndex más alto
              transformOrigin: "bottom center", // Rotación tipo abanico desde la base
            }}
            animate={{
              x: transform.x,
              y: transform.y,
              rotate: transform.rotate,
              scale: transform.scale,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1.2}
            onDragEnd={(e, info) => isTop && handleDragEnd(e, info, card.id)}
            className="absolute inset-x-12 h-120 w-70 overflow-hidden rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing bg-white border border-gray-100 select-none"
          >
            <img
              src={card.image}
              alt={card.alt}
              className="h-full w-full object-cover select-none pointer-events-none"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 text-white">
              {card.title && (
                <h3 className="font-poppins text-xl font-bold leading-snug">
                  {card.title}
                </h3>
              )}
              {card.description && (
                <p className="font-poppins mt-1 text-sm leading-snug text-white/80">
                  {card.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
