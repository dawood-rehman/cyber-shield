# 🛡️ CyberShield — Harassment Response & Digital Safety Portal

A production-ready Next.js web application for cyber harassment reporting, digital safety resources, and AI-powered support.

---

## ✨ Features

- **🔒 Anonymous Reporting** — Submit harassment reports with full identity protection
- **🤖 AI Chatbot** — Powered by OpenAI (with intelligent rule-based fallback)
- **📚 Resources Library** — Comprehensive digital safety guides and articles
- **🛡️ Digital Safety Tips** — 12+ expert security tips with visual cards
- **👤 User Authentication** — JWT-based login/signup system
- **🔧 Admin Panel** — Full report management dashboard
- **📱 Responsive Design** — Works perfectly on all screen sizes
- **🌐 Dark Cyber Theme** — Professional dark UI with Three.js particle effects
- **🗄️ MongoDB Backend** — Full database integration with Mongoose

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/cyberportal
JWT_SECRET=your-super-secret-key-here
OPENAI_API_KEY=sk-your-key-here  # Optional
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
cyberportal/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── about/page.tsx            # About Us page
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Signup page
│   ├── report/page.tsx           # Harassment Report Form
│   ├── digital-safety-tips/      # Safety Tips page
│   ├── resources/page.tsx        # Resources Library
│   ├── articles/                 # Articles + Detail pages
│   ├── contact/page.tsx          # Contact Us page
│   ├── admin/page.tsx            # Admin Dashboard
│   └── api/                      # Backend API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── reports/
│       │   ├── route.ts          # GET all, POST new
│       │   └── [id]/route.ts     # PATCH, DELETE
│       ├── contact/route.ts
│       └── chatbot/route.ts      # AI Chatbot (OpenAI + fallback)
├── components/
│   ├── Header.tsx                # Navigation with dropdown
│   ├── Footer.tsx                # Footer with links
│   ├── ChatbotWidget.tsx         # AI Chat bubble
│   └── ParticleBackground.tsx    # Three.js particles
├── lib/
│   ├── mongodb.ts                # Database connection
│   └── models/
│       ├── User.ts               # User schema
│       ├── Report.ts             # Harassment report schema
│       └── Contact.ts            # Contact message schema
├── tailwind.config.js
├── next.config.js
└── .env.example
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get JWT cookie |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports (admin) |
| POST | `/api/reports` | Submit new report |
| PATCH | `/api/reports/:id` | Update report status |
| DELETE | `/api/reports/:id` | Delete report |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Send contact message |
| POST | `/api/chatbot` | AI chatbot (OpenAI + fallback) |

---

## 🤖 AI Chatbot

The chatbot supports two modes:

**With OpenAI key** (`.env.local`):
```
OPENAI_API_KEY=sk-your-key
```
Uses GPT-3.5-turbo with a cybersecurity-focused system prompt.

**Without OpenAI key:**
Uses intelligent rule-based responses covering:
- Harassment reporting steps
- Digital safety tips  
- Cyberbullying guidance
- Mental health resources
- Identity theft protection

---

## 🔐 Admin Access

Visit `/admin` to manage reports. For production, add authentication middleware to protect the admin route.

To create an admin user, register normally then update the role in MongoDB:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 🎨 Design System

- **Primary Color:** Cyan (`#06b6d4`)
- **Accent Color:** Orange (`#f97316`)  
- **Background:** Navy dark (`#0a0f1e`)
- **Font (Display):** Orbitron
- **Font (Body):** Exo 2
- **Animations:** CSS keyframes + Three.js canvas particles

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Custom CSS |
| Animations | Three.js, CSS animations |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | OpenAI GPT-3.5 (with rule-based fallback) |
| Icons | Lucide React |

---

## 📄 License

MIT License — Built with ❤️ for digital safety
