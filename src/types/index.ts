export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  images?: string[];
  emoji: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  instagramUrl: string;
  bannerImages: string[];
  showBanner: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
}