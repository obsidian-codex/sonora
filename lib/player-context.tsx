'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface ActiveTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl: string;
  albumTitle?: string;
  albumSlug?: string;
}

interface AudioPlayerContextType {
  activeTrack: ActiveTrack | null;
  isPlaying: boolean;
  progress: number; // percentage 0 - 100
  currentTime: number; // seconds
  duration: number; // seconds
  playTrack: (track: ActiveTrack) => void;
  togglePlay: () => void;
  pauseTrack: () => void;
  seekTo: (fraction: number) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const onError = (e: any) => {
      console.warn('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const playTrack = useCallback((track: ActiveTrack) => {
    if (!audioRef.current || !track.previewUrl) return;

    if (activeTrack?.id === track.id) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    setActiveTrack(track);
    audioRef.current.src = track.previewUrl;
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
  }, [activeTrack]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !activeTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, activeTrack]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seekTo = useCallback((fraction: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const target = fraction * audioRef.current.duration;
    audioRef.current.currentTime = target;
  }, []);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveTrack(null);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        activeTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        playTrack,
        togglePlay,
        pauseTrack,
        seekTo,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return ctx;
}

