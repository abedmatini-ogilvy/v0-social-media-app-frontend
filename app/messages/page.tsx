"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Edit, Paperclip, Search, Send, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for conversations
const conversations = [
  {
    id: 1,
    name: "Mumbai Municipal Corporation",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your water bill payment has been received. Thank you!",
    time: "10:30 AM",
    unread: 0,
    isOfficial: true,
    online: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Are you attending the community meeting tomorrow?",
    time: "Yesterday",
    unread: 2,
    isOfficial: false,
    online: true,
  },
  {
    id: 3,
    name: "Digital Literacy Program",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your application has been approved. Classes start next week.",
    time: "Yesterday",
    unread: 1,
    isOfficial: true,
    online: false,
  },
  {
    id: 4,
    name: "Amit Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for sharing the information about the new scheme!",
    time: "2 days ago",
    unread: 0,
    isOfficial: false,
    online: false,
  },
  {
    id: 5,
    name: "Local Police Station",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We've received your complaint. An officer will contact you shortly.",
    time: "3 days ago",
    unread: 0,
    isOfficial: true,
    online: true,
  },
]

// Sample messages for a conversation
const messages = [
  {
    id: 1,
    sender: "Mumbai Municipal Corporation",
    content: "Hello Ravi, this is Mumbai Municipal Corporation. We're reaching out regarding your recent water bill.",
    time: "10:15 AM",
    isUser: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Hi, yes I've been waiting for my bill. Can you provide details?",
    time: "10:18 AM",
    isUser: true,
  },
  {
    id: 3,
    sender: "Mumbai Municipal Corporation",
    content: "Your water bill for May 2023 is ₹1,250. The due date is June 15, 2023.",
    time: "10:20 AM",
    isUser: false,
  },
  {
    id: 4,
    sender: "You",
    content: "Thank you. I'll make the payment today. Can I pay online?",
    time: "10:22 AM",
    isUser: true,
  },
  {
    id: 5,
    sender: "Mumbai Municipal Corporation",
    content:
      "Yes, you can pay online through the CivicConnect app or our official website. Would you like to proceed with the payment now?",
    time: "10:25 AM",
    isUser: false,
  },
  {
    id: 6,
    sender: "You",
    content: "Yes, I'll pay now through the app.",
    time: "10:28 AM",
    isUser: true,
  },
  {
    id: 7,
    sender: "Mumbai Municipal Corporation",
    content: "Your water bill payment has been received. Thank you!",
    time: "10:30 AM",
    isUser: false,
  },
]

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Conversations List */}
          <div className="w-full md:w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Messages</h1>
              <Button variant="ghost" size="icon" className="text-purple-700 dark:text-purple-400">
                <Edit className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 border-purple-200 dark:border-purple-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full mb-4">
              <TabsList className="grid grid-cols-3 bg-purple-100 dark:bg-gray-800 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="official"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  Official
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  Personal
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="flex-1 h-[calc(100vh-250px)]">
              <div className="space-y-2 pr-4">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeConversation.id === conversation.id
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                          <AvatarFallback className={conversation.isOfficial ? "bg-blue-500" : "bg-green-500"}>
                            {conversation.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="font-medium truncate">{conversation.name}</p>
                            {conversation.isOfficial && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                              >
                                Official
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.time}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-purple-600 hover:bg-purple-700">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Users className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            <Card className="h-[calc(100vh-150px)] flex flex-col border-purple-100 dark:border-purple-900">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={activeConversation.avatar || "/placeholder.svg"}
                        alt={activeConversation.name}
                      />
                      <AvatarFallback className={activeConversation.isOfficial ? "bg-blue-500" : "bg-green-500"}>
                        {activeConversation.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        {activeConversation.name}
                        {activeConversation.isOfficial && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Official
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeConversation.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-purple-700 dark:text-purple-400">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <CardContent className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-purple-700 dark:text-purple-400">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="border-purple-200 dark:border-purple-900"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
