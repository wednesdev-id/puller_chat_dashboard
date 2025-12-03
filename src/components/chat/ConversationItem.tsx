import { cn } from "@/lib/utils";

interface ConversationItemProps {
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isActive?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
}

const ConversationItem = ({
  name,
  avatar,
  lastMessage,
  time,
  unread = 0,
  isActive = false,
  isOnline = false,
  onClick,
}: ConversationItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left",
        isActive
          ? "bg-accent shadow-soft"
          : "hover:bg-secondary/60"
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-primary/10 transition-all duration-200">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "font-medium text-sm truncate",
            isActive ? "text-foreground" : "text-foreground/90"
          )}>
            {name}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {lastMessage}
        </p>
      </div>

      {unread > 0 && (
        <span className="flex-shrink-0 min-w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full px-1.5">
          {unread}
        </span>
      )}
    </button>
  );
};

export default ConversationItem;
