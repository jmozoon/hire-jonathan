'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useState } from 'react';

type OrbState = 'idle' | 'listening' | 'speaking';

interface ConversationState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  volume: number;
  transcript: string;
  error: string | null;
  mode: OrbState;
}

interface UseElevenLabsConversationProps {
  agentId: string;
  onError?: (error: string) => void;
  onMessage?: (message: string) => void;
}

export function useElevenLabsConversation({ 
  agentId, 
  onError, 
  onMessage 
}: UseElevenLabsConversationProps) {
  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    volume: 0,
    transcript: '',
    error: null,
    mode: 'idle'
  });

  const handleConnect = useCallback(() => {
    setState(prev => ({ ...prev, isConnected: true, error: null }));
  }, []);

  const handleDisconnect = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isListening: false,
      isSpeaking: false,
      mode: 'idle'
    }));
  }, []);

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'transcript') {
      setState(prev => ({ ...prev, transcript: message.text }));
      onMessage?.(message.text);
    }
  }, [onMessage]);

  const handleError = useCallback((error: any) => {
    const errorMessage = error?.message || 'An error occurred';
    setState(prev => ({ ...prev, error: errorMessage }));
    onError?.(errorMessage);
  }, [onError]);

  const handleModeChange = useCallback((mode: any) => {
    setState(prev => ({ 
      ...prev, 
      mode: mode.mode || 'idle',
      isListening: mode.mode === 'listening',
      isSpeaking: mode.mode === 'speaking'
    }));
  }, []);

  const handleVolumeChange = useCallback((volume: any) => {
    setState(prev => ({ ...prev, volume: volume.volume || 0 }));
  }, []);

  const conversation = useConversation({
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onMessage: handleMessage,
    onError: handleError,
  });

  const startConversation = useCallback(async () => {
    try {
      await conversation.startSession({ agentId });
    } catch (error) {
      handleError(error);
    }
  }, [conversation, agentId, handleError]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      handleError(error);
    }
  }, [conversation, handleError]);

  const getOrbState = useCallback((): OrbState => {
    if (conversation.isSpeaking) return 'speaking';
    if (state.isListening) return 'listening';
    return 'idle';
  }, [conversation.isSpeaking, state.isListening]);

  return {
    ...state,
    isConnected: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    conversation,
    startConversation,
    endConversation,
    orbState: getOrbState(),
  };
}