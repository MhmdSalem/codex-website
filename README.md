# Codex — Official Website + Admin Dashboard

الموقع الرسمى لشركة **Codex** — حلول برمجية بنظام الاشتراك الشهرى، مع لوحة تحكم متكاملة لإدارة المحتوى.
The official website of **Codex** — smart software solutions, with a built-in admin dashboard for managing all content, media, and contact messages.

> Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **MongoDB (Mongoose)**.
> Fully **bilingual (Arabic RTL + English LTR)** with automatic locale detection.
> Backend dashboard at `/admin` lets you edit every text, image, and video on the site.

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in:

- `MONGODB_URI` — your MongoDB connection string
  - Local: `mongodb://127.0.0.1:27017`
  - Atlas: `mongodb+srv://USER:PASS@cluster.mongodb.net`
- `AUTH_SECRET` — long random string (32+ chars). Generate one:
  - macOS/Linux: `openssl rand -base64 48`
  - Windows PowerShell: `[Convert]::ToBase64String((1..48 | %{[byte](Get-Random -Max 256)}))`
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — first admin login (you can change later).

### 3. Seed the database

Imports the existing AR/EN dictionaries into MongoDB and creates your first super admin:

```bash
npm run seed
```

Re-running this script is safe — it never overwrites existing content or users.

### 4. Run the dev server

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin dashboard: <http://localhost:3000/admin>

Login with the email/password from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (default: `admin@codex.local` / `Codex@1234`). **Change the password from the dashboard immediately**.

---

## Admin dashboard

| Page                    | Path               | What you can do                                                  |
| ----------------------- | ------------------ | ---------------------------------------------------------------- |
| Overview                | `/admin`           | Stats, latest messages, quick actions                            |
| Content (AR / EN)       | `/admin/content`   | Edit every text on the site, per language. Changes apply live    |
| Media library           | `/admin/media`     | Upload / preview / delete images & videos. Copy URLs into fields |
| Messages                | `/admin/messages`  | View, archive, delete contact-form submissions                   |
| Users (super-admin)     | `/admin/users`     | Add / remove admins, reset passwords                             |

### How content updates work

1. Public pages fetch content from MongoDB (the `Content` collection has one document per locale).
2. When you save in the dashboard, the matching document is updated and `revalidatePath` is fired for every public route, so changes appear instantly without a redeploy.
3. If MongoDB is unreachable, the static `lib/i18n/dictionaries/*.ts` files act as a fallback so the site never breaks.

### Where uploads are stored

Files dropped in the media library are saved to `public/uploads/` and served from `/uploads/<filename>`. To move to S3/Cloudinary later, edit `lib/media/storage.ts`.

---

## Project structure

```
codex-website/
├── app/
│   ├── [locale]/                       # Public, bilingual website
│   │   ├── layout.tsx                  # Fonts, RTL/LTR, navbar, footer
│   │   ├── page.tsx, about/, services/, contact/
│   ├── admin/                          # Admin dashboard (RTL, dark theme)
│   │   ├── layout.tsx                  # Admin html/body shell
│   │   ├── login/                      # Login page + server action
│   │   ├── (authed)/                   # Auth-gated section
│   │   │   ├── layout.tsx              # Sidebar + topbar
│   │   │   ├── page.tsx                # Dashboard overview
│   │   │   ├── content/                # Per-locale content editor
│   │   │   ├── media/                  # Upload & manage images/videos
│   │   │   ├── messages/               # Contact-form inbox
│   │   │   └── users/                  # Admin user management
│   │   └── admin.css                   # Admin theme tokens
│   ├── api/
│   │   ├── contact/route.ts            # Public contact form endpoint
│   │   └── admin/
│   │       ├── upload/route.ts         # Multipart upload (auth-gated)
│   │       └── media/route.ts          # List media (used by picker)
│   ├── layout.tsx, robots.ts, sitemap.ts, globals.css
├── components/                         # UI pieces shared on the public site
├── lib/
│   ├── auth/                           # JWT sessions, password hashing
│   ├── content/                        # DB-backed dictionary service + labels
│   ├── db/
│   │   ├── mongoose.ts                 # Cached connection helper
│   │   └── models/                     # User, Content, Media, Message
│   ├── i18n/                           # Locales + bundled fallback dicts
│   ├── media/storage.ts                # File upload helpers
│   └── utils.ts
├── scripts/seed.ts                     # `npm run seed` — initial setup
├── public/uploads/                     # User-uploaded media (git-ignored)
├── middleware.ts                       # Locale routing + admin auth gate
└── package.json
```

---

## Design system

