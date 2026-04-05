import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoice(language = 'en-US') {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Check browser support
  const isSupported = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  // Initialize recognition once
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, language]);

  const startListening = useCallback((onTranscript) => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slower for seniors
    utterance.lang = language;

    // Prefer a warm female voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes('Samantha') || v.name.includes('Karen')
    );
    const fallback = voices.find((v) => v.lang.startsWith('en') && v.localService);
    utterance.voice = preferred || fallback || null;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synthRef.current.speak(utterance);
  }, [language]);

  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeaking(false);
  }, []);

  return {
    listening,
    speaking,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    isSupported,
  };
}
