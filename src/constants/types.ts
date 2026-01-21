export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  comment?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  lastFourDigits?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productsCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
}

export interface SortOption {
  key: string;
  label: string;
  value: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}