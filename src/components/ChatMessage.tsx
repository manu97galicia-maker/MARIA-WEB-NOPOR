"use client";

import VoiceMessage from "./VoiceMessage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Check if content contains payment links (URLs)
  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        urlRegex.lastIndex = 0;
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 underline break-all hover:text-pink-700"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md"
            : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
        } px-4 py-2.5`}
      >
        {!isUser && message.audioUrl && (
          <div className="mb-2">
            <VoiceMessage audioUrl={message.audioUrl} />
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {renderContent(message.content)}
        </p>
        <p
          className={`text-[10px] mt-1 ${
            isUser ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
