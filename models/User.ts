import { Schema, model, models } from 'mongoose'

export type UserRole = 'user' | 'admin'

export interface IOAuthAccount {
  provider: string
  providerAccountId: string
}

export interface IUser {
  name: string
  email: string
  phone?: string
  passwordHash?: string // Optional for OAuth users
  role: UserRole
  oauthAccounts?: IOAuthAccount[]
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const OAuthAccountSchema = new Schema<IOAuthAccount>({
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
}, { _id: false })

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String }, // Optional for OAuth users
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    oauthAccounts: { type: [OAuthAccountSchema], default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
)

UserSchema.index({ resetPasswordToken: 1 })

export const User = models.User || model<IUser>('User', UserSchema)


