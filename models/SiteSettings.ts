import { Schema, model, models } from 'mongoose'

export interface ISiteSettings {
  siteName: string
  siteDescription: string
  siteTagline: string
  logo?: string
  favicon?: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
  footerText: string
  promotionalBanner: {
    enabled: boolean
    text: string
    link?: string
  }
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, required: true, default: 'Luxury Shop' },
    siteDescription: { type: String, required: true, default: 'Premium Online Shopping' },
    siteTagline: { type: String, default: 'Shop Luxury. Live Premium.' },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String, required: true, default: 'contact@luxuryshop.com' },
    contactPhone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Premium Street, Luxury City, LC 12345' },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
    },
    footerText: { type: String, default: '© 2024 Luxury Shop. All rights reserved.' },
    promotionalBanner: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'New User? Get $10 off! • Free Shipping on orders over $50' },
      link: { type: String },
    },
  },
  { timestamps: true }
)

// Only one settings document should exist
SiteSettingsSchema.index({ _id: 1 }, { unique: true })

export const SiteSettings = models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema)

