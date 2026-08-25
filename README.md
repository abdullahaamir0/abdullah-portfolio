# Abdullah Amir — Portfolio (React + Node)

A rebuild of your portfolio as a React (Vite) front end and a Node/Express backend.
It's fully responsive and the contact form actually works — messages are saved on
the server and (once you add a few credentials) emailed straight to your inbox.

```
abdullah-portfolio/
├── client/     React app (Vite) — the site itself
└── server/     Node/Express API — powers the contact form
```

---

## 1. What's included

**Client (`/client`)**
- Single-page portfolio: Home, About, Skills, Projects, Contact — same sections
  and visual style as your original design (aurora background, gradient text,
  glass cards, scroll-reveal animations, role-cycling hero text), rebuilt as
  React components.
- Fully responsive: collapsible mobile nav, fluid type sizes, and extra
  breakpoints (tablet, small phones) beyond the original single breakpoint.
- Real projects wired in: **NUSH** and **Ali Baba Food Point**. Edit
  `client/src/data/content.js` to update descriptions, tags, or add real
  live/source links whenever you have them.
- A working contact form with client-side validation, loading/success/error
  states, and spam protection (honeypot field + server-side rate limiting).
- A "back to top" button, smooth scroll-spy navigation, and small UX
  touches on top of the original.

**Server (`/server`)**
- `POST /api/contact` — validates a submission, saves it, and emails it to you.
- `GET /api/messages?key=...` — lets you view every saved message in a browser,
  even before you've set up email. Handy as a fallback / while testing.
- `GET /api/health` — simple uptime check.
- Rate limiting, basic input validation, and a honeypot field to cut down on spam.

---

## 2. Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

### Server

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and at minimum set `ADMIN_KEY` to any random string —
that alone lets the contact form save messages and lets you read them back
at `/api/messages`. Email sending is optional (see step 3).

```bash
npm run dev
```

The API starts on **http://localhost:5000**.

### Client

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The site opens on **http://localhost:5173** and talks to the API above.

Submit the contact form — you should see it succeed, and the message will
appear in `server/data/messages.json`.

---

## 3. Actually receiving messages by email

Right now, messages are always saved to `server/data/messages.json`. To also
get them emailed to `abdullahaamir924@gmail.com`, add SMTP credentials to
`server/.env`. The easiest option is Gmail:

1. Turn on 2-Step Verification on your Google account (required for the next step):
   `myaccount.google.com/security`
2. Create an **App Password**: `myaccount.google.com/apppasswords`
   — choose "Mail" as the app, generate it, and copy the 16-character code.
3. Fill these into `server/.env`:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=abdullahaamir924@gmail.com
   SMTP_PASS=the-16-character-app-password
   TO_EMAIL=abdullahaamir924@gmail.com
   ```

4. Restart the server. Submit the form again — you should get an email, and
   the visitor gets a short "I got your message" auto-reply too.

No email provider? That's fine — leave those blank and just use
`GET /api/messages?key=YOUR_ADMIN_KEY` (open it in a browser) to read
messages any time.

---

## 4. Editing your content

Everything text-based lives in one file: `client/src/data/content.js` —
your name/contact info, the hero stats, education timeline, skills list,
tools, and projects. Change it there and every section updates automatically.

Real project links: once NUSH and Ali Baba Food Point (or new projects) are
live, update the `live` and `source` fields for each entry in that file.

---

## 5. Deploying it for real

**Server** — deploy `/server` to something like [Render](https://render.com)
or [Railway](https://railway.app) (both have free tiers):
- Set the same environment variables from `.env` in their dashboard.
- Set `CLIENT_URL` to your deployed site's URL (for CORS).
- Note the URL Render/Railway gives your API, e.g. `https://your-api.onrender.com`.

**Client** — deploy `/client` to [Vercel](https://vercel.com) or
[Netlify](https://netlify.com):
- Build command: `npm run build`, output directory: `dist`.
- Set `VITE_API_URL` to your deployed API URL from above.

Once both are live, your contact form will send real emails from your live site.

---

## 6. Tech stack

- **Frontend:** React 18, Vite, plain CSS (no framework — keeps the original
  hand-built aesthetic intact)
- **Backend:** Node.js, Express, Nodemailer, express-rate-limit, Helmet
- **Storage:** a simple JSON file (no database needed for a low-traffic
  contact form — easy to swap for a real database later if you ever need to)
