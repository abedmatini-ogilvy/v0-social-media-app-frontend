"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Search,
  UserMinus,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { getConnections } from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import { useAuth } from "@/components/auth-provider";
import { useConnections } from "@/components/connection-provider";
import type { User } from "@/lib/types";
import { toast } from "sonner";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<User[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  // Use global connection context for synced state
  const { disconnect, isConnecting } = useConnections();

  const fetchConnections = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getConnections(token);
      setConnections(data);
      setFilteredConnections(data);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
      toast.error("Failed to load connections");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchConnections();
    }
  }, [authLoading, fetchConnections]);

  // Filter connections based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConnections(connections);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredConnections(
        connections.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.occupation?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, connections]);

  const handleDisconnect = async (userId: string, userName: string) => {
    // Use global connection context for synced state
    const success = await disconnect(userId, userName);
    if (success) {
      // Update local list
      setConnections((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Show login prompt if not logged in
  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="flex items-center text-purple-700 hover:text-purple-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col items-center justify-center py-20">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">My Connections</h1>
            <p className="text-gray-500 mb-6">
              Please login to view your connections
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 hover:text-purple-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Connections</h1>
            <p className="text-gray-500 mt-1">
              {connections.length} connection
              {connections.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search connections..."
                className="pl-9 w-64 border-purple-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Link href="/community">Find People</Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            {searchQuery ? (
              <>
                <h2 className="text-xl font-medium mb-2">
                  No connections found
                </h2>
                <p className="text-gray-500">
                  No connections match "{searchQuery}"
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium mb-2">No connections yet</h2>
                <p className="text-gray-500 mb-6">
                  Start connecting with people in the community
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Link href="/community">Browse Community</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((user) => (
              <Card
                key={user.id}
                className="border-purple-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${user.id}`}>
                      <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80">
                        <AvatarImage
                          src={user.avatar || "/placeholder-user.jpg"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {user.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/profile/${user.id}`}
                          className="font-medium hover:underline truncate"
                        >
                          {user.name}
                        </Link>
                        {user.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {user.role === "official" ? (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Official
                          </Badge>
                        ) : user.role === "admin" ? (
                          <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                            Admin
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-500">Citizen</span>
                        )}
                      </div>
                      {user.occupation && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {user.occupation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                      asChild
                    >
                      <Link href={`/messages?user=${user.id}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDisconnect(user.id, user.name)}
                      disabled={isConnecting(user.id)}
                    >
                      {isConnecting(user.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserMinus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
