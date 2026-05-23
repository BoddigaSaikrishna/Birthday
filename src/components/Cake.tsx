import { useState, useRef } from "react";

interface CakeProps {
  onCut: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  type: "sparkle" | "smoke" | "star";
}

const Cake = ({ onCut }: CakeProps) => {
  const [step, setStep] = useState<"blow" | "wish" | "cut" | "done">("blow");
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [sliceActive, setSliceActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  // Generate particles (sparkles/smoke/stars)
  const spawnParticles = (
    x: number,
    y: number,
    count: number,
    type: "sparkle" | "smoke" | "star",
    baseColor?: string
  ) => {
    const colors = baseColor
      ? [baseColor]
      : ["#ff69b4", "#ffb6c1", "#ffeb3b", "#00e5ff", "#e040fb", "#ffffff"];
    
    const newParticles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = type === "smoke" ? 0.3 + Math.random() * 0.5 : 1 + Math.random() * 3;
      particleIdRef.current += 1;
      return {
        id: particleIdRef.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: type === "smoke" ? -speed : Math.sin(angle) * speed - 1, // natural float up
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === "smoke" ? 8 + Math.random() * 8 : type === "star" ? 6 + Math.random() * 4 : 3 + Math.random() * 3,
        opacity: 1,
        type,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Animate particles
    const startTime = Date.now();
    const duration = type === "smoke" ? 1500 : 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
        clearInterval(interval);
      } else {
        setParticles((prev) =>
          prev.map((p) => {
            const match = newParticles.find((np) => np.id === p.id);
            if (match) {
              return {
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.type === "smoke" ? p.vy - 0.02 : p.vy + 0.1, // gravity for sparks, lift for smoke
                opacity: 1 - progress,
                size: p.type === "smoke" ? p.size + 0.3 : p.size, // smoke expands
              };
            }
            return p;
          })
        );
      }
    }, 30);
  };

  // Blow out a candle
  const handleBlowCandle = (index: number, e: React.MouseEvent) => {
    if (step !== "blow" || !candlesLit[index]) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const clickX = rect.left - parentRect.left + rect.width / 2;
    const clickY = rect.top - parentRect.top;

    const newLit = [...candlesLit];
    newLit[index] = false;
    setCandlesLit(newLit);

    // Sparkles on blowout
    spawnParticles(clickX, clickY, 12, "sparkle");
    // Smoke trail
    setTimeout(() => {
      spawnParticles(clickX, clickY - 5, 8, "smoke", "#7a7a7a");
    }, 150);

    // Check if all candles are blown
    if (newLit.every((lit) => !lit)) {
      setTimeout(() => {
        setStep("wish");
      }, 1000);
    }
  };

  // Blow all candles at once (fallback helper)
  const handleBlowAll = () => {
    if (step !== "blow") return;
    setCandlesLit([false, false, false, false, false]);
    spawnParticles(140, 60, 40, "sparkle");
    setTimeout(() => {
      setStep("wish");
    }, 1000);
  };

  // Wish completed
  const handleWishDone = () => {
    setStep("cut");
  };

  // Slice the cake
  const handleCutCake = (e: React.MouseEvent) => {
    if (step !== "cut" || sliceActive) return;

    setSliceActive(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Trigger cutting sparkles down the middle
    let currentY = 30;
    const cutInterval = setInterval(() => {
      if (currentY > 180) {
        clearInterval(cutInterval);
      } else {
        spawnParticles(140, currentY, 4, "star", "#ffd700");
        currentY += 15;
      }
    }, 50);

    // Split cake
    setTimeout(() => {
      setStep("done");
      // Huge confetti explosion
      spawnParticles(140, 120, 50, "sparkle");
    }, 850);
  };

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full max-w-md mx-auto">
      {/* ── Guidance Prompts ── */}
      <div className="text-center h-16 flex flex-col justify-center">
        {step === "blow" && (
          <p className="text-sm uppercase tracking-[0.2em] text-primary text-glow-pink animate-pulse">
            Tap each flame to blow out the candles! 🕯️✨
          </p>
        )}
        {step === "wish" && (
          <p className="text-base font-medium text-purple-200 tracking-wide animate-fade-in-up">
            Close your eyes and make a wish in your heart... 💫
          </p>
        )}
        {step === "cut" && (
          <p className="text-sm uppercase tracking-[0.2em] text-accent text-glow-pink animate-pulse">
            Ready? Tap the cake to slice it! 🔪
          </p>
        )}
        {step === "done" && (
          <p
            className="text-2xl font-script text-glow-pink shimmer-text"
            style={{ fontFamily: "var(--font-script, cursive)" }}
          >
            Happy Birthday, Leelu! 🎂🎉
          </p>
        )}
      </div>

      {/* ── Cake Arena ── */}
      <div
        onClick={(e) => {
          if (step === "cut") handleCutCake(e);
        }}
        className={`relative cursor-pointer transition-transform duration-500 ${
          step === "cut" && !sliceActive ? "hover:scale-[1.02] active:scale-[0.98]" : ""
        }`}
        style={{ width: 300, height: 260 }}
      >
        {/* Render Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: p.type === "smoke" ? "none" : `0 0 ${p.size * 1.5}px ${p.color}`,
              transform: p.type === "star" ? "rotate(45deg)" : "none",
              zIndex: 99,
            }}
          />
        ))}

        {/* ── 3D Silver Plate ── */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          style={{
            width: 270,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(180deg, hsl(270 20% 40% / 0.5) 0%, hsl(270 20% 15% / 0.8) 100%)",
            border: "1.5px solid hsl(330 80% 65% / 0.3)",
            boxShadow: "0 10px 30px hsl(0 0% 0% / 0.6), inset 0 2px 4px hsl(330 80% 70% / 0.2)",
            zIndex: 1,
          }}
        />

        {/* ── THE CAKE ── */}
        <div className="absolute inset-0 z-10 flex justify-center items-end pb-8">
          {/* Cake Group with animated sliding halves */}
          <div className="relative w-[210px] h-[140px]">
            {/* LEFT HALF */}
            <div
              className="absolute left-0 bottom-0 w-[105px] h-[140px] transition-transform cubic-bezier(0.25, 1, 0.5, 1)"
              style={{
                transform: step === "done" ? "translateX(-28px) rotate(-3deg)" : "none",
                transitionDuration: "1000ms",
              }}
            >
              {/* Outer Shell (Left Half) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(330 75% 58%) 0%, hsl(310 65% 48%) 50%, hsl(280 60% 38%) 100%)",
                  borderRadius: "20px 0 0 12px",
                  borderLeft: "2px solid hsl(330 80% 75% / 0.3)",
                  boxShadow: "inset 2px 2px 6px hsl(330 80% 80% / 0.2), -10px 10px 25px hsl(0 0% 0% / 0.5)",
                }}
              >
                {/* Frosting Drips */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white rounded-t-[18px]">
                  <div className="absolute top-3 left-[15%] w-3 h-5 bg-white rounded-b-full" />
                  <div className="absolute top-3 left-[45%] w-2.5 h-7 bg-white rounded-b-full" />
                  <div className="absolute top-3 left-[75%] w-3.5 h-4 bg-white rounded-b-full" />
                </div>

                {/* Cream Swirl Dollops (Left Half) */}
                <div className="absolute -top-2 left-[15%] w-4 h-4 bg-pink-100 rounded-full shadow-md" />
                <div className="absolute -top-2 left-[55%] w-4 h-4 bg-pink-100 rounded-full shadow-md" />

                {/* Left side Sprinkles */}
                <div className="absolute top-1/3 left-[20%] w-3 h-1 bg-yellow-300 rounded-full rotate-45" />
                <div className="absolute top-1/2 left-[40%] w-3 h-1 bg-cyan-300 rounded-full -rotate-12" />
                <div className="absolute top-[70%] left-[15%] w-3 h-1 bg-purple-300 rounded-full rotate-12" />
                <div className="absolute top-[60%] left-[55%] w-3 h-1 bg-white rounded-full -rotate-45" />
              </div>

              {/* 🍓 Cream & Strawberry on Top */}
              <div className="absolute -top-3 left-[30%] w-6 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span className="text-xs -mt-1 select-none">🍓</span>
              </div>

              {/* 🍰 INNER CUT-SURFACE (REVEALED WHEN CUT) */}
              {step === "done" && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-[16px] transition-opacity duration-500"
                  style={{
                    transform: "skewY(10deg) translateX(4px)",
                    background: "linear-gradient(to bottom, #fff 0%, #fff 10%, #ffd54f 10%, #ffd54f 35%, #e91e63 35%, #e91e63 45%, #ffd54f 45%, #ffd54f 70%, #8d6e63 70%, #8d6e63 80%, #ffd54f 80%)",
                    borderLeft: "1.5px solid hsl(330 80% 50% / 0.5)",
                    boxShadow: "inset 1px 0 3px rgba(0,0,0,0.15)",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}
            </div>

            {/* RIGHT HALF */}
            <div
              className="absolute right-0 bottom-0 w-[105px] h-[140px] transition-transform cubic-bezier(0.25, 1, 0.5, 1)"
              style={{
                transform: step === "done" ? "translateX(28px) rotate(3deg)" : "none",
                transitionDuration: "1000ms",
              }}
            >
              {/* Outer Shell (Right Half) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(330 75% 58%) 0%, hsl(310 65% 48%) 50%, hsl(280 60% 38%) 100%)",
                  borderRadius: "0 20px 12px 0",
                  borderRight: "2px solid hsl(330 80% 75% / 0.3)",
                  boxShadow: "inset -2px 2px 6px hsl(330 80% 80% / 0.2), 10px 10px 25px hsl(0 0% 0% / 0.5)",
                }}
              >
                {/* Frosting Drips */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white rounded-t-[18px]">
                  <div className="absolute top-3 left-[20%] w-3.5 h-6 bg-white rounded-b-full" />
                  <div className="absolute top-3 left-[55%] w-2.5 h-4 bg-white rounded-b-full" />
                  <div className="absolute top-3 left-[80%] w-3 h-5 bg-white rounded-b-full" />
                </div>

                {/* Cream Swirl Dollops (Right Half) */}
                <div className="absolute -top-2 left-[25%] w-4 h-4 bg-pink-100 rounded-full shadow-md" />
                <div className="absolute -top-2 left-[65%] w-4 h-4 bg-pink-100 rounded-full shadow-md" />

                {/* Right side Sprinkles */}
                <div className="absolute top-1/3 left-[40%] w-3 h-1 bg-yellow-300 rounded-full -rotate-45" />
                <div className="absolute top-1/2 left-[20%] w-3 h-1 bg-cyan-300 rounded-full rotate-30" />
                <div className="absolute top-[65%] left-[65%] w-3 h-1 bg-purple-300 rounded-full -rotate-12" />
                <div className="absolute top-[75%] left-[30%] w-3 h-1 bg-white rounded-full rotate-60" />
              </div>

              {/* 🍓 Cream & Strawberry on Top */}
              <div className="absolute -top-3 left-[50%] w-6 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span className="text-xs -mt-1 select-none">🍓</span>
              </div>

              {/* 🍰 INNER CUT-SURFACE (REVEALED WHEN CUT) */}
              {step === "done" && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[16px] transition-opacity duration-500"
                  style={{
                    transform: "skewY(-10deg) translateX(-4px)",
                    background: "linear-gradient(to bottom, #fff 0%, #fff 10%, #ffd54f 10%, #ffd54f 35%, #e91e63 35%, #e91e63 45%, #ffd54f 45%, #ffd54f 70%, #8d6e63 70%, #8d6e63 80%, #ffd54f 80%)",
                    borderRight: "1.5px solid hsl(330 80% 50% / 0.5)",
                    boxShadow: "inset -1px 0 3px rgba(0,0,0,0.15)",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── CANDLES (Lit until blown) ── */}
        {step === "blow" && (
          <div className="absolute top-[48px] left-[55px] right-[55px] h-[72px] flex justify-around items-end z-20">
            {candlesLit.map((lit, i) => (
              <button
                key={i}
                onClick={(e) => handleBlowCandle(i, e)}
                className="relative flex flex-col items-center select-none focus:outline-none transition-transform hover:scale-110 active:scale-95"
                style={{
                  height: 60 - (i % 2) * 5,
                  cursor: lit ? "pointer" : "default",
                }}
              >
                {/* Flame */}
                {lit && (
                  <div
                    className="absolute -top-[18px] w-3 h-5 rounded-full animate-flame-flicker"
                    style={{
                      background: "radial-gradient(ellipse at 50% 80%, #ffffff 0%, #ffeb3b 40%, #ff5722 80%, transparent 100%)",
                      boxShadow: "0 0 10px #ffeb3b, 0 0 20px #ff5722",
                    }}
                  />
                )}
                {/* Wick */}
                <div className="w-[1.5px] h-1.5 bg-neutral-800" />
                {/* Body */}
                <div
                  className="w-2.5 rounded-t-sm"
                  style={{
                    height: 40 - (i % 2) * 5,
                    background: i % 2 === 0
                      ? "repeating-linear-gradient(45deg, #00bcd4, #00bcd4 3px, #e0f7fa 3px, #e0f7fa 6px)"
                      : "repeating-linear-gradient(-45deg, #e91e63, #e91e63 3px, #fce4ec 3px, #fce4ec 6px)",
                    boxShadow: lit ? "0 0 4px rgba(255,255,255,0.4)" : "none",
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* ── SLICE OVERLAY KNIFE ── */}
        {step === "cut" && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-30 transition-all ${
              sliceActive ? "animate-knife-cut" : "animate-bounce"
            }`}
            style={{
              top: sliceActive ? "20px" : "32px",
              pointerEvents: "none",
            }}
          >
            <div
              className="text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              style={{
                transform: "rotate(-45deg)",
              }}
            >
              🔪
            </div>
          </div>
        )}
      </div>

      {/* ── Control Action Cards ── */}
      <div className="w-full flex flex-col items-center h-20 justify-center">
        {step === "blow" && candlesLit.some((l) => !l) && (
          <button
            onClick={handleBlowAll}
            className="text-xs uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors py-1 px-4 border border-foreground/10 hover:border-primary/20 rounded-full"
          >
            Blow all out 🌬️
          </button>
        )}

        {step === "wish" && (
          <button
            onClick={handleWishDone}
            className="px-8 py-3.5 rounded-full text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, hsl(330 80% 55%), hsl(280 70% 55%))",
              color: "white",
              boxShadow: "0 4px 20px hsl(330 80% 65% / 0.5), 0 0 40px hsl(280 60% 50% / 0.2)",
              border: "1px solid hsl(330 80% 70% / 0.3)",
            }}
          >
            I've made my wish 🤍
          </button>
        )}

        {step === "done" && (
          <button
            onClick={onCut}
            className="px-10 py-3.5 rounded-full text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, hsl(330 80% 55%), hsl(280 70% 55%))",
              color: "white",
              boxShadow: "0 4px 20px hsl(330 80% 65% / 0.5), 0 0 40px hsl(280 60% 50% / 0.2)",
              border: "1px solid hsl(330 80% 70% / 0.3)",
            }}
          >
            Continue… ✨
          </button>
        )}
      </div>
    </div>
  );
};

export default Cake;
