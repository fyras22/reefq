import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface IProductModel {
  url: string;
  type: '3d' | 'ar';
  thumbnail?: string;
}

export interface IMaterial {
  name: string;
  color?: string;
  quality?: string;
  weight?: number;
  unit?: string;
}

export interface IVariant {
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  size?: string;
  color?: string;
  materials?: IMaterial[];
  images?: IProductImage[];
  models?: IProductModel[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  categories: string[];
  type: 'ring' | 'bracelet' | 'necklace' | 'earring' | 'pendant' | 'other';
  materials: IMaterial[];
  tags: string[];
  variants: IVariant[];
  images: IProductImage[];
  models: IProductModel[];
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  hasAR: boolean;
  has3D: boolean;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit: string;
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    salePrice: Number,
    costPrice: Number,
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    categories: [{ type: String, required: true }],
    type: { 
      type: String, 
      required: true, 
      enum: ['ring', 'bracelet', 'necklace', 'earring', 'pendant', 'other'] 
    },
    materials: [{
      name: { type: String, required: true },
      color: String,
      quality: String,
      weight: Number,
      unit: String
    }],
    tags: [String],
    variants: [{
      name: { type: String, required: true },
      sku: { type: String, required: true },
      price: { type: Number, required: true },
      salePrice: Number,
      stock: { type: Number, required: true, default: 0 },
      size: String,
      color: String,
      materials: [{
        name: { type: String, required: true },
        color: String,
        quality: String,
        weight: Number,
        unit: String
      }],
      images: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
      }],
      models: [{
        url: { type: String, required: true },
        type: { type: String, required: true, enum: ['3d', 'ar'] },
        thumbnail: String
      }]
    }],
    images: [{
      url: { type: String, required: true },
      alt: { type: String, required: true },
      isPrimary: { type: Boolean, default: false }
    }],
    models: [{
      url: { type: String, required: true },
      type: { type: String, required: true, enum: ['3d', 'ar'] },
      thumbnail: String
    }],
    featured: { type: Boolean, default: false },
    new: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    hasAR: { type: Boolean, default: false },
    has3D: { type: Boolean, default: false },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: { type: String, default: 'mm' }
    },
    publishedAt: Date
  },
  { timestamps: true, strict: true }
);

// Create text indexes for search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  shortDescription: 'text',
  'materials.name': 'text',
  tags: 'text'
});

// Create slug from name if not provided
ProductSchema.pre('save', function(this: IProduct & Document, next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 