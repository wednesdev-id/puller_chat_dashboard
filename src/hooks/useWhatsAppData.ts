import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3002/api'
  : '/api';

interface Message {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  body: string;
  message?: string;
  fromMe: boolean;
  hasMedia: boolean;
  datetime?: string;
  source?: string;
  mediaType?: string;
  mediaCaption?: string;
}

interface Contact {
  id: string;
  name: string;
  last_message?: string;
  last_from?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

interface MessageFilters {
  file?: string;
  contact_id?: string;
  from_user?: string;
  to_user?: string;
  search?: string;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
  has_media?: boolean;
  from_me?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  fields?: string;
}

export const useMessages = (filters: MessageFilters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryKey = ['messages', filters];
  const queryUrl = `${API_BASE_URL}/messages?${queryParams.toString()}`;

  return useQuery<{
    success: boolean;
    data: Message[];
    message: string;
    metadata: {
      total: number;
      count: number;
      pagination: {
        limit: number;
        offset: number;
        hasMore: boolean;
      };
      statistics: {
        total_messages: number;
        media_messages: number;
        text_messages: number;
        sent_messages: number;
        received_messages: number;
        unique_contacts: number;
      };
    };
  }>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(queryUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useContacts = (filters: {
  file?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  fields?: string;
} = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryKey = ['contacts', filters];
  const queryUrl = `${API_BASE_URL}/contacts?${queryParams.toString()}`;

  return useQuery<{
    success: boolean;
    data: Contact[];
    message: string;
    metadata: {
      total: number;
      count: number;
      pagination: {
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    };
  }>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(queryUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      // Get contacts first
      const contactsResponse = await fetch(`${API_BASE_URL}/contacts?limit=100`);
      const contacts = await contactsResponse.json();

      if (!contacts.success) {
        throw new Error('Failed to fetch contacts');
      }

      // For each contact, get their latest message
      const conversations = await Promise.all(
        contacts.data.map(async (contact: Contact) => {
          const messagesResponse = await fetch(
            `${API_BASE_URL}/messages?contact_id=${contact.id}&limit=1&sort=timestamp&order=desc`
          );
          const messages = await messagesResponse.json();

          return {
            id: contact.id,
            name: contact.name,
            phone: contact.phone || contact.id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`,
            lastMessage: messages.success && messages.data.length > 0
              ? messages.data[0].body || 'Media message'
              : contact.last_message || 'No messages',
            time: messages.success && messages.data.length > 0
              ? formatMessageTime(messages.data[0].timestamp)
              : '',
            unread: 0, // We'll implement this later
            isOnline: false, // We'll implement this later
            timestamp: messages.success && messages.data.length > 0
              ? messages.data[0].timestamp
              : null,
          };
        })
      );

      // Sort by latest message
      return conversations.sort((a, b) => {
        if (a.timestamp === null) return 1;
        if (b.timestamp === null) return -1;
        return b.timestamp - a.timestamp;
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Helper function to format message time
const formatMessageTime = (timestamp: number): string => {
  const now = new Date();
  const messageDate = new Date(timestamp * 1000); // Convert to milliseconds

  const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInHours < 24 * 7) {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  } else {
    return messageDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};