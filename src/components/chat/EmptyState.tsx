import { MessageCircle } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6 animate-scale-in">
        <MessageCircle className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-medium text-foreground mb-2 animate-fade-in">
        Select a conversation
      </h2>
      <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
        Choose a chat from the sidebar to start messaging
      </p>
    </div>
  );
};

export default EmptyState;
