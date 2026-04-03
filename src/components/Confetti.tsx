import { useEffect, useState } from "react";

type Piece = {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
  shape: "rect" | "circle" | "petal";
  duration: number;
  rotation: number;
};

const COLORS = [
  "hsl(330, 85%, 68%)",
  "hsl(280, 65%, 62%)",
  "hsl(45, 95%, 72%)",
  "hsl(340, 85%, 62%)",
  "hsl(350, 90%, 72%)",
  "hsl(200, 80%, 68%)",
  "hsl(160, 65%, 58%)",
  "hsl(315, 75%, 75%)",
  "hsl(270, 70%, 70%)",
];

const Confetti = ({ active }: { active: boolean }) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const shapes: Piece["shape"][] = ["rect", "rect", "circle", "petal"];
    const items: Piece[] = Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2.5,
      size: 5 + Math.random() * 10,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      duration: 3 + Math.random() * 2.5,
      rotation: Math.random() * 360,
    }));
    setPieces(items);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => {
        const isPetal = p.shape === "petal";
        const isCircle = p.shape === "circle";

        return (
          <div
            key={p.id}
            className="absolute top-0"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: isPetal ? `${p.size * 2}px` : `${p.size * (isCircle ? 1 : 1.6)}px`,
              backgroundColor: p.color,
              borderRadius: isCircle ? "50%" : isPetal ? "50% 0 50% 0" : "2px",
              transform: `rotate(${p.rotation}deg)`,
              boxShadow: `0 0 ${p.size}px ${p.color}80`,
              animation: isPetal
                ? `petal-fall ${p.duration + 1}s ease-in ${p.delay}s forwards`
                : `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Confetti;
