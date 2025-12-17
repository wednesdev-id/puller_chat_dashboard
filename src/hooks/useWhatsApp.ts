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
      const sessionId = data.id || data.session || data.name || 'default';
      setActiveSessionId(sessionId);
      setConnectionStatus('connecting');

      // Open WAHA dashboard for QR scanning
      wahaService.openDashboard();

      // Start polling for status updates
      setTimeout(() => {
        pollConnectionStatus(sessionId);
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
        const activeId = status.id || status.session || status.name || sessionId;
        setActiveSessionId(activeId);
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

  // Auto-setup WhatsApp connection
  const autoSetupWhatsApp = useCallback(async () => {
    try {
      setConnectionStatus('connecting');

      // Run auto-setup
      const { qrCode, sessionId } = await wahaService.autoSetup();

      console.log('Auto-setup successful:', { sessionId, hasQR: !!qrCode });

      setActiveSessionId(sessionId);

      // Open WAHA dashboard for QR scanning
      wahaService.openDashboard();

      // Start polling for status updates
      setTimeout(() => {
        pollConnectionStatus(sessionId);
      }, 2000);

    } catch (error) {
      console.error('Auto-setup failed:', error);
      setConnectionStatus('disconnected');
      throw error;
    }
  }, [pollConnectionStatus]);

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
    startWhatsApp: () => startConnectionMutation.mutate('default'),
    autoSetupWhatsApp,
    disconnectSession,
    testConnection,
    openDashboard,
    refetchSessions,
  };
};

// Hook for WhatsApp chats (for other components that might need it)
export const useWhatsAppChats = () => {
  const { sessions, connectionStatus } = useWhatsAppSession();
  const activeSession = sessions[0]; // Get first available session
  const activeSessionId = activeSession?.session || activeSession?.id || activeSession?.name;

  const {
    data: chats = [],
    isLoading: chatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery<WhatsAppChat[]>({
    queryKey: ['whatsapp-chats', activeSessionId],
    queryFn: async () => {
      if (!activeSessionId || connectionStatus !== 'connected') {
        console.log('Chats: No active session or not connected', { activeSessionId, connectionStatus });
        return [];
      }
      console.log('Chats: Fetching chats for session', activeSessionId);
      try {
        const chatsData = await wahaService.getChats(activeSessionId);
        console.log('Chats: Retrieved', chatsData.length, 'chats');
        return chatsData;
      } catch (error) {
        console.error('Chats: Failed to fetch chats', error);
        return [];
      }
    },
    enabled: !!activeSessionId && connectionStatus === 'connected',
    refetchInterval: 10000,
  });

  return {
    chats,
    isLoading: chatsLoading,
    error: chatsError,
    refetchChats,
    hasActiveSession: !!activeSessionId && connectionStatus === 'connected',
  };
};

// Hook for WhatsApp messages (for other components that might need it)
export const useWhatsAppMessages = (chatId?: string) => {
  const { sessions, connectionStatus } = useWhatsAppSession();
  const activeSession = sessions[0]; // Get first available session
  const activeSessionId = activeSession?.session || activeSession?.id || activeSession?.name;
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['whatsapp-messages', activeSessionId, chatId],
    queryFn: async () => {
      if (!activeSessionId || !chatId || connectionStatus !== 'connected') {
        console.log('Messages: No active session, chat, or not connected', { activeSessionId, chatId, connectionStatus });
        return [];
      }
      console.log('Messages: Fetching messages for chat', chatId, 'session', activeSessionId);
      try {
        const messagesData = await wahaService.getMessages(chatId, activeSessionId);
        console.log('Messages: Retrieved', messagesData.length, 'messages');
        return messagesData;
      } catch (error) {
        console.error('Messages: Failed to fetch messages', error);
        return [];
      }
    },
    enabled: !!activeSessionId && !!chatId && connectionStatus === 'connected',
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!activeSessionId || !chatId) throw new Error('No active session or chat');
      console.log('Messages: Sending message to', chatId, 'session', activeSessionId);
      return wahaService.sendMessage(chatId, content, activeSessionId);
    },
    onSuccess: () => {
      console.log('Messages: Message sent successfully');
      // Invalidate messages query after sending
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', activeSessionId, chatId] });
    },
  });

  const sendMessage = useCallback((content: string) => {
    sendMessageMutation.mutate(content);
  }, [sendMessageMutation]);

  return {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    sendMessage,
    isSending: sendMessageMutation.isPending,
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