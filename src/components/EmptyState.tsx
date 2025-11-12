import { motion } from 'framer-motion';

const suggestions = [
  'Explain quantum computing in simple terms',
  'Write a Python function to sort an array',
  'Help me plan a weekend trip',
  'Summarize the latest tech trends',
];

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold mb-3"
            style={{ color: '#ECECF1' }}
          >
            Polychat
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: '#8E8EA0' }}
          >
            How can I help you today?
          </motion.p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={() => onSuggestionClick(suggestion)}
                className="text-left px-4 py-3 rounded-lg text-sm transition-all duration-150 border"
                style={{
                  backgroundColor: '#40414F',
                  borderColor: '#565869',
                  color: '#ECECF1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4A4B57';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#40414F';
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
