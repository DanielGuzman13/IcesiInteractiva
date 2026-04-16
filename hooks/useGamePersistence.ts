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
          console.log('User data from /api/auth/me:', data);
          if (data.user?.id) {
            setUserId(data.user.id);
            console.log('UserId set:', data.user.id);
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
    console.log('createGameSession called, userId:', userId);
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
      console.log('Session created:', data);
      if (data.session) {
        setSessionId(data.session.id);
        console.log('SessionId set:', data.session.id);
        return data.session.id;
      }
    } catch (error) {
      console.error('Error creating game session:', error);
    }
    return null;
  }, [userId]);

  const saveAnswer = useCallback(async (challengeId: string, answer: any, isCorrect: boolean, score: number) => {
    console.log('saveAnswer called:', { challengeId, userId, sessionId, score });
    if (!userId) {
      console.warn('Cannot save answer: userId not available', { userId });
      return;
    }

    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          challengeId,
          playStepId: sessionId || null, // Allow null for open-ended questions
          answer,
          isCorrect,
          responseTime: 0,
          attempts: 1,
          score,
        }),
      });

      if (!response.ok) {
        console.error('Answer save failed:', response.status);
      } else {
        console.log('Answer saved successfully');
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
