# 🏛️ Primăria Salonta - Website Oficial

Website-ul Primăriei Municipiului Salonta: conținut public multilingv (RO / HU / EN) și panou de administrare, construit cu **Next.js** (App Router), **TypeScript** și **Tailwind CSS 4**.

Infrastructura țintă este **hosting cPanel** (sau echivalent): **PostgreSQL** pe același furnizor și **stocare fișiere pe server** (disc / upload-uri), fără dependență de Supabase sau Cloudflare.

## Tech stack (țintă producție)

| Zonă | Tehnologie |
|------|------------|
| Framework | Next.js **16.x**, React **19** |
| Limbaj | TypeScript 5 |
| Stiluri | Tailwind CSS 4 |
| Bază de date | **PostgreSQL** (cPanel / phpPgAdmin / conexiune directă din aplicație) – schema în **`docs/schema-cpanel.sql`** |
| Stocare fișiere | **Disc pe server** (documente și media în spațiul de hosting), expuse prin URL-uri publice configurate |
| Rate limiting | Opțional: **Redis** (ex. Upstash) sau mecanism simplu pe DB / memorie, după implementare |
| Hosting | **cPanel** (Node.js + Passenger, vezi `server.js`) și/sau **Netlify** pentru frontend cu `DATABASE_URL` către PostgreSQL pe server |
| i18n | `next-intl` – `messages/ro.json`, `hu.json`, `en.json` |

## Migrare în cod

Închiderea completă în cod (înlocuirea backend-ului vechi prin **pg** / API proprii și mutarea upload-urilor pe disc) poate fi **în curs**. Schema pentru **cPanel** este în `docs/schema-cpanel.sql`; variabilele de mai jos sunt **ținta** după migrare.

**Până atunci:** ramura curentă poate încă necesita variabilele vechi de integrare pentru a rula `npm run dev` — folosește setul agreat de echipă (ex. fișier `.env.local` partajat intern).

## Funcții principale

- Pagini publice pe locale (`/ro`, `/hu`, `/en`): știri, evenimente, primărie, consiliu local, formulare etc.
- **Panou admin** (`/admin`): autentificare, roluri (`super_admin`, `admin`, `editor`, `viewer`), gestionare utilizatori, schimbare parolă, reset parolă (e-mail prin **SMTP**).
- **Securitate**: JWT în cookie httpOnly pentru sesiunea admin, parole cu **bcrypt** în `admin_profiles`, reCAPTCHA v3, rate limiting (unde e configurat), audit log, validări Zod.

## Cerințe locale

- **Node.js 20+** (recomandat LTS)
- npm
- PostgreSQL accesibil din mașina de dezvoltare (sau tunnel), pentru teste cu aceeași schemă ca producția

## Setup local

### 1. Repository și dependențe

```bash
git clone <url-repository>
cd web-primaria-salonta
npm install
```

### 2. Variabile de mediu

Creează `.env.local` în rădăcina proiectului. Model pentru arhitectura pe **cPanel** (completează valorile reale):

```bash
# --- PostgreSQL (cPanel: host intern sau hostname din cPanel) ---
DATABASE_URL=postgresql://utilizator:parola@host:5432/nume_baza

# --- Sesiune admin (JWT) ---
JWT_SECRET=long-random-secret-min-32-chars

# --- URL public al site-ului (SEO, link-uri) ---
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# --- Google reCAPTCHA v3 ---
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxxxx
RECAPTCHA_SECRET_KEY=xxxxx

# --- Google Translate (dacă folosiți traducere automată în admin) ---
GOOGLE_TRANSLATE_API_KEY=

# --- E-mail (reset parolă, notificări) – SMTP din cPanel sau furnizor ---
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# --- Rate limiting (opțional) ---
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Baza de date:** rulează mai întâi scriptul din **`docs/schema-cpanel.sql`** în PostgreSQL (ex. phpPgAdmin pe cPanel). Migrări incrementale suplimentare: `docs/*.sql`, `sql/`.

**Fișiere:** după migrarea codului, căile / URL-urile pentru upload vor fi cele definite în aplicație (director sub contul cPanel, cu permisiuni corecte).

### 3. Rulare development

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Structura proiectului (rezumat)

```
web-primaria-salonta/
├── app/
│   ├── [locale]/           # Site public (ro, hu, en)
│   ├── admin/              # Panou administrare
│   └── api/                # Route handlers (public + admin)
├── components/             # UI, layout, secțiuni, admin
├── lib/                    # Auth, JWT, rate-limit, e-mail, audit, clienți DB/storage (în evoluție)
├── messages/               # Traduceri i18n
├── public/                 # Assets statice
├── docs/                   # SQL: schema-cpanel.sql, migrări
├── sql/                    # Scripturi SQL mici
├── i18n/                   # Config next-intl
├── netlify.toml            # Opțional: build Netlify + plugin Next.js
└── server.js               # Entry Node pentru Phusion Passenger (cPanel)
```

## Limbi

- Română (implicit)
- Maghiară
- Engleză

## Deploy

### cPanel (Node.js + Passenger)

1. Creează baza **PostgreSQL** (Database Wizard) și aplică **`docs/schema-cpanel.sql`**.
2. Încarcă build-ul aplicației și rulează `npm install` / `npm run build` conform procedurii hostului.
3. Setează **Application Startup File** la **`server.js`** dacă folosești Passenger.
4. Definește toate variabilele de mediu în interfața **Setup Node.js App** (Passenger nu încarcă automat `.env.local`).
5. Pe pachete shared cu limite stricte (NPROC, memorie), SSR intens poate fi problematic; în acest caz e util să rulezi frontend-ul pe **Netlify** și să lași doar **PostgreSQL** (și eventual fișiere) pe cPanel.

### Netlify (frontend)

1. Conectează repository-ul la Netlify.
2. Folosește **`netlify.toml`**: `npm run build` și plugin **`@netlify/plugin-nextjs`**.
3. Adaugă în **Environment variables** aceleași variabile ca în producție; **`DATABASE_URL`** poate puncta spre PostgreSQL-ul de pe cPanel (dacă hostul permite conexiuni externe și firewall-ul e configurat).

## Scripts npm

| Comandă | Rol |
|---------|-----|
| `npm run dev` | Server de dezvoltare |
| `npm run build` | Build producție |
| `npm run start` | Pornește serverul Next după build |
| `npm run lint` | ESLint |

## Licență

Proiectul este proprietatea **Primăriei Municipiului Salonta**.

---

Dezvoltat cu ❤️ pentru comunitatea Salontei
