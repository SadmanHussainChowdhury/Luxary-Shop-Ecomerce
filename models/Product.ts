import { Schema, model, models, Types } from 'mongoose'

export interface IProductImage {
  url: string
  alt?: string
}

export interface IProduct {
  title: string
  slug: string
  description?: string
  price: number
  images: IProductImage[]
  category?: string
  brand?: string
  countInStock: number
  rating: number
  numReviews: number
  isFeatured?: boolean
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: String,
})

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    images: { type: [ProductImageSchema], default: [] },
    category: { type: String, index: true },
    brand: { type: String },
    countInStock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    numReviews: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    tags: { type: [String], default: [], index: true },
  },
  { timestamps: true }
)

ProductSchema.index({ title: 'text', description: 'text' })

export const Product = models.Product || model<IProduct>('Product', ProductSchema)


