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
    <div className="border-t border-neutral-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 outline-none resize-none transition-all duration-200 bg-white text-neutral-900 placeholder:text-neutral-400"
                rows={1}
                disabled={isLoading}
                style={{ maxHeight: '200px' }}
              />

              {message.trim() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 bottom-3"
                >
                  <span className="text-xs text-neutral-400">
                    {message.length}
                  </span>
                </motion.div>
              )}
            </div>

            {isLoading ? (
              <motion.button
                type="button"
                onClick={onStop}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <StopCircle className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={!message.trim() || isLoading}
                whileHover={{ scale: message.trim() ? 1.05 : 1 }}
                whileTap={{ scale: message.trim() ? 0.95 : 1 }}
                className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                  message.trim()
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {isLoading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border-2 border-accent-500 border-t-transparent rounded-full"
                />
                Generating response...
              </motion.span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
