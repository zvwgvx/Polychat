import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { User, Bot } from 'lucide-react';
import type { Message as MessageType } from '../store/chatStore';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-4 px-6 py-8 ${
        isUser ? 'bg-white' : 'bg-neutral-50'
      } border-b border-neutral-100`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white'
              : 'bg-gradient-to-br from-neutral-700 to-neutral-800 text-white'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-neutral-900">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-neutral-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="prose prose-neutral max-w-none">
          {isUser ? (
            <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              className="text-neutral-800 leading-relaxed"
              components={{
                // Custom code block styling
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div className="relative group">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children));
                          }}
                          className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className={className}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                // Custom link styling
                a({ node, children, ...props }) {
                  return (
                    <a
                      {...props}
                      className="text-accent-600 hover:text-accent-700 underline decoration-accent-300 hover:decoration-accent-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}

          {message.isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-accent-500 ml-1"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
