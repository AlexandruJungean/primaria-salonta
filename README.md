# Primăria Salonta – site web

Website oficial: conținut public **RO / HU / EN** și **panou de administrare**, construit cu **Next.js** (App Router), **TypeScript** și **Tailwind CSS 4**.

## Arhitectură producție

| Rol | Tehnologie |
|-----|------------|
| Aplicație (Next.js) | **Netlify** + `@netlify/plugin-nextjs` |
| Bază de date | **PostgreSQL** pe infrastructura primăriei (**cPanel**); aplicația se conectează prin `DATABASE_URL` |
| Fișiere (documente, media) | **Stocare pe server** (disc în contul de hosting), servite prin URL-uri publice |
| Autentificare admin | **JWT** (cookie httpOnly), profiluri și parole în PostgreSQL (`admin_profiles`, **bcrypt**) |
| E-mail | **SMTP** (ex. serviciul de mail al gazdei) |
| Protecție formulare | **Google reCAPTCHA v3** |
| Traduceri automate (admin) | **Google Translate API** (opțional) |
| Limitare trafic | Mecanism în aplicație și/sau **Redis** (URL/token configurate în mediu — furnizor la alegere) |
| i18n site | **next-intl** — `messages/ro.json`, `hu.json`, `en.json` |

**Notă:** Node.js pentru Next.js **nu** rulează pe același cPanel cu site-ul vechi; aplicația este izolată pe Netlify, iar cPanel găzduiește în principal PostgreSQL (și spațiul pentru fișiere, după configurare).

## Stack tehnic

- **Next.js** 16.x, **React** 19, **TypeScript** 5, **Tailwind CSS** 4  
- Acces la date: client **PostgreSQL** din runtime-ul Next.js (ex. `pg` + pool)  
- Validări **Zod**, jurnal **audit** pentru acțiuni admin  

## Funcții principale

- Site public pe `/ro`, `/hu`, `/en` (știri, evenimente, primărie, consiliu local, formulare etc.)
- **`/admin`:** roluri `super_admin`, `admin`, `editor`, `viewer`; utilizatori; schimbare și reset parolă; e-mail pentru fluxuri de securitate unde e configurat SMTP

## Cerințe pentru dezvoltare locală

- **Node.js 20+** (LTS recomandat)  
- **npm**  
- PostgreSQL accesibil local sau prin tunel (aceeași schemă ca în producție)

## Setup local

```bash
git clone <url-repository>
cd web-primaria-salonta
npm install
```

Creează **`.env.local`** (exemplu — denumirile rămân stabile odată cu arhitectura de mai sus):

```bash
DATABASE_URL=postgresql://utilizator:parola@host:5432/nume_baza
JWT_SECRET=secret-lung-minim-32-caractere
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

GOOGLE_TRANSLATE_API_KEY=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Opțional – rate limiting (Redis over HTTP, ex. Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Structura repository (rezumat)

```
web-primaria-salonta/
├── app/                 # Rute publice [locale], admin, API
├── components/
├── lib/                 # DB, auth, e-mail, rate limit, utilitare
├── messages/            # Traduceri
├── public/
├── docs/                # Schema SQL (ex. schema-cpanel.sql), ghid operare
├── i18n/
└── netlify.toml
```

## Deploy

1. **Netlify:** repository conectat, build `npm run build`, plugin Next.js din `netlify.toml`, variabile de mediu setate (inclusiv `DATABASE_URL` către PostgreSQL-ul accesibil public sau prin rețea permisă).
2. **PostgreSQL (cPanel):** bază creată din panoul de găzduire; import schema din fișierul SQL menținut în `docs/` (structura bazei).

Operațiuni punctuale (primul import, migrări de date, fișiere): **`docs/MIGRATION-CPANEL.md`**.

## Limbi

Română (implicit), maghiară, engleză.

## Scripts npm

| Comandă | Rol |
|---------|-----|
| `npm run dev` | Development |
| `npm run build` | Build producție |
| `npm run start` | Server producție (după build) |
| `npm run lint` | ESLint |

## Licență

Proiectul este proprietatea **Primăriei Municipiului Salonta**.

---

Dezvoltat cu ❤️ pentru comunitatea Salontei