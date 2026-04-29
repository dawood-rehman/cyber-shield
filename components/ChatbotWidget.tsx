'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string; time: string }

const QUICK_REPLIES = [
  'How do I report harassment?',
  'Digital safety tips',
  'What is cyberbullying?',
  'How to stay anonymous?',
  'Mental health support',
]

const FALLBACK_RESPONSES: Record<string, string> = {
  default: `Hello! I'm CyberShield AI, your digital safety assistant. I'm here to help you with:\n\n• **Cyber harassment reporting** — How to report incidents\n• **Digital safety tips** — Protect yourself online\n• **Cyberbullying awareness** — Recognize and respond\n• **Privacy guidance** — Keep your data safe\n• **Mental health support** — Resources and guidance\n\nWhat can I help you with today?`,
  report: `Here's how to report harassment:\n\n**1. Document Everything**\nScreenshot all harassment. Note dates, times, and what was said.\n\n**2. Use Our Anonymous Report Form**\nClick "Report Harassment" in the navigation. Your identity is fully protected.\n\n**3. Report to the Platform**\nUse the platform's built-in reporting tools (Facebook, Instagram, etc.)\n\n**4. Contact Authorities**\nFor serious threats: FIA Cybercrime (Pakistan) or FBI IC3 (USA).\n\nWould you like help with any of these steps?`,
  cyberbullying: `**What is Cyberbullying?**\n\nCyberbullying is using digital technology to harass, threaten, or embarrass someone. It includes:\n\n• Sending threatening messages\n• Spreading rumors online\n• Sharing private images without consent\n• Excluding someone online\n• Impersonating someone\n\n**What to do:**\n• Don't respond to the bully\n• Block and report them\n• Save all evidence\n• Talk to a trusted adult or professional\n• Report it through our platform anonymously`,
  safety: `**Top Digital Safety Tips:**\n\n🔐 **Passwords** — Use strong, unique passwords for every account. Consider a password manager like Bitwarden.\n\n🔑 **Two-Factor Auth** — Enable 2FA on all important accounts.\n\n🚫 **Phishing** — Never click suspicious links. Verify senders.\n\n🛡️ **Antivirus** — Keep security software updated.\n\n📱 **App Permissions** — Regularly review what apps can access.\n\n🌐 **VPN** — Use a VPN on public Wi-Fi.\n\n💾 **Backups** — Back up your data regularly.\n\nNeed details on any of these?`,
  anonymous: `**How to Stay Anonymous:**\n\n**On Our Platform:**\nAll reports are anonymous by default — we never require personal information. Your IP is not logged with your report.\n\n**Online Anonymity Tools:**\n• **Tor Browser** — Routes your traffic through multiple servers\n• **VPN** — Encrypts your connection\n• **ProtonMail** — Encrypted anonymous email\n• **Signal** — End-to-end encrypted messaging\n\n**Privacy Settings:**\nAudit your social media privacy settings regularly. Limit public information.\n\nWould you like more info about any of these tools?`,
  mental: `**Mental Health Support Resources:**\n\nExperiencing online harassment can be traumatic. Please know you're not alone.\n\n**Immediate Help:**\n• **Crisis Text Line** — Text HOME to 741741\n• **Befrienders Worldwide** — befrienders.org\n• **Vandrevala Foundation** — 1860-2662-345 (Pakistan)\n\n**Recovery Tips:**\n• Take digital breaks when overwhelmed\n• Talk to someone you trust\n• Consider professional therapy\n• Join support communities\n• Remember: It's not your fault\n\nYou can also chat with our support team through the Contact page.`,
  identity: `**Protecting Your Identity Online:**\n\n**Prevent Identity Theft:**\n• Never share your NIC/SSN online\n• Use unique passwords for financial accounts\n• Enable 2FA on banking apps\n• Monitor your accounts regularly\n• Check Have I Been Pwned (haveibeenpwned.com)\n\n**If You're a Victim:**\n1. Contact your bank immediately\n2. File a police report\n3. Report to FIA Cybercrime (Pakistan)\n4. Notify credit bureaus\n5. Document everything\n\nNeed more specific guidance?`,
}

function getResponse(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('report') || lower.includes('submit')) return FALLBACK_RESPONSES.report
  if (lower.includes('bully') || lower.includes('harass')) return FALLBACK_RESPONSES.cyberbullying
  if (lower.includes('safe') || lower.includes('tip') || lower.includes('protect')) return FALLBACK_RESPONSES.safety
  if (lower.includes('anon') || lower.includes('private') || lower.includes('hidden')) return FALLBACK_RESPONSES.anonymous
  if (lower.includes('mental') || lower.includes('stress') || lower.includes('anxious') || lower.includes('help')) return FALLBACK_RESPONSES.mental
  if (lower.includes('identity') || lower.includes('theft') || lower.includes('stolen')) return FALLBACK_RESPONSES.identity
  return `Thank you for your question about "${msg}". \n\nI can help you with:\n• Reporting cyber harassment\n• Digital safety tips\n• Cyberbullying awareness\n• Staying anonymous online\n• Mental health support\n• Identity theft protection\n\nPlease try one of the quick replies below, or ask me specifically about any of these topics!`
}

function formatMessage(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} className="font-semibold text-white mt-2">{line.slice(2, -2)}</div>
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <div key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
        {parts.map((p, j) =>
          p.startsWith('**') ? <strong key={j} className="text-cyan-300 font-semibold">{p.slice(2, -2)}</strong> : p
        )}
      </div>
    )
  })
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: FALLBACK_RESPONSES.default, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  useEffect(() => {
    const handleOpenChat = () => {
      setOpen(true)
      setMinimized(false)
    }

    window.addEventListener('cybershield:open-chat', handleOpenChat)
    return () => window.removeEventListener('cybershield:open-chat', handleOpenChat)
  }, [])
  useEffect(() => {
    if (!open || minimized) return

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100)
    return () => window.clearTimeout(focusTimer)
  }, [minimized, open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Msg = { role: 'user', content: text, time }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || getResponse(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: getResponse(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false) }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all hover:scale-110 group"
        title="Chat with AI Assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-navy-900 animate-pulse">
            AI
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-full max-w-sm transition-all duration-300 ${minimized ? 'h-14' : 'h-[500px]'} flex flex-col`}>
          <div className="cyber-card rounded-2xl border border-cyan-500/30 shadow-2xl shadow-black/60 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-navy-900 to-navy-800 border-b border-cyan-500/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-navy-900" />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-sm text-white">CyberShield AI</div>
                  <div className="text-xs text-green-400">Online • Digital Safety Expert</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setMinimized(!minimized)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-900/80">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        msg.role === 'assistant' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-orange-500/20 border border-orange-500/30'
                      }`}>
                        {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'chatbot-bubble-user text-white' : 'chatbot-bubble-bot text-slate-200'
                        }`}>
                          <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                        </div>
                        <div className="text-xs text-slate-600 px-1">{msg.time}</div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="chatbot-bubble-bot px-4 py-3 rounded-2xl">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick replies */}
                <div className="px-3 py-2 bg-navy-900/90 border-t border-slate-700/50 overflow-x-auto">
                  <div className="flex gap-2 pb-1">
                    {QUICK_REPLIES.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-cyan-500/20 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all whitespace-nowrap">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="px-3 py-3 bg-navy-900/90 border-t border-slate-700/50 shrink-0">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask about digital safety..."
                      className="cyber-input flex-1 text-sm py-2.5 px-3"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                      disabled={loading}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading}
                      className="btn-cyber px-3 py-2.5 rounded-lg disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
