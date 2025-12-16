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
        "flex items-end gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-[75%] animate-fade-in",
        isSent ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {!isSent && avatar && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className={cn(
          "px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-200",
          isSent
            ? "bg-message-sent text-message-sent-foreground rounded-br-md"
            : "bg-message-received text-message-received-foreground rounded-bl-md"
        )}
      >
        <p className="text-xs sm:text-sm leading-relaxed break-words">{content}</p>
        <div className={cn(
          "flex items-center gap-1 mt-0.5 sm:mt-1",
          isSent ? "justify-end" : ""
        )}>
          <span className="text-[9px] sm:text-[10px] opacity-60">{time}</span>
          {isSent && (
            isRead ? (
              <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            ) : (
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
