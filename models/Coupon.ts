import { Schema, model, models } from 'mongoose'

export type CouponType = 'percentage' | 'fixed'
export type CouponStatus = 'active' | 'inactive' | 'expired'

export interface ICoupon {
  code: string
  type: CouponType
  value: number // Percentage (0-100) or fixed amount
  minPurchase?: number // Minimum order amount to use coupon
  maxDiscount?: number // Maximum discount for percentage coupons
  usageLimit?: number // Total number of times coupon can be used
  usedCount: number
  userLimit?: number // Limit per user
  validFrom: Date
  validUntil: Date
  categories?: string[] // Applicable categories (empty = all)
  status: CouponStatus
  description?: string
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    userLimit: { type: Number, min: 1 },
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true },
    categories: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active', index: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
)

CouponSchema.index({ code: 1, status: 1 })
CouponSchema.index({ validUntil: 1, status: 1 })

export const Coupon = models.Coupon || model<ICoupon>('Coupon', CouponSchema)

