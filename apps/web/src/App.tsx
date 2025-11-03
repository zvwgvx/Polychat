import { useState, useEffect } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { Sidebar } from "./components/Sidebar";
import { migrateSessions } from "./utils/migrateSessions";
import type { AIModel, ChatSession, Message } from "@polychat/types";

const availableModels: AIModel[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and efficient model"
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable model"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance"
  }
];

function App() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempSession, setTempSession] = useState<ChatSession | null>(null);

  // Get current session - check temp session first, then saved sessions
  const currentSession = tempSession && tempSession.id === currentSessionId 
    ? tempSession 
    : sessions.find((s) => s.id === currentSessionId);

  // Load sessions from localStorage on mount
  useEffect(() => {
    // Migrate old Vietnamese sessions to English
    migrateSessions();

    const savedSessions = localStorage.getItem("polychat-sessions");
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      // Convert date strings back to Date objects
      const sessionsWithDates = parsed.map((s: any) => ({
        ...s,
        title: s.title === "Chat mới" ? "New chat" : s.title, // Extra safety check
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
      setSessions(sessionsWithDates);

      // Set the most recent session as current
      if (sessionsWithDates.length > 0) {
        setCurrentSessionId(sessionsWithDates[0].id);
      }
    } else {
      // Create initial session
      const initialSession: ChatSession = {
        id: crypto.randomUUID(),
        title: "New chat",
        model: "gpt-3.5-turbo",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions([initialSession]);
      setCurrentSessionId(initialSession.id);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    // Only save actual sessions, not temporary ones
    if (sessions.length > 0) {
      localStorage.setItem("polychat-sessions", JSON.stringify(sessions));
    } else {
      // If no sessions, remove the localStorage entry
      localStorage.removeItem("polychat-sessions");
    }
  }, [sessions]);

  // Handle beforeunload to save temporary session if needed
  useEffect(() => {
    const handleBeforeUnload = () => {
      // If there's a temporary session with messages, save it to localStorage
      if (tempSession && tempSession.messages.length > 0) {
        setSessions(prev => [tempSession, ...prev]);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tempSession]);

  const createNewSession = () => {
    // Check if there's already an empty session (temp or saved)
    const emptySession = [...sessions, ...(tempSession ? [tempSession] : [])].find(session => session.messages.length === 0);
    
    // If there's already an empty session, switch to it
    if (emptySession) {
      setCurrentSessionId(emptySession.id);
      setSidebarOpen(false);
    } else {
      // Otherwise, create a temporary session that isn't saved to localStorage yet
      const newTempSession: ChatSession = {
        id: crypto.randomUUID(),
        title: "New chat",
        model: selectedModel.id,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTempSession(newTempSession);
      setCurrentSessionId(newTempSession.id);
      setSidebarOpen(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    // If trying to delete the temporary session
    if (tempSession && tempSession.id === sessionId) {
      setTempSession(null);
      
      // If deleting current session, switch to another one
      if (sessionId === currentSessionId) {
        if (sessions.length > 0) {
          setCurrentSessionId(sessions[0].id);
        } else {
          // No sessions left, create a new temporary one
          const newTempSession: ChatSession = {
            id: crypto.randomUUID(),
            title: "New chat",
            model: selectedModel.id,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setTempSession(newTempSession);
          setCurrentSessionId(newTempSession.id);
        }
      }
      return;
    }

    // Otherwise, delete from saved sessions
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);

      // If deleting current session, switch to another one
      if (sessionId === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          // No sessions left, create a new temporary one
          const newTempSession: ChatSession = {
            id: crypto.randomUUID(),
            title: "New chat",
            model: selectedModel.id,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setTempSession(newTempSession);
          setCurrentSessionId(newTempSession.id);
          return [];
        }
      }

      return filtered;
    });
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    // Check if this update is for a temporary session
    if (tempSession && tempSession.id === sessionId) {
      // Update the temporary session
      let updatedTitle = tempSession.title;
      
      // Auto-generate title from first user message
      if (updatedTitle === "New chat" && messages.length > 0) {
        const firstUserMessage = messages.find((m) => m.role === "user");
        if (firstUserMessage) {
          updatedTitle = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "");
        }
      }

      const updatedTempSession = {
        ...tempSession,
        messages,
        title: updatedTitle,
        updatedAt: new Date()
      };

      // If this is the first message, save the temporary session to the sessions list
      if (messages.length > 0 && tempSession.messages.length === 0) {
        setSessions((prev) => [updatedTempSession, ...prev]);
        setTempSession(null); // Remove the temp session since it's now saved
      } else {
        setTempSession(updatedTempSession); // Just update the temp session
      }
    } else {
      // Update a saved session
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === sessionId) {
            // Auto-generate title from first user message
            let title = session.title;
            if (title === "New chat" && messages.length > 0) {
              const firstUserMessage = messages.find((m) => m.role === "user");
              if (firstUserMessage) {
                title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "");
              }
            }

            return {
              ...session,
              messages,
              title,
              updatedAt: new Date()
            };
          }
          return session;
        })
      );
    }
  };

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            title: newTitle,
            updatedAt: new Date()
          };
        }
        return session;
      })
    );
  };

  const togglePinSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            isPinned: !session.isPinned,
            updatedAt: new Date()
          };
        }
        return session;
      })
    );
  };

  return (
    <div className="flex h-screen bg-[#212121]">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setSidebarOpen(false);
        }}
        onDeleteSession={deleteSession}
        onRenameSession={updateSessionTitle}
        onPinSession={togglePinSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#212121] border-b border-gray-800 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Title */}
            <h1 className="text-base font-semibold text-gray-300 truncate">
              {currentSession?.title || "Polychat"}
            </h1>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          {currentSession ? (
            <ChatWindow
              key={currentSession.id}
              model={selectedModel}
              availableModels={availableModels}
              onModelChange={setSelectedModel}
              initialMessages={currentSession.messages}
              onMessagesChange={(messages) =>
                updateSessionMessages(currentSession.id, messages)
              }
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 bg-[#212121]">
              <div className="text-center">
                <p className="text-lg mb-4">No conversations yet</p>
                <button
                  onClick={createNewSession}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
                >
                  Create new chat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;