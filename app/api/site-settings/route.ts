import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import SiteSettings from '@/lib/models/SiteSettings'
import { normalizeSiteSettings, type SiteSettings as PublicSiteSettings } from '@/lib/site-settings'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function getAuth(token?: string) {
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export async function GET() {
  try {
    await connectDB()
    const settings = await SiteSettings.findOne({ key: 'global' }).lean().maxTimeMS(5000)
    return NextResponse.json({ settings: normalizeSiteSettings(settings as Partial<PublicSiteSettings> | null) })
  } catch (err) {
    console.error('GET /api/site-settings error:', err)
    return NextResponse.json({ settings: normalizeSiteSettings() })
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = cookies()
    const decoded = getAuth(cookieStore.get('auth-token')?.value)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const supportEmail = typeof body.supportEmail === 'string' ? body.supportEmail.trim() : undefined
    const supportPhone = typeof body.supportPhone === 'string' ? body.supportPhone.trim() : undefined

    if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
      return NextResponse.json({ message: 'Please enter a valid support email.' }, { status: 400 })
    }

    await connectDB()
    const update: Record<string, string> = {}
    if (supportEmail !== undefined) update.supportEmail = supportEmail
    if (supportPhone !== undefined) update.supportPhone = supportPhone

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'global' },
      { $set: { key: 'global', ...update } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean().maxTimeMS(5000)

    return NextResponse.json({ message: 'Contact information updated', settings: normalizeSiteSettings(settings as Partial<PublicSiteSettings> | null) })
  } catch (err) {
    console.error('PATCH /api/site-settings error:', err)
    return NextResponse.json({ message: 'Could not update contact information. Please try again.' }, { status: 500 })
  }
}
