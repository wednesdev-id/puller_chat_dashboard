import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  time: string;
  isSent: boolean;
  isRead?: boolean;
  avatar?: string;
}

const MessageBubble = ({
  content,
  time,
  isSent,
  isRead = false,
  avatar,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex items-end gap-2 max-w-[75%] animate-fade-in",
        isSent ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {!isSent && avatar && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl transition-all duration-200",
          isSent
            ? "bg-message-sent text-message-sent-foreground rounded-br-md"
            : "bg-message-received text-message-received-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        <div className={cn(
          "flex items-center gap-1 mt-1",
          isSent ? "justify-end" : ""
        )}>
          <span className="text-[10px] opacity-60">{time}</span>
          {isSent && (
            isRead ? (
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Check className="w-3.5 h-3.5 opacity-50" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
