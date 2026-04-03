import { useState, useEffect } from "react";

interface TypingTextProps {
  lines: string[];
  onComplete?: () => void;
  speed?: number;
  lineDelay?: number;
  className?: string;
}

const TypingText = ({ lines, onComplete, speed = 40, lineDelay = 600, className = "" }: TypingTextProps) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    if (currentChar < lines[currentLine].length) {
      const timer = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, lines[currentLine]]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, lines, speed, lineDelay, onComplete]);

  return (
    <div className={`space-y-4 ${className}`}>
      {displayedLines.map((line, i) =>
        line === "" ? (
          <div key={i} className="h-2" />
        ) : (
          <p
            key={i}
            className="text-foreground/90 text-lg md:text-xl font-light leading-relaxed tracking-wide"
            style={{
              animation: "fade-in-up 0.5s ease-out both",
            }}
          >
            {line}
          </p>
        )
      )}
      {currentLine < lines.length && (
        lines[currentLine] === "" ? (
          <div className="h-2" />
        ) : (
          <p className="text-foreground/90 text-lg md:text-xl font-light leading-relaxed tracking-wide">
            {lines[currentLine].substring(0, currentChar)}
            {isTyping && (
              <span
                className="inline-block ml-0.5 align-middle"
                style={{
                  width: "2px",
                  height: "1.1em",
                  background: "linear-gradient(180deg, hsl(330 80% 70%), hsl(280 65% 65%))",
                  borderRadius: "1px",
                  boxShadow: "0 0 6px hsl(330 80% 65%)",
                  animation: "typing-cursor 1s infinite",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
            )}
          </p>
        )
      )}
    </div>
  );
};

export default TypingText;
