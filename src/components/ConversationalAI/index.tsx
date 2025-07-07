'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedOrb3D from '../AnimatedOrb3D';
import AtmosphericBackground from '../AtmosphericBackground';
import BackgroundMusic from '../BackgroundMusic';
import { useElevenLabsConversation } from '../../hooks/useElevenLabsConversation';

interface ConversationalAIProps {
  agentId: string;
  className?: string;
}

export default function ConversationalAI({ agentId, className = '' }: ConversationalAIProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    isConnected,
    isListening,
    isSpeaking,
    volume,
    transcript,
    error,
    orbState,
    startConversation,
    endConversation,
  } = useElevenLabsConversation({
    agentId,
    onError: (error) => console.error('ElevenLabs error:', error),
    onMessage: (message) => console.log('ElevenLabs message:', message),
  });

  const handleStartConversation = async () => {
    // Enable audio context on user interaction for both ElevenLabs and BackgroundMusic
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('Audio context resumed for conversation');
      }
    } catch (error) {
      console.error('Audio context setup failed:', error);
    }
    
    // Start conversation which will trigger background music
    await startConversation();
  };

  const handleEndConversation = async () => {
    await endConversation();
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Atmospheric Background */}
        <AtmosphericBackground state={orbState} />

        {/* Background Music */}
        <BackgroundMusic 
          isPlaying={isConnected} 
          volume={0.08} 
        />
        <div className="relative w-full h-full max-w-4xl max-h-4xl flex flex-col items-center justify-center p-8">

          {/* Error Display */}
          {error && (
            <motion.div
              className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </motion.div>
          )}

          {/* Main Orb */}
          <div className="relative flex items-center justify-center">
            <AnimatedOrb3D
              state={orbState}
              volume={volume}
              className={`mb-8 ${isMobile ? 'scale-75' : ''}`}
            />
          </div>

          {/* Control Panel */}
          <div className="flex flex-col items-center gap-4">
            <motion.button
              onClick={isConnected ? handleEndConversation : handleStartConversation}
              className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!agentId}
            >
              {isConnected ? 'End Conversation' : 'Start Conversation'}
            </motion.button>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-white/80">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              <span className="text-sm">
                {isConnected ? (
                  isSpeaking ? 'Speaking...' : 
                  isListening ? 'Listening...' : 'Connected'
                ) : 'Disconnected'}
              </span>
            </div>

            {/* Talk to Interrupt Button */}
            {isConnected && isSpeaking && (
              <motion.button
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Talk to interrupt
              </motion.button>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}