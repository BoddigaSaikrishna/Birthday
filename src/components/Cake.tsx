import { useState, useEffect } from "react";

interface CakeProps {
  onCut: () => void;
}

const Cake = ({ onCut }: CakeProps) => {
  const [candleBlown, setCandleBlown] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [cut, setCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sparkleParticles, setSparkleParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const candleColors = [
    "hsl(330 80% 65%)",
    "hsl(280 70% 65%)",
    "hsl(45 90% 65%)",
    "hsl(200 80% 65%)",
    "hsl(150 70% 55%)",
  ];

  const handleBlowCandle = () => {
    if (candleBlown) return;
    setCandleBlown(true);
    // Trigger sparkles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 45 + Math.random() * 10,
      y: 20 + Math.random() * 20,
      color: candleColors[Math.floor(Math.random() * candleColors.length)],
    }));
    setSparkleParticles(particles);
    setTimeout(() => setSparkleParticles([]), 1500);
  };

  // Step 1: tapping the cake opens the popup
  const handleTapCake = () => {
    if (!candleBlown || cutting || cut) return;
    setShowPopup(true);
  };

  // Step 2: confirmed in popup → run the actual cut
  const handleConfirmCut = () => {
    setShowPopup(false);
    setCutting(true);
    setTimeout(() => {
      setCut(true);
      setCutting(false);
      // Trigger a burst of sparkles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i + 100,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        color: candleColors[Math.floor(Math.random() * candleColors.length)],
      }));
      setSparkleParticles(particles);
      setTimeout(() => setSparkleParticles([]), 2000);
    }, 800);
    setTimeout(() => setShowMessage(true), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Instruction */}
      <p className="text-sm uppercase tracking-[0.25em] text-foreground/40 font-light">
        {!candleBlown
          ? "Tap the flame to blow out the candles 🕯️"
          : !cut
          ? "Now tap the cake to cut it! 🔪"
          : "🎉 Happy Birthday, Leelu! 🎉"}
      </p>

      {/* Cake SVG Scene */}
      <div className="relative" style={{ width: 280, height: 240 }}>
        {/* Sparkle Particles */}
        {sparkleParticles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              animation: "cake-sparkle 1.2s ease-out forwards",
            }}
          />
        ))}

        {/* Cake Left Half */}
        <div
          className="absolute"
          style={{
            left: cut ? "5%" : "10%",
            bottom: 0,
            width: cut ? "42%" : "80%",
            height: 160,
            transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
            transformOrigin: "right bottom",
          }}
        >
          {/* Plate beneath left */}
          {cut && (
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "110%",
                height: 12,
                borderRadius: "50%",
                background: "linear-gradient(180deg, hsl(220 20% 92%), hsl(220 20% 80%))",
                boxShadow: "0 4px 12px hsl(0 0% 0% / 0.3)",
              }}
            />
          )}

          {/* Cake Body Left */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              borderRadius: cut ? "16px 8px 8px 16px" : "16px 16px 8px 8px",
              background:
                "linear-gradient(160deg, hsl(330 80% 70%) 0%, hsl(0 70% 60%) 40%, hsl(20 80% 55%) 100%)",
              boxShadow: cut
                ? "inset -2px 0 12px hsl(0 0% 0% / 0.15), -4px 8px 30px hsl(330 80% 65% / 0.4)"
                : "0 8px 30px hsl(330 80% 65% / 0.5)",
              overflow: "hidden",
            }}
          >
            {/* Cake Layers */}
            <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 3, background: "hsl(45 90% 88% / 0.5)", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 3, background: "hsl(45 90% 88% / 0.5)", borderRadius: 2 }} />

            {/* Cream Frosting on top */}
            <div
              style={{
                position: "absolute",
                top: -6,
                left: -2,
                right: -2,
                height: 16,
                background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(330 50% 95%) 100%)",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 2px 8px hsl(0 0% 0% / 0.15)",
              }}
            />

            {/* Drips */}
            {[15, 35, 55, 75].map((left, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${left}%`,
                  width: 8,
                  height: 18 + (i % 2) * 8,
                  background: "hsl(330 80% 90%)",
                  borderRadius: "0 0 8px 8px",
                }}
              />
            ))}

            {/* Sprinkles */}
            {[
              { top: "20%", left: "20%", color: "hsl(45 90% 70%)", rot: 45 },
              { top: "45%", left: "60%", color: "hsl(200 80% 70%)", rot: -30 },
              { top: "70%", left: "30%", color: "hsl(120 60% 70%)", rot: 60 },
              { top: "55%", left: "45%", color: "hsl(280 70% 70%)", rot: 15 },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: s.top,
                  left: s.left,
                  width: 12,
                  height: 4,
                  background: s.color,
                  borderRadius: 2,
                  transform: `rotate(${s.rot}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Cake Right Half (only when cut) */}
        {cut && (
          <div
            className="absolute"
            style={{
              right: "4%",
              bottom: 0,
              width: "42%",
              height: 160,
              animation: "cake-slide-right 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards",
            }}
          >
            {/* Plate beneath right */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "110%",
                height: 12,
                borderRadius: "50%",
                background: "linear-gradient(180deg, hsl(220 20% 92%), hsl(220 20% 80%))",
                boxShadow: "0 4px 12px hsl(0 0% 0% / 0.3)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100%",
                borderRadius: "8px 16px 16px 8px",
                background:
                  "linear-gradient(160deg, hsl(330 80% 70%) 0%, hsl(0 70% 60%) 40%, hsl(20 80% 55%) 100%)",
                boxShadow: "4px 8px 30px hsl(330 80% 65% / 0.4)",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 3, background: "hsl(45 90% 88% / 0.5)", borderRadius: 2 }} />
              <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 3, background: "hsl(45 90% 88% / 0.5)", borderRadius: 2 }} />
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  left: -2,
                  right: -2,
                  height: 16,
                  background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(330 50% 95%) 100%)",
                  borderRadius: "8px 8px 0 0",
                  boxShadow: "0 2px 8px hsl(0 0% 0% / 0.15)",
                }}
              />
              {[15, 35, 55, 75].map((left, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${left}%`,
                    width: 8,
                    height: 18 + (i % 2) * 8,
                    background: "hsl(330 80% 90%)",
                    borderRadius: "0 0 8px 8px",
                  }}
                />
              ))}
              {[
                { top: "25%", left: "25%", color: "hsl(45 90% 70%)", rot: -45 },
                { top: "50%", left: "55%", color: "hsl(330 80% 70%)", rot: 30 },
                { top: "72%", left: "35%", color: "hsl(280 70% 70%)", rot: -60 },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: s.top,
                    left: s.left,
                    width: 12,
                    height: 4,
                    background: s.color,
                    borderRadius: 2,
                    transform: `rotate(${s.rot}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Candles on top (only visible when not cut) */}
        {!cut && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              width: "80%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              height: 80,
              zIndex: 10,
            }}
          >
            {candleColors.map((color, i) => (
              <button
                key={i}
                onClick={handleBlowCandle}
                className="focus:outline-none"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0,
                  background: "none",
                  border: "none",
                  cursor: candleBlown ? "default" : "pointer",
                  padding: 0,
                  height: 70 - i * 3,
                }}
              >
                {/* Flame */}
                {!candleBlown ? (
                  <div
                    style={{
                      width: 14,
                      height: 22,
                      background: `radial-gradient(ellipse at 50% 80%, hsl(45 100% 80%) 0%, hsl(30 100% 60%) 40%, hsl(15 100% 50%) 70%, transparent 100%)`,
                      borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
                      animation: "flame-flicker 0.8s ease-in-out infinite alternate",
                      boxShadow: `0 0 12px hsl(45 100% 70%), 0 0 24px ${color}`,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{ width: 14, height: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(0 0% 30%)", opacity: 0.7 }} />
                  </div>
                )}
                {/* Wick */}
                <div style={{ width: 2, height: 6, background: "hsl(0 0% 20%)", borderRadius: 1 }} />
                {/* Candle body */}
                <div
                  style={{
                    width: 10,
                    height: 40 - i * 2,
                    borderRadius: "4px 4px 2px 2px",
                    background: `linear-gradient(180deg, ${color}, hsl(from ${color} h s calc(l - 15%)))`,
                    boxShadow: candleBlown ? "none" : `0 0 8px ${color}88`,
                    flexShrink: 0,
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Cut action overlay */}
        {candleBlown && !cut && (
          <button
            onClick={handleTapCake}
            disabled={cutting}
            className="absolute inset-0 focus:outline-none"
            style={{
              background: cutting ? "hsl(330 80% 65% / 0.08)" : "transparent",
              cursor: cutting ? "wait" : "pointer",
              borderRadius: 16,
              transition: "background 0.3s",
              zIndex: 20,
            }}
            aria-label="Cut the cake"
          >
            {cutting && (
              <div style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 36,
                filter: "drop-shadow(0 0 16px hsl(330 80% 65%))",
                animation: "knife-cut 0.8s ease-in-out forwards",
              }}>
                🔪
              </div>
            )}
          </button>
        )}
      </div>

      {/* ── Make-a-wish Popup ── */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "hsl(0 0% 0% / 0.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl text-center animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, hsl(330 50% 14% / 0.97), hsl(280 40% 10% / 0.97))",
              border: "1px solid hsl(330 70% 55% / 0.3)",
              boxShadow: "0 0 60px hsl(330 80% 60% / 0.2), 0 20px 60px hsl(0 0% 0% / 0.5)",
              maxWidth: 340,
              width: "90%",
            }}
          >
            <p className="text-5xl" style={{ filter: "drop-shadow(0 0 14px hsl(45 100% 70%))" }}>🎂</p>
            <h3
              className="text-2xl sm:text-3xl font-display text-primary text-glow-pink leading-snug"
              style={{ fontFamily: "var(--font-script, cursive)" }}
            >
              Make a Wish, Leela! 🌟
            </h3>
            <p className="text-sm text-foreground/60 font-light tracking-wide leading-relaxed">
              Close your eyes, make a wish from your heart… then cut the cake! 💖
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleConfirmCut}
                className="px-7 py-3 rounded-full text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(330 80% 55%), hsl(280 70% 55%))",
                  color: "white",
                  boxShadow: "0 4px 20px hsl(330 80% 65% / 0.5)",
                  border: "1px solid hsl(330 80% 70% / 0.3)",
                }}
              >
                Cut It! 🎂
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-3 rounded-full text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
                style={{ border: "1px solid hsl(280 30% 30% / 0.4)" }}
              >
                Wait…
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cut message + continue button */}
      {showMessage && (
        <div className="flex flex-col items-center gap-5 animate-fade-in-up">
          <p
            className="text-2xl sm:text-3xl font-display text-primary text-glow-pink text-center"
            style={{ fontFamily: "var(--font-script, cursive)" }}
          >
            Make a wish, Leela! 🌟
          </p>
          <button
            onClick={onCut}
            className="px-8 py-3 rounded-full text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(330 80% 55%), hsl(280 70% 55%))",
              color: "white",
              boxShadow: "0 4px 20px hsl(330 80% 65% / 0.5), 0 0 40px hsl(330 80% 65% / 0.2)",
              border: "1px solid hsl(330 80% 70% / 0.3)",
            }}
          >
            Continue… ✨
          </button>
        </div>
      )}
    </div>
  );
};

export default Cake;
