import { useState, useCallback, useEffect, useRef } from "react";
import TypingText from "@/components/TypingText";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import Confetti from "@/components/Confetti";
import MusicPlayer, { type MusicPlayerRef } from "@/components/MusicPlayer";
import SplashScreen from "@/components/SplashScreen";
import EnvelopeButton from "@/components/EnvelopeButton";
import Cake from "@/components/Cake";
import PetalRain from "@/components/PetalRain";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import ProposalScene from "@/components/ProposalScene";

type Section =
  | "opening"
  | "birthday"
  | "cake-cutting"
  | "honest-beginning"
  | "eye-contact"
  | "smile"
  | "thinking"
  | "prayer"
  | "feeling"
  | "i-like-you"
  | "confession"
  | "respectful"
  | "soft-ending"
  | "final"
  | "response"
  | "closing-note";

const HER_NAME = "Leela";
const HER_NICKNAME = "Leelu"; // ← used only on the final/response screens
const YOUR_NAME = "Sai Krishna"; // ← #3 your name for the signature

const SECTIONS: Section[] = [
  "opening",
  "birthday",
  "cake-cutting",
  "honest-beginning",
  "eye-contact",
  "smile",
  "thinking",
  "prayer",
  "feeling",
  "i-like-you",
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
  const [isReelOpen, setIsReelOpen] = useState(false);

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
    // Switch to Eye song during eye-contact section
    if (next === "eye-contact") {
      musicRef.current?.switchTo("/Music/Eye.mp3");
    }
    // Switch to Smile song for the smile section with automatic fade-in crossfade
    if (next === "smile") {
      musicRef.current?.switchTo("/Music/Smile.mp4");
    }
    // Switch to Urike Urike song after the smile section
    if (next === "thinking") {
      musicRef.current?.switchTo("/Music/Urike Urike (mp3cut.net).mp3");
    }
    // Fade out music when i-like-you starts — Propose.mp4 video audio takes over
    if (next === "i-like-you") {
      musicRef.current?.fadeOut();
    }
    // Switch to Krishna song when the deep confession starts, video audio ends
    if (next === "confession") {
      musicRef.current?.switchTo("/Music/Krishna.mp4");
    }
    // Switch to Panchadhara Bomma after the Krishna confession section
    if (next === "respectful") {
      musicRef.current?.switchTo("/Music/Magadhera.mp3");
    }
  };

  const handleResponse = (answer: string) => {
    track("Response_Selected", { answer: answer }); // 📊 Log to Vercel Analytics
    
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
    } else if (answer === "time") {
      // 🎵 Switch to "I need time.mp3" when she says I need time
      setTimeout(() => {
        musicRef.current?.switchTo("/Music/I need time.mp3");
      }, 600);
    }
  };

  const openReel = () => {
    musicRef.current?.pause();
    setIsReelOpen(true);
  };

  const closeReel = () => {
    setIsReelOpen(false);
    musicRef.current?.play();
  };

  // #4 — Replay
  const handleReplay = () => {
    setResponse(null);
    setTypingDone(false);
    setSection("opening");
    setSectionKey((k) => k + 1);
    
    // Reset music back to the starting song
    musicRef.current?.switchTo("/Music/Tum Hi Ho Aashiqui 2 128 Kbps.mp3");
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
                "When I look at you,",
                "I don't notice anything else.",
                "Not just your lovely face,",
                "Your soft hair,",
                "or your gentle hands.",
                "",
                "It's your eyes that hold me.",
                "They are so deep and beautiful",
                "that I lose myself in them",
                "Every single time. 🧿",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && (
              <div className="flex flex-col items-center gap-4 mt-6 animate-fade-in">
                <Button
                  onClick={openReel}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 py-6 text-lg font-medium backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  Watch this ✨
                </Button>
                <button
                  onClick={() => goTo("smile")}
                  className="text-white/60 hover:text-white/90 text-sm mt-2 transition-colors"
                >
                  Continue reading...
                </button>
              </div>
            )}
          </SectionWrapper>
        );

      case "smile":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>😊</SectionOrnament>
            <TypingText
              lines={[
                "Asalu aa navvu abbo…",
                "aa navvu entee sami! 😍",
                "",
                "Mana Rayalaseema faction ni kuda",
                "aapese power undi nee navvulo.",
                "",
                "Anta magic undi…",
                "nuvvu prathi sari navvinappudu",
                "nenu bayata silent ga untanu gani,",
                "",
                "na chitti gunde lopala chitukku mantadi telsa.. 💓",
                "chudu eppudu kuda aa navvuu 🥰✨",
              ]}
              onComplete={handleTypingComplete}
              speed={48}
              lineDelay={900}
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
                "but those moments stayed with me.",
                "",
                "If you asked me how many times",
                "you came to my mind,",
                "I would say only once...",
                "",
                "because you came and never left."
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
                "I read a quote once that said…",
                "",
                "\"When The One You Prayed For,",
                "Becomes The One You Prayed With.\" ✨❤️",
                "",
                "I might not be someone you mention in your stories…",
                "but in my own small way,",
                "I've prayed for your happiness",
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
            {typingDone && <ContinueButton onClick={() => goTo("i-like-you")} />}
          </SectionWrapper>
        );

      case "i-like-you":
        return (
          <>
            {/* 🎬 Cinematic Propose.mp4 background — only for this section */}
            <div className="fixed inset-0 pointer-events-none z-[1] animate-propose-fade-in">
              <video
                autoPlay
                loop
                playsInline
                src="/Music/Propose.mp4"
                className="absolute top-1/2 left-1/2"
                style={{
                  width: "100vh",
                  height: "100vw",
                  objectFit: "cover",
                  filter: "brightness(0.5) saturate(1.3)",
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                }}
                ref={(el) => {
                  if (el) {
                    el.volume = 1.0;
                    el.muted = false;
                  }
                }}
              />
              {/* Deep romantic overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: [
                    "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 15%, hsl(280 60% 4% / 0.6) 100%)",
                    "linear-gradient(to bottom, hsl(280 50% 4% / 0.65) 0%, transparent 25%, transparent 72%, hsl(280 50% 4% / 0.8) 100%)",
                  ].join(", "),
                }}
              />
              {/* Rose tint */}
              <div
                className="absolute inset-0"
                style={{ background: "hsl(330 70% 25% / 0.10)", mixBlendMode: "screen" }}
              />
            </div>

            {/* Content card — very transparent so video bleeds through */}
            <div
              key={sectionKey}
              className="confession-glass-card relative z-10 max-w-xl w-full mx-auto text-center rounded-2xl sm:rounded-3xl px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 section-enter"
            >
              <SectionOrnament>💗</SectionOrnament>
              <TypingText
                lines={[
                  "There are things I've kept to myself for a long time…",
                  "But today… I can't.",
                  "",
                  "So I'll just say it simply…",
                  "I like you.",
                  "I love you more than anyone.",
                  "",
                  "And I think you deserve to know that. ❤️",
                ]}
                onComplete={handleTypingComplete}
                speed={52}
                lineDelay={1100}
              />
              {typingDone && (
                <p
                  className="mt-8 text-5xl md:text-6xl heart-beat"
                  style={{ filter: "drop-shadow(0 0 20px hsl(340 85% 65%))" }}
                >
                  💖
                </p>
              )}
              {typingDone && <ContinueButton onClick={() => goTo("confession")} />}
            </div>
          </>
        );

      case "confession":
        return (
          <div className="relative w-full max-w-xl mx-auto flex items-center justify-center">
            <SectionWrapper key={sectionKey}>
              <SectionOrnament>💌</SectionOrnament>
            <TypingText
              lines={[
                "Nv Oppukunte...",
                "",
                "Mahabharathamlo Krishna, Radha ni vadulukovadaniki enno karanalu undavacchu...",
                "kani ee Krishna matram, ninnu vadulukovadaniki enni karanalu unna...",
                "ninnu eppatiki vadaladu.",
                "",
                "Ayana loka-kalyanam kosam Radhani vadulukunnademo...",
                "kani na kalyananiki (na jeevithaniki) matram nuvve mukhyam, Leela!",
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
            
            {/* The animation positioned on the right side of the box */}
            <ProposalScene className="absolute top-1/2 -translate-y-1/2 -right-[320px] md:-right-[420px] w-[240px] md:w-[350px] hidden lg:block" />
          </div>
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
                    I promise you I will be honest with you everytime
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 font-light tracking-wide">
                    and make sure you never regret this ❤️
                  </p>
                </div>
                <p
                  className="text-2xl sm:text-3xl font-script text-primary mt-8 text-glow-subtle"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  Happy Birthday, my dear {HER_NICKNAME} 🎂💖
                </p>

                <div className="mt-10 animate-fade-in-up">
                  <Button variant="romantic" onClick={() => goTo("closing-note")}>
                    One last thing... 💌
                  </Button>
                </div>
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

                <div className="mt-10 animate-fade-in-up">
                  <Button variant="romantic" onClick={() => goTo("closing-note")}>
                    One last thing... 💌
                  </Button>
                </div>
              </div>
            )}
          </SectionWrapper>
        );

      case "closing-note":
        return (
          <SectionWrapper key={sectionKey}>
            <SectionOrnament>💌</SectionOrnament>
            <TypingText
              lines={[
                "Neku nacchindani anukuntunnanu 🙂",
                "",
                "Idhi cheyadaniki koncham kastapadanu…",
                "kani kastam anipinchina kuda, istam tho chesa.",
                "",
                "Ee roju kosam last 1 and half months nunchi wait chesthunna…",
                "finally ee roju vacchesindhi.",
                "",
                "Manam koncham ekkuva matladithe…",
                "leda daily koncham conversation unte…",
                "maybe nenu gift ni inka different ga plan chesedani 🙂",
                "",
                "Kani ippudu naaku telisina best way lo chesa.",
                "",
                "Neku manchi experience ichaanani anukuntunnanu…",
                "kani nee honest opinion chepthe chala happy avutanu ❤️",
              ]}
              onComplete={handleTypingComplete}
              speed={42}
            />
            {typingDone && (
              <div className="mt-8 flex flex-col items-center">
                <Signature />
                <ReplayButton onClick={handleReplay} />
              </div>
            )}
          </SectionWrapper>
        );
    }
  };

  // Determine if petal rain should be active
  const activatePetals = [
    "feeling", "i-like-you", "confession", "respectful", "soft-ending", "final", "response", "closing-note"
  ].includes(section);

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
        <PetalRain active={activatePetals} />
        <ProgressDots current={section} />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-4 py-16 sm:py-20">
          {renderSection()}
        </div>

        {/* Video Reel Modal */}
        {isReelOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,90,150,0.15)] ring-1 ring-white/10 mx-4">
              <button
                onClick={closeReel}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all"
                aria-label="Close video"
              >
                ✕
              </button>
              <video
                ref={(el) => {
                  if (el) {
                    el.volume = 1.0;
                    el.muted = false;
                  }
                }}
                src="/Music/Reel.mp4"
                className="w-full h-full object-cover"
                autoPlay
                controls
                playsInline
                onEnded={closeReel}
              />
            </div>
          </div>
        )}
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
