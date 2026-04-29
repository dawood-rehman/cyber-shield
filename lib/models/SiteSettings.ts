import mongoose, { Schema, Document } from 'mongoose'

export interface ISiteSettings extends Document {
  key: string
  supportEmail: string
  supportPhone: string
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: { type: String, required: true, unique: true, default: 'global' },
  supportEmail: { type: String, default: '' },
  supportPhone: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
