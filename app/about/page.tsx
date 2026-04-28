import { Shield, Users, Target, Award, CheckCircle, Heart, Lock, Globe } from 'lucide-react'

const team = [
  { name: 'Dr. Sarah Mitchell', role: 'Lead Cybersecurity Expert', bio: '15+ years in digital security and threat analysis.', initials: 'SM', color: 'cyan' },
  { name: 'James Rodriguez', role: 'Mental Health Specialist', bio: 'Licensed counselor specializing in digital trauma and online harassment recovery.', initials: 'JR', color: 'orange' },
  { name: 'Aisha Patel', role: 'Legal Advocate', bio: 'Cybercrime attorney with expertise in online harassment laws and victim rights.', initials: 'AP', color: 'purple' },
  { name: 'Liu Wei', role: 'Platform Safety Engineer', bio: 'Expert in content moderation systems and abuse prevention infrastructure.', initials: 'LW', color: 'green' },
]

const values = [
  { icon: Lock, title: 'Privacy First', desc: 'We never compromise on user privacy. All data is encrypted and your identity remains protected.' },
  { icon: Heart, title: 'Empathy-Driven', desc: 'We approach every case with compassion and understand the emotional impact of harassment.' },
  { icon: Shield, title: 'Unwavering Security', desc: 'Military-grade security protocols ensure your reports and information stay confidential.' },
  { icon: Globe, title: 'Inclusive Platform', desc: 'Built for everyone — regardless of age, background, or technical expertise.' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 text-xs font-orbitron text-cyan-400 tracking-wider">
            <Shield className="w-4 h-4" /> ABOUT OUR MISSION
          </div>
          <h1 className="font-orbitron font-black text-4xl lg:text-6xl text-white mb-6">
            WHO <span className="text-cyan-400">WE ARE</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Founded by cybersecurity professionals, our platform was established to address the growing concern of online harassment and cyberbullying.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-white mb-6">
                OUR <span className="text-orange-400">MISSION</span>
              </h2>
              <div className="cyber-card rounded-xl p-8 border border-cyan-500/20 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-white text-lg mb-3">Our Mission Statement</h3>
                    <p className="text-slate-300 leading-relaxed">
                      The Cyber Security Harassment Response and Digital Safety Portal is dedicated to providing resources, support, and tools to combat online harassment, cyberbullying, and digital threats.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-3">
                      Our mission is to create a safe digital environment by empowering individuals and organizations with the knowledge and resources they need to protect themselves online.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {['100% Anonymous Reporting System', 'Expert-led Response Team', 'Evidence-based Safety Resources', 'Legal and Mental Health Guidance'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="cyber-card rounded-2xl p-10 border border-orange-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-cyan-500/5" />
                <Shield className="w-32 h-32 text-cyan-400/40 mx-auto mb-6 animate-pulse" />
                <h3 className="font-orbitron font-bold text-2xl text-white mb-4">Who We Are</h3>
                <p className="text-slate-300 leading-relaxed">
                  Our team is composed of experienced cybersecurity experts, mental health specialists, and highly dedicated advocates who are passionate about protecting your online presence.
                </p>
                <p className="text-slate-400 mt-4 leading-relaxed">
                  We understand the complexities of digital threats and are committed to providing effective solutions and support for every individual who reaches out to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-navy-900/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-orbitron font-bold text-3xl text-white mb-4">OUR <span className="text-cyan-400">CORE VALUES</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="cyber-card rounded-xl p-6 border border-cyan-500/20 text-center hover:border-cyan-400/50 transition-all">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-orbitron font-bold text-3xl text-white mb-4">MEET THE <span className="text-orange-400">TEAM</span></h2>
            <p className="text-slate-400">The dedicated professionals protecting your digital world</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, bio, initials, color }) => (
              <div key={name} className="cyber-card rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all text-center group">
                <div className={`w-20 h-20 rounded-full bg-${color}-500/10 border-2 border-${color}-500/40 flex items-center justify-center mx-auto mb-4 text-2xl font-orbitron font-bold text-${color}-400 group-hover:scale-110 transition-transform`}>
                  {initials}
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-1">{name}</h3>
                <div className="text-cyan-400 text-xs font-orbitron tracking-wide mb-3">{role}</div>
                <p className="text-slate-400 text-sm">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
