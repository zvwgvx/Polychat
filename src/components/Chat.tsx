import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { sendChatMessage } from '../services/api';
import { Header } from './Header';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

export function Chat() {
  const {
    messages,
    isLoading,
    error,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    clearMessages,
    setStreamingMessage,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    addMessage({
      role: 'user',
      content,
    });

    // Create assistant message placeholder
    const assistantMessage = {
      role: 'assistant' as const,
      content: '',
      isStreaming: true,
    };

    addMessage(assistantMessage);

    setLoading(true);
    setError(null);

    // Get the last message ID (the assistant message we just added)
    const assistantMessageId = crypto.randomUUID();
    setCurrentStreamingId(assistantMessageId);

    try {
      let fullResponse = '';

      await sendChatMessage(
        [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content },
        ],
        (chunk) => {
          fullResponse += chunk;
          // Update the last message with the streaming content
          const allMessages = useChatStore.getState().messages;
          const lastMessage = allMessages[allMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            updateMessage(lastMessage.id, fullResponse);
          }
        }
      );

      // Mark streaming as complete
      const allMessages = useChatStore.getState().messages;
      const lastMessage = allMessages[allMessages.length - 1];
      if (lastMessage) {
        setStreamingMessage(lastMessage.id, false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      // Remove the empty assistant message on error
      const allMessages = useChatStore.getState().messages;
      const lastMessage = allMessages[allMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
        // Just update with error info
        updateMessage(lastMessage.id, 'Sorry, I encountered an error processing your request.');
        setStreamingMessage(lastMessage.id, false);
      }
    } finally {
      setLoading(false);
      setCurrentStreamingId(null);
    }
  };

  const handleStop = () => {
    setLoading(false);
    if (currentStreamingId) {
      setStreamingMessage(currentStreamingId, false);
    }
    setCurrentStreamingId(null);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
      setError(null);
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#343541' }}>
      <Header onClearChat={handleClearChat} messageCount={messages.length} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSendMessage} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-4xl mx-auto px-6 py-4"
          >
            <div className="rounded-lg p-4 flex items-start gap-3 border" style={{ backgroundColor: '#442726', borderColor: '#6B3433' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F87171' }} />
              <div className="flex-1">
                <h4 className="font-semibold mb-1" style={{ color: '#FCA5A5' }}>Error</h4>
                <p className="text-sm" style={{ color: '#FECACA' }}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="transition-colors"
                style={{ color: '#F87171' }}
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        onStop={handleStop}
      />
    </div>
  );
}
