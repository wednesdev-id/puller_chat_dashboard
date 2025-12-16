import { Phone, Video, MoreVertical, Search } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

const ChatHeader = ({ name, avatar, isOnline, lastSeen }: ChatHeaderProps) => {
  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full border-2 border-background" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium text-foreground text-sm sm:text-base truncate">{name}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {isOnline ? "Online" : lastSeen || "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Show only essential buttons on mobile */}
        <button className="p-1.5 sm:p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Hide some buttons on very small screens */}
        <button className="hidden sm:flex p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <button className="hidden sm:flex p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Video className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        <button className="p-1.5 sm:p-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
