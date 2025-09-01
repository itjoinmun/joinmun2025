"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession, Session } from "../actions/session";

type AuthContextType = {
  user: Session | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSession = await getSession();
      setSession(fetchedSession);
    };

    fetchData();
  }, []);

  return <AuthContext.Provider value={{ user: session }}>{children}</AuthContext.Provider>;
}

// Custom hook for consuming the context
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
}
