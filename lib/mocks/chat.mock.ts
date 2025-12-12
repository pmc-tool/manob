// MOCK: Chat data types and mock data for chat functionality

export interface ChatUser {
  user_id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  sender_avatar: string;
  receiver_avatar: string;
  last_message: string;
  last_message_at: string;
  last_message_status: 'SENT' | 'DELIVERED' | 'READ';
  is_online: boolean;
  is_typing: boolean;
  sended_by: string;
  attachments: ChatAttachment[];
}

export interface ChatMessage {
  message_id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'GENERAL' | 'AGENT' | 'ORDER';
  message_data: {
    text?: string;
    status?: string;
    service_id?: string;
    service_meta?: {
      thumbnail_image: string;
      service_title: string;
    };
    cover_letter?: string;
    price?: number;
    revisions?: number;
    delivery_time?: number;
    delivery_type?: string;
    id?: string;
  };
  attachments: ChatAttachment[];
  sended_at: string;
  sended_by: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface ChatAttachment {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

// MOCK: Current logged in user
export const mockCurrentUser = {
  id: 'user-1',
  full_name: 'John Doe',
  email: 'john@example.com',
  profile_image: '/images/avatar-placeholder.png',
};

// MOCK: Chat users list
export const mockChatUsers: Record<string, ChatUser> = {
  'user-2': {
    user_id: 'user-2',
    room_id: 'room-1',
    sender_id: 'user-1',
    receiver_id: 'user-2',
    sender_name: 'John Doe',
    receiver_name: 'Alice Smith',
    sender_avatar: '/images/avatar-placeholder.png',
    receiver_avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    last_message: 'Hey, how are you doing?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    last_message_status: 'READ',
    is_online: true,
    is_typing: false,
    sended_by: 'user-2',
    attachments: [],
  },
  'user-3': {
    user_id: 'user-3',
    room_id: 'room-2',
    sender_id: 'user-1',
    receiver_id: 'user-3',
    sender_name: 'John Doe',
    receiver_name: 'Bob Johnson',
    sender_avatar: '/images/avatar-placeholder.png',
    receiver_avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    last_message: 'Thanks for the quick delivery!',
    last_message_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    last_message_status: 'READ',
    is_online: false,
    is_typing: false,
    sended_by: 'user-1',
    attachments: [],
  },
  'user-4': {
    user_id: 'user-4',
    room_id: 'room-3',
    sender_id: 'user-1',
    receiver_id: 'user-4',
    sender_name: 'John Doe',
    receiver_name: 'Emma Wilson',
    sender_avatar: '/images/avatar-placeholder.png',
    receiver_avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    last_message: 'Can you help me with the project?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    last_message_status: 'DELIVERED',
    is_online: true,
    is_typing: false,
    sended_by: 'user-4',
    attachments: [],
  },
  'user-5': {
    user_id: 'user-5',
    room_id: 'room-4',
    sender_id: 'user-1',
    receiver_id: 'user-5',
    sender_name: 'John Doe',
    receiver_name: 'Michael Brown',
    sender_avatar: '/images/avatar-placeholder.png',
    receiver_avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    last_message: 'I sent you the files',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    last_message_status: 'READ',
    is_online: false,
    is_typing: false,
    sended_by: 'user-1',
    attachments: [
      {
        id: 'att-1',
        filename: 'design.zip',
        url: '/files/design.zip',
        mimetype: 'application/zip',
        size: 1024000,
      },
    ],
  },
};

// MOCK: Chat history for each room
export const mockChatHistory: Record<string, ChatMessage[]> = {
  'user-2': [
    {
      message_id: 'msg-1',
      room_id: 'room-1',
      sender_id: 'user-2',
      receiver_id: 'user-1',
      message: 'Hi there! I saw your product on the marketplace.',
      message_type: 'GENERAL',
      message_data: { text: 'Hi there! I saw your product on the marketplace.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sended_by: 'user-2',
      status: 'READ',
    },
    {
      message_id: 'msg-2',
      room_id: 'room-1',
      sender_id: 'user-1',
      receiver_id: 'user-2',
      message: 'Hello! Yes, how can I help you?',
      message_type: 'GENERAL',
      message_data: { text: 'Hello! Yes, how can I help you?' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      sended_by: 'user-1',
      status: 'READ',
    },
    {
      message_id: 'msg-3',
      room_id: 'room-1',
      sender_id: 'user-2',
      receiver_id: 'user-1',
      message: 'I would like to know more about the React component library.',
      message_type: 'GENERAL',
      message_data: { text: 'I would like to know more about the React component library.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      sended_by: 'user-2',
      status: 'READ',
    },
    {
      message_id: 'msg-4',
      room_id: 'room-1',
      sender_id: 'user-1',
      receiver_id: 'user-2',
      message: 'Sure! It includes 50+ customizable components with TypeScript support.',
      message_type: 'GENERAL',
      message_data: { text: 'Sure! It includes 50+ customizable components with TypeScript support.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      sended_by: 'user-1',
      status: 'READ',
    },
    {
      message_id: 'msg-5',
      room_id: 'room-1',
      sender_id: 'user-2',
      receiver_id: 'user-1',
      message: 'That sounds great! Is there a demo available?',
      message_type: 'GENERAL',
      message_data: { text: 'That sounds great! Is there a demo available?' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      sended_by: 'user-2',
      status: 'READ',
    },
    {
      message_id: 'msg-6',
      room_id: 'room-1',
      sender_id: 'user-2',
      receiver_id: 'user-1',
      message: 'Hey, how are you doing?',
      message_type: 'GENERAL',
      message_data: { text: 'Hey, how are you doing?' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      sended_by: 'user-2',
      status: 'READ',
    },
  ],
  'user-3': [
    {
      message_id: 'msg-10',
      room_id: 'room-2',
      sender_id: 'user-3',
      receiver_id: 'user-1',
      message: 'Hello, I purchased your service yesterday.',
      message_type: 'GENERAL',
      message_data: { text: 'Hello, I purchased your service yesterday.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sended_by: 'user-3',
      status: 'READ',
    },
    {
      message_id: 'msg-11',
      room_id: 'room-2',
      sender_id: 'user-1',
      receiver_id: 'user-3',
      message: 'Great! I have started working on it. Will deliver soon.',
      message_type: 'GENERAL',
      message_data: { text: 'Great! I have started working on it. Will deliver soon.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sended_by: 'user-1',
      status: 'READ',
    },
    {
      message_id: 'msg-12',
      room_id: 'room-2',
      sender_id: 'user-1',
      receiver_id: 'user-3',
      message: 'Thanks for the quick delivery!',
      message_type: 'GENERAL',
      message_data: { text: 'Thanks for the quick delivery!' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sended_by: 'user-1',
      status: 'READ',
    },
  ],
  'user-4': [
    {
      message_id: 'msg-20',
      room_id: 'room-3',
      sender_id: 'user-4',
      receiver_id: 'user-1',
      message: 'Can you help me with the project?',
      message_type: 'GENERAL',
      message_data: { text: 'Can you help me with the project?' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sended_by: 'user-4',
      status: 'DELIVERED',
    },
  ],
  'user-5': [
    {
      message_id: 'msg-30',
      room_id: 'room-4',
      sender_id: 'user-5',
      receiver_id: 'user-1',
      message: 'Please send the design files when ready.',
      message_type: 'GENERAL',
      message_data: { text: 'Please send the design files when ready.' },
      attachments: [],
      sended_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      sended_by: 'user-5',
      status: 'READ',
    },
    {
      message_id: 'msg-31',
      room_id: 'room-4',
      sender_id: 'user-1',
      receiver_id: 'user-5',
      message: 'I sent you the files',
      message_type: 'GENERAL',
      message_data: { text: 'I sent you the files' },
      attachments: [
        {
          id: 'att-1',
          filename: 'design.zip',
          url: '/files/design.zip',
          mimetype: 'application/zip',
          size: 1024000,
        },
      ],
      sended_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      sended_by: 'user-1',
      status: 'READ',
    },
  ],
};

// MOCK: Pixi AI user
export const mockPixiUser = {
  user_id: 'pixi-ai',
  receiver_name: 'PMC Pixi AI',
  receiver_avatar: '/images/pixi-avatar.png',
  is_online: true,
};
