"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("lovemenu-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("lovemenu-user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("lovemenu-user");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("lovemenu-user");
    localStorage.removeItem("lovemenu-token");
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