### Colors (Dark + Gold premium)

| Token              | Value           | Usage                          |
| ------------------ | --------------- | ------------------------------ |
| `background`       | `#0A0A0F`       | Body background (near-black)   |
| `background-surface` | `#13131A`     | Cards / surfaces                |
| `background-elevated` | `#1A1A23`    | Elevated surfaces / inputs      |
| `border`           | `#1F1F2E`       | Default borders                 |
| `foreground`       | `#F5F5F7`       | Primary text                    |
| `foreground-muted` | `#A1A1AA`       | Secondary text                  |
| `gold` / `accent`  | `#D4AF37`       | Primary accent (premium gold)   |
| `gold-300`         | `#E5C158`       | Hover accent                    |

### Typography

- **Latin**: [Inter](https://fonts.google.com/specimen/Inter) (300–700)
- **Arabic**: [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) (300–700)
- Fonts are loaded via `next/font` with `display: swap` for zero CLS.

---

## Editing content

All website text lives in two dictionary files:

- `lib/i18n/dictionaries/ar.ts` — Arabic content
- `lib/i18n/dictionaries/en.ts` — English content (must mirror the Arabic shape)

To change a headline or service description, edit the corresponding key in **both** files. TypeScript will warn you if a key is missing in `en.ts`.

### Adding a new page

1. Create `app/[locale]/<page-name>/page.tsx`.
2. Add the page link to:
   - `components/layout/navbar.tsx` (nav items)
   - `components/layout/footer.tsx` (footer nav)
   - `app/sitemap.ts` (`PAGES` array)
3. Add the labels to both dictionary files under `nav` and `footer.nav`.

---

## Branding

The logo is a stylized code brackets icon `< />` rendered in gold on a dark rounded square.

- Icon source: `public/favicon.svg`
- Wordmark: rendered inline in `components/ui/logo.tsx` ("Co" white + "dex" gold)
- Replace `public/favicon.svg`, `public/apple-touch-icon.png`, and `public/og.png` when you have the final brand assets.

---

## Contact form

The contact form posts to `/api/contact`. By default it just **logs** submissions on the server. To make it functional, edit `app/api/contact/route.ts` and wire one of:

1. **Email** — via [Resend](https://resend.com), SendGrid, or `nodemailer`.
2. **Telegram/Slack webhook** — for instant push notifications.
3. **Database** — store in Postgres / MySQL.

Example using Resend:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Codex <hello@codex-tech.com>",
  to: ["hello@codex-tech.com"],
  subject: `New lead: ${body.name}`,
  html: `<p>${body.message}</p>`,
});
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable                       | Description                            |
| ------------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | Production site URL                    |
| `NEXT_PUBLIC_CONTACT_EMAIL`    | Public contact email                   |
| `NEXT_PUBLIC_CONTACT_PHONE`    | Public phone number (E.164 format)     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | WhatsApp number (no `+`, just digits)  |

For the contact form integration, add your provider's keys (e.g. `RESEND_API_KEY`).

---

## Deployment

The site is a standard Next.js 14 App Router app and runs anywhere Node.js runs.

### Option 1 — Vercel (recommended)

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add your env vars.
4. Vercel auto-detects Next.js and deploys.
5. Add your domain `codex-tech.com` in Vercel → Domains.

### Option 2 — VPS (Hetzner / DigitalOcean / Contabo)

```bash
npm install
npm run build
npm start          # or use pm2 / systemd
```

Add a Nginx reverse-proxy in front of port `3000` and an SSL certificate via Let's Encrypt.

### Option 3 — Cloudflare Pages

1. Connect the GitHub repo.
2. Build command: `npm run build`
3. Output directory: `.next`
4. Use [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) for edge runtime.

---

## SEO checklist

- ✅ Metadata per page (title, description, keywords)
- ✅ Open Graph + Twitter cards
- ✅ `robots.txt` and `sitemap.xml` generated automatically
- ✅ Bilingual `hreflang` alternates
- ✅ Mobile-first responsive design
- ✅ Theme color set for browser chrome
- ⏳ Add Google Analytics / Plausible after launch
- ⏳ Submit sitemap to Google Search Console

---

## Roadmap

- [ ] Add real brand assets (logo PNG/SVG, OG image, apple-touch-icon)
- [ ] Wire contact form to email provider
- [ ] Add testimonials / case studies section
- [ ] Add blog (`/[locale]/blog`)
- [ ] Integrate analytics (Plausible or GA4)
- [ ] Add product pages per system (`/[locale]/services/registration`, etc.)
- [ ] Marketing services pages when launched

---

## License

© Codex. All rights reserved.
