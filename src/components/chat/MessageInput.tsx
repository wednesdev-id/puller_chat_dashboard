import { useState } from "react";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

const MessageInput = ({ onSend, isConnected = true, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim() && isConnected && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isConnected && !isLoading) {
        handleSend();
      }
    }
  };

  return (
    <div className="p-2 sm:p-4 border-t border-border bg-background">
      <div
        className={cn(
          "flex items-end gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all duration-200",
          isFocused
            ? "border-primary/30 bg-secondary/30 shadow-soft"
            : "border-border bg-secondary/50"
        )}
      >
        <button className="p-1.5 sm:p-2 rounded-lg hover:bg-background transition-colors duration-200 group">
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={isConnected ? "Type a message..." : "Connect to WhatsApp to send messages"}
          disabled={!isConnected || isLoading}
          rows={1}
          className={`flex-1 bg-transparent resize-none text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none py-1.5 sm:py-2 max-h-24 sm:max-h-32 ${
            !isConnected || isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />

        <button className="p-1.5 sm:p-2 rounded-lg hover:bg-background transition-colors duration-200 group">
          <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {message.trim() && isConnected && !isLoading ? (
          <button
            onClick={handleSend}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary-glow transition-all duration-200 shadow-soft hover:shadow-medium"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        ) : (
          <button
            disabled={!isConnected || isLoading}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors duration-200 group ${
              message.trim() && isConnected && !isLoading
                ? 'hover:bg-background'
                : 'cursor-not-allowed opacity-60'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 animate-spin border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;