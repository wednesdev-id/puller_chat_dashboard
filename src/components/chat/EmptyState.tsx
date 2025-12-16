import { MessageCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  showConnectPrompt?: boolean;
  onConnect?: () => void;
}

const EmptyState = ({ showConnectPrompt = false, onConnect }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6 animate-scale-in">
        {showConnectPrompt ? (
          <Wifi className="w-10 h-10 text-destructive" />
        ) : (
          <MessageCircle className="w-10 h-10 text-primary" />
        )}
      </div>

      {showConnectPrompt ? (
        <>
          <h2 className="text-xl font-medium text-foreground mb-2 animate-fade-in">
            Connect to WhatsApp
          </h2>
          <p className="text-sm text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Connect your WhatsApp account to start sending and receiving messages
          </p>
          {onConnect && (
            <Button onClick={onConnect} className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Wifi className="w-4 h-4 mr-2" />
              Connect WhatsApp
            </Button>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-medium text-foreground mb-2 animate-fade-in">
            Select a conversation
          </h2>
          <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
            Choose a chat from the sidebar to start messaging
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyState;