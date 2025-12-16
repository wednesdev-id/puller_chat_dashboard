import { useState, useEffect } from "react";
import TopBar from "@/components/chat/TopBar";
import AppSidebar from "@/components/AppSidebar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import EmptyState from "@/components/chat/EmptyState";
import WhatsAppConnection from "@/components/WhatsAppConnection";
import { useWhatsAppChats, useWhatsAppMessages, useWhatsAppSession, useWhatsAppRealtime } from "@/hooks/useWhatsApp";

// Sample data
const initialConversations = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "That sounds great! Let me know when you're free",
    time: "2m",
    unread: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "The project files have been updated",
    time: "15m",
    unread: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Design Team",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Emma: New mockups are ready for review",
    time: "1h",
    unread: 5,
    isOnline: false,
  },
  {
    id: "4",
    name: "Jordan Kim",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Thanks for your help yesterday!",
    time: "3h",
    unread: 0,
    isOnline: false,
  },
  {
    id: "5",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can we schedule a call for tomorrow?",
    time: "5h",
    unread: 1,
    isOnline: true,
  },
  {
    id: "6",
    name: "Tech Support",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Your ticket has been resolved",
    time: "1d",
    unread: 0,
    isOnline: false,
  },
];

const initialMessages: Record<string, { id: string; content: string; time: string; isSent: boolean; isRead?: boolean }[]> = {
  "1": [
    { id: "1", content: "Hey! How's the project going?", time: "10:30 AM", isSent: false },
    { id: "2", content: "It's going well! Just finished the main features", time: "10:32 AM", isSent: true, isRead: true },
    { id: "3", content: "That's awesome! Can you share a preview?", time: "10:33 AM", isSent: false },
    { id: "4", content: "Sure, I'll send it over in a few minutes", time: "10:35 AM", isSent: true, isRead: true },
    { id: "5", content: "That sounds great! Let me know when you're free", time: "10:38 AM", isSent: false },
  ],
  "2": [
    { id: "1", content: "Hey Alex, did you get a chance to review the latest updates?", time: "9:15 AM", isSent: true, isRead: true },
    { id: "2", content: "Yes! Everything looks good. Nice work on the animations", time: "9:20 AM", isSent: false },
    { id: "3", content: "The project files have been updated", time: "9:45 AM", isSent: false },
  ],
  "3": [
    { id: "1", content: "Team, the new designs are in!", time: "8:00 AM", isSent: false },
    { id: "2", content: "Great! I'll review them today", time: "8:30 AM", isSent: true, isRead: true },
    { id: "3", content: "Emma: New mockups are ready for review", time: "9:00 AM", isSent: false },
  ],
};

const Index = () => {
  // WhatsApp hooks
  const { connectionStatus } = useWhatsAppSession();
  const { chats, isLoading: chatsLoading, hasActiveSession } = useWhatsAppChats();
  const { messages, sendMessage, isSending } = useWhatsAppMessages();

  // Initialize real-time connection
  useWhatsAppRealtime();

  // Local state
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [showWhatsAppConnection, setShowWhatsAppConnection] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Check if WhatsApp is truly connected (not just session exists)
  useEffect(() => {
    // Check if connection is established through QR code scan
    const checkRealConnection = () => {
      if (connectionStatus === 'connected' && hasActiveSession) {
        setIsConnected(true);
        setShowWhatsAppConnection(false);
      } else {
        setIsConnected(false);
        setShowWhatsAppConnection(true);
      }
    };

    checkRealConnection();
  }, [connectionStatus, hasActiveSession]);

  // Use WhatsApp chats if truly connected through QR code, otherwise use sample data
  const conversations = isConnected ? chats : initialConversations;
  const currentMessages = messages || [];

  const activeChat = conversations.find((c) => c.id === activeConversation);

  // Calculate notification counts
  const unreadCount = conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0);

  // Filter conversations based on active filter
  const filteredConversations = activeFilter === "unread"
    ? conversations.filter(conv => (conv.unread || 0) > 0)
    : conversations;

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
  };

  // Handle navigation item clicks
  const handleNavigationClick = (itemLabel: string) => {
    if (itemLabel === "All Chats") {
      setActiveFilter("all");
    } else if (itemLabel === "Unread") {
      setActiveFilter("unread");
    } else if (itemLabel === "WhatsApp Connection") {
      setShowWhatsAppConnection(!showWhatsAppConnection);
    }
  };

  // Handle sending messages
  const handleSendMessage = (content: string) => {
    if (!activeConversation || !isConnected) return;

    // Send message using WhatsApp service
    sendMessage(content);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          totalChats={unreadCount}
          unreadCount={unreadCount}
          onNavigationClick={handleNavigationClick}
        />

        {showWhatsAppConnection ? (
          <WhatsAppConnection />
        ) : (
          <>
            <ChatSidebar
              conversations={filteredConversations}
              activeId={activeConversation}
              onSelect={handleConversationSelect}
              isLoading={chatsLoading}
            />
            {activeChat ? (
              <ChatArea
                name={activeChat.name}
                avatar={activeChat.avatar}
                isOnline={activeChat.isOnline}
                messages={currentMessages}
                onSendMessage={handleSendMessage}
                isLoading={isSending}
                isConnected={isConnected}
              />
            ) : (
              <EmptyState
                showConnectPrompt={!isConnected}
                onConnect={() => setShowWhatsAppConnection(true)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;