import { motion } from 'framer-motion';
import { MessageSquare, Trash2, Github, Settings } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export function Header({ onClearChat, messageCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-accent-500 to-accent-600 p-2.5 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                Polychat
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Modern AI Assistant
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {messageCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearChat}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors duration-200 text-sm font-medium"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors duration-200"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
