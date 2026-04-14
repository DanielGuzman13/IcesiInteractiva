'use client';

import { useEffect, useState, useCallback } from 'react';

interface UserSession {
  id: string;
  userId: string;
  score: number;
}

export const useGamePersistence = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Obtener userId desde API (las cookies httpOnly no están disponibles en el cliente)
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok && mounted) {
          const data = await response.json();
          if (data.user?.id) {
            setUserId(data.user.id);
          }
        }
      } catch (error) {
        console.error('Error fetching user id:', error);
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    fetchUserId();

    return () => {
      mounted = false;
    };
  }, []);

  const createGameSession = useCallback(async (): Promise<string | null> => {
    if (!userId) {
      console.warn('Cannot create session: No userId available');
      return null;
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.error('Session creation failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (data.session) {
        setSessionId(data.session.id);
        return data.session.id;
      }
    } catch (error) {
      console.error('Error creating game session:', error);
    }
    return null;
  }, [userId]);

  const saveAnswer = useCallback(async (challengeId: string, answer: any, isCorrect: boolean, score: number) => {
    if (!userId || !sessionId) {
      console.warn('Cannot save answer: userId or sessionId not available');
      return;
    }

    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          challengeId,
          playStepId: sessionId,
          answer,
          isCorrect,
          responseTime: 0,
          attempts: 1,
          score,
        }),
      });

      if (!response.ok) {
        console.error('Answer save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  }, [userId, sessionId]);

  return {
    userId,
    sessionId,
    isInitialized,
    createGameSession,
    saveAnswer,
  };
};
