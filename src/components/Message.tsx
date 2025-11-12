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
      className="flex gap-4 px-6 py-6 border-b"
      style={{
        backgroundColor: isUser ? '#343541' : '#444654',
        borderColor: '#565869'
      }}
    >
      <div className="flex-shrink-0">
        <div
          className="w-7 h-7 rounded-sm flex items-center justify-center"
          style={{
            backgroundColor: isUser ? '#5B5D6B' : '#19C37D',
            color: 'white'
          }}
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
          <span className="font-medium text-sm" style={{ color: '#ECECF1' }}>
            {isUser ? 'You' : 'Assistant'}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap m-0" style={{ color: '#ECECF1' }}>
              {message.content}
            </p>
          ) : (
            <div style={{ color: '#ECECF1' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                className="leading-relaxed"
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
                          className="text-xs px-2 py-1 rounded transition-colors"
                          style={{
                            backgroundColor: '#565869',
                            color: '#ECECF1'
                          }}
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
                      className="underline transition-colors"
                      style={{ color: '#6EA8FE' }}
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
            </div>
          )}

          {message.isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block w-1.5 h-4 ml-0.5 rounded-sm"
              style={{ backgroundColor: '#8E8EA0' }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
