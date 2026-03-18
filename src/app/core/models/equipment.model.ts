export interface Equipment {
  id?: string;
  name: string;
  description: string;
  pricePerDay: number;
  imageUrl: string;
  category: string;
  available: boolean;
  location?: string;
  ownerId?: string;
}
