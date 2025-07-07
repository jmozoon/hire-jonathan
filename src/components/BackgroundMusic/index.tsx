'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume?: number;
}

export default function BackgroundMusic({ isPlaying, volume = 0.1 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to create audio element with ambient music
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    
    // Set source and handle loading
    audio.src = '/ambient-music.mp3';
    
    const handleCanPlay = () => {
      console.log('Audio file loaded successfully');
      audioRef.current = audio;
      setIsLoaded(true);
    };

    const handleError = () => {
      console.log('Background music file not found, creating ambient tones');
      createAmbientTone();
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Try to load, fallback to tones if it fails
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (audioRef.current && audioRef.current.pause) {
        audioRef.current.pause();
      }
      audioRef.current = null;
    };
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.log('Audio play failed:', error);
          // Browser might require user interaction first
        });
      }
    } else if (audioRef.current.pause) {
      audioRef.current.pause();
    }
  }, [isPlaying, isLoaded]);

  const createAmbientTone = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      let isPlaying = false;
      let oscillators: OscillatorNode[] = [];
      let gainNode: GainNode;

      const startAmbientTones = async () => {
        if (isPlaying) return;
        
        try {
          // Ensure audio context is running
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          // Clear previous oscillators
          oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          oscillators = [];

          gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime); // Increased volume

          // Create multiple subtle tones for rich ambient sound
          const frequencies = [55, 82.5, 110, 165, 220]; // Low harmonics
          
          frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const oscGain = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            // Vary volume for each oscillator with higher base volume
            oscGain.gain.setValueAtTime(0.15 + (index * 0.08), audioContext.currentTime);
            
            // Add slight detuning for warmth
            oscillator.detune.setValueAtTime(Math.random() * 6 - 3, audioContext.currentTime);
            
            oscillator.connect(oscGain);
            oscGain.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillators.push(oscillator);
          });

          isPlaying = true;
          console.log('Ambient tones started successfully with', frequencies.length, 'oscillators');
        } catch (error) {
          console.error('Failed to start ambient tones:', error);
        }
      };

      const stopAmbientTones = () => {
        oscillators.forEach(osc => {
          try { 
            osc.stop(); 
          } catch (e) {}
        });
        oscillators = [];
        isPlaying = false;
        console.log('Ambient tones stopped');
      };

      // Store reference for control
      (audioRef.current as any) = {
        play: startAmbientTones,
        pause: stopAmbientTones,
        volume: volume
      };

      setIsLoaded(true);
      console.log('Ambient tone system initialized');

    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  };

  return null; // This component doesn't render anything visible
}