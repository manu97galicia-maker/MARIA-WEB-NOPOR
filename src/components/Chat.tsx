"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const CHARACTER_NAME = process.env.NEXT_PUBLIC_CHARACTER_NAME || "Maria";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface ChatProps {
  userName?: string;
}

export default function Chat({ userName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => generateId());
  const [lang, setLang] = useState("es");
  const [messageCount, setMessageCount] = useState(0);
  const [paymentNudgeCount, setPaymentNudgeCount] = useState(0);
  const [paymentVerified] = useState(false);
  const [isEroticMode] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [voiceCount, setVoiceCount] = useState(0);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addAssistantMessages = useCallback(
    async (
      textMessages: string[],
      sendVoice: boolean,
      typingSeconds: number,
      paymentLinks: string | null
    ) => {
      for (let i = 0; i < textMessages.length; i++) {
        // Show typing indicator
        setIsTyping(true);
        const delay = i === 0 ? typingSeconds * 1000 : (1 + Math.random() * 2) * 1000;
        await new Promise((r) => setTimeout(r, Math.min(delay, 5000)));
        setIsTyping(false);

        let audioUrl: string | undefined;

        // Generate voice for the first message if requested
        if (sendVoice && i === 0 && voiceCount < 4) {
          try {
            const voiceResp = await fetch("/api/voice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: textMessages[i], lang }),
            });
            if (voiceResp.ok) {
              const audioBlob = await voiceResp.blob();
              audioUrl = URL.createObjectURL(audioBlob);
              setVoiceCount((c) => c + 1);
            }
          } catch (e) {
            console.error("Voice error:", e);
          }
        }

        const msg: Message = {
          id: generateId(),
          role: "assistant",
          content: textMessages[i],
          audioUrl,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);
        setMessageCount((c) => c + 1);
      }

      // Payment links as separate message
      if (paymentLinks) {
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsTyping(false);
        const linkMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: paymentLinks,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, linkMsg]);
      }
    },
    [lang, voiceCount]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const isFirst = !chatStarted;
    setChatStarted(true);

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Build history for API
    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      setIsTyping(true);
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          history,
          lang,
          messageCount,
          paymentVerified,
          isEroticMode,
          isBlocked,
          paymentNudgeCount,
          voiceCount,
          isFirstMessage: isFirst,
          senderName: userName || "",
        }),
      });

      if (!resp.ok) throw new Error("API error");

      const data = await resp.json();
      setIsTyping(false);

      // Update lang if greeting detected it
      if (data.lang) setLang(data.lang);
      if (data.incrementNudge) setPaymentNudgeCount((c) => c + 1);
      if (data.action === "block_freeloader") setIsBlocked(true);

      await addAssistantMessages(
        data.messages,
        data.sendVoice,
        data.typingSeconds || 3,
        data.paymentLinks
      );
    } catch (error) {
      console.error("Send error:", error);
      setIsTyping(false);
      const errMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: lang === "en" ? "Oops, something went wrong. Try again!" : "Ups, algo fallo. Intentalo de nuevo!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[100dvh]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
            {CHARACTER_NAME[0]}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{CHARACTER_NAME}</h2>
          <p className="text-xs text-green-500">
            {isTyping
              ? lang === "en"
                ? "typing..."
                : "escribiendo..."
              : "online"}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {lang === "es" ? "🇪🇸 ES" : "🇬🇧 EN"}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-pink-50/50 to-gray-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
              {CHARACTER_NAME[0]}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {CHARACTER_NAME}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              {lang === "en"
                ? `Say hi to ${CHARACTER_NAME}! She's online and waiting for you 😘`
                : `Saluda a ${CHARACTER_NAME}! Esta online esperandote 😘`}
            </p>
            <button
              onClick={() => {
                setInput(lang === "en" ? "Hey!" : "Hola!");
                inputRef.current?.focus();
              }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
            >
              {lang === "en" ? "Say Hello 👋" : "Decir Hola 👋"}
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isBlocked
                ? lang === "en"
                  ? "Choose a plan to continue..."
                  : "Elige un plan para seguir..."
                : lang === "en"
                ? "Type a message..."
                : "Escribe un mensaje..."
            }
            disabled={isTyping}
            className="flex-1 bg-gray-100 rounded-full px-5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
