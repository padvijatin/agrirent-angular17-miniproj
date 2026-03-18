export interface Booking {
  id?: string;
  equipmentId: string;
  userId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  equipment?: {
    id?: string;
    name?: string;
    category?: string;
    imageUrl?: string;
    pricePerDay?: number;
    location?: string;
    ownerId?: string;
  };
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
}
