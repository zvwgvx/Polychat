import { motion } from 'framer-motion';
import { MessageSquare, Zap, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Lightning-fast responses with real-time streaming',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your conversations are encrypted and private',
  },
  {
    icon: Sparkles,
    title: 'Smart & Helpful',
    description: 'Advanced AI to assist with any task',
  },
];

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
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl blur-2xl opacity-30" />
              <div className="relative bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-3xl shadow-2xl">
                <MessageSquare className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent"
          >
            Welcome to Polychat
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto"
          >
            Your intelligent AI assistant, ready to help with anything you need.
            Start a conversation below or try one of the suggestions.
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-accent-300 hover:shadow-lg transition-all duration-300 hover-lift"
            >
              <div className="bg-gradient-to-br from-accent-100 to-accent-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-sm font-semibold text-neutral-700 mb-3 text-center">
            Try asking:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSuggestionClick(suggestion)}
                className="text-left px-4 py-3 bg-neutral-50 hover:bg-accent-50 border border-neutral-200 hover:border-accent-300 rounded-lg text-sm text-neutral-700 hover:text-accent-700 transition-all duration-200 font-medium"
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
