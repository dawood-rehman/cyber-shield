import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Report from '@/lib/models/Report'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function getAuth(token?: string) {
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const decoded = getAuth(cookieStore.get('auth-token')?.value)
    if (!decoded || decoded.role !== 'admin')
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    await connectDB()
    const { status, adminNotes } = await req.json()
    const update: Record<string, string> = {}
    if (status) update.status = status
    if (adminNotes !== undefined) update.adminNotes = adminNotes
    const report = await Report.findByIdAndUpdate(params.id, update, { new: true }).lean().maxTimeMS(5000)
    if (!report) return NextResponse.json({ message: 'Report not found' }, { status: 404 })
    return NextResponse.json({ message: 'Updated', report })
  } catch { return NextResponse.json({ message: 'Could not update report. Please try again.' }, { status: 500 }) }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const decoded = getAuth(cookieStore.get('auth-token')?.value)
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const query: Record<string, string> = { _id: params.id }
    if (decoded.role !== 'admin') query.userId = decoded.userId
    const report = await Report.findOne(query).lean().maxTimeMS(5000)
    if (!report) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ report })
  } catch { return NextResponse.json({ message: 'Could not load report. Please try again.' }, { status: 500 }) }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const decoded = getAuth(cookieStore.get('auth-token')?.value)
    if (!decoded || decoded.role !== 'admin')
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    await connectDB()
    await Report.findByIdAndDelete(params.id).maxTimeMS(5000)
    return NextResponse.json({ message: 'Deleted' })
  } catch { return NextResponse.json({ message: 'Could not delete report. Please try again.' }, { status: 500 }) }
}
