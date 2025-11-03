import { useState, useRef, useEffect } from "react";
import { Avatar } from "@polychat/ui";
import { ModelSelectorCompact } from "./ModelSelectorCompact";
import type { Message, AIModel } from "@polychat/types";

interface ChatWindowProps {
  model: AIModel;
  availableModels: AIModel[];
  onModelChange: (model: AIModel) => void;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  model,
  availableModels,
  onModelChange,
  initialMessages = [],
  onMessagesChange
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Call onMessagesChange when messages change
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model.id,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.id || crypto.randomUUID(),
        role: "assistant",
        content: data.message.content,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#212121]">
      {messages.length === 0 ? (
        /* Empty State - Centered Input */
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl space-y-6">
            {/* Welcome Message */}
            <div className="text-center mb-8 space-y-4">
              <div className="inline-block">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            <h2 className="text-3xl font-bold text-gray-100">
                How can I help you today?
              </h2>
            </div>

            {/* Centered Input */}
            <div>
              <div className="bg-[#2f2f2f] border border-gray-700 rounded-3xl shadow-2xl focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-600/50 transition-all">
                <div className="px-4 pt-4">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Message Polychat..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full resize-none outline-none text-base placeholder-gray-500 max-h-40 overflow-y-auto bg-transparent text-white"
                    style={{
                      minHeight: "24px",
                      height: "auto"
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "24px";
                      target.style.height = target.scrollHeight + "px";
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between px-2 pb-2 pt-2">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 disabled:opacity-50"
                      disabled={isLoading}
                      title="Attach file"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 disabled:opacity-50"
                      disabled={isLoading}
                      title="Add image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <ModelSelectorCompact
                      models={availableModels}
                      selectedModel={model}
                      onModelChange={onModelChange}
                      disabled={isLoading}
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={`
                        p-2 rounded-lg transition-all
                        ${!inputValue.trim() || isLoading
                          ? "bg-white/10 text-gray-500 cursor-not-allowed"
                          : "bg-white text-black hover:bg-gray-100"
                        }
                      `}
                      title="Send message (Enter)"
                    >
                      {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      ) : (
        /* Messages View */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>
                  </div>
                )}

                <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#2f2f2f] text-white"
                        : "bg-[#2f2f2f] text-gray-100 border border-gray-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 mt-1 px-2">
                    {new Date(message.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                      U
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
              </div>
              <div className="bg-[#2f2f2f] border border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Bottom fixed */}
          <div className="p-4 bg-[#212121] border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          {/* Input Container */}
          <div className="bg-[#2f2f2f] border border-gray-700 rounded-3xl shadow-lg focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-600/50 transition-all">
            {/* Textarea */}
            <div className="px-4 pt-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message Polychat..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none outline-none text-base placeholder-gray-500 max-h-40 overflow-y-auto bg-transparent text-white"
                style={{
                  minHeight: "24px",
                  height: "auto"
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "24px";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </div>

            {/* Bottom Bar - Tools and Actions */}
            <div className="flex items-center justify-between px-2 pb-2 pt-2">
              {/* Left side - Tool icons */}
              <div className="flex items-center gap-1">
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 disabled:opacity-50"
                  disabled={isLoading}
                  title="Attach file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 disabled:opacity-50"
                  disabled={isLoading}
                  title="Add image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Right side - Model selector, Character count and Send button */}
              <div className="flex items-center gap-2">
                {/* Model Selector */}
                <ModelSelectorCompact
                  models={availableModels}
                  selectedModel={model}
                  onModelChange={onModelChange}
                  disabled={isLoading}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`
                    p-2 rounded-lg transition-all
                    ${!inputValue.trim() || isLoading
                      ? "bg-white/10 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-100"
                    }
                  `}
                  title="Send message (Enter)"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
