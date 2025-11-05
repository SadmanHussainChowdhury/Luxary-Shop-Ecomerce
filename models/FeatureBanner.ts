import { Schema, model, models } from 'mongoose'

export interface IFeatureBanner {
  title: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind gradient class
  href: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const FeatureBannerSchema = new Schema<IFeatureBanner>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, default: 'from-premium-gold to-premium-amber' },
    href: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

FeatureBannerSchema.index({ isActive: 1, order: 1 })

export const FeatureBanner = models.FeatureBanner || model<IFeatureBanner>('FeatureBanner', FeatureBannerSchema)

