import { useState } from "react";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div
        className={cn(
          "flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200",
          isFocused
            ? "border-primary/30 bg-secondary/30 shadow-soft"
            : "border-border bg-secondary/50"
        )}
      >
        <button className="p-2 rounded-lg hover:bg-background transition-colors duration-200 group">
          <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm placeholder:text-muted-foreground focus:outline-none py-2 max-h-32"
        />

        <button className="p-2 rounded-lg hover:bg-background transition-colors duration-200 group">
          <Smile className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {message.trim() ? (
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-glow transition-all duration-200 shadow-soft hover:shadow-medium"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button className="p-2.5 rounded-xl hover:bg-background transition-colors duration-200 group">
            <Mic className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
