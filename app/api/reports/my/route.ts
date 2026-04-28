export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Report from '@/lib/models/Report'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (!decoded.userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const reports = await Report.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean()
      .maxTimeMS(5000)
    return NextResponse.json({ reports, total: reports.length })
  } catch (err) {
    console.error('GET /api/reports/my error:', err)
    return NextResponse.json({ message: 'Could not load your reports. Please try again.' }, { status: 500 })
  }
}
