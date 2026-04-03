import { useState } from "react";

interface EnvelopeButtonProps {
  onClick: () => void;
}

const EnvelopeButton = ({ onClick }: EnvelopeButtonProps) => {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (opened) return;
    setOpened(true);
    // Let envelope open animation play, then navigate
    setTimeout(() => onClick(), 1200);
  };

  return (
    <div className="mt-12 animate-fade-in-up flex flex-col items-center gap-5">
      <button
        onClick={handleClick}
        className="envelope-wrapper group focus:outline-none"
        aria-label="Open the letter"
      >
        <div className={`envelope ${opened ? "open" : ""}`}>
          {/* Envelope body */}
          <div className="envelope-body" />

          {/* Letter inside */}
          <div className="envelope-letter">
            <div className="flex items-center justify-center h-full">
              <span style={{ fontSize: "10px", color: "hsl(330 60% 50%)" }}>♥</span>
            </div>
          </div>

          {/* Heart seal */}
          <div className="envelope-heart">💖</div>

          {/* Flap */}
          <div className="envelope-flap" />
        </div>
      </button>

      <p
        className="text-sm tracking-[0.2em] uppercase font-body"
        style={{
          color: opened ? "hsl(330 80% 70%)" : "hsl(330 40% 55%)",
          transition: "color 0.5s ease",
        }}
      >
        {opened ? "Opening…" : "Tap the envelope"}
      </p>
    </div>
  );
};

export default EnvelopeButton;
