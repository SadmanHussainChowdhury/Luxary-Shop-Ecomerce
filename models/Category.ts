import { Schema, model, models } from 'mongoose'

export interface ICategory {
  name: string
  slug: string
  displayName: string
  icon?: string
  color?: string
  description?: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    displayName: { type: String, required: true, trim: true },
    icon: { type: String },
    color: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

CategorySchema.index({ isActive: 1, order: 1 })

export const Category = models.Category || model<ICategory>('Category', CategorySchema)

