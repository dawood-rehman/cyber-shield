import Link from 'next/link'
import { Shield, AlertTriangle, BookOpen, Users, Lock, ArrowRight, Star, CheckCircle, Eye, Zap, Globe, Heart } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Reports Handled', icon: Shield },
  { value: '98%', label: 'Satisfaction Rate', icon: Star },
  { value: '24/7', label: 'Support Available', icon: Zap },
  { value: '150+', label: 'Resources & Guides', icon: BookOpen },
]

const features = [
  {
    icon: Lock,
    title: 'Anonymous Reporting',
    desc: 'Report incidents without revealing your identity. Your privacy is our top priority with end-to-end encryption.',
    color: 'cyan',
  },
  {
    icon: Shield,
    title: 'Digital Safety Resources',
    desc: 'Access comprehensive guides, articles, and tools to protect yourself from online harassment and threats.',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Expert Support Team',
    desc: 'Connect with trained cybersecurity experts and mental health specialists for immediate assistance.',
    color: 'purple',
  },
  {
    icon: Globe,
    title: 'Legal Awareness',
    desc: 'Understand your legal rights online. Get guidance on reporting to authorities and platform moderation.',
    color: 'green',
  },
  {
    icon: Heart,
    title: 'Mental Health Support',
    desc: 'Access mental health resources and connect with counselors who understand digital trauma and harassment.',
    color: 'pink',
  },
  {
    icon: Eye,
    title: 'AI-Powered Chatbot',
    desc: 'Get instant answers to your questions about cyber harassment, safety tips, and reporting steps.',
    color: 'yellow',
  },
]

const colorMap: Record<string, string> = {
  cyan: 'border-cyan-500/30 hover:border-cyan-400/60 [&_.icon]:text-cyan-400 [&_.glow]:bg-cyan-500/10',
  orange: 'border-orange-500/30 hover:border-orange-400/60 [&_.icon]:text-orange-400 [&_.glow]:bg-orange-500/10',
  purple: 'border-purple-500/30 hover:border-purple-400/60 [&_.icon]:text-purple-400 [&_.glow]:bg-purple-500/10',
  green: 'border-green-500/30 hover:border-green-400/60 [&_.icon]:text-green-400 [&_.glow]:bg-green-500/10',
  pink: 'border-pink-500/30 hover:border-pink-400/60 [&_.icon]:text-pink-400 [&_.glow]:bg-pink-500/10',
  yellow: 'border-yellow-500/30 hover:border-yellow-400/60 [&_.icon]:text-yellow-400 [&_.glow]:bg-yellow-500/10',
}

const articles = [
  { title: 'How to Report Online Harassment', excerpt: 'Step-by-step guide to reporting harassment on major platforms and to law enforcement.', category: 'Guide', href: '/articles/report-harassment' },
  { title: 'Essential Cyber Safety Tips', excerpt: 'Protect your digital life with these proven strategies used by security professionals.', category: 'Safety', href: '/articles/cyber-safety-tips' },
  { title: 'Privacy Settings & Your Digital Safety', excerpt: 'Configure your accounts to minimize exposure and protect your personal information.', category: 'Privacy', href: '/articles/privacy-settings' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 hex-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />

        {/* Animated rings */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block">
          <div className="relative w-96 h-96">
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"
                style={{ animationDuration: `${2 + i}s`, animationDelay: `${i * 0.5}s`, transform: `scale(${i})` }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-48 h-48 text-cyan-400/30" />
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 text-xs font-orbitron text-cyan-400 tracking-wider">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SECURE & ENCRYPTED PLATFORM
            </div>

            <h1 className="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              <span className="text-cyan-400 glow-text">CYBER</span>{' '}
              <span className="text-orange-400 glow-orange">SECURITY</span>
              <br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl">HARASSMENT RESPONSE</span>
              <br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl">AND DIGITAL SAFETY PORTAL</span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-4 font-medium">
              Protecting You from Online Harassment, Cyberbullying, and Digital Threats.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Get support, resources, and tools to stay safe online. Report incidents, learn digital safety tips, and connect with experts for immediate assistance.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/report" className="btn-cyber flex items-center gap-2 text-base px-8 py-4">
                🚨 Get Help Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                Learn More
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {['Anonymous Reporting', 'Expert Support', 'Free Resources'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 border-y border-cyan-500/10">
        <div className="absolute inset-0 bg-navy-900/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="cyber-card rounded-xl p-6 text-center group">
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:text-orange-400 transition-colors" />
                <div className="font-orbitron font-black text-3xl text-cyan-400 mb-1">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block font-orbitron text-xs text-cyan-400 tracking-widest uppercase mb-3 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">Our Features</div>
            <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-white mb-4">
              Everything You Need to <span className="text-cyan-400">Stay Safe</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our comprehensive platform provides all the tools and resources you need to combat cyber harassment and protect your digital wellbeing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`cyber-card rounded-xl p-6 border ${colorMap[color]} transition-all duration-300 group`}>
                <div className={`glow w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`icon w-7 h-7`} />
                </div>
                <h3 className="font-orbitron font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Preview */}
      <section className="py-24 relative">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="absolute inset-0 bg-navy-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-white mb-4">
              CYBER SAFETY <span className="text-orange-400">GUIDES & ARTICLES</span>
            </h2>
            <p className="text-slate-400">Stay informed with our latest resources on digital safety and harassment prevention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {articles.map(({ title, excerpt, category, href }) => (
              <Link key={href} href={href} className="cyber-card rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 group transition-all">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-orbitron tracking-wide mb-4">{category}</div>
                <h3 className="font-orbitron font-semibold text-white text-base mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{excerpt}</p>
                <span className="text-cyan-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/articles" className="btn-outline inline-flex items-center gap-2">
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-navy-800 to-orange-600/20" />
        <div className="absolute inset-0 border-y border-cyan-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-6 animate-pulse" />
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-white mb-4">
            Stay Informed and <span className="text-cyan-400">Stay Safe Online</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join our community and stay informed. Follow us for the latest digital safety tips, news, and resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/report" className="btn-cyber px-8 py-4 text-base flex items-center gap-2">
              Report Harassment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/resources" className="btn-outline px-8 py-4 text-base">
              Browse Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
