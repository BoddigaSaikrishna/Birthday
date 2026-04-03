import { useEffect, useState, useRef } from "react";

type Star = { id: number; top: number; left: number; delay: number; duration: number; size: number };
type ShootingStar = { id: number; top: number; delay: number };

const Sparkles = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shooters, setShooters] = useState<ShootingStar[]>([]);
  const nextShooter = useRef(0);

  useEffect(() => {
    // Static twinkling stars
    setStars(
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 2.5 + Math.random() * 4,
        size: Math.random() > 0.7 ? 10 : 8,
      }))
    );

    // Shooting stars every 4–8 s
    const fire = () => {
      setShooters((prev) => [
        ...prev.slice(-4),
        { id: nextShooter.current++, top: 5 + Math.random() * 35, delay: 0 },
      ]);
      setTimeout(fire, 4000 + Math.random() * 5000);
    };
    const t = setTimeout(fire, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Twinkling star field */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute text-sparkle select-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            filter: "drop-shadow(0 0 4px hsl(45 90% 80%))",
          }}
        >
          {Math.random() > 0.5 ? "✦" : "✧"}
        </span>
      ))}

      {/* Sparkle pulses */}
      {stars.slice(0, 18).map((s) => (
        <span
          key={`sp-${s.id}`}
          className="absolute text-sparkle select-none"
          style={{
            top: `${(s.top + 15) % 100}%`,
            left: `${(s.left + 20) % 100}%`,
            fontSize: "10px",
            animation: `sparkle-pulse ${3 + s.delay * 0.5}s ease-in-out ${s.delay * 0.7}s infinite`,
            filter: "drop-shadow(0 0 6px hsl(330 90% 75%))",
            color: "hsl(330 80% 75%)",
          }}
        >
          ✦
        </span>
      ))}

      {/* Shooting stars */}
      {shooters.map((sh) => (
        <div
          key={sh.id}
          className="absolute"
          style={{
            top: `${sh.top}%`,
            left: 0,
            width: "120px",
            height: "1.5px",
            background:
              "linear-gradient(90deg, transparent 0%, hsl(330 80% 85% / 0.9) 40%, hsl(280 70% 90%) 80%, transparent 100%)",
            borderRadius: "9999px",
            animation: `shooting-star 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            filter: "drop-shadow(0 0 3px hsl(330 80% 85%))",
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
