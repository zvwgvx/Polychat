import { Trash2, Github, Settings } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export function Header({ onClearChat, messageCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b" style={{ backgroundColor: '#343541', borderColor: '#565869' }}>
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold" style={{ color: '#ECECF1' }}>
              Polychat
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {messageCount > 0 && (
              <button
                onClick={onClearChat}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[#40414F] transition-colors duration-150 text-sm"
                style={{ color: '#8E8EA0' }}
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}

            <button
              className="p-2 rounded-md hover:bg-[#40414F] transition-colors duration-150"
              style={{ color: '#8E8EA0' }}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-[#40414F] transition-colors duration-150"
              style={{ color: '#8E8EA0' }}
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
