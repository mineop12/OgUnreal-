export interface Asset {
  id: string;
  name: string;
  category: string;
  priceType: 'free' | 'paid';
  price: number;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  images?: string[];
  tags?: string[];
  ueVersion: string;
  fileSize: string;
  downloadLink: string;
  features: string;
  requirements: string;
  createdAt: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
