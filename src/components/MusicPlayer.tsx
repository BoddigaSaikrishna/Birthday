import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
  switchTo: (url: string) => void;
}

// All songs preloaded at module level so they are buffered before any section starts
const SONG_URLS = [
  "/Music/Tum Hi Ho Aashiqui 2 128 Kbps.mp3",
  "/Music/Eye.mp3",
  "/Music/Urike Urike (mp3cut.net).mp3",
  "/Music/Krishna.mp4",
  "/Music/Ottesi cheputhunna.mp4",
  "/Music/Magadhera.mp3",
  "/Music/Smile.mp4",
  "/Music/I need time.mp3",
];

// Create & preload every audio element immediately
const audioPool: Record<string, HTMLAudioElement> = {};
SONG_URLS.forEach((url) => {
  const a = new Audio(url);
  a.preload = "auto";
  a.loop = true;
  a.volume = 0;
  audioPool[url] = a;
});

const DEFAULT_SONG = "/Music/Tum Hi Ho Aashiqui 2 128 Kbps.mp3";

const MusicPlayer = forwardRef<MusicPlayerRef>((_props, ref) => {
  const [playing, setPlaying] = useState(false);
  const currentUrlRef = useRef<string>(DEFAULT_SONG);

  const getTargetVolume = (url: string) =>
    url.includes("Tum") ? 0.35 : 0.8;

  useEffect(() => {
    // Set default song volume ready for play
    audioPool[DEFAULT_SONG].volume = 0;
    return () => {
      // Pause all on unmount
      Object.values(audioPool).forEach((a) => a.pause());
    };
  }, []);

  // Expose play(), pause(), and switchTo() to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      const current = audioPool[currentUrlRef.current];
      if (!current) return;
      const target = getTargetVolume(currentUrlRef.current);
      current.play().catch(() => {});
      // Fade in from 0
      const fadeIn = setInterval(() => {
        if (current.volume < target - 0.03) {
          current.volume = Math.min(target, current.volume + 0.03);
        } else {
          current.volume = target;
          clearInterval(fadeIn);
        }
      }, 80);
      setPlaying(true);
    },
    pause: () => {
      const current = audioPool[currentUrlRef.current];
      if (!current) return;
      current.pause();
      setPlaying(false);
    },
    switchTo: (url: string) => {
      const oldUrl = currentUrlRef.current;
      const old = audioPool[oldUrl];
      const newAudio = audioPool[url];
      if (!old || !newAudio) return;

      const targetVolume = getTargetVolume(url);

      // Start new song immediately (already buffered) at volume 0
      newAudio.currentTime = 0;
      newAudio.volume = 0;
      newAudio.play().catch(() => {});
      currentUrlRef.current = url;

      // Crossfade: fade out old & fade in new simultaneously
      const crossfade = setInterval(() => {
        let oldDone = false;
        let newDone = false;

        // Fade out old
        if (old.volume > 0.03) {
          old.volume = Math.max(0, old.volume - 0.05);
        } else {
          old.volume = 0;
          old.pause();
          oldDone = true;
        }

        // Fade in new
        if (newAudio.volume < targetVolume - 0.05) {
          newAudio.volume = Math.min(targetVolume, newAudio.volume + 0.05);
        } else {
          newAudio.volume = targetVolume;
          newDone = true;
        }

        if (oldDone && newDone) {
          clearInterval(crossfade);
        }
      }, 60);

      setPlaying(true);
    },
  }));

  const toggle = () => {
    const current = audioPool[currentUrlRef.current];
    if (!current) return;
    if (playing) {
      current.pause();
    } else {
      current.play().catch(() => {});
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
