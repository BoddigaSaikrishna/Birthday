import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
  emoji: string;
  rotate: number;
  drift: number;
};

const EMOJIS = ["♥", "♥", "♥", "❤", "💕", "✨", "⭐", "★"];

const FloatingHearts = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const makeParticle = (): Particle => ({
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      delay: 0,
      size: 10 + Math.random() * 22,
      duration: 7 + Math.random() * 8,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      rotate: -15 + Math.random() * 30,
      drift: Math.random() > 0.5 ? 1 : -1,
    });

    // initial burst
    setParticles(Array.from({ length: 6 }, makeParticle));

    const interval = setInterval(() => {
      setParticles((prev) => [...prev.slice(-20), makeParticle()]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => {
        const isHeart = p.emoji === "♥" || p.emoji === "❤" || p.emoji === "💕";
        const color = isHeart
          ? `hsl(${330 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`
          : `hsl(${40 + Math.random() * 20}, 90%, 75%)`;

        return (
          <span
            key={p.id}
            className="absolute bottom-0 select-none"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              color,
              filter: isHeart
                ? `drop-shadow(0 0 ${p.size * 0.4}px ${color})`
                : `drop-shadow(0 0 ${p.size * 0.3}px hsl(45 90% 75%))`,
              animation: `float-up ${p.duration}s ease-out forwards`,
              "--r": `${p.rotate}deg`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        );
      })}
    </div>
  );
};

export default FloatingHearts;
