export interface ChatMessage {
  id: string;
  senderId: string;
  username: string;
  room: string;
  content: string;
  createdAt: string;
}
