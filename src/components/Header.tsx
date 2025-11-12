import { Trash2, Github, Settings } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export function Header({ onClearChat, messageCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-100">
              Polychat
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {messageCount > 0 && (
              <button
                onClick={onClearChat}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors duration-150 text-sm"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}

            <button
              className="p-2 rounded-md hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors duration-150"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors duration-150"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
