"use client";

import { useState, useEffect } from "react";

interface FloatingCloth {
  id: number;
  type: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  opacity: number;
}

const clothingTypes = [
  { type: "tshirt", emoji: "👕" },
  { type: "dress", emoji: "👗" },
  { type: "pants", emoji: "👖" },
  { type: "hoodie", emoji: "🧥" },
  { type: "shorts", emoji: "🩳" },
  { type: "skirt", emoji: "👘" },
  { type: "jacket", emoji: "🧥" },
  { type: "shirt", emoji: "👔" },
  { type: "sweater", emoji: "👚" },
  { type: "coat", emoji: "🥼" },
  { type: "kimono", emoji: "🥼" },
  { type: "vest", emoji: "🦺" }
];

export default function FloatingClothes() {
  const [clothes, setClothes] = useState<FloatingCloth[]>([]);

  useEffect(() => {
    // Generate floating clothes
    const generateClothes = () => {
      const newClothes: FloatingCloth[] = [];
      
      for (let i = 0; i < 15; i++) {
        const clothingType = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
        
        newClothes.push({
          id: i,
          type: clothingType.type,
          emoji: clothingType.emoji,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 20, // 20-50px
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 10, // 10-30s
          delay: Math.random() * 5, // 0-5s delay
          opacity: Math.random() * 0.3 + 0.1 // 0.1-0.4 opacity
        });
      }
      
      setClothes(newClothes);
    };

    generateClothes();
    
    // Change clothes every 8 seconds
    const interval = setInterval(() => {
      generateClothes();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clothes.map((cloth) => (
        <div
          key={cloth.id}
          className="absolute animate-float"
          style={{
            left: `${cloth.x}%`,
            top: `${cloth.y}%`,
            fontSize: `${cloth.size}px`,
            transform: `rotate(${cloth.rotation}deg)`,
            opacity: cloth.opacity,
            animation: `float ${cloth.duration}s ease-in-out ${cloth.delay}s infinite`,
            filter: 'blur(0.5px)'
          }}
        >
          {cloth.emoji}
        </div>
      ))}
    </div>
  );
}
