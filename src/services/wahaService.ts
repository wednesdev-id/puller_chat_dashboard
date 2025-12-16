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
  id: string;
  status: 'STARTING' | 'QR' | 'AUTHENTICATED' | 'CONNECTED' | 'DISCONNECTED';
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
      auth: {
        username: WAHA_CONFIG.username,
        password: WAHA_CONFIG.password,
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

  // Start session
  async startSession(sessionName: string = 'default'): Promise<WhatsAppSession> {
    try {
      const response = await this.apiClient.post('/api/sessions/start', {
        name: sessionName,
      });
      return response.data;
    } catch (error) {
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
      const response = await this.apiClient.get(`/api/sessions/${sessionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wahaService = new WAHAService();