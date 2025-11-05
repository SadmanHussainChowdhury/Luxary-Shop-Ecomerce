import { Schema, model, models, Types } from 'mongoose'

export type OrderStatus = 'awaiting_payment' | 'paid' | 'fulfilled' | 'cancelled'

export interface IOrderItem {
  productId: Types.ObjectId
  slug: string
  title: string
  price: number
  quantity: number
  image?: string
}

export interface ICustomerInfo {
  name: string
  email: string
  phone?: string
  address: string
  city: string
  state?: string
  zipCode: string
  country: string
}

export interface IOrder {
  userId?: Types.ObjectId
  items: IOrderItem[]
  total: number
  status: OrderStatus
  stripeSessionId?: string
  customer?: ICustomerInfo
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
})

const CustomerInfoSchema = new Schema<ICustomerInfo>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
})

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['awaiting_payment', 'paid', 'fulfilled', 'cancelled'], default: 'awaiting_payment', index: true },
  stripeSessionId: { type: String, index: true },
  customer: { type: CustomerInfoSchema },
  paymentMethod: { type: String },
}, { timestamps: true })

OrderSchema.index({ createdAt: -1 })

export const Order = models.Order || model<IOrder>('Order', OrderSchema)


