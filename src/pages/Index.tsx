import { useState, useCallback, useEffect, useRef } from "react";
import TypingText from "@/components/TypingText";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import Confetti from "@/components/Confetti";
import MusicPlayer, { type MusicPlayerRef } from "@/components/MusicPlayer";
import SplashScreen from "@/components/SplashScreen";
import EnvelopeButton from "@/components/EnvelopeButton";
import Cake from "@/components/Cake";
import { Button } from "@/components/ui/button";

type Section =
  | "opening"
  | "birthday"
  | "cake-cutting"
  | "honest-beginning"
  | "eye-contact"
  | "thinking"
  | "prayer"
  | "feeling"
  | "confession"
  | "respectful"
  | "soft-ending"
  | "final"
  | "response";

const HER_NAME = "Leela";
const HER_NICKNAME = "Leelu"; // ← used only on the final/response screens
const YOUR_NAME = "Sai Krishna"; // ← #3 your name for the signature

const SECTIONS: Section[] = [
  "opening",
  "birthday",
  "cake-cutting",
  "honest-beginning",
  "eye-contact",
  "thinking",
  "prayer",
  "feeling",
  "confession",
  "respectful",
  "soft-ending",
  "final",
];

// ── Progress Dots ────────────────────────────────────────
const ProgressDots = ({ current }: { current: Section }) => {
  const idx = SECTIONS.indexOf(current);
  if (idx < 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2 items-center progress-dots-container">
      {SECTIONS.map((s, i) => (
        <span
          key={s}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === idx ? "20px" : "6px",
            height: "6px",
            background:
              i < idx
                ? "hsl(330 80% 65%)"
                : i === idx
                ? "linear-gradient(90deg, hsl(330 80% 65%), hsl(280 70% 65%))"
                : "hsl(280 30% 30%)",
            boxShadow: i === idx ? "0 0 8px hsl(330 80% 65% / 0.7)" : "none",
            opacity: i > idx ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
};

// ── Easter Egg Tooltip (#8) ──────────────────────────────
const EasterEggTooltip = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="easter-egg-tooltip mt-3 px-5 py-3 rounded-2xl text-center"
      style={{
        background: "linear-gradient(135deg, hsl(330 50% 18% / 0.95), hsl(280 40% 14% / 0.95))",
        border: "1px solid hsl(330 70% 55% / 0.25)",
        boxShadow: "0 4px 20px hsl(0 0% 0% / 0.4), 0 0 30px hsl(330 80% 60% / 0.1)",
      }}
    >
      <p className="text-sm text-foreground/70 font-light italic">
        "Every candle on this cake is a wish I've made for your happiness" ✨
      </p>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────
const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [section, setSection] = useState<Section>("opening");
  const [typingDone, setTypingDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sectionKey, setSectionKey] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  const musicRef = useRef<MusicPlayerRef>(null);

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  // #2 — When splash ends, auto-play music
  const handleSplashEnter = () => {
    setShowSplash(false);
    // Start music after a small delay so the UI is ready
    setTimeout(() => {
      musicRef.current?.play();
    }, 300);
  };

  const goTo = (next: Section) => {
    setTypingDone(false);
    setSection(next);
    setSectionKey((k) => k + 1);
    if (next === "birthday") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
  };

  const handleResponse = (answer: string) => {
    setResponse(answer);
    setSection("response");
    setSectionKey((k) => k + 1);
    if (answer === "yes") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
      // 🎵 Switch to Ottesi Cheputhunna when she says Yes
      setTimeout(() => {
        musicRef.current?.switchTo("/Music/Ottesi cheputhunna.mp4");
      }, 600);
    }
  };

  // #4 — Replay
  const handleReplay = () => {
    setResponse(null);
    setTypingDone(false);
    setSection("opening");
    setSectionKey((k) => k + 1);
  };

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  // #8 — Easter egg toggle
  const toggleEasterEgg = () => {
    setEasterEgg((prev) => !prev);
  };

  const renderSection = () => {
    switch (section) {
      case "opening":
        return (
          <SectionWrapper key={sectionKey}>
            {/* #8 — Easter egg: tap the cake emoji */}
            <button
              onClick={toggleEasterEgg}
              className="text-4xl mb-4 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              style={{ filter: "drop-shadow(0 0 12px hsl(330 80% 65%))" }}
              aria-label="Secret message"
            >
              🎂
            </button>
            <EasterEggTooltip show={easterEgg} />

            <h2
              className="font-script text-4xl sm:text-5xl md:text-6xl mb-8 shimmer-text"
              style={{ fontFamily: "var(--font-script)" }}
            >
              A little something for you…
            </h2>
            <TypingText
              lines={[
                `Hey ${HER_NAME}… 🌸`,
                "Happy Birthday.",
                "",
                "I didn't really know what to gift you…",
                "So I made something instead.",
              ]}
              onComplete={handleTypingComplete}
              speed={45}
            />
            {/* #1 — Envelope animation replaces plain button */}
            {typingDone && <EnvelopeButton onClick={() => goTo("birthday")} />}
          </SectionWrapper>
        );

      case "birthday":
        return (
          <SectionWrapper key={sectionKey}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary text-glow-pink mb-8 md:mb-10 leading-tight">
              Happy Birthday,
              <br />
              <span
                className="shimmer-text font-script text-5xl sm:text-6xl md:text-8xl"
                style={{ fontFamily: "var(--font-script)" }}
              >
                {HER_NAME}
              </span>
              <span className="ml-2 heart-beat inline-block">💖</span>
            </h1>
            <TypingText
              lines={[
                "I really hope today makes you smile a lot…",
                "Because you honestly deserve that.",
              ]}
              onComplete={handleTypingComplete}
              speed={40}
              lineDelay={800}
            />
            {typingDone && <ContinueButton onClick={() => goTo("cake-cutting")} />}
          </SectionWrapper>
        );

      case "cake-cutting":
        return (
          <SectionWrapper key={sectionKey}>
            <p
              className="font-display text-2xl sm:text-3xl md:text-4xl text-primary text-glow-pink mb-2 leading-snug"
            >
              Time to cut the cake! 🎂
            </p>
            <p className="text-foreground/60 font-light text-sm mb-8 tracking-wide">
              A little celebration just for you…
            </p>
            <Cake onCut={() => goTo("honest-beginning")} />
          </SectionWrapper>
        );

      case "honest-beginning":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>💬</SectionOrnament>
            <TypingText
              lines={[
                "We haven't really talked much…",
                "Maybe just once or twice this whole year.",
                "",
                "But still… I noticed you.",
                "",
                "Not in a weird way… just quietly.",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("eye-contact")} />}
          </SectionWrapper>
        );

      case "eye-contact":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>👁️</SectionOrnament>
            <TypingText
              lines={[
                "Sometimes it was just those small eye contacts…",
                "",
                "You probably didn't think much about them…",
                "But for me, they meant something.",
                "",
                "Every time it happened…",
                "it just made me feel really good.",
                "",
                "It's strange how something so small can stay with you.",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("thinking")} />}
          </SectionWrapper>
        );

      case "thinking":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>💭</SectionOrnament>
            <TypingText
              lines={[
                "It might sound a bit unexpected…",
                "",
                "but those moments stayed with me.",
                "",
                "There wasn't really a day this year…",
                "where you didn't cross my mind at least once.",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("prayer")} />}
          </SectionWrapper>
        );

      case "prayer":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>🙏</SectionOrnament>
            <TypingText
              lines={[
                "I might not be someone you mention in your stories…",
                "",
                "but in my own small way,",
                "I've thought about you and wished good things for you",
                "more times than you'd probably expect.",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("feeling")} />}
          </SectionWrapper>
        );

      case "feeling":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>🌷</SectionOrnament>
            <TypingText
              lines={[
                "I don't have big memories or long conversations with you…",
                "",
                "But somehow…",
                "I started liking you.",
                "",
                "I didn't expect this…",
                "but you became one of the most important people to me,",
                "even without us talking much.",
                "",
                "And I didn't want to keep pretending that I don't.",
              ]}
              onComplete={handleTypingComplete}
              speed={44}
            />
            {typingDone && <ContinueButton onClick={() => goTo("confession")} />}
          </SectionWrapper>
        );

      case "confession":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>💌</SectionOrnament>
            <TypingText
              lines={[
                "So I'll just say it simply…",
                "",
                "I like you.",
                "",
                "More than just a friend.",
              ]}
              onComplete={handleTypingComplete}
              speed={50}
              lineDelay={1000}
            />
            {typingDone && (
              <p
                className="mt-8 text-5xl md:text-6xl heart-beat"
                style={{ filter: "drop-shadow(0 0 16px hsl(340 80% 60%))" }}
              >
                ❤️
              </p>
            )}
            {typingDone && <ContinueButton onClick={() => goTo("respectful")} />}
          </SectionWrapper>
        );

      case "respectful":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>🕊️</SectionOrnament>
            <TypingText
              lines={[
                "I don't know how you feel…",
                "And I don't want to assume anything.",
                "",
                "I just wanted to be honest about mine.",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("soft-ending")} />}
          </SectionWrapper>
        );

      case "soft-ending":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>🌙</SectionOrnament>
            <TypingText
              lines={[
                "You don't have to say anything right now.",
                "",
                "If you feel something, you can tell me.",
                "If not… that's completely okay too.",
                "",
                "I'll still respect you the same.",
                "",
                "And truly…",
                "I wish you the happiest birthday ❤️",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && <ContinueButton onClick={() => goTo("final")} />}
          </SectionWrapper>
        );

      case "final":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>✨</SectionOrnament>
            <TypingText
              lines={[
                "I don't know what your answer will be…",
                "But I just wanted to ask…",
                "",
                "If someday we were in a relationship…",
                `I think I'd love to call you '${HER_NICKNAME}' ❤️`,
                "",
                `Once again… happiest birthday, my dear ${HER_NICKNAME} 🎂💖`,
                "",
                "Will you make me the happiest person? 💖",
              ]}
              onComplete={handleTypingComplete}
              speed={44}
            />
            {typingDone && (
              <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up">
                <Button variant="confession" size="lg" onClick={() => handleResponse("yes")}>
                  Yes 💖
                </Button>
                <Button variant="romantic" size="lg" onClick={() => handleResponse("time")}>
                  I need time 😊
                </Button>
              </div>
            )}
          </SectionWrapper>
        );

      case "response":
        return (
          <SectionWrapper key={sectionKey}>
            {response === "yes" ? (
              <div className="space-y-6 text-center">
                <p
                  className="text-7xl md:text-8xl heart-beat"
                  style={{ filter: "drop-shadow(0 0 20px hsl(340 80% 60%))" }}
                >
                  💖
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-primary text-glow-pink leading-snug">
                  You just made me the happiest person…
                </h2>
                <div className="space-y-2">
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 font-light tracking-wide">
                    I promise to always be honest with you,
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 font-light tracking-wide">
                    and to make sure you never regret this ❤️
                  </p>
                </div>
                <p
                  className="text-2xl sm:text-3xl font-script text-primary mt-8 text-glow-subtle"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  Happy Birthday, my dear {HER_NICKNAME} 🎂💖
                </p>

                {/* #3 — "From" Signature */}
                <Signature />

                {/* #4 — Replay button */}
                <ReplayButton onClick={handleReplay} />
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <p className="text-6xl" style={{ filter: "drop-shadow(0 0 12px hsl(45 80% 70%))" }}>
                  😊
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-foreground/90">
                  Take all the time you need…
                </h2>
                <div className="space-y-2">
                  <p className="text-base sm:text-lg md:text-xl text-foreground/70 font-light tracking-wide">
                    I'll be right here, the same as always.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/70 font-light tracking-wide">
                    No pressure, no rush. Just honesty.
                  </p>
                </div>
                <p
                  className="text-2xl sm:text-3xl font-script text-primary mt-8 text-glow-subtle"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  Happy Birthday, {HER_NICKNAME} 🎂❤️
                </p>

                {/* #3 — "From" Signature */}
                <Signature />

                {/* #4 — Replay button */}
                <ReplayButton onClick={handleReplay} />
              </div>
            )}
          </SectionWrapper>
        );
    }
  };

  return (
    <>
      {/* #2 + #7 — Splash / Loading Screen */}
      {showSplash && <SplashScreen onEnter={handleSplashEnter} />}

      <div className="min-h-screen bg-romantic-gradient relative overflow-hidden">
        {/* Background aurora orbs */}
        <div
          className="fixed pointer-events-none z-0"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 40% at 20% 20%, hsl(280 70% 35% / 0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 80% 80%, hsl(330 75% 40% / 0.1) 0%, transparent 70%)",
          }}
        />

        <MusicPlayer ref={musicRef} />
        <FloatingHearts />
        <Sparkles />
        <Confetti active={showConfetti} />
        <ProgressDots current={section} />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-4 py-16 sm:py-20">
          {renderSection()}
        </div>
      </div>
    </>
  );
};

