/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  sizes: string[];
  colors: { name: string; class: string }[];
  stock: number;
  isMen: boolean;
  isWomen: boolean;
  featured: boolean;
  inNewArrivals: boolean;
  stockBySize?: Record<string, number>;

  gender?: string;
  displayCategory?: string;
  productType?: string;
  image?: string;
  currency?: string;
  brand?: string;
}

export interface CartItem {
  id: string; // unique for item + size + color combination
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; class: string };
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  productId: string;
  productName: string;
  category: string;
  size: string;
  colorOrModel: string;
  quantity: number;
  priceDA: number;
  status: 'Nouveau' | 'Confirmé' | 'En livraison' | 'Livré' | 'Annulé';
  deliveryType?: 'Stop Desk' | 'Domicile';
  deliveryFee?: number;
  productPrice?: number;
  totalPrice?: number;

  // Firebase compatible fields
  wilaya_code?: string;
  wilaya_name?: string;
  commune_name?: string;
  delivery_type?: string;
  delivery_price?: number;
  total?: number;
}

export interface AdminAnalytics {
  salesTotal: number;
  ordersCount: number;
  productsCount: number;
  outOfStockCount: number;
  recentOrders: Order[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

export interface CampaignSettings {
  subtitle: string;
  promoBanner: string;
  discountCode: string;
}

