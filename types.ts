export interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  isAssured?: boolean;
  sellerType?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isStudent?: boolean;
}

export interface FilterState {
  category: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
  sort: 'popularity' | 'price_low' | 'price_high' | 'newest';
}
