import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are CyberShield AI, an expert digital safety assistant for the CyberShield Harassment Response and Digital Safety Portal. You help users with:

1. Cyber harassment reporting — how to report, what to document, where to report
2. Digital safety tips — passwords, 2FA, phishing, VPNs, antivirus
3. Cyberbullying awareness — recognition, response strategies
4. Online privacy — privacy settings, data protection, anonymity tools
5. Mental health support — resources, coping strategies, where to get help
6. Legal awareness — cybercrime laws, victim rights, reporting to authorities
7. Identity theft protection — prevention and recovery steps

Guidelines:
- Be empathetic and supportive, especially to harassment victims
- Provide practical, actionable advice
- Keep responses concise but comprehensive (max 200 words)
- For emergencies or immediate danger, always direct to emergency services
- Use bullet points for clarity when listing steps
- Never provide advice that could harm users
- Recommend our platform's report form when relevant
- Be culturally sensitive and inclusive

Always remind users that if they're in immediate danger, they should contact emergency services (911 in USA, 15 in Pakistan).`

const FALLBACK_RESPONSES: Record<string, string> = {
  default: "I'm here to help with digital safety and cyber harassment. Ask me about reporting harassment, safety tips, cyberbullying, or privacy protection.",
  report: "To report harassment: 1) Document everything (screenshots, dates), 2) Use our anonymous report form, 3) Report to the platform, 4) For serious threats contact FIA Cybercrime (Pakistan) or FBI IC3 (USA).",
  safety: "Key safety tips: Use strong unique passwords, enable 2FA, avoid suspicious links, keep software updated, use a VPN on public Wi-Fi, back up your data regularly.",
  bully: "If you're being cyberbullied: Don't respond, block and report the bully, save all evidence, tell a trusted person, and use our anonymous reporting form for support.",
  mental: "For mental health support: Crisis Text Line (text HOME to 741741), Befrienders Worldwide (befrienders.org), Vandrevala Foundation in Pakistan (1860-2662-345). You're not alone.",
}

function simpleFallback(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('report') || lower.includes('submit')) return FALLBACK_RESPONSES.report
  if (lower.includes('safe') || lower.includes('tip')) return FALLBACK_RESPONSES.safety
  if (lower.includes('bully') || lower.includes('harass')) return FALLBACK_RESPONSES.bully
  if (lower.includes('mental') || lower.includes('stress') || lower.includes('depress')) return FALLBACK_RESPONSES.mental
  return FALLBACK_RESPONSES.default
}

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ reply: FALLBACK_RESPONSES.default })
    }

    // Try OpenAI if key is available
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey && openaiKey !== 'your-key-here') {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 7000)
      try {
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-6).map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: message },
        ]

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content
          if (reply) return NextResponse.json({ reply, source: 'openai' })
        }
      } catch (err) {
        console.warn('OpenAI call failed, using fallback:', err)
      } finally {
        clearTimeout(timeout)
      }
    }

    // Fallback to rule-based responses
    const reply = simpleFallback(message)
    return NextResponse.json({ reply, source: 'fallback' })
  } catch (err) {
    console.error('Chatbot error:', err)
    return NextResponse.json({ reply: FALLBACK_RESPONSES.default })
  }
}
