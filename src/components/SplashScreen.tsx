import { useState, useEffect } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen = ({ onEnter }: SplashScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Simulate loading (fonts + assets)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    setExiting(true);
    setTimeout(() => onEnter(), 900);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-romantic-gradient flex flex-col items-center justify-center">
        {/* Heartbeat loader */}
        <div className="loading-heart select-none">💖</div>
        <p
          className="mt-8 text-sm tracking-[0.3em] uppercase text-foreground/40 font-body"
          style={{ animation: "gentle-pulse 2s ease-in-out infinite" }}
        >
          Loading something special…
        </p>
      </div>
    );
  }

  // Splash / tap-to-begin screen
  return (
    <div
      className={`fixed inset-0 z-[100] bg-romantic-gradient flex flex-col items-center justify-center px-6 ${
        exiting ? "splash-fade-out" : ""
      }`}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleTap()}
    >
      {/* Ambient stars behind */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-sparkle select-none"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${6 + Math.random() * 6}px`,
              animation: `twinkle ${2.5 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite`,
              filter: "drop-shadow(0 0 3px hsl(45 90% 75%))",
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative text-center">
        {/* Decorative emoji */}
        <p
          className="text-6xl md:text-7xl mb-6 splash-title select-none"
          style={{ filter: "drop-shadow(0 0 20px hsl(330 80% 65%))" }}
        >
          💌
        </p>

        {/* Title */}
        <h1
          className="splash-title font-script text-5xl md:text-7xl shimmer-text mb-4"
          style={{ fontFamily: "var(--font-script)" }}
        >
          For You…
        </h1>

        {/* Subtitle */}
        <p className="splash-subtitle text-foreground/50 text-sm md:text-base font-light tracking-wider mb-16">
          something made with love
        </p>

        {/* Tap button */}
        <div className="splash-button">
          <div
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full backdrop-blur-md transition-all duration-300
              hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(330 60% 22% / 0.85), hsl(280 50% 18% / 0.85))",
              border: "1px solid hsl(330 70% 55% / 0.35)",
              boxShadow: "0 0 20px hsl(330 80% 60% / 0.35), 0 0 50px hsl(280 60% 55% / 0.15)",
            }}
          >
            <span className="text-lg tracking-[0.15em] uppercase text-[hsl(330_80%_80%)] font-body font-medium">
              Tap to Begin
            </span>
            <span className="text-xl" style={{ filter: "drop-shadow(0 0 6px hsl(330 80% 65%))" }}>
              ✨
            </span>
          </div>
        </div>

        {/* Hint */}
        <p className="splash-tap-hint mt-10 text-xs text-foreground/25 tracking-widest uppercase">
          🎵 best with sound on
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
