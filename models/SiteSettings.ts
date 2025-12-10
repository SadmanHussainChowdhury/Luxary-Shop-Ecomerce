import { Schema, model, models } from 'mongoose'

export interface IPaymentMethod {
  name: string
  enabled: boolean
  icon?: string
}

export interface IFooterSection {
  title: string
  links: Array<{
    label: string
    url: string
  }>
}

export interface ISiteSettings {
  siteName: string
  siteDescription: string
  siteTagline: string
  logo?: string
  favicon?: string
  contactEmail: string
  contactPhone: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  businessHours?: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
  footerText: string
  footerDescription?: string
  paymentMethods: IPaymentMethod[]
  merchantAccounts?: {
    bkash?: string
    nagad?: string
    rocket?: string
  }
  promotionalBanner: {
    enabled: boolean
    text: string
    link?: string
  }
  createdAt: Date
  updatedAt: Date
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    icon: { type: String },
  },
  { _id: false }
)

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, required: true, default: 'Luxury Shop' },
    siteDescription: { type: String, required: true, default: 'Premium Online Shopping' },
    siteTagline: { type: String, default: 'Shop Luxury. Live Premium.' },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String, required: true, default: 'contact@luxuryshop.com' },
    contactPhone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Premium Street' },
    city: { type: String, default: 'Luxury City' },
    state: { type: String, default: 'LC' },
    zipCode: { type: String, default: '12345' },
    country: { type: String, default: 'United States' },
    businessHours: { type: String, default: 'Mon-Fri: 9AM-8PM EST' },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
    },
    footerText: { type: String, default: '© 2024 Luxury Shop. All rights reserved.' },
    footerDescription: { type: String, default: 'Your premier destination for luxury products. Experience world-class quality and exceptional service.' },
    paymentMethods: {
      type: [PaymentMethodSchema],
      default: [
        { name: 'Visa', enabled: true },
        { name: 'Mastercard', enabled: true },
        { name: 'Amex', enabled: true },
        { name: 'PayPal', enabled: true },
        { name: 'Apple Pay', enabled: true },
        { name: 'Google Pay', enabled: true },
        { name: 'bKash', enabled: true },
        { name: 'Nagad', enabled: true },
        { name: 'Rocket', enabled: true },
        { name: 'Cash on Delivery', enabled: true },
      ],
    },
    merchantAccounts: {
      bkash: { type: String, trim: true },
      nagad: { type: String, trim: true },
      rocket: { type: String, trim: true },
    },
    promotionalBanner: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'New User? Get $10 off! • Free Shipping on orders over $50' },
      link: { type: String },
    },
  },
  { timestamps: true }
)

// Only one settings document should exist

export const SiteSettings = models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema)

