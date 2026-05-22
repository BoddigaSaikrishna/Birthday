import { useEffect, useState, useRef, useMemo } from "react";

const LOADING_TEXT = "Preparing something special for you…";

const DancingLoader = ({ visible }: { visible: boolean }) => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setFadeOut(false);
      setShow(true);
      let i = 0;
      setTypedText("");
      typingRef.current = setInterval(() => {
        i++;
        setTypedText(LOADING_TEXT.slice(0, i));
        if (i >= LOADING_TEXT.length) clearInterval(typingRef.current!);
      }, 60);
    } else {
      setFadeOut(true);
      if (typingRef.current) clearInterval(typingRef.current);
      const t = setTimeout(() => { setShow(false); setTypedText(""); }, 600);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 5,
      dur: 3 + Math.random() * 3,
      size: Math.random() > 0.65 ? 3 : 2,
      isHeart: i % 5 === 0,
      isStar: i % 7 === 0,
    })), []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse 120% 100% at 50% 60%, hsl(270 40% 7%) 0%, hsl(265 35% 4%) 55%, hsl(0 0% 2%) 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
        overflow: "hidden",
      }}
    >
      {/* ── SOFT PARTICLES / SPARKLES ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              bottom: "18%",
              width: p.isHeart || p.isStar ? undefined : p.size,
              height: p.isHeart || p.isStar ? undefined : p.size,
              fontSize: p.isHeart || p.isStar ? 13 : undefined,
              borderRadius: "50%",
              background: p.isHeart || p.isStar ? undefined : `hsl(${35 + p.id * 3} 100% 65%)`,
              boxShadow: p.isHeart || p.isStar ? undefined : `0 0 ${p.size * 3}px hsl(38 100% 60%)`,
              animation: `sparkleFloat ${p.dur}s ease-out ${p.delay}s infinite`,
              filter: p.isHeart || p.isStar ? "drop-shadow(0 0 4px hsl(38 100% 60%))" : undefined,
            }}
          >
            {p.isHeart ? "💛" : p.isStar ? "✨" : null}
          </div>
        ))}
      </div>

      {/* ── COUPLE SCENE ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: "min(380px, 90vw)", aspectRatio: "1 / 1.1" }}
      >
        {/* Outer ambient halo — large soft glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(ellipse 70% 65% at 50% 55%, hsl(38 100% 50% / 0.10) 0%, hsl(38 100% 45% / 0.04) 60%, transparent 100%)",
            filter: "blur(18px)",
            animation: "haloBreath 3.5s ease-in-out infinite alternate",
          }}
        />

        {/* Inner focused glow behind couple */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            right: "20%",
            top: "12%",
            bottom: "15%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, hsl(38 100% 55% / 0.13) 0%, transparent 70%)",
            filter: "blur(12px)",
            animation: "haloBreath 3.5s ease-in-out 0.5s infinite alternate",
          }}
        />

        {/* ── COUPLE SVG ── */}
        <svg
          viewBox="0 0 200 230"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            {/* Multi-layer neon orange/gold glow */}
            <filter id="neonGold" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b0"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="b2"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="9"   result="b3"/>
              <feMerge>
                <feMergeNode in="b3"/>
                <feMergeNode in="b2"/>
                <feMergeNode in="b1"/>
                <feMergeNode in="b0"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Skirt-only softer glow */}
            <filter id="skirtGlow" x="-50%" y="-30%" width="200%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="4"   result="b2"/>
              <feMerge>
                <feMergeNode in="b2"/>
                <feMergeNode in="b1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* ══ SLOW-DANCING COUPLE — sways as one unit ══ */}
          {/* Transform origin at waist/hip level */}
          <g
            style={{
              transformOrigin: "100px 110px",
              animation: "slowDanceSway 3.5s ease-in-out infinite",
            }}
          >
            {/* ─── Core couple lines (neon glow) ─── */}
            <g
              filter="url(#neonGold)"
              stroke="#ffaa22"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* ════ MAN (left, facing right) ════ */}

              {/* Head */}
              <circle cx="75" cy="26" r="12" strokeWidth="3.2"/>

              {/* Neck */}
              <line x1="75" y1="38" x2="74" y2="48" strokeWidth="3"/>

              {/* Shoulders */}
              <path d="M 53,56 Q 74,48 92,55" strokeWidth="3.5"/>

              {/* LEFT arm — raised up holding joined hands */}
              <path d="M 53,56 Q 58,36 72,22 Q 78,16 88,15" strokeWidth="3.2"/>

              {/* RIGHT arm — wrapping around her back */}
              <path d="M 92,55 Q 112,68 124,80" strokeWidth="3.2"/>

              {/* Torso */}
              <path d="M 53,56 Q 50,80 54,112" strokeWidth="4"/>
              <path d="M 92,55 Q 95,78 90,112" strokeWidth="4"/>
              {/* Hip */}
              <path d="M 54,112 Q 72,120 90,112" strokeWidth="3.2"/>

              {/* RIGHT leg — forward step */}
              <path d="M 70,114 Q 64,146 58,178" strokeWidth="3.8"/>
              {/* Right foot */}
              <path d="M 58,178 Q 46,184 36,182" strokeWidth="3"/>

              {/* LEFT leg — back */}
              <path d="M 72,114 Q 82,146 88,178" strokeWidth="3.8"/>
              {/* Left foot */}
              <path d="M 88,178 Q 96,182 104,180" strokeWidth="3"/>

              {/* ════ LADY (right, facing left, slightly shorter) ════ */}

              {/* Head */}
              <circle cx="120" cy="30" r="11" strokeWidth="3.2"/>

              {/* Hair — flowing elegantly */}
              <path d="M 127,22 Q 138,13 134,28 Q 136,36 130,44" strokeWidth="2.5"/>
              <path d="M 129,18 Q 142,16 140,28" strokeWidth="2"/>

              {/* Neck */}
              <line x1="120" y1="41" x2="120" y2="50" strokeWidth="3"/>

              {/* Shoulders */}
              <path d="M 100,58 Q 120,51 138,57" strokeWidth="3.5"/>

              {/* RIGHT arm — raised up to joined hands */}
              <path d="M 138,57 Q 130,36 116,22 Q 110,16 100,15" strokeWidth="3.2"/>

              {/* LEFT arm — gently resting on his shoulder */}
              <path d="M 100,58 Q 90,55 80,54" strokeWidth="3.2"/>

              {/* Torso */}
              <path d="M 100,58 Q 98,80 100,106" strokeWidth="4"/>
              <path d="M 138,57 Q 140,78 136,106" strokeWidth="4"/>
              {/* Hip */}
              <path d="M 100,106 Q 118,114 136,106" strokeWidth="3.2"/>
            </g>

            {/* ─── Skirt — slightly separate sway ─── */}
            <g
              filter="url(#skirtGlow)"
              stroke="#ffaa22"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transformOrigin: "118px 106px",
                animation: "skirtSway 3.5s ease-in-out infinite",
              }}
            >
              {/* Dress panels — flowing outward */}
              <path d="M 100,106 Q 82,132 68,178" strokeWidth="3.8"/>
              <path d="M 108,110 Q 98,138 92,182" strokeWidth="3.8"/>
              <path d="M 122,110 Q 120,140 118,184" strokeWidth="3.8"/>
              <path d="M 136,106 Q 150,134 160,178" strokeWidth="3.8"/>
              {/* Skirt hem arc */}
              <path d="M 68,178 Q 112,196 160,178" strokeWidth="3"/>

              {/* Raised leg from beneath skirt — tango accent */}
              <path d="M 106,112 Q 120,126 136,140 Q 148,152 150,164" strokeWidth="3.2"/>
              {/* Pointed toe */}
              <path d="M 150,164 Q 157,170 158,166" strokeWidth="2.8"/>

              {/* Standing leg */}
              <path d="M 112,112 Q 108,144 106,180" strokeWidth="3.5"/>
              {/* Standing foot */}
              <path d="M 106,180 Q 96,186 86,184" strokeWidth="3"/>
            </g>

            {/* ─── Joined hands — center top ─── */}
            <g filter="url(#neonGold)">
              <circle cx="94" cy="15" r="5" stroke="#ffcc55" strokeWidth="2.5" fill="none"/>
              {/* Tiny sparkle at joined hands */}
              <circle cx="94" cy="15" r="2" fill="#ffcc55" opacity="0.7"
                style={{ animation: "handSpark 2s ease-in-out infinite" }}
              />
            </g>
          </g>
        </svg>
      </div>

      {/* ── LOADING TEXT ── */}
      <div style={{ marginTop: 28, textAlign: "center", padding: "0 20px" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(12px, 3.5vw, 15px)",
            color: "hsl(36 100% 80%)",
            letterSpacing: "0.08em",
            fontWeight: 300,
            minHeight: "1.6em",
            textShadow: "0 0 14px hsl(38 100% 55% / 0.6), 0 0 30px hsl(38 100% 45% / 0.3)",
          }}
        >
          <span>{typedText}</span>
          <span
            style={{
              animation: "typingCursor 0.75s step-end infinite",
              color: "hsl(38 100% 65%)",
              marginLeft: 1,
            }}
          >|</span>
          {typedText.length === LOADING_TEXT.length && " ❤️"}
        </p>

        {/* Glowing dot indicators */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "hsl(38 100% 62%)",
                boxShadow: "0 0 8px hsl(38 100% 60%), 0 0 16px hsl(38 100% 50% / 0.5)",
                animation: `dotBounce 1.4s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DancingLoader;
