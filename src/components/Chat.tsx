"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const CHARACTER_NAME = process.env.NEXT_PUBLIC_CHARACTER_NAME || "Maria";
const TELEGRAM_LINK = "https://t.me/mariahot66";

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
  const [lang, setLang] = useState("es");
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
      telegramLink: string | null,
      prices: string | null,
      showPrices: boolean
    ) => {
      for (let i = 0; i < textMessages.length; i++) {
        setIsTyping(true);
        const delay = i === 0 ? 2000 : 1500;
        await new Promise((r) => setTimeout(r, delay));
        setIsTyping(false);

        const msg: Message = {
          id: generateId(),
          role: "assistant",
          content: textMessages[i],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);
      }

      // Show prices if available
      if (showPrices && prices) {
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsTyping(false);
        const priceMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: prices,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, priceMsg]);
      }

      // Always show Telegram button after response
      if (telegramLink) {
        await new Promise((r) => setTimeout(r, 1000));
        const tgMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: `__TELEGRAM_BUTTON__`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, tgMsg]);
      }
    },
    []
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const isFirst = !chatStarted;
    setChatStarted(true);

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setIsTyping(true);
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang,
          isFirstMessage: isFirst,
          senderName: userName || "",
        }),
      });

      if (!resp.ok) throw new Error("API error");

      const data = await resp.json();
      setIsTyping(false);

      if (data.lang) setLang(data.lang);

      await addAssistantMessages(
        data.messages,
        data.telegramLink,
        data.prices || null,
        data.showPrices || false
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

  const renderMessage = (msg: Message) => {
    // Telegram button special message
    if (msg.content === "__TELEGRAM_BUTTON__") {
      return (
        <div key={msg.id} className="flex justify-start mb-3">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#26A5E4] text-white px-5 py-3 rounded-2xl rounded-bl-md text-sm font-semibold hover:bg-[#1e96d1] transition-all shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            {lang === "en" ? `Chat with ${CHARACTER_NAME} on Telegram` : `Hablar con ${CHARACTER_NAME} en Telegram`}
          </a>
        </div>
      );
    }

    return <ChatMessage key={msg.id} message={msg} />;
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
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-[#26A5E4] text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#1e96d1] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </a>
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
            <p className="text-sm text-gray-500 mb-4 max-w-xs">
              {lang === "en"
                ? `Ask me about prices or chat with me on Telegram 😘`
                : `Preguntame por precios o hablame por Telegram 😘`}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setInput(lang === "en" ? "What are your prices?" : "Cuanto cuestas?");
                  inputRef.current?.focus();
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
              >
                {lang === "en" ? "See prices 💰" : "Ver precios 💰"}
              </button>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#26A5E4] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1e96d1] transition-all shadow-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {lang === "en" ? "Chat on Telegram" : "Hablar por Telegram"}
              </a>
            </div>
          </div>
        )}

        {messages.map((msg) => renderMessage(msg))}

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
              lang === "en"
                ? "Ask about prices..."
                : "Pregunta por precios..."
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
