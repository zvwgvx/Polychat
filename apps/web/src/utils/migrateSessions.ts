// Migrate old Vietnamese sessions to English
export const migrateSessions = () => {
  const savedSessions = localStorage.getItem("polychat-sessions");

  if (savedSessions) {
    try {
      const sessions = JSON.parse(savedSessions);

      // Migrate Vietnamese titles to English
      const migratedSessions = sessions.map((session: any) => ({
        ...session,
        title: session.title === "Chat mới" ? "New chat" : session.title
      }));

      // Save back to localStorage
      localStorage.setItem("polychat-sessions", JSON.stringify(migratedSessions));

      console.log("Sessions migrated to English");
      return migratedSessions;
    } catch (error) {
      console.error("Error migrating sessions:", error);
      return null;
    }
  }

  return null;
};
