import axios, { AxiosInstance } from 'axios';

// WAHA Configuration
const WAHA_CONFIG = {
  baseURL: 'http://localhost:3000',
  dashboardURL: 'http://localhost:3000/dashboard/',
  username: 'admin',
  password: 'e44213b43dc349709991dbb1a6343e47',
  apiKey: 'c79b6529186c44aa9d536657ffea710b',
  timeout: 30000,
};

// Type definitions
export interface WhatsAppSession {
  id?: string;
  session?: string;
  name?: string;
  status: 'STARTING' | 'QR' | 'AUTHENTICATED' | 'CONNECTED' | 'DISCONNECTED';
  me?: any;
  presence?: any;
  timestamps?: any;
  engine?: any;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  content: string;
  timestamp: number;
  fromMe: boolean;
}

export interface WhatsAppChat {
  id: string;
  name: string;
  unreadCount: number;
  lastMessage?: WhatsAppMessage;
  timestamp: number;
  isGroup: boolean;
  avatar?: string;
  time?: string;
  lastMessageContent?: string;
}

// WAHA Service Class
export class WAHAService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = this.createApiClient();
  }

  private createApiClient(): AxiosInstance {
    const client = axios.create({
      baseURL: WAHA_CONFIG.baseURL,
      timeout: WAHA_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_CONFIG.apiKey,
      },
    });

    // Response interceptor
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('WAHA API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );

    return client;
  }

  // Test connection to WAHA server
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.apiClient.get('/api/sessions');
      return response.status === 200;
    } catch (error) {
      console.error('WAHA server connection failed:', error);
      return false;
    }
  }

  // Get WAHA dashboard URL
  getDashboardURL(): string {
    return WAHA_CONFIG.dashboardURL;
  }

  // Open WAHA dashboard in browser
  openDashboard(): void {
    const url = this.getDashboardURL();
    window.open(url, '_blank');
  }

  // Get all sessions
  async getSessions(): Promise<WhatsAppSession[]> {
    try {
      const response = await this.apiClient.get('/api/sessions');
      return response.data;
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  }

  // Start session or get existing
  async startSession(sessionName: string = 'default'): Promise<WhatsAppSession> {
    try {
      // Try to start new session first
      const response = await this.apiClient.post('/api/sessions/start', {
        session: sessionName,
        name: sessionName,
      });
      return response.data;
    } catch (error: any) {
      // If session already exists, get existing session
      if (error.response?.status === 422 && error.response?.data?.message?.includes('already started')) {
        const sessions = await this.getSessions();
        const existingSession = sessions.find(s => s.name === sessionName || s.session === sessionName);
        if (existingSession) {
          console.log('Using existing session:', existingSession);
          return existingSession;
        }
      }
      console.error('Failed to start session:', error);
      throw error;
    }
  }

  // Disconnect session
  async disconnectSession(sessionId: string): Promise<void> {
    try {
      await this.apiClient.post(`/api/sessions/${sessionId}/stop`);
    } catch (error) {
      console.error('Failed to disconnect session:', error);
      throw error;
    }
  }

  // Get session status
  async getSessionStatus(sessionId: string): Promise<WhatsAppSession> {
    try {
      // Get all sessions and find the one we want
      const sessions = await this.getSessions();
      const session = sessions.find(s =>
        s.id === sessionId || s.session === sessionId || s.name === sessionId
      );
      if (session) {
        return session;
      }
      // If no specific session found, return the first available session
      if (sessions.length > 0) {
        return sessions[0];
      }
      throw new Error(`Session ${sessionId} not found`);
    } catch (error) {
      console.error('Failed to get session status:', error);
      throw error;
    }
  }

  // Get QR code
  async getQRCode(): Promise<string> {
    try {
      const response = await this.apiClient.get('/api/screenshot', {
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get QR code:', error);
      throw error;
    }
  }

  // Auto-setup API key and session
  async autoSetup(): Promise<{ qrCode: string; sessionId: string }> {
    try {
      console.log('Starting auto-setup for WAHA connection...');

      // Step 1: Test connection to WAHA server
      await this.apiClient.get('/api/sessions');
      console.log('WAHA server connection successful');

      // Step 2: Get existing sessions or create new one
      const sessions = await this.getSessions();
      let sessionId = 'default';

      if (sessions.length > 0) {
        sessionId = sessions[0].session || sessions[0].name || sessions[0].id || 'default';
        console.log('Using existing session:', sessionId);
      } else {
        console.log('Creating new session...');
        const session = await this.startSession('default');
        sessionId = session.session || session.name || session.id || 'default';
        console.log('New session created:', sessionId);
      }

      // Step 3: Get QR code
      console.log('Getting QR code...');
      const qrCode = await this.getQRCode();
      console.log('QR code retrieved successfully');

      return {
        qrCode,
        sessionId
      };
    } catch (error) {
      console.error('Auto-setup failed:', error);
      throw error;
    }
  }

  // Get WhatsApp chats
  async getChats(sessionId?: string): Promise<WhatsAppChat[]> {
    try {
      // WAHA uses /api/sessions/{sessionId}/chats for chats
      const url = sessionId ? `/api/sessions/${sessionId}/chats` : '/api/chats';
      const response = await this.apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to get chats:', error);
      return [];
    }
  }

  // Get messages from a chat
  async getMessages(chatId: string, sessionId?: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    try {
      // WAHA uses /api/sessions/{sessionId}/chats/{chatId} for messages
      const url = sessionId
        ? `/api/sessions/${sessionId}/chats/${chatId}?messages=${limit}`
        : `/api/chats/${chatId}?messages=${limit}`;
      const response = await this.apiClient.get(url);
      return response.data.messages || [];
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  // Send message
  async sendMessage(chatId: string, content: string, sessionId?: string): Promise<WhatsAppMessage> {
    try {
      // WAHA uses POST /api/sessions/{sessionId}/chats/{chatId}/messages
      const url = sessionId
        ? `/api/sessions/${sessionId}/chats/${chatId}/messages`
        : `/api/chats/${chatId}/messages`;

      const response = await this.apiClient.post(url, {
        text: content,
        session: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wahaService = new WAHAService();