import { Shield, Lock, Eye, AlertTriangle, Wifi, Cloud, Smartphone, Users, Search, Link2 } from 'lucide-react'

const tips = [
  {
    icon: Users,
    title: 'Recognizing Cyberbullying',
    desc: 'Be aware of signs of cyberbullying. Report and block offenders. Keep a record of harassment incidents for evidence.',
    category: 'Awareness',
    color: 'cyan',
  },
  {
    icon: Lock,
    title: 'Secure Your Accounts',
    desc: 'Use strong, unique passwords for every account. Enable two-factor authentication for extra security on all platforms.',
    category: 'Account Security',
    color: 'orange',
  },
  {
    icon: AlertTriangle,
    title: 'Beware of Phishing',
    desc: 'Avoid clicking on suspicious links or opening attachments from unknown senders. Verify website URLs before entering info.',
    category: 'Phishing',
    color: 'red',
  },
  {
    icon: Shield,
    title: 'Use Antivirus Protection',
    desc: 'Install and regularly update antivirus software to protect against malware, viruses, and ransomware attacks.',
    category: 'Protection',
    color: 'green',
  },
  {
    icon: Eye,
    title: 'Think Before You Share',
    desc: 'Be mindful of what you post online. Your personal information can be misused if overshared with the wrong people.',
    category: 'Privacy',
    color: 'purple',
  },
  {
    icon: Link2,
    title: 'Avoid Suspicious Links',
    desc: "Don't click links from unknown emails or messages. Always verify the website's legitimacy before entering any information.",
    category: 'Safe Browsing',
    color: 'yellow',
  },
  {
    icon: Search,
    title: 'Download from Trusted Sources Only',
    desc: 'Avoid installing apps or files from unknown or unsafe websites. Only use official app stores and verified sources.',
    category: 'Downloads',
    color: 'teal',
  },
  {
    icon: Smartphone,
    title: 'Secure Your Devices',
    desc: 'Use antivirus software and lock your devices with a PIN, strong password, or fingerprint/biometric authentication.',
    category: 'Device Security',
    color: 'blue',
  },
  {
    icon: Cloud,
    title: 'Make Backups Regularly',
    desc: 'Regularly back up important data to secure locations to protect your files in case of ransomware attacks or data loss.',
    category: 'Backup',
    color: 'indigo',
  },
  {
    icon: Wifi,
    title: 'Be Careful on Public Wi-Fi',
    desc: 'Avoid accessing sensitive accounts on public networks. Use a VPN to encrypt your connection when on public Wi-Fi.',
    category: 'Network Safety',
    color: 'pink',
  },
  {
    icon: Lock,
    title: 'Review App Permissions',
    desc: "Regularly review and limit the permissions you grant to apps. Don't give apps access to data they don't need.",
    category: 'App Safety',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Protect Your Social Media',
    desc: 'Set your social media profiles to private. Be selective about who you accept as friends or followers online.',
    category: 'Social Media',
    color: 'cyan',
  },
]

const colorConfig: Record<string, { badge: string; icon: string; border: string }> = {
  cyan: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: 'text-cyan-400', border: 'border-cyan-500/20 hover:border-cyan-400/50' },
  orange: { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: 'text-orange-400', border: 'border-orange-500/20 hover:border-orange-400/50' },
  red: { badge: 'bg-red-500/10 text-red-400 border-red-500/20', icon: 'text-red-400', border: 'border-red-500/20 hover:border-red-400/50' },
  green: { badge: 'bg-green-500/10 text-green-400 border-green-500/20', icon: 'text-green-400', border: 'border-green-500/20 hover:border-green-400/50' },
  purple: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: 'text-purple-400', border: 'border-purple-500/20 hover:border-purple-400/50' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: 'text-yellow-400', border: 'border-yellow-500/20 hover:border-yellow-400/50' },
  teal: { badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20', icon: 'text-teal-400', border: 'border-teal-500/20 hover:border-teal-400/50' },
  blue: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: 'text-blue-400', border: 'border-blue-500/20 hover:border-blue-400/50' },
  indigo: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: 'text-indigo-400', border: 'border-indigo-500/20 hover:border-indigo-400/50' },
  pink: { badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: 'text-pink-400', border: 'border-pink-500/20 hover:border-pink-400/50' },
}

export default function DigitalSafetyTipsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5 text-xs font-orbitron text-cyan-400 tracking-wider">
            <Shield className="w-4 h-4" /> DIGITAL SAFETY TIPS
          </div>
          <h1 className="font-orbitron font-black text-4xl lg:text-5xl text-white mb-4">
            STAY <span className="text-cyan-400">SAFE</span> ONLINE
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Essential cybersecurity practices to protect your digital life, privacy, and online presence from modern threats.
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map(({ icon: Icon, title, desc, category, color }) => {
            const c = colorConfig[color] || colorConfig.cyan
            return (
              <div key={title} className={`cyber-card rounded-xl p-6 border ${c.border} transition-all duration-300 group`}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-navy-900/60 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className={`w-8 h-8 ${c.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`inline-block text-xs px-2.5 py-0.5 rounded-full border mb-2 font-orbitron tracking-wide ${c.badge}`}>{category}</div>
                    <h3 className="font-orbitron font-semibold text-white text-base mb-2 leading-tight">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-navy-900 to-red-600/20" />
        <div className="absolute inset-0 border-y border-orange-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="font-orbitron font-bold text-2xl lg:text-3xl text-white mb-3">
            Experiencing Harassment Right Now?
          </h2>
          <p className="text-slate-300 mb-6">Don't wait. Report it anonymously and get immediate support from our team.</p>
          <a href="/report" className="btn-cyber inline-flex items-center gap-2 px-8 py-4 text-base">
            🚨 Report Immediately
          </a>
        </div>
      </section>
    </div>
  )
}
