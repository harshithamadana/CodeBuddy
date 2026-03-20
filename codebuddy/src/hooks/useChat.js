import { useState, useCallback, useRef, useEffect } from "react";
import { subjects } from "../config/subjects";

const MODE_LABELS = { hint: "Guide", explain: "Deep Dive", debug: "Debug" };

export function useChat() {
  const [messages,      setMessages]      = useState([]);
  const [isLoading,     setIsLoading]     = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [mode,          setMode]          = useState("hint");
  const [sessionEvents, setSessionEvents] = useState([]);

  // For retry
  const lastFailedRef = useRef(null);

  // Track previous values to detect changes
  const prevSubjectRef = useRef(null);
  const prevModeRef    = useRef(null);

  // Session event: subject change
  useEffect(() => {
    if (prevSubjectRef.current && prevSubjectRef.current.id !== selectedSubject?.id) {
      setSessionEvents(prev => [...prev, {
        id:    Date.now(),
        type:  "subject",
        label: selectedSubject?.label || "Unknown",
        time:  Date.now(),
      }]);
    }
    prevSubjectRef.current = selectedSubject;
  }, [selectedSubject]);

  // Session event: mode change
  useEffect(() => {
    if (prevModeRef.current !== null && prevModeRef.current !== mode) {
      setSessionEvents(prev => [...prev, {
        id:    Date.now(),
        type:  "mode",
        label: MODE_LABELS[mode] || mode,
        time:  Date.now(),
      }]);
    }
    prevModeRef.current = mode;
  }, [mode]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const trimmedText = text.trim();
    const userMessage = { id: Date.now(), text: trimmedText, sender: "user" };

    const currentMessages = messages;
    const currentSubject  = selectedSubject;
    const currentMode     = mode;

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    lastFailedRef.current = null;

    // Session event: question asked
    setSessionEvents(prev => [...prev, {
      id:    Date.now(),
      type:  "question",
      label: trimmedText.length > 40 ? trimmedText.slice(0, 40) + "…" : trimmedText,
      time:  Date.now(),
    }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:  trimmedText,
          messages: currentMessages.slice(-10),
          subject:  currentSubject,
          mode:     currentMode,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Server error");
      }

      const data      = await res.json();
      const aiMessage = { id: Date.now() + 1, text: data.reply, sender: "ai" };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      lastFailedRef.current = { text: trimmedText };
      setMessages(prev => [...prev, {
        id:      Date.now() + 1,
        text:    "I glitched for a moment — mind sending that again?",
        sender:  "ai",
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedSubject, mode, isLoading]);

  const sendWhyExplanation = useCallback(async (code) => {
    const prompt = `Why does this code work? Please explain it line by line in plain English without rewriting it:\n\n${code}`;
    await sendMessage(prompt);
  }, [sendMessage]);

  const retryLastMessage = useCallback(async () => {
    if (!lastFailedRef.current || isLoading) return;
    setMessages(prev => prev.filter(m => !m.isError));
    const { text } = lastFailedRef.current;
    lastFailedRef.current = null;
    await sendMessage(text);
  }, [sendMessage, isLoading]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSelectedSubject(subjects[0]);
    setMode("hint");
    setSessionEvents([]);
    lastFailedRef.current = null;
    prevModeRef.current   = "hint";
  }, []);

  return {
    messages,
    isLoading,
    selectedSubject,
    setSelectedSubject,
    mode,
    setMode,
    sessionEvents,
    sendMessage,
    sendWhyExplanation,
    retryLastMessage,
    resetConversation,
  };
}
