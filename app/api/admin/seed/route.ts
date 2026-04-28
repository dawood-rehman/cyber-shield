import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

const seedArticles = [
  {
    slug: 'report-harassment',
    title: 'How to Report Online Harassment',
    excerpt: 'A comprehensive step-by-step guide to reporting harassment on all major platforms and to law enforcement agencies.',
    content: `**Step 1: Document Everything**\nBefore reporting, screenshot all harassment, save links, and note dates and times. This evidence is crucial for any formal report.\n\n**Step 2: Block the Harasser**\nMost platforms let you block users immediately. This stops further contact while you gather evidence.\n\n**Step 3: Report to the Platform**\nUse the platform's built-in reporting tools. Go to the offending content and look for "Report" options. Include all relevant evidence.\n\n**Step 4: Report to Cybercrime Units**\nFor severe harassment, contact your national cybercrime unit. In Pakistan, contact FIA Cybercrime Wing. In the US, this is the FBI's IC3.\n\n**Step 5: Seek Legal Help**\nConsult an attorney specializing in cybercrime. Many forms of online harassment are illegal and can result in criminal charges.\n\n**Step 6: Get Support**\nReach out to mental health resources and support groups. You don't have to face this alone.`,
    category: 'Guide', readTime: '8 min read', author: 'CyberShield Team', published: true, tags: ['harassment','reporting','safety'],
  },
  {
    slug: 'cyber-safety-tips',
    title: 'Essential Cyber Safety Tips',
    excerpt: 'Protect your digital life with these proven strategies used by cybersecurity professionals worldwide.',
    content: `**Use Strong, Unique Passwords**\nCreate passwords with 12+ characters mixing letters, numbers, and symbols. Never reuse passwords across sites.\n\n**Enable Two-Factor Authentication (2FA)**\nAdd a second layer of security to all important accounts. Use authenticator apps instead of SMS when possible.\n\n**Keep Software Updated**\nSecurity patches are critical. Enable automatic updates for your OS, apps, and antivirus software.\n\n**Be Phishing-Aware**\nDon't click suspicious links. Always verify the sender's email address. When in doubt, go directly to the website.\n\n**Use a VPN**\nVirtual Private Networks encrypt your internet traffic, especially important on public Wi-Fi networks.\n\n**Regular Backups**\nFollow the 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 off-site backup.`,
    category: 'Safety', readTime: '6 min read', author: 'CyberShield Team', published: true, tags: ['safety','passwords','tips'],
  },
  {
    slug: 'privacy-settings',
    title: 'Privacy Settings & Your Digital Safety',
    excerpt: 'Configure your social media and online accounts to minimize your exposure and protect personal information.',
    content: `**Facebook/Meta Privacy**\nSet profile to "Friends Only." Review tagged photos. Limit who can search for you. Review app permissions regularly.\n\n**Instagram Safety**\nSwitch to a private account if needed. Disable location tagging. Use "Close Friends" for sensitive content.\n\n**Google Account**\nReview your Google Activity controls. Turn off location history if not needed. Use Privacy Checkup tool regularly.\n\n**Twitter/X Settings**\nProtect your tweets if needed. Disable precise location. Remove phone number from visibility settings.\n\n**General Best Practices**\nReview privacy settings quarterly. Use different usernames across platforms. Never share your real location publicly.`,
    category: 'Privacy', readTime: '7 min read', author: 'CyberShield Team', published: true, tags: ['privacy','social-media'],
  },
  {
    slug: 'cyberbullying-awareness',
    title: 'Understanding and Combating Cyberbullying',
    excerpt: 'Learn to recognize cyberbullying patterns and effective strategies to combat them for yourself or others.',
    content: `**What is Cyberbullying?**\nCyberbullying involves using digital technology to harass, threaten, embarrass, or target another person. It can occur on social media, messaging apps, gaming platforms, or websites.\n\n**Warning Signs**\nBeing upset after using devices. Withdrawing from friends and family. Reluctance to discuss online activities. Unexplained anger or depression.\n\n**How to Respond**\nDon't respond to bullies — it often escalates things. Document everything. Block and report. Seek support from trusted adults or professionals.\n\n**Supporting Others**\nIf you witness cyberbullying, don't participate or share. Show support for the victim. Report it to platform administrators.`,
    category: 'Awareness', readTime: '9 min read', author: 'CyberShield Team', published: true, tags: ['cyberbullying','awareness'],
  },
  {
    slug: 'identity-theft-protection',
    title: 'Protecting Yourself from Identity Theft',
    excerpt: 'Comprehensive guide to preventing identity theft and what to do if your identity has been compromised online.',
    content: `**Monitor Your Accounts**\nCheck bank and credit statements monthly. Set up fraud alerts. Use credit monitoring services.\n\n**Secure Your Information**\nUse encrypted storage for sensitive documents. Shred physical documents with personal information. Never share SSN/NIC unnecessarily.\n\n**Online Protection**\nUse strong, unique passwords. Enable 2FA everywhere. Be cautious about what you share online.\n\n**If You're a Victim**\nReport to police immediately. Contact your bank. File a report with national fraud authorities. Notify credit bureaus.`,
    category: 'Protection', readTime: '10 min read', author: 'CyberShield Team', published: true, tags: ['identity','protection'],
  },
  {
    slug: 'mental-health-digital-harassment',
    title: 'Mental Health & Recovering from Digital Harassment',
    excerpt: 'Resources and strategies for healing from the psychological impact of online harassment and cyberbullying.',
    content: `**Acknowledge the Impact**\nOnline harassment causes real psychological harm including anxiety, depression, and PTSD. Your feelings are valid.\n\n**Immediate Steps**\nStep away from the device. Reach out to someone you trust. Contact a crisis line if needed.\n\n**Long-term Recovery**\nConsider therapy with someone experienced in digital trauma. Practice digital detoxes. Rebuild your online presence on your terms.\n\n**Support Resources**\nNational crisis hotlines, online therapy platforms, and support communities can all be valuable resources. Crisis Text Line: Text HOME to 741741.`,
    category: 'Mental Health', readTime: '8 min read', author: 'CyberShield Team', published: true, tags: ['mental-health','recovery'],
  },
]

export async function GET() {
  try {
    await connectDB()
    let seeded = 0
    for (const a of seedArticles) {
      const exists = await Article.findOne({ slug: a.slug })
      if (!exists) { await Article.create(a); seeded++ }
    }
    return NextResponse.json({ message: `Seeded ${seeded} articles` })
  } catch (err) {
    return NextResponse.json({ message: 'Seed failed', error: String(err) }, { status: 500 })
  }
}
