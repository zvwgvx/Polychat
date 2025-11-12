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
      className={`flex gap-4 px-6 py-6 border-b border-dark-700 ${
        isUser ? 'bg-dark-800' : 'bg-dark-850'
      }`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-dark-600 text-gray-300'
              : 'bg-dark-700 text-gray-300'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-200 text-sm">
            {isUser ? 'You' : 'Assistant'}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          {isUser ? (
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap m-0">
              {message.content}
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              className="text-gray-200 leading-relaxed"
              components={{
                // Custom code block styling
                code({ node, inline, className, children, ...props }: any) {
                  return !inline ? (
                    <div className="relative group">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children));
                          }}
                          className="text-xs bg-dark-600 hover:bg-dark-500 text-gray-300 px-2 py-1 rounded transition-colors"
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
                      className="text-accent-400 hover:text-accent-300 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  );
                },
                p({ node, children, ...props }) {
                  return (
                    <p className="mb-4 last:mb-0" {...props}>
                      {children}
                    </p>
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
              className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 rounded-sm"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
