import { useState, useCallback, useRef } from 'react';
import { sendToGrace, GateError } from '../utils/claudeService';
import { classifyRisk } from '../utils/safetyClassifier';
import { trackMessage, trackFeature } from '../utils/analytics';

export function useChat({ onEmergency, speak, voiceResponse, accessToken, anonId, onGateTriggered }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 50);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;

      // 1. Classify risk
      const riskLevel = classifyRisk(text);

      // 2. If emergency, trigger the emergency modal
      if (riskLevel === 'emergency' && onEmergency) {
        onEmergency();
      }

      // 3. Track the message
      trackMessage(text, riskLevel);

      // 4. Add user message to state
      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        riskLevel,
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      scrollToBottom();

      try {
        // Build history for API
        const history = messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

        // 5. Call Edge Function (passes auth token or anon ID)
        // System prompt is built server-side from SOUL + SKILLS + user context
        const reply = await sendToGrace(history, text, null, {
          accessToken,
          anonId,
        });

        // 6. Add AI response
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          riskLevel: 'safe',
        };

        setMessages((prev) => [...prev, aiMsg]);
        scrollToBottom();

        // 7. Speak if voice enabled
        if (voiceResponse && speak) {
          speak(reply);
        }
      } catch (err) {
        // Freemium gate — show blurred placeholder + signup prompt
        if (err instanceof GateError) {
          const gatedMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: 'Grace has a thoughtful response ready for you...',
            time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            riskLevel: 'safe',
            blurred: true,
          };
          setMessages((prev) => [...prev, gatedMsg]);
          scrollToBottom();
          if (onGateTriggered) onGateTriggered();
          return;
        }

        // Friendly error messages — never show raw errors
        const isNetwork = err.message === 'Failed to fetch' || !navigator.onLine;
        const isRateLimit = err.message === 'rate_limited';
        let errorText;
        if (isNetwork) {
          errorText = "I'm having trouble connecting. Please check your internet.";
        } else if (isRateLimit) {
          errorText = "You're chatting quite a bit! Please wait a moment and try again.";
        } else {
          errorText = 'Something went wrong. Please try again in a moment.';
        }

        const errorMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: errorText,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          riskLevel: 'safe',
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
        scrollToBottom();
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, onEmergency, speak, voiceResponse, scrollToBottom, accessToken, anonId, onGateTriggered]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    trackFeature('chat_cleared');
  }, []);

  return { messages, loading, sendMessage, clearChat, scrollRef };
}
