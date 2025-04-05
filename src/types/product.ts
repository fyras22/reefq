// Media types
export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductModel {
  url: string;
  type: '3d' | 'ar';
  isPrimary: boolean;
  alt?: string;
}

// Material type
export interface ProductMaterial {
  name: string;
  color?: string;
  quality?: string;
  weight?: number;
  unit?: string;
}

// Variant type
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  size?: string;
  color?: string;
  materials?: ProductMaterial[];
  images?: ProductImage[];
}

// Product form data type
export interface ProductFormData {
  // Basic info
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  
  // Categories and attributes
  categories: string[];
  type: string;
  materials: ProductMaterial[];
  tags: string[];
  
  // Media
  images: ProductImage[];
  models: ProductModel[];
  
  // Variants
  variants: ProductVariant[];
  
  // Flags
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  hasAR: boolean;
  has3D: boolean;
} 