# 🏛️ Primăria Salonta - Website Oficial
Testpermissions
Website-ul oficial al Primăriei Municipiului Salonta, dezvoltat cu Next.js 16, TypeScript și Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Storage:** Cloudflare R2
- **Hosting:** Netlify
- **i18n:** next-intl (RO, HU, EN)

## 📋 Prerequisites

- Node.js 20+
- npm sau yarn
- Cont Supabase (gratuit)
- Cont Cloudflare (pentru R2)
- Cont Netlify (pentru hosting)

## 🛠️ Setup Local

### 1. Clonează repository-ul

```bash
git clone https://github.com/your-repo/web-primaria-salonta.git
cd web-primaria-salonta
```

### 2. Instalează dependențele

```bash
npm install
```

### 3. Configurează environment variables

Creează fișierul `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudflare R2
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=primaria-salonta-docs
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Vezi `Setup_Supabase_Cloudflare.md` pentru ghidul complet de configurare.

### 4. Rulează serverul de development

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## 📁 Structura Proiectului

```
web-primaria-salonta/
├── app/
│   ├── [locale]/          # Routing bazat pe limbă (ro, hu, en)
│   │   ├── page.tsx       # Homepage
│   │   ├── primaria/      # Secțiunea Primăria
│   │   ├── consiliul-local/
│   │   ├── stiri/
│   │   └── ...
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Componente UI de bază
│   ├── layout/            # Header, Footer, Navigation
│   └── sections/          # Secțiuni de pagină
├── lib/
│   ├── supabase/          # Client Supabase
│   ├── constants/         # Constante și configurări
│   └── utils/             # Funcții utilitare
├── messages/              # Traduceri (ro.json, hu.json, en.json)
├── public/                # Assets statice
└── docs/                  # Documentație
```

## 🌐 Limbi Suportate

- 🇷🇴 Română (implicit)
- 🇭🇺 Maghiară
- 🇬🇧 Engleză

## 📖 Documentație

- [Technical_Details.md](./Technical_Details.md) - Detalii tehnice și scheme bază de date
- [Project_Plan.md](./Project_Plan.md) - Planul proiectului și sitemap
- [Setup_Supabase_Cloudflare.md](./Setup_Supabase_Cloudflare.md) - Ghid configurare infrastructură

## 🚀 Deploy pe Netlify

1. Conectează repository-ul la Netlify
2. **Build command:** `npm run build`
3. **Publish directory:** `.next`
4. Adaugă environment variables în Netlify Dashboard

## 📝 Scripts Disponibile

```bash
npm run dev       # Development server
npm run build     # Build pentru producție
npm run start     # Start server producție
npm run lint      # Verificare ESLint
```

## 📄 License

Acest proiect este proprietatea Primăriei Municipiului Salonta.

---

Dezvoltat cu ❤️ pentru comunitatea Salontei
