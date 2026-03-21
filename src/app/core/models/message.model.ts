export interface Message {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
