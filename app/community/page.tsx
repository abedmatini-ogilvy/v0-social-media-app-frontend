"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Search,
  UserPlus,
  UserCheck,
  Users,
  Shield,
  Loader2,
  Filter,
} from "lucide-react";
import { getSuggestedConnections, getConnections } from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import { useAuth } from "@/components/auth-provider";
import { useConnections } from "@/components/connection-provider";
import type { User } from "@/lib/types";
import { toast } from "sonner";

export default function CommunityPage() {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discover");
  const { isLoggedIn, isLoading: authLoading, user: currentUser } = useAuth();
  // Use global connection context for synced state
  const { isConnected, connect, disconnect, isConnecting } = useConnections();

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const [suggested, myConnections] = await Promise.all([
        getSuggestedConnections(token).catch(() => []),
        getConnections(token).catch(() => []),
      ]);

      setSuggestedUsers(suggested);
      setConnections(myConnections);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load community data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const handleConnect = async (userId: string, userName: string) => {
    // Use global connection context for synced state
    await connect(userId, userName);
  };

  const handleDisconnect = async (userId: string, userName: string) => {
    // Use global connection context for synced state
    await disconnect(userId, userName);
  };

  // Filter users based on search
  const filterUsers = (users: User[]) => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.occupation?.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query)
    );
  };

  const filteredSuggested = filterUsers(suggestedUsers);
  const filteredConnections = filterUsers(connections);

  const renderUserCard = (user: User) => {
    const userIsConnected = isConnected(user.id);
    const userIsConnecting = isConnecting(user.id);
    const isSelf = currentUser?.id === user.id;

    return (
      <Card
        key={user.id}
        className="border-purple-100 hover:shadow-md transition-shadow"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${user.id}`}>
              <Avatar className="h-14 w-14 cursor-pointer hover:opacity-80">
                <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg">
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
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {user.occupation}
                </p>
              )}
              {user.location && (
                <p className="text-xs text-gray-500 truncate">
                  {user.location}
                </p>
              )}
              {user.bio && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {!isSelf && (
            <div className="flex gap-2 mt-4">
              {userIsConnected ? (
                <>
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
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={() => handleDisconnect(user.id, user.name)}
                    disabled={userIsConnecting}
                  >
                    {userIsConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Connected
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleConnect(user.id, user.name)}
                  disabled={userIsConnecting}
                >
                  {userIsConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-1" />
                  )}
                  Connect
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
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
            <h1 className="text-2xl font-bold mb-2">Community</h1>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Connect with citizens, government officials, and community
              members. Please login to browse and connect.
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
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-gray-500 mt-1">
              Discover and connect with people
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search people..."
                className="pl-9 w-64 border-purple-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-purple-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="discover"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Discover ({suggestedUsers.length})
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700"
            >
              <Users className="h-4 w-4 mr-2" />
              My Connections ({connections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border-purple-100">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSuggested.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                {searchQuery ? (
                  <>
                    <h2 className="text-xl font-medium mb-2">
                      No people found
                    </h2>
                    <p className="text-gray-500">
                      No people match "{searchQuery}"
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-medium mb-2">
                      No suggestions available
                    </h2>
                    <p className="text-gray-500">
                      Check back later for new people to connect with
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuggested.map(renderUserCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="connections">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-purple-100">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-full mt-4" />
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
                    <h2 className="text-xl font-medium mb-2">
                      No connections yet
                    </h2>
                    <p className="text-gray-500 mb-4">
                      Start connecting with people in the Discover tab
                    </p>
                    <Button
                      onClick={() => setActiveTab("discover")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Discover People
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConnections.map(renderUserCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
