export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
  }
  
  export interface Conversation {
    user: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
    };
    latestMessage: Message;
    unreadCount: number;
  }
  