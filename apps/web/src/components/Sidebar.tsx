import { useState, useRef, useEffect } from "react";
import type { ChatSession, AIModel } from "@polychat/types";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onPinSession: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onPinSession,
  isOpen,
  onToggle
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString("en-US");
  };

  // State để theo dõi menu nào đang mở
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
        setIsRenaming(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRename = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setRenameInput(session.title);
      setIsRenaming(sessionId);
    }
  };

  const confirmRename = (sessionId: string) => {
    if (renameInput.trim()) {
      onRenameSession(sessionId, renameInput.trim());
    }
    setIsRenaming(null);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#171717] text-white
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col border-r border-gray-800
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Polychat</h2>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-3 w-full px-1 py-2.5 rounded-lg text-left hover:bg-white/5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex-1">New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Pinned Sessions */}
          {sessions.filter(session => session.isPinned).length > 0 && (
            <>
              <div className="text-xs text-gray-500 px-2 py-2 font-medium uppercase tracking-wider">
                Pinned
              </div>
              <div className="space-y-1 px-1" ref={menuRef}>
                {sessions
                  .filter(session => session.isPinned)
                  .map((session) => (
                    <div
                      key={session.id}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
                        transition-all duration-200 ease-in-out
                        ${
                          currentSessionId === session.id
                            ? "bg-white/10 text-white"
                            : "hover:bg-white/5 text-gray-300"
                        }
                      `}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-all duration-200 flex-shrink-0">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0 min-h-0">
                        {isRenaming === session.id ? (
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onBlur={() => setIsRenaming(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') confirmRename(session.id);
                              if (e.key === 'Escape') setIsRenaming(null);
                            }}
                            className="w-full bg-transparent text-sm font-medium text-white focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm font-medium truncate">{session.title}</p>
                        )}
                        <p className="text-xs text-gray-500 truncate">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>

                      {/* More options button */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === session.id ? null : session.id);
                            setIsRenaming(null);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-200 flex items-center justify-center hover:bg-white/10"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>

                        {/* Menu */}
                        {openMenuId === session.id && (
                          <div className="absolute right-0 top-8 w-48 bg-[#2f2f2f] border border-gray-700 rounded-md shadow-lg z-50 py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPinSession(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-gray-300 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              Unpin
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-gray-300 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Other Sessions */}
          {sessions.filter(session => !session.isPinned).length > 0 && (
            <>
              <div className="text-xs text-gray-500 px-2 py-2 font-medium uppercase tracking-wider">
                {sessions.filter(session => session.isPinned).length > 0 ? 'OTHER CHATS' : 'CHAT HISTORY'}
              </div>
              <div className="space-y-1 px-1" ref={menuRef}>
                {sessions
                  .filter(session => !session.isPinned)
                  .map((session) => (
                    <div
                      key={session.id}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
                        transition-all duration-200 ease-in-out
                        ${
                          currentSessionId === session.id
                            ? "bg-white/10 text-white"
                            : "hover:bg-white/5 text-gray-300"
                        }
                      `}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-700/50 group-hover:bg-gray-600/50 transition-all duration-200 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0 min-h-0">
                        {isRenaming === session.id ? (
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onBlur={() => setIsRenaming(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') confirmRename(session.id);
                              if (e.key === 'Escape') setIsRenaming(null);
                            }}
                            className="w-full bg-transparent text-sm font-medium text-white focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm font-medium truncate">{session.title}</p>
                        )}
                        <p className="text-xs text-gray-500 truncate">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>

                      {/* More options button */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === session.id ? null : session.id);
                            setIsRenaming(null);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-200 flex items-center justify-center hover:bg-white/10"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>

                        {/* Menu */}
                        {openMenuId === session.id && (
                          <div className="absolute right-0 top-8 w-48 bg-[#2f2f2f] border border-gray-700 rounded-md shadow-lg z-50 py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPinSession(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-gray-300 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              Pin
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-gray-300 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {sessions.length === 0 && (
            <div className="text-sm text-gray-500 px-3 py-8 text-center">
              No conversations yet
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-500">Settings</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};