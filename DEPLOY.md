# Kian Canessa · Baja Real Estate — Deployment Guide

## ✅ Build Status: PASSING

---

## 🚀 Deploy to Vercel (Free — Step by Step)

### Step 1 — Push to GitHub
```bash
cd kian-realty
git init
git add .
git commit -m "feat: initial real estate site"
# Create a repo on github.com, then:
git remote add origin https://github.com/TU_USUARIO/kian-realty.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `kian-realty` repo
4. Settings stay default (Next.js auto-detected)
5. Click **"Deploy"** → done in ~60 seconds
6. Your site is live at: `https://kian-realty.vercel.app`

### Step 3 — Custom Domain (optional)
1. In Vercel → Project → Settings → Domains
2. Add your domain (e.g. `kiancanessa.com`)
3. Update DNS records at your registrar as instructed

---

## 📸 How to Add Content

### Photos
Copy your files to `public/images/`:
| File | Description |
|------|-------------|
| `hero-poster.jpg` | Background fallback for the hero (1920×1080) |
| `kian.jpg` | Your professional headshot |
| `prop1.jpg` | Property 1 cover photo |
| `prop2.jpg` | Property 2 cover photo |
| `prop3.jpg` | Property 3 cover photo |

### Hero Video (Drone footage)
1. Copy your `.mp4` to `public/videos/hero.mp4`
2. Open `app/components/Hero.tsx`
3. Uncomment line: `{/* <source src="/videos/hero.mp4" type="video/mp4" /> */}`

### Update Your Info
- **Contact info** → `app/components/Contact.tsx` (email, WhatsApp, Instagram)
- **Properties** → `app/components/Featured.tsx` (PROPERTIES array)
- **About text** → `app/lib/translations.ts` (bio1, bio2)

---

## 📞 Contact Form — Wire It Up
The form currently simulates sending. To make it real:

**Option A — Formspree (free, easiest)**
1. Go to https://formspree.io → create form → get your endpoint
2. In `Contact.tsx` replace the simulate block:
```ts
const res = await fetch("https://formspree.io/f/YOUR_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});
```

**Option B — EmailJS (free)**
1. `npm install @emailjs/browser`
2. Set up a template at https://emailjs.com
3. Use `emailjs.send(serviceId, templateId, form, publicKey)`

---

## 🌐 Bilingual System
- Translations are in `app/lib/translations.ts`
- Add/edit any text in English (`en`) and Spanish (`es`)
- Language toggle is in the navbar (EN / ES buttons)

---

## 📦 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS variables
- **Fonts**: Cormorant Garamond + Jost + DM Mono (Google Fonts)
- **Icons**: Lucide React
- **Deployment**: Vercel (free tier)
