import { Phone, Video, MoreVertical, Search } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

const ChatHeader = ({ name, avatar, isOnline, lastSeen }: ChatHeaderProps) => {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          )}
        </div>
        <div>
          <h2 className="font-medium text-foreground">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {isOnline ? "Online" : lastSeen || "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Video className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <MoreVertical className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
