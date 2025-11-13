import { Schema, model, models } from 'mongoose'

export interface INewsletterSubscription {
  email: string
  subscribedAt: Date
  isActive: boolean
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true 
    },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
)

NewsletterSubscriptionSchema.index({ email: 1, isActive: 1 })

export const NewsletterSubscription = 
  models.NewsletterSubscription || 
  model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema)

