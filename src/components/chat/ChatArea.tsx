import { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Message {
  id: string;
  content: string;
  time: string;
  isSent: boolean;
  isRead?: boolean;
}

interface ChatAreaProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatArea = ({ name, avatar, isOnline, messages, onSendMessage }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <ChatHeader name={name} avatar={avatar} isOnline={isOnline} />
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Date Separator */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
              Today
            </span>
          </div>

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              time={message.time}
              isSent={message.isSent}
              isRead={message.isRead}
              avatar={!message.isSent ? avatar : undefined}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <MessageInput onSend={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
