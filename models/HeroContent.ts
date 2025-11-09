import { Schema, model, models } from 'mongoose'

export interface IHeroContent {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  stats: {
    label: string
    value: string
  }[]
  badgeText: string
  isActive: boolean
  order: number
  backgroundImage?: string
  createdAt: Date
  updatedAt: Date
}

const HeroContentSchema = new Schema<IHeroContent>(
  {
    title: { type: String, required: true, default: 'Shop Luxury.' },
    subtitle: { type: String, default: 'Live Premium.' },
    description: { type: String, default: 'Discover exclusive premium products with world-class quality. Free shipping worldwide and 30-day money-back guarantee.' },
    primaryButtonText: { type: String, default: 'Shop Now →' },
    primaryButtonLink: { type: String, default: '/products' },
    secondaryButtonText: { type: String, default: 'View Premium Collection' },
    secondaryButtonLink: { type: String, default: '/products/premium' },
    stats: [{
      label: { type: String },
      value: { type: String },
    }],
    badgeText: { type: String, default: "World's #1 Premium Ecommerce" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    backgroundImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2400&q=80',
    },
  },
  { timestamps: true }
)

HeroContentSchema.index({ isActive: 1, order: 1 })

export const HeroContent = models.HeroContent || model<IHeroContent>('HeroContent', HeroContentSchema)

