import { Schema, model, models } from 'mongoose'

export interface ITestimonial {
  name: string
  role: string
  image: string
  text: string
  rating: number
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

TestimonialSchema.index({ isActive: 1, order: 1 })

export const Testimonial = models.Testimonial || model<ITestimonial>('Testimonial', TestimonialSchema)

