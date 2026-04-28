import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  reportId: string
  userId?: string
  userEmail?: string
  userName?: string
  harassmentType: string
  platform: string
  date?: string
  details: string
  evidenceFiles: string[]
  status: 'pending' | 'reviewing' | 'resolved'
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  userId: { type: String },
  userEmail: { type: String },
  userName: { type: String },
  harassmentType: { type: String, required: true },
  platform: { type: String, required: true },
  date: { type: String },
  details: { type: String, required: true, minlength: 10 },
  evidenceFiles: [{ type: String }],
  status: { type: String, enum: ['pending', 'reviewing', 'resolved'], default: 'pending' },
  adminNotes: { type: String },
}, { timestamps: true })

ReportSchema.index({ userId: 1, createdAt: -1 })
ReportSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)
