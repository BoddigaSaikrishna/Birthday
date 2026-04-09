import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  animationDuration: number;
  delay: number;
  rotation: number;
  scale: number;
  type: string;
};

interface PetalRainProps {
  active: boolean;
}

const PetalRain = ({ active }: PetalRainProps) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) {
      // Fade out slowly by stopping new generation
      const t = setTimeout(() => setPetals([]), 8000);
      return () => clearTimeout(t);
    }

    // Generate initial batch
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 5,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.7,
      type: Math.random() > 0.5 ? "petal-1" : "petal-2"
    }));
    
    setPetals(newPetals);

    // Keep generating new petals slowly
    const interval = setInterval(() => {
      setPetals((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0;
        return [
          ...prev.filter((p, idx) => prev.length - idx < 25), // keep max 25 memory
          {
            id: nextId,
            left: Math.random() * 100,
            animationDuration: 8 + Math.random() * 5,
            delay: 0,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.7,
            type: Math.random() > 0.5 ? "petal-1" : "petal-2"
          }
        ];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [active]);

  if (!active && petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-10%",
            animation: `petal-fall ${p.animationDuration}s linear ${p.delay}s forwards`,
          }}
        >
          {/* Petal Graphic */}
          <div
            style={{
              width: "16px",
              height: "16px",
              background: p.type === "petal-1" 
                ? "linear-gradient(135deg, hsl(340 80% 65%), hsl(340 70% 55%))"
                : "linear-gradient(135deg, hsl(330 80% 75%), hsl(320 60% 65%))",
              borderRadius: p.type === "petal-1" ? "0 50% 50% 50%" : "50% 0 50% 50%",
              transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
              boxShadow: "0 2px 8px hsl(340 80% 60% / 0.4)",
              opacity: 0.85,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PetalRain;
