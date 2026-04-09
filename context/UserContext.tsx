"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "lovemenu-user";
const ADMIN_STORAGE_KEY = "lovemenu-admin-user";

const getStorageKeyByPath = (pathname: string | null) =>
  pathname?.startsWith("/admin") ? ADMIN_STORAGE_KEY : USER_STORAGE_KEY;

const getStorageKeyByUser = (
  targetUser: User | null,
  pathname: string | null
) => {
  if (targetUser?.role === "admin") return ADMIN_STORAGE_KEY;
  if (targetUser) return USER_STORAGE_KEY;
  return getStorageKeyByPath(pathname);
};

const clearUserStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
};

const isPublicPath = (pathname: string | null) => {
  if (!pathname) return false;
  return pathname === "/login" || pathname === "/403";
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSetUser = useCallback(
    (newUser: User | null) => {
      setUser(newUser);
      const storageKey = getStorageKeyByUser(newUser, pathname);

      if (newUser) {
        localStorage.setItem(storageKey, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(storageKey);
      }
    },
    [pathname]
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });

      if (res.status === 401) {
        clearUserStorage();
        setUser(null);
        if (!isPublicPath(pathname)) {
          router.replace("/login");
        }
        return;
      }

      if (!res.ok) {
        throw new Error("获取当前用户失败");
      }

      const json = await res.json();
      const latestUser = (json.data ?? json.user ?? null) as User | null;

      if (!latestUser) {
        clearUserStorage();
        setUser(null);
        if (!isPublicPath(pathname)) {
          router.replace("/login");
        }
        return;
      }

      handleSetUser(latestUser);

      if (pathname?.startsWith("/admin") && latestUser.role !== "admin") {
        router.replace("/403");
      }
    } catch (error) {
      console.error("Failed to refresh current user", error);
    }
  }, [handleSetUser, pathname, router]);

  useEffect(() => {
    const storageKey = getStorageKeyByPath(pathname);
    const storedUser = localStorage.getItem(storageKey);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    } else {
      setUser(null);
      setIsLoading(true);
    }

    void refreshUser().finally(() => {
      setIsLoading(false);
    });
  }, [pathname, refreshUser]);

  const logout = useCallback(() => {
    setUser(null);
    clearUserStorage();
    localStorage.removeItem("lovemenu-token");
    router.replace("/login");
  }, [router]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        setUser: handleSetUser,
        refreshUser,
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
