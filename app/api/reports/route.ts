import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Report from '@/lib/models/Report'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function generateReportId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CS-${ts}-${rand}`
}

function getAuthUser(token?: string) {
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    const decoded = getAuthUser(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }
    await connectDB()
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .lean()
      .maxTimeMS(5000)
    return NextResponse.json({ reports, total: reports.length })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    const decoded = getAuthUser(token)
    if (!decoded) return NextResponse.json({ message: 'Login required to submit a report' }, { status: 401 })

    await connectDB()
    let harassmentType = '', platform = '', date = '', details = ''

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData()
      harassmentType = fd.get('harassmentType') as string || ''
      platform = fd.get('platform') as string || ''
      date = fd.get('date') as string || ''
      details = fd.get('details') as string || ''
    } else {
      const body = await req.json()
      ;({ harassmentType, platform, date, details } = body)
    }

    if (!harassmentType || !platform || !details) {
      return NextResponse.json({ message: 'Type, platform and details are required' }, { status: 400 })
    }

    const reportId = generateReportId()
    const report = await Report.create({
      reportId,
      userId: decoded.userId,
      userEmail: decoded.email,
      userName: decoded.name,
      harassmentType, platform,
      date: date || undefined,
      details,
      evidenceFiles: [],
      status: 'pending',
    })

    return NextResponse.json({ message: 'Report submitted successfully', reportId: report.reportId }, { status: 201 })
  } catch (err) {
    console.error('POST /api/reports error:', err)
    return NextResponse.json({ message: 'We could not submit your report right now. Please try again.' }, { status: 500 })
  }
}
