import mongoose, { Schema, Document } from 'mongoose'

export interface IArticle extends Document {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: string
  author: string
  published: boolean
  featuredImage?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>({
  slug: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, default: 'Guide' },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'CyberShield Team' },
  published: { type: Boolean, default: true },
  featuredImage: { type: String },
  tags: [{ type: String }],
}, { timestamps: true })

ArticleSchema.index({ published: 1, createdAt: -1 })
ArticleSchema.index({ category: 1, published: 1, createdAt: -1 })

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)
