import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="pt-4 pb-6 px-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-[#40414F] rounded-2xl shadow-lg border border-[#565869]">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="w-full px-4 py-4 pr-12 bg-transparent text-[#ECECF1] placeholder:text-[#8E8EA0] outline-none resize-none rounded-2xl"
              rows={1}
              disabled={isLoading}
              style={{ maxHeight: '200px' }}
            />

            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="p-2 rounded-lg bg-[#565869] hover:bg-[#6E6E80] text-white transition-colors duration-150"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className={`p-2 rounded-lg transition-all duration-150 ${
                    message.trim()
                      ? 'bg-[#ECECF1] hover:bg-white text-[#343541]'
                      : 'bg-[#565869] text-[#8E8EA0] cursor-not-allowed opacity-40'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8E8EA0]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border-2 border-[#8E8EA0] border-t-transparent rounded-full"
              />
              <span>Generating...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
