import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// GET - Get a specific product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();
    
    const productId = params.productId;
    
    // Check if we're looking up by slug instead of ID
    const isSlug = !productId.match(/^[0-9a-fA-F]{24}$/);
    
    let product;
    if (isSlug) {
      product = await Product.findOne({ slug: productId }).lean();
    } else {
      product = await Product.findById(productId).lean();
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific product (protected route - admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    const productId = params.productId;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    
    // Partial validation schema for updates
    const updateSchema = z.object({
      name: z.string().min(3).max(100).optional(),
      slug: z.string().min(3).max(100).optional(),
      description: z.string().min(10).optional(),
      shortDescription: z.string().min(5).max(200).optional(),
      price: z.number().positive().optional(),
      salePrice: z.number().positive().nullable().optional(),
      costPrice: z.number().positive().nullable().optional(),
      stock: z.number().int().nonnegative().optional(),
      lowStockThreshold: z.number().int().positive().optional(),
      categories: z.array(z.string()).min(1).optional(),
      type: z.enum(['ring', 'bracelet', 'necklace', 'earring', 'pendant', 'other']).optional(),
      materials: z.array(
        z.object({
          name: z.string().min(1),
          color: z.string().optional(),
          quality: z.string().optional(),
          weight: z.number().positive().optional(),
          unit: z.string().optional()
        })
      ).optional(),
      tags: z.array(z.string()).optional(),
      variants: z.array(
        z.object({
          name: z.string().min(1),
          sku: z.string().min(3),
          price: z.number().positive(),
          salePrice: z.number().positive().optional().nullable(),
          stock: z.number().int().nonnegative(),
          size: z.string().optional(),
          color: z.string().optional(),
          materials: z.array(
            z.object({
              name: z.string().min(1),
              color: z.string().optional(),
              quality: z.string().optional(),
              weight: z.number().positive().optional(),
              unit: z.string().optional()
            })
          ).optional(),
          images: z.array(
            z.object({
              url: z.string().url(),
              alt: z.string().min(1),
              isPrimary: z.boolean().optional()
            })
          ).optional(),
          models: z.array(
            z.object({
              url: z.string().url(),
              type: z.enum(['3d', 'ar']),
              thumbnail: z.string().url().optional()
            })
          ).optional()
        })
      ).optional(),
      images: z.array(
        z.object({
          url: z.string().url(),
          alt: z.string().min(1),
          isPrimary: z.boolean().optional()
        })
      ).optional(),
      models: z.array(
        z.object({
          url: z.string().url(),
          type: z.enum(['3d', 'ar']),
          thumbnail: z.string().url().optional()
        })
      ).optional(),
      featured: z.boolean().optional(),
      new: z.boolean().optional(),
      bestseller: z.boolean().optional(),
      hasAR: z.boolean().optional(),
      has3D: z.boolean().optional(),
      dimensions: z.object({
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        depth: z.number().positive().optional(),
        unit: z.string().default('mm')
      }).optional(),
      publishedAt: z.date().optional()
    });
    
    try {
      const validatedData = updateSchema.parse(body);
      
      // Special case for slug - regenerate if name changes and slug is not provided
      if (validatedData.name && !body.slug) {
        validatedData.slug = validatedData.name
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
      }
      
      // Use findByIdAndUpdate to update the document
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: validatedData },
        { new: true, runValidators: true }
      ).lean();
      
      return NextResponse.json(updatedProduct);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific product (protected route - admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    const productId = params.productId;
    
    // Delete the product
    const result = await Product.findByIdAndDelete(productId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 