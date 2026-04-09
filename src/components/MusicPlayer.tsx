import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
  switchTo: (url: string) => void;
}

const MusicPlayer = forwardRef<MusicPlayerRef>((_props, ref) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/Music/Tum Hi Ho Aashiqui 2 128 Kbps.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Expose play(), pause(), and switchTo() to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current && !playing) {
        audioRef.current.play().catch(() => {});
        setPlaying(true);
      }
    },
    pause: () => {
      if (audioRef.current && playing) {
        audioRef.current.pause();
        setPlaying(false);
      }
    },
    switchTo: (url: string) => {
      const old = audioRef.current;
      if (!old) return;

      // Fade out current song
      const fadeOut = setInterval(() => {
        if (old.volume > 0.03) {
          old.volume = Math.max(0, old.volume - 0.03);
        } else {
          clearInterval(fadeOut);
          old.pause();

          // Start new song with fade-in
          const newAudio = new Audio(url);
          newAudio.loop = true;
          newAudio.volume = 0;
          newAudio.play().catch(() => {});
          audioRef.current = newAudio;

          // Target volumes — Tum Hi Ho is background (0.35), others are emotional peaks (0.8)
          const targetVolume = url.includes("Tum") ? 0.35 : 0.8;
          
          const fadeIn = setInterval(() => {
            if (newAudio.volume < targetVolume - 0.03) {
              newAudio.volume = Math.min(targetVolume, newAudio.volume + 0.03);
            } else {
              newAudio.volume = targetVolume;
              clearInterval(fadeIn);
            }
          }, 80);
        }
      }, 80);
    },
  }));

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-5 right-5 z-50"
      aria-label={playing ? "Mute music" : "Play music"}
      title={playing ? "Mute music" : "Play music"}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: 48, height: 48 }}
      >
        {/* Animated pulse rings when playing */}
        {playing && (
          <>
            <span
              className="absolute inset-0 rounded-full border border-pink-400/60"
              style={{ animation: "pulse-ring-anim 2.2s ease-out infinite" }}
            />
            <span
              className="absolute inset-0 rounded-full border border-purple-400/40"
              style={{ animation: "pulse-ring-anim 2.2s ease-out 0.9s infinite" }}
            />
          </>
        )}

        {/* Button face */}
        <span
          className="relative flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md transition-all duration-300"
          style={{
            background: playing
              ? "linear-gradient(135deg, hsl(330 70% 25% / 0.92) 0%, hsl(280 60% 18% / 0.88) 100%)"
              : "hsl(270 20% 12% / 0.85)",
            border: `1.5px solid ${playing ? "hsl(330 80% 55% / 0.6)" : "hsl(280 30% 30% / 0.5)"}`,
            boxShadow: playing
              ? "0 0 16px hsl(330 80% 60% / 0.5), 0 0 35px hsl(280 60% 50% / 0.25)"
              : "0 2px 12px hsl(0 0% 0% / 0.4)",
            fontSize: "18px",
          }}
        >
          {playing ? "🎵" : "🎶"}
        </span>
      </div>
    </button>
  );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
