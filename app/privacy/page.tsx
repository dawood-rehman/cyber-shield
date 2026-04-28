import { Shield, Lock, Eye, Database, Mail, RefreshCw } from 'lucide-react'

const sections = [
  {
    id: '1',
    icon: Database,
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Information You Provide',
        text: 'When you create an account, we collect your name, email address, and optionally your phone number. When you submit a harassment report, we collect the details of the incident including type of harassment, platform, date, and your description of events.'
      },
      {
        subtitle: '1.2 Evidence Files',
        text: 'You may optionally upload screenshots, documents, or other files as evidence for your report. These files are stored securely and encrypted at rest. They are only accessible to our trained support staff.'
      },
      {
        subtitle: '1.3 Automatic Information',
        text: 'We may automatically collect certain technical information including browser type, operating system, and pages visited. This information is used solely for improving the portal\'s functionality and is not linked to your identity.'
      },
    ]
  },
  {
    id: '2',
    icon: Eye,
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: '2.1 Processing Reports',
        text: 'Information you provide in harassment reports is used exclusively to review your case, connect you with appropriate resources, and — where you consent — forward to relevant authorities or platform teams for action.'
      },
      {
        subtitle: '2.2 Account Management',
        text: 'Your account information is used to authenticate you, allow you to track your submitted reports, and send you status updates about your cases (if you have provided your email).'
      },
      {
        subtitle: '2.3 Service Improvement',
        text: 'Aggregated, anonymized data may be used to improve our services, identify trends in cyber harassment, and develop better resources. No personally identifiable information is used for this purpose.'
      },
    ]
  },
  {
    id: '3',
    icon: Lock,
    title: '3. Data Security & Encryption',
    content: [
      {
        subtitle: '3.1 Encryption Standards',
        text: 'All data transmitted between your browser and our servers is encrypted using industry-standard TLS 1.3. All data stored in our databases is encrypted at rest using AES-256 encryption.'
      },
      {
        subtitle: '3.2 Access Controls',
        text: 'Access to report data is strictly limited to trained support staff. All access is logged and audited. No third-party services or advertisers have access to your report data.'
      },
      {
        subtitle: '3.3 Password Security',
        text: 'Your password is never stored in plain text. We use bcrypt with a high cost factor to hash all passwords. Even our administrators cannot see your password.'
      },
    ]
  },
  {
    id: '4',
    icon: Shield,
    title: '4. Anonymity & Confidentiality',
    content: [
      {
        subtitle: '4.1 Anonymous Reporting',
        text: 'By default, all reports are anonymous. You are not required to provide any personally identifying information to submit a harassment report. If you choose to remain fully anonymous, we will not attempt to identify you.'
      },
      {
        subtitle: '4.2 Optional Identity',
        text: 'If you choose to provide your email address (optional), it is used solely for follow-up communications about your case and will never be shared with third parties without your explicit consent.'
      },
      {
        subtitle: '4.3 Legal Obligations',
        text: 'In rare circumstances where there is an imminent threat to life, we may be legally required to share information with law enforcement. We will always notify you of such disclosures when legally permitted to do so.'
      },
    ]
  },
  {
    id: '5',
    icon: RefreshCw,
    title: '5. Data Retention',
    content: [
      {
        subtitle: '5.1 Report Data',
        text: 'Harassment reports are retained for a period of 2 years from the date of submission to allow for ongoing investigations and appeals. After this period, reports are permanently deleted from our systems.'
      },
      {
        subtitle: '5.2 Account Data',
        text: 'Your account information is retained as long as your account is active. You may request deletion of your account at any time by contacting our support team.'
      },
      {
        subtitle: '5.3 Right to Erasure',
        text: 'You have the right to request deletion of your personal data at any time. Please contact us at support@cybershield.com with your request. We will process all deletion requests within 30 days.'
      },
    ]
  },
  {
    id: '6',
    icon: Mail,
    title: '6. Contact & Your Rights',
    content: [
      {
        subtitle: '6.1 Your Rights',
        text: 'You have the right to access your personal data, correct inaccurate data, request deletion of your data, object to processing of your data, and request a copy of your data in a portable format.'
      },
      {
        subtitle: '6.2 Contact Us',
        text: 'For any privacy-related inquiries, to exercise your rights, or to report a concern about how we handle your data, please contact our Privacy Officer at: privacy@cybershield.com or through the Contact Us page.'
      },
      {
        subtitle: '6.3 Policy Updates',
        text: 'We may update this Privacy Policy from time to time. We will notify registered users of any material changes via email. Your continued use of the portal after changes constitutes acceptance of the updated policy.'
      },
    ]
  },
]

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5 text-xs font-orbitron text-cyan-400 tracking-wider">
            <Lock className="w-4 h-4" /> PRIVACY & DATA PROTECTION
          </div>
          <h1 className="font-orbitron font-black text-4xl lg:text-5xl text-white mb-4">
            PRIVACY <span className="text-cyan-400">POLICY</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your privacy is our highest priority. This policy explains exactly how we collect, use, and protect your information.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-xs text-green-400">
            <Shield className="w-4 h-4" /> Last Updated: April 28, 2026 · Effective Immediately
          </div>
        </div>
      </section>

      {/* Quick summary */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="cyber-card rounded-2xl border border-cyan-500/20 p-8 mb-12">
          <h2 className="font-orbitron font-bold text-xl text-white mb-4">Summary (TL;DR)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🔒', text: 'Anonymous reporting by default — no personal info required' },
              { icon: '🔐', text: 'All data encrypted in transit and at rest (AES-256)' },
              { icon: '🚫', text: 'We never sell your data or share it with advertisers' },
              { icon: '👁️', text: 'Only trained support staff can access report details' },
              { icon: '🗑️', text: 'You can request deletion of your data at any time' },
              { icon: '📧', text: 'Email is optional — required only for follow-up updates' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table of contents */}
        <div className="cyber-card rounded-xl border border-cyan-500/15 p-6 mb-10">
          <h3 className="font-orbitron font-semibold text-white text-sm mb-4 uppercase tracking-wider">Table of Contents</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map(s => (
              <a key={s.id} href={`#section-${s.id}`}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm py-1">
                <span className="text-cyan-600">§</span> {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Full policy sections */}
        <div className="space-y-8">
          {sections.map(({ id, icon: Icon, title, content }) => (
            <div key={id} id={`section-${id}`} className="cyber-card rounded-2xl border border-cyan-500/15 overflow-hidden scroll-mt-24">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-cyan-500/5 to-transparent border-b border-slate-700/50">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="font-orbitron font-bold text-white text-lg">{title}</h2>
              </div>
              <div className="p-6 space-y-6">
                {content.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-cyan-400 text-sm mb-2">{item.subtitle}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-12 cyber-card rounded-xl border border-orange-500/20 p-8 text-center">
          <Mail className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">Privacy Questions?</h3>
          <p className="text-slate-400 mb-4">Our Privacy Officer is available to answer any questions about how we handle your data.</p>
          <a href="mailto:privacy@cybershield.com" className="btn-cyber inline-flex items-center gap-2 px-8 py-3 rounded-lg">
            <Mail className="w-4 h-4" /> Contact Privacy Officer
          </a>
        </div>
      </section>
    </div>
  )
}
