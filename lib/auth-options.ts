import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

const ADMIN_EMAIL = 'admin123@gmail.com'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const providers: NextAuthOptions['providers'] = []

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  )
}

export async function findOrCreateGoogleUser(email: string, name?: string | null) {
  const normalizedEmail = email.toLowerCase()
  await connectDB()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    return existing
  }

  if (normalizedEmail === ADMIN_EMAIL) {
    throw new Error('This email is reserved')
  }

  const randomPassword = crypto.randomBytes(32).toString('hex')
  const hashedPassword = await bcrypt.hash(randomPassword, 12)

  return User.create({
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    password: hashedPassword,
    role: 'user',
  })
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'cybershield-nextauth-secret',
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true
      if (!user.email) return false

      try {
        await findOrCreateGoogleUser(user.email, user.name)
        return true
      } catch (err) {
        console.error('Google sign-in error:', err)
        return false
      }
    },
    async jwt({ token }) {
      if (!token.email) return token

      try {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email.toLowerCase() })
        if (dbUser) {
          token.userId = dbUser._id.toString()
          token.name = dbUser.name
          token.role = dbUser.role
          token.phone = dbUser.phone || ''
        }
      } catch (err) {
        console.error('NextAuth JWT user lookup error:', err)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).userId = token.userId
        ;(session.user as any).role = token.role || 'user'
        ;(session.user as any).phone = token.phone || ''
        session.user.name = (token.name as string) || session.user.name
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}
