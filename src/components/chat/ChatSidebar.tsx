import { Search, Settings, MessageSquarePlus } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

const ChatSidebar = ({ conversations, activeId, onSelect }: ChatSidebarProps) => {
  return (
    <aside className="w-80 h-full bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200">
              <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2.5 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ConversationItem
              {...conversation}
              isActive={activeId === conversation.id}
              onClick={() => onSelect(conversation.id)}
            />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;
