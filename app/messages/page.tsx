"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Edit, Paperclip, Search, Send, User, Users, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getConversations, getConversation, sendMessage } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { Conversation, Message } from "@/lib/types"
import { toast } from "sonner"

interface DisplayConversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  isOfficial: boolean
  online: boolean
}

const mockConversations: DisplayConversation[] = [
  { id: "1", name: "Mumbai Municipal Corporation", avatar: "/placeholder.svg", lastMessage: "Your water bill payment has been received.", time: "10:30 AM", unread: 0, isOfficial: true, online: true },
  { id: "2", name: "Priya Sharma", avatar: "/placeholder.svg", lastMessage: "Are you attending the meeting tomorrow?", time: "Yesterday", unread: 2, isOfficial: false, online: true },
  { id: "3", name: "Digital Literacy Program", avatar: "/placeholder.svg", lastMessage: "Classes start next week.", time: "Yesterday", unread: 1, isOfficial: true, online: false },
  { id: "4", name: "Amit Patel", avatar: "/placeholder.svg", lastMessage: "Thanks for sharing!", time: "2 days ago", unread: 0, isOfficial: false, online: false },
]

const mockMessages: { id: string; sender: string; content: string; time: string; isUser: boolean }[] = [
  { id: "1", sender: "Municipal Corporation", content: "Hello, regarding your recent water bill.", time: "10:15 AM", isUser: false },
  { id: "2", sender: "You", content: "Hi, yes I've been waiting for details.", time: "10:18 AM", isUser: true },
  { id: "3", sender: "Municipal Corporation", content: "Your bill for May is ₹1,250.", time: "10:20 AM", isUser: false },
  { id: "4", sender: "You", content: "Thank you. I'll pay today.", time: "10:22 AM", isUser: true },
  { id: "5", sender: "Municipal Corporation", content: "Payment received. Thank you!", time: "10:30 AM", isUser: false },
]

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<DisplayConversation[]>([])
  const [messages, setMessages] = useState<typeof mockMessages>([])
  const [activeConversation, setActiveConversation] = useState<DisplayConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = useCallback(async () => {
    if (!isLoggedIn) {
      setConversations(mockConversations)
      setActiveConversation(mockConversations[0])
      setMessages(mockMessages)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const token = getToken()
    if (!token) {
      setConversations(mockConversations)
      setActiveConversation(mockConversations[0])
      setMessages(mockMessages)
      setIsLoading(false)
      return
    }
    try {
      const fetchedConversations = await getConversations(token)
      if (fetchedConversations.length > 0) {
        const displayConvs = fetchedConversations.map(conv => ({
          id: conv.id,
          name: conv.user2?.name || "Unknown",
          avatar: conv.user2?.avatar || "/placeholder.svg",
          lastMessage: conv.messages?.[0]?.content || "No messages yet",
          time: conv.messages?.[0]?.createdAt ? formatMessageTime(conv.messages[0].createdAt) : "",
          unread: 0,
          isOfficial: conv.user2?.role === "official",
          online: false,
        }))
        setConversations(displayConvs)
        setActiveConversation(displayConvs[0])
      } else {
        setConversations(mockConversations)
        setActiveConversation(mockConversations[0])
      }
      setMessages(mockMessages)
    } catch {
      setConversations(mockConversations)
      setActiveConversation(mockConversations[0])
      setMessages(mockMessages)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn])

  const fetchMessages = useCallback(async (conversationId: string) => {
    const token = getToken()
    if (!token) return
    try {
      const fetchedMessages = await getConversation(conversationId, token)
      if (fetchedMessages.length > 0) {
        setMessages(fetchedMessages.map(msg => ({
          id: msg.id,
          sender: msg.senderId === user?.id ? "You" : msg.sender?.name || "Unknown",
          content: msg.content,
          time: formatMessageTime(msg.createdAt),
          isUser: msg.senderId === user?.id,
        })))
      }
    } catch {
      // Keep mock messages on error
    }
  }, [user?.id])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return
    if (!isLoggedIn) {
      toast.error("Please login to send messages")
      return
    }
    const token = getToken()
    if (!token) return
    setIsSending(true)
    try {
      await sendMessage(activeConversation.id, messageText, token)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "You",
        content: messageText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isUser: true,
      }])
      setMessageText("")
      toast.success("Message sent!")
    } catch {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="flex gap-6">
            <div className="w-80">
              <Skeleton className="h-10 w-full mb-4" />
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full mb-2" />)}
            </div>
            <div className="flex-1"><Skeleton className="h-96 w-full" /></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /><span>Back to Home</span>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view messages</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /><span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Conversations List */}
          <div className="w-full md:w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Messages</h1>
              <Button variant="ghost" size="icon"><Edit className="h-5 w-5" /></Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-9 border-purple-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Tabs defaultValue="all" className="w-full mb-4">
              <TabsList className="grid grid-cols-3 bg-purple-100 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">All</TabsTrigger>
                <TabsTrigger value="official" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Official</TabsTrigger>
                <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Personal</TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollArea className="flex-1 h-[calc(100vh-350px)]">
              <div className="space-y-2 pr-4">
                {filteredConversations.map(conversation => (
                  <div key={conversation.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${activeConversation?.id === conversation.id ? "bg-purple-100" : "hover:bg-gray-100"}`} onClick={() => { setActiveConversation(conversation); fetchMessages(conversation.id) }}>
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar><AvatarImage src={conversation.avatar} /><AvatarFallback className={conversation.isOfficial ? "bg-blue-500" : "bg-green-500"}>{conversation.name[0]}</AvatarFallback></Avatar>
                        {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="font-medium truncate">{conversation.name}</p>
                            {conversation.isOfficial && <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-600 border-blue-200">Official</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">{conversation.time}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && <Badge className="bg-purple-600">{conversation.unread}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"><Users className="h-4 w-4 mr-2" />New Conversation</Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            <Card className="h-[calc(100vh-150px)] flex flex-col border-purple-100">
              {activeConversation ? (
                <>
                  <CardHeader className="border-b py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3"><AvatarImage src={activeConversation.avatar} /><AvatarFallback className={activeConversation.isOfficial ? "bg-blue-500" : "bg-green-500"}>{activeConversation.name[0]}</AvatarFallback></Avatar>
                        <div>
                          <CardTitle className="text-lg flex items-center">{activeConversation.name}{activeConversation.isOfficial && <Badge variant="outline" className="ml-2 text-xs">Official</Badge>}</CardTitle>
                          <p className="text-xs text-gray-500">{activeConversation.online ? "Online" : "Offline"}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(message => (
                        <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${message.isUser ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100"}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <CardContent className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                      <Input placeholder="Type a message..." className="border-purple-200" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage() }} />
                      <Button size="icon" className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={handleSendMessage} disabled={!messageText.trim() || isSending}>
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start messaging</div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
