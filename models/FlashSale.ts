import { Schema, model, models } from 'mongoose'

export interface IFlashSale {
  title: string
  buttonText: string
  buttonLink: string
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const FlashSaleSchema = new Schema<IFlashSale>(
  {
    title: { type: String, required: true, default: 'FLASH SALE' },
    buttonText: { type: String, default: 'Shop Now →' },
    buttonLink: { type: String, default: '/products?tag=flash' },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

FlashSaleSchema.index({ isActive: 1, endDate: 1 })

export const FlashSale = models.FlashSale || model<IFlashSale>('FlashSale', FlashSaleSchema)

