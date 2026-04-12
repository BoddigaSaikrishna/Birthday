import { useEffect, useState } from "react";

const ProposalScene = ({ className = "" }: { className?: string }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // slight delay so the card renders first then they slide in
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`pointer-events-none z-20 ${className}`}>
      <svg
        viewBox="0 0 300 210"
        className="w-full max-w-[350px] sm:max-w-[400px] h-auto drop-shadow-lg"
      >
        <defs>
          <filter id="ring_glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floor line */}
        <line x1="20" y1="183" x2="280" y2="183" stroke="hsl(330 80% 65% / 0.2)" strokeWidth="2" strokeLinecap="round" />

        {/* Boy Group */}
        <g
          style={{
            transform: animate ? "translateX(0)" : "translateX(-40px)",
            opacity: animate ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
          }}
        >
          {/* Back Arm */}
          <polyline points="70,65 60,95 65,125" fill="none" stroke="#fdba74" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="65" cy="125" r="3.5" fill="#fdba74" />
          
          {/* Back Leg (Kneeling) */}
          <polyline points="60,120 60,180 25,180" fill="none" stroke="#2563eb" strokeWidth="15" strokeLinejoin="round" />
          <path d="M 30 180 L 15 180" fill="none" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" />

          {/* Planted Leg (Front) */}
          <polyline points="60,120 100,120 100,180" fill="none" stroke="#3b82f6" strokeWidth="15" strokeLinejoin="round" />
          <path d="M 95 180 L 115 180" fill="none" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" />

          {/* Torso */}
          <line x1="70" y1="60" x2="60" y2="120" stroke="#f1f5f9" strokeWidth="23" strokeLinecap="round" />
          <line x1="70" y1="60" x2="60" y2="120" stroke="#e2e8f0" strokeWidth="23" strokeLinecap="round" opacity="0.6" /> {/* Shadow */}

          {/* Head & Neck */}
          <line x1="68" y1="50" x2="70" y2="60" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          <circle cx="75" cy="40" r="14" fill="#fed7aa" />
          
          {/* Hair */}
          <path d="M 60 45 C 55 20, 95 15, 90 45 Z" fill="#1e293b" />
          <path d="M 88 25 Q 95 35 90 45" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          
          {/* Face */}
          <path d="M 81 35 Q 83 34 85 35" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" /> {/* Closed eye */}
          <path d="M 83 44 Q 85 47 87 43" fill="none" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" /> {/* Smile */}

          {/* Front Arm */}
          <polyline points="70,65 100,85 130,80" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Hand holding box */}
          <circle cx="130" cy="80" r="4" fill="#fed7aa" />

          {/* Ring Box */}
          <rect x="130" y="75" width="12" height="8" fill="#e11d48" rx="1" />
          <rect x="130" y="65" width="12" height="4" fill="#be123c" rx="1" transform="rotate(-25 130 75)" />
          {/* Ring glow */}
          <circle cx="136" cy="72" r="2.5" fill="#fcd34d" filter="url(#ring_glow)" style={{ animation: animate ? "pulseLight 1.5s infinite alternate" : "none", transformOrigin: "136px 72px" }} />
          <circle cx="136" cy="72" r="1" fill="#fff" />
        </g>

        {/* Girl Group */}
        <g
          style={{
            transform: animate ? "translateX(0)" : "translateX(40px)",
            opacity: animate ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s",
          }}
        >
          {/* Back Leg */}
          <polyline points="210,110 225,145 230,180" fill="none" stroke="#fdba74" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 233 180 L 218 180" fill="none" stroke="#be123c" strokeWidth="8" strokeLinecap="round" />

          {/* Back Arm */}
          <polyline points="200,55 207,75 197,40" fill="none" stroke="#fdba74" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="197" cy="40" r="3.5" fill="#fdba74" />

          {/* Dress */}
          <path d="M 195 55 C 190 70, 185 120, 180 140 L 225 140 C 220 110, 215 70, 210 55 Z" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Front Leg */}
          <line x1="210" y1="110" x2="210" y2="180" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          <path d="M 215 180 L 200 180" fill="none" stroke="#e11d48" strokeWidth="8" strokeLinecap="round" />

          {/* Head & Neck */}
          <line x1="200" y1="40" x2="200" y2="55" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
          <circle cx="195" cy="32" r="13" fill="#fed7aa" />

          {/* Hair */}
          <path d="M 197 20 C 212 20, 217 50, 217 80 C 217 100, 207 110, 207 110 C 207 110, 202 90, 202 60 Z" fill="#0f172a" />
          <path d="M 200 18 C 182 18, 182 35, 182 35 C 187 30, 197 25, 200 18 Z" fill="#0f172a" />

          {/* Face Details */}
          <path d="M 186 28 Q 189 27 191 29" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" /> {/* Closed eye */}
          <ellipse cx="187" cy="38" rx="2" ry="3" fill="#e11d48" /> {/* Gasp mouth */}
          <ellipse cx="193" cy="38" rx="4" ry="2" fill="#fca5a5" opacity="0.7" /> {/* Blush */}

          {/* Front Arm (covers dress a bit) */}
          <polyline points="200,55 192,75 187,45" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="187" cy="45" r="3.5" fill="#fed7aa" />
        </g>

        {/* Floating Hearts */}
        <g
          style={{
            opacity: animate ? 1 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          {["💖", "✨", "💕"].map((emoji, i) => (
            <text
              key={i}
              x={145 + i * 18}
              y={65 - i * 15}
              fontSize={14 + (i % 2) * 4}
              style={{
                animation: animate ? `customFloatUp ${2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite alternate` : "none",
                transformOrigin: "center"
              }}
            >
              {emoji}
            </text>
          ))}
        </g>
      </svg>
      
      <style>{`
        @keyframes pulseLight {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes customFloatUp {
          0% { transform: translateY(0px) scale(0.9); }
          100% { transform: translateY(-12px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default ProposalScene;
