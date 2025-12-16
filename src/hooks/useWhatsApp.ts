import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wahaService, WhatsAppChat } from '@/services/wahaService';

// Hook for WhatsApp session management
export const useWhatsAppSession = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected'>('idle');
  const queryClient = useQueryClient();

  // Get all sessions
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ['whatsapp-sessions'],
    queryFn: () => wahaService.getSessions(),
    refetchInterval: 5000,
  });

  // Start connection mutation
  const startConnectionMutation = useMutation({
    mutationFn: () => wahaService.startSession('default'),
    onSuccess: (data) => {
      console.log('Session started:', data);
      setActiveSessionId(data.id);
      setConnectionStatus('connecting');

      // Open WAHA dashboard for QR scanning
      wahaService.openDashboard();

      // Start polling for status updates
      setTimeout(() => {
        pollConnectionStatus(data.id);
      }, 2000);
    },
    onError: (error) => {
      console.error('Failed to start connection:', error);
      setConnectionStatus('disconnected');
    },
  });

  // Disconnect session mutation
  const disconnectMutation = useMutation({
    mutationFn: (sessionId: string) => wahaService.disconnectSession(sessionId),
    onSuccess: () => {
      console.log('Session disconnected');
      setActiveSessionId(null);
      setConnectionStatus('disconnected');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to disconnect session:', error);
    },
  });

  // Poll connection status
  const pollConnectionStatus = useCallback(async (sessionId: string) => {
    try {
      const status = await wahaService.getSessionStatus(sessionId);

      if (status.status === 'CONNECTED') {
        setConnectionStatus('connected');
        setActiveSessionId(sessionId);
        queryClient.invalidateQueries({ queryKey: ['whatsapp-sessions'] });
        return; // Stop polling
      } else if (status.status === 'DISCONNECTED') {
        setConnectionStatus('disconnected');
        setActiveSessionId(null);
        return; // Stop polling
      } else {
        // Continue polling
        setTimeout(() => pollConnectionStatus(sessionId), 3000);
      }
    } catch (error) {
      console.error('Error polling connection status:', error);
      // Continue polling with longer interval
      setTimeout(() => pollConnectionStatus(sessionId), 5000);
    }
  }, [queryClient]);

  // Start WhatsApp connection
  const startWhatsApp = useCallback(async () => {
    setConnectionStatus('connecting');
    startConnectionMutation.mutate();
  }, [startConnectionMutation]);

  // Disconnect session
  const disconnectSession = useCallback(async (sessionId: string) => {
    disconnectMutation.mutate(sessionId);
  }, [disconnectMutation]);

  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    return await wahaService.testConnection();
  }, []);

  // Open WAHA dashboard
  const openDashboard = useCallback(() => {
    wahaService.openDashboard();
  }, []);

  return {
    sessions,
    activeSessionId,
    connectionStatus,
    isLoading: sessionsLoading || startConnectionMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    startWhatsApp,
    disconnectSession,
    testConnection,
    openDashboard,
    refetchSessions,
  };
};

// Hook for WhatsApp chats (for other components that might need it)
export const useWhatsAppChats = () => {
  const { activeSessionId } = useWhatsAppSession();

  const {
    data: chats = [],
    isLoading: chatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery<WhatsAppChat[]>({
    queryKey: ['whatsapp-chats', activeSessionId],
    queryFn: () => {
      if (!activeSessionId) return [];
      return []; // Return empty array for now
    },
    enabled: !!activeSessionId,
    refetchInterval: 10000,
  });

  return {
    chats,
    isLoading: chatsLoading,
    error: chatsError,
    refetchChats,
    hasActiveSession: !!activeSessionId,
  };
};

// Hook for WhatsApp messages (for other components that might need it)
export const useWhatsAppMessages = (chatId?: string) => {
  const { activeSessionId } = useWhatsAppSession();
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['whatsapp-messages', activeSessionId, chatId],
    queryFn: () => {
      if (!activeSessionId || !chatId) return [];
      return []; // Return empty array for now
    },
    enabled: !!activeSessionId && !!chatId,
    refetchInterval: 5000,
  });

  const sendMessage = useCallback((content: string) => {
    console.log('Message sent to', chatId, ':', content);
    // Invalidate messages query after sending (when API is ready)
    queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', activeSessionId, chatId] });
    // TODO: Implement actual message sending when API is ready
  }, [chatId, activeSessionId, queryClient]);

  return {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    sendMessage,
    isSending: false,
    refetchMessages,
  };
};

// Hook for real-time WebSocket connection (for other components that might need it)
export const useWhatsAppRealtime = () => {
  const { activeSessionId } = useWhatsAppSession();

  // For now, return basic implementation
  // TODO: Implement actual WebSocket connection when needed
  return {
    isConnected: !!activeSessionId, // Basic connection status based on active session
  };
};

// Hook for getting WAHA dashboard info
export const useWAHADashboard = () => {
  const getDashboardURL = useCallback(() => {
    return wahaService.getDashboardURL();
  }, []);

  return {
    getDashboardURL,
    dashboardURL: wahaService.getDashboardURL(),
  };
};