"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  getConnections,
  connectWithUser,
  disconnectFromUser,
} from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

interface ConnectionContextType {
  // Set of user IDs that the current user is connected to
  connectedUserIds: Set<string>;
  // Check if a user is connected
  isConnected: (userId: string) => boolean;
  // Connect with a user - updates global state
  connect: (userId: string, userName?: string) => Promise<boolean>;
  // Disconnect from a user - updates global state
  disconnect: (userId: string, userName?: string) => Promise<boolean>;
  // Check if a connection operation is in progress for a user
  isConnecting: (userId: string) => boolean;
  // Refresh connections from server
  refreshConnections: () => Promise<void>;
  // Loading state
  isLoading: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

interface ConnectionProviderProps {
  readonly children: ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [connectedUserIds, setConnectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [connectingUserIds, setConnectingUserIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  // Fetch connections from server
  const refreshConnections = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setConnectedUserIds(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const connections = await getConnections(token);
      setConnectedUserIds(new Set(connections.map((u) => u.id)));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch connections when user logs in
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      refreshConnections();
    } else if (!authLoading && !isLoggedIn) {
      // Clear connections when logged out
      setConnectedUserIds(new Set());
    }
  }, [authLoading, isLoggedIn, refreshConnections]);

  // Check if connected to a user
  const isConnected = useCallback(
    (userId: string) => connectedUserIds.has(userId),
    [connectedUserIds]
  );

  // Check if connecting to a user
  const isConnecting = useCallback(
    (userId: string) => connectingUserIds.has(userId),
    [connectingUserIds]
  );

  // Connect with a user
  const connect = useCallback(
    async (userId: string, userName?: string): Promise<boolean> => {
      const token = getToken();
      if (!token) {
        toast.error("Please login to connect");
        return false;
      }

      setConnectingUserIds((prev) => new Set([...prev, userId]));

      try {
        await connectWithUser(userId, token);
        // Update local state immediately
        setConnectedUserIds((prev) => new Set([...prev, userId]));
        toast.success(userName ? `Connected with ${userName}` : "Connected!");
        return true;
      } catch (error) {
        console.error("Failed to connect:", error);
        toast.error("Failed to connect");
        return false;
      } finally {
        setConnectingUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    []
  );

  // Disconnect from a user
  const disconnect = useCallback(
    async (userId: string, userName?: string): Promise<boolean> => {
      const token = getToken();
      if (!token) {
        toast.error("Please login to manage connections");
        return false;
      }

      setConnectingUserIds((prev) => new Set([...prev, userId]));

      try {
        await disconnectFromUser(userId, token);
        // Update local state immediately
        setConnectedUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        toast.success(
          userName ? `Disconnected from ${userName}` : "Disconnected"
        );
        return true;
      } catch (error) {
        console.error("Failed to disconnect:", error);
        toast.error("Failed to disconnect");
        return false;
      } finally {
        setConnectingUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      connectedUserIds,
      isConnected,
      connect,
      disconnect,
      isConnecting,
      refreshConnections,
      isLoading,
    }),
    [
      connectedUserIds,
      isConnected,
      connect,
      disconnect,
      isConnecting,
      refreshConnections,
      isLoading,
    ]
  );

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
}