// ── Section wrapper with glassmorphism card ──────────────
const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-xl w-full mx-auto text-center glass-card rounded-2xl sm:rounded-3xl px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 section-enter">
    {children}
  </div>
);

// ── Small decorative emoji ornament ─────────────────────
const SectionOrnament = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-3xl sm:text-4xl mb-6 sm:mb-8"
    style={{ filter: "drop-shadow(0 0 10px hsl(330 80% 65% / 0.6))" }}
  >
    {children}
  </p>
);

// ── Continue button ──────────────────────────────────────
const ContinueButton = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-10 sm:mt-12 animate-fade-in-up">
    <Button variant="romantic" onClick={onClick}>
      Continue…
    </Button>
  </div>
);

// ── #3 — "From" Signature ───────────────────────────────
const Signature = () => (
  <div className="mt-10 pt-6 border-t border-foreground/10 animate-fade-in-up">
    <p className="text-xs uppercase tracking-[0.3em] text-foreground/30 mb-2">
      with love,
    </p>
    <p className="signature-text text-3xl sm:text-4xl">{YOUR_NAME}</p>
  </div>
);

// ── #4 — Replay Button ──────────────────────────────────
const ReplayButton = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-8 animate-fade-in-up">
    <button
      onClick={onClick}
      className="text-xs uppercase tracking-[0.25em] text-foreground/30 hover:text-foreground/60 transition-colors duration-300 font-body"
    >
      ↻ experience again
    </button>
  </div>
);

export default Index;
