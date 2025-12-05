export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  featured: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  delivery_date?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'separated'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Settings {
  company_name: string;
  whatsapp: string;
  phone: string;
  address: string;
  banner_url: string;
  logo_url: string;
  description: string;
}
