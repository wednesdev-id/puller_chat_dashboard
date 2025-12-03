import { useState } from "react";
import TopBar from "@/components/chat/TopBar";
import AppSidebar from "@/components/AppSidebar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import EmptyState from "@/components/chat/EmptyState";

// Sample data
const conversations = [
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
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeChat = conversations.find((c) => c.id === activeConversation);
  const currentMessages = activeConversation ? messages[activeConversation] || [] : [];

  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;
    
    const newMessage = {
      id: Date.now().toString(),
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSent: true,
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage],
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
        />
        {activeChat ? (
          <ChatArea
            name={activeChat.name}
            avatar={activeChat.avatar}
            isOnline={activeChat.isOnline}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Index;
