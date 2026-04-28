import Link from 'next/link'
import { Shield, BookOpen, Heart, Scale, Lock, Users, ArrowRight, ExternalLink } from 'lucide-react'

const categories = [
  {
    icon: Shield,
    title: 'Harassment Response',
    color: 'orange',
    resources: [
      { title: 'Report to Cybercrime Wing (Pakistan)', desc: 'Official FIA portal for reporting cybercrime in Pakistan', href: 'https://www.fia.gov.pk', external: true },
      { title: 'FBI Internet Crime Complaint Center', desc: 'US federal resource for reporting internet crimes', href: 'https://www.ic3.gov', external: true },
      { title: 'Anonymous Report Form', desc: 'Submit an anonymous harassment report on our platform', href: '/report', external: false },
      { title: 'Platform Reporting Guides', desc: 'How to report on Facebook, Instagram, Twitter, and more', href: '/articles/report-harassment', external: false },
    ],
  },
  {
    icon: BookOpen,
    title: 'Digital Safety Education',
    color: 'cyan',
    resources: [
      { title: 'Cybersecurity for Beginners', desc: 'Essential guide to staying safe online', href: '/articles/cyber-safety-tips', external: false },
      { title: 'Privacy Settings Guide', desc: 'Configure your accounts for maximum privacy', href: '/articles/privacy-settings', external: false },
      { title: 'Digital Safety Tips', desc: 'Comprehensive tips from security experts', href: '/digital-safety-tips', external: false },
      { title: 'Identity Theft Protection', desc: 'How to prevent and recover from identity theft', href: '/articles/identity-theft-protection', external: false },
    ],
  },
  {
    icon: Heart,
    title: 'Mental Health Support',
    color: 'pink',
    resources: [
      { title: 'Crisis Text Line', desc: 'Text HOME to 741741 for immediate mental health support', href: 'https://www.crisistextline.org', external: true },
      { title: 'Digital Trauma Recovery', desc: 'Resources for recovering from online harassment', href: '/articles/mental-health-digital-harassment', external: false },
      { title: 'Befrienders Worldwide', desc: 'Global emotional support and crisis intervention', href: 'https://www.befrienders.org', external: true },
      { title: 'Vandrevala Foundation', desc: '24/7 helpline for mental health support in Pakistan', href: 'tel:1860-2662-345', external: false },
    ],
  },
  {
    icon: Scale,
    title: 'Legal Resources',
    color: 'purple',
    resources: [
      { title: 'PECA 2016 Overview', desc: 'Pakistan Electronic Crimes Act — know your legal rights', href: '/articles/report-harassment', external: false },
      { title: 'Digital Rights Foundation', desc: 'Legal aid for online harassment victims in Pakistan', href: 'https://digitalrightsfoundation.pk', external: true },
      { title: 'Cyber Harassment Helpline', desc: 'Free legal consultation for harassment victims (Pakistan)', href: 'tel:0800-39393', external: false },
      { title: 'Cyber Crime Laws by Country', desc: 'International legal framework for cybercrime', href: '/articles/report-harassment', external: false },
    ],
  },
  {
    icon: Lock,
    title: 'Security Tools',
    color: 'green',
    resources: [
      { title: 'Have I Been Pwned?', desc: 'Check if your email/password has been compromised', href: 'https://haveibeenpwned.com', external: true },
      { title: 'Bitwarden Password Manager', desc: 'Free, open-source password manager', href: 'https://bitwarden.com', external: true },
      { title: 'Tor Browser', desc: 'Browse the web anonymously', href: 'https://www.torproject.org', external: true },
      { title: 'ProtonMail', desc: 'Encrypted email for secure communication', href: 'https://proton.me', external: true },
    ],
  },
  {
    icon: Users,
    title: 'Community Support',
    color: 'blue',
    resources: [
      { title: 'Anti-Cyberbullying Alliance', desc: 'Community-driven support for harassment victims', href: '#', external: true },
      { title: 'Cyber Smile Foundation', desc: 'Global cyberbullying helpline and resources', href: 'https://cybersmile.org', external: true },
      { title: 'Without My Consent', desc: 'Resources for victims of non-consensual sharing', href: '#', external: false },
      { title: 'Online SOS', desc: 'Community guides for urgent online safety situations', href: '#', external: false },
    ],
  },
]

const colorMap: Record<string, { border: string; icon: string; title: string }> = {
  orange: { border: 'border-orange-500/20 hover:border-orange-400/50', icon: 'text-orange-400 bg-orange-500/10', title: 'text-orange-400' },
  cyan: { border: 'border-cyan-500/20 hover:border-cyan-400/50', icon: 'text-cyan-400 bg-cyan-500/10', title: 'text-cyan-400' },
  pink: { border: 'border-pink-500/20 hover:border-pink-400/50', icon: 'text-pink-400 bg-pink-500/10', title: 'text-pink-400' },
  purple: { border: 'border-purple-500/20 hover:border-purple-400/50', icon: 'text-purple-400 bg-purple-500/10', title: 'text-purple-400' },
  green: { border: 'border-green-500/20 hover:border-green-400/50', icon: 'text-green-400 bg-green-500/10', title: 'text-green-400' },
  blue: { border: 'border-blue-500/20 hover:border-blue-400/50', icon: 'text-blue-400 bg-blue-500/10', title: 'text-blue-400' },
}

export default function ResourcesPage() {
  return (
    <div className="pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-orbitron font-black text-4xl lg:text-5xl text-white mb-4">
            DIGITAL SAFETY <span className="text-cyan-400">RESOURCES</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A curated collection of resources, tools, and organizations to help you stay safe, report harassment, and recover from online threats.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {categories.map(({ icon: Icon, title, color, resources }) => {
            const c = colorMap[color]
            return (
              <div key={title} className={`cyber-card rounded-xl border ${c.border} transition-all overflow-hidden`}>
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className={`font-orbitron font-bold text-lg ${c.title}`}>{title}</h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {resources.map(({ title: rt, desc, href, external }) => (
                    <a key={rt} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
                      className="flex items-start justify-between gap-4 p-5 hover:bg-cyan-500/5 transition-colors group">
                      <div>
                        <div className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors mb-1">{rt}</div>
                        <div className="text-slate-500 text-xs">{desc}</div>
                      </div>
                      {external ? <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                        : <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
