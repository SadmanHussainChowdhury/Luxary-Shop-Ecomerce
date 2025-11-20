import { Schema, model, models, Types } from 'mongoose'

export interface IReview {
  productId: Types.ObjectId
  userId?: Types.ObjectId
  customerName: string
  customerEmail: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerifiedPurchase?: boolean
  isApproved?: boolean
  helpfulCount?: number
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, trim: true },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true, index: true },
    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

ReviewSchema.index({ productId: 1, createdAt: -1 })
ReviewSchema.index({ productId: 1, rating: -1 })

export const Review = models.Review || model<IReview>('Review', ReviewSchema)

