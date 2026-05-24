import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
  fadeOut: () => void;
  switchTo: (url: string, slowFade?: boolean) => void;
}

// All songs preloaded at module level so they are buffered before any section starts
const SONG_URLS = [
  "/Music/Tum Hi Ho Aashiqui 2 128 Kbps.mp3",
  "/Music/Eye.mp3",
  "/Music/Urike Urike (mp3cut.net).mp3",
  "/Music/krishna.mp3",
  "/Music/Ottesi cheputhunna.mp4",
  "/Music/Magadhera.mp3",
  "/Music/Smile.mp4",
  "/Music/I need time.mp3",
  "/Music/Nee Chitram Choosi - SenSongsM3.Com (mp3cut.net).mp3",
  "/Music/Last.m4a",
  "/Music/No Song.mp4",
  "/Music/Promise.m4a",
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
  const crossfadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getTargetVolume = (url: string) =>
    url.includes("Tum") ? 0.35 : 0.8;

  useEffect(() => {
    // Set default song volume ready for play
    audioPool[DEFAULT_SONG].volume = 0;
    return () => {
      // Pause all on unmount
      Object.values(audioPool).forEach((a) => a.pause());
      if (crossfadeRef.current) clearInterval(crossfadeRef.current);
    };
  }, []);

  // Expose play(), pause(), fadeOut() and switchTo() to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      const current = audioPool[currentUrlRef.current];
      if (!current) return;
      const target = getTargetVolume(currentUrlRef.current);
      current.play().catch(() => {});
      // Quick fade in from 0
      const fadeIn = setInterval(() => {
        if (current.volume < target - 0.05) {
          current.volume = Math.min(target, current.volume + 0.05);
        } else {
          current.volume = target;
          clearInterval(fadeIn);
        }
      }, 40);
      setPlaying(true);
    },
    pause: () => {
      const current = audioPool[currentUrlRef.current];
      if (!current) return;
      current.pause();
      setPlaying(false);
    },
    fadeOut: () => {
      const current = audioPool[currentUrlRef.current];
      if (!current) return;
      const fade = setInterval(() => {
        if (current.volume > 0.05) {
          current.volume = Math.max(0, current.volume - 0.05);
        } else {
          current.volume = 0;
          current.pause();
          clearInterval(fade);
        }
      }, 40);
      setPlaying(false);
    },
    switchTo: (url: string, slowFade: boolean = false) => {
      const oldUrl = currentUrlRef.current;

      // Clear any existing crossfade
      if (crossfadeRef.current) {
        clearInterval(crossfadeRef.current);
        crossfadeRef.current = null;
      }
      
      // Prevent restarting the song if it's already the current one
      if (oldUrl === url) {
        const current = audioPool[url];
        if (current) {
          current.play().catch(() => {});
          current.volume = getTargetVolume(url);
          setPlaying(true);
        }
        return;
      }

      const old = audioPool[oldUrl];
      const newAudio = audioPool[url];
      if (!old || !newAudio) return;

      const targetVolume = getTargetVolume(url);

      // Start new song immediately (already buffered) at volume 0
      newAudio.currentTime = 0;
      newAudio.volume = 0;
      newAudio.play().catch(() => {});
      currentUrlRef.current = url;

      // FASTER crossfade — even "slow" fade is now reasonable
      const step = slowFade ? 0.04 : 0.08;
      const intervalTime = slowFade ? 50 : 30;

      // Crossfade: fade out old & fade in new simultaneously
      crossfadeRef.current = setInterval(() => {
        let oldDone = false;
        let newDone = false;

        // Fade out old
        if (old.volume > step) {
          old.volume = Math.max(0, old.volume - step);
        } else {
          old.volume = 0;
          old.pause();
          oldDone = true;
        }

        // Fade in new
        if (newAudio.volume < targetVolume - step) {
          newAudio.volume = Math.min(targetVolume, newAudio.volume + step);
        } else {
          newAudio.volume = targetVolume;
          newDone = true;
        }

        if (oldDone && newDone) {
          if (crossfadeRef.current) {
            clearInterval(crossfadeRef.current);
            crossfadeRef.current = null;
          }
        }
      }, intervalTime);

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

  return null;
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
