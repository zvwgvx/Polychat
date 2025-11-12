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
    <div className="border-t border-dark-700 bg-dark-800">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="w-full px-4 py-3 rounded-lg border border-dark-600 focus:border-dark-500 outline-none resize-none transition-all duration-150 bg-dark-700 text-gray-100 placeholder:text-gray-500 shadow-sm"
                rows={1}
                disabled={isLoading}
                style={{ maxHeight: '200px' }}
              />
            </div>

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex-shrink-0 p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-150"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`flex-shrink-0 p-3 rounded-lg transition-all duration-150 ${
                  message.trim()
                    ? 'bg-accent-600 hover:bg-accent-500 text-white'
                    : 'bg-dark-600 text-gray-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>

          {isLoading && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full"
              />
              <span>Generating response...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
