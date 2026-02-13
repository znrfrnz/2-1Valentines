# 💖 Valentine's Wall

A beautiful, interactive Valentine's Day post-it wall built with **Next.js**, **Supabase**, and the **Spotify API**. Users can send sweet anonymous notes to someone special — optionally attaching a song that reminds them of that person.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Spotify](https://img.shields.io/badge/Spotify-API-1DB954?logo=spotify)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Post-It Wall** — Browse a wall of love notes with smooth Framer Motion animations
- **Send Messages** — Multi-step form to compose and pin a new note
- **Spotify Integration** — Search for songs via the Spotify API and attach them to notes with an embedded mini player
- **Supabase Database** — Messages persist in a PostgreSQL database with real-time updates
- **Real-Time Updates** — New notes appear on the wall instantly via Supabase Realtime
- **Anonymous Session Management** — Visitors get a persistent identity via signed cookies (no login required)
- **Own-Post Management** — Visitors can delete their own notes; "yours" badge on owned posts
- **Nickname Memory** — Auto-fills the "From" field with your last-used nickname
- **Rate Limiting** — Prevents spam (max 10 posts per 5 minutes per visitor)
- **Responsive Design** — Looks great on mobile, tablet, and desktop
- **Optimistic UI** — Notes appear immediately while saving in the background

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Supabase](https://supabase.com/) account (free tier works)
- A [Spotify Developer](https://developer.spotify.com/) account (free)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "2-1 VAL"
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Once your project is ready, navigate to the **SQL Editor** in the Supabase dashboard.
3. Run the migrations **in order**:
   - Copy `supabase/migrations/001_create_messages.sql` and run it. This creates the `messages` table, RLS policies, and enables real-time.
   - Copy `supabase/migrations/002_add_visitor_sessions.sql` and run it. This adds the `visitor_id` column and policies for post deletion.
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up Spotify API

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create App**.
3. Fill in the app details:
   - **App name**: Valentine's Wall (or anything you like)
   - **Redirect URI**: `http://localhost:3000` (not actually used, but required)
   - **APIs used**: Check **Web API**
4. Once created, go to **Settings** and copy:
   - **Client ID** → `SPOTIFY_CLIENT_ID`
   - **Client Secret** → `SPOTIFY_CLIENT_SECRET`

> **Note:** The app uses the **Client Credentials** flow, so no user login is required. This means you can search for songs and get track metadata, but preview playback uses Spotify's embedded player (iframe).

### 4. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Spotify API
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Session Management
# Generate with: openssl rand -hex 32
# Required in production; a dev fallback is used automatically in development.
SESSION_SECRET=your-random-secret-here
```

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
2-1 VAL/
├── app/
│   ├── api/
│   │   ├── messages/
│   │   │   └── route.ts          # GET/POST/DELETE messages (Supabase)
│   │   ├── session/
│   │   │   └── route.ts          # GET session (auto-creates if needed)
│   │   └── spotify/
│   │       └── search/
│   │           └── route.ts      # Spotify track search proxy
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout with fonts & metadata
│   └── page.tsx                  # Home page (server component)
├── components/
│   ├── LandingPage.tsx           # Hero section with animated title
│   ├── WallView.tsx              # Grid display of all post-it notes
│   ├── SendForm.tsx              # Multi-step form modal (4 steps)
│   ├── PostItNote.tsx            # Individual post-it note card
│   ├── SpotifySearch.tsx         # Debounced song search with results dropdown
│   ├── SpotifyMiniPlayer.tsx     # Compact Spotify embed on post-it notes
│   ├── ValentineApp.tsx          # Main client-side app shell
│   ├── Sparkle.tsx               # Animated sparkle SVG decoration
│   └── PushPin.tsx               # Decorative push pin SVG
├── lib/
│   ├── session.ts                # Anonymous session management (cookies, rate limiting)
│   ├── spotify.ts                # Spotify API helpers (server-side)
│   ├── supabase.ts               # Supabase browser client
│   ├── supabase-server.ts        # Supabase server client
│   └── types.ts                  # TypeScript types & helpers
├── supabase/
│   └── migrations/
│       ├── 001_create_messages.sql     # Base messages table schema
│       └── 002_add_visitor_sessions.sql # Visitor session columns & policies
├── .env.local.example            # Environment variable template
├── next.config.js                # Next.js config (Spotify image domains)
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies & scripts
```

---

## 🗄️ Database Schema

The `messages` table in Supabase:

| Column                | Type          | Description                                  |
|-----------------------|---------------|----------------------------------------------|
| `id`                  | `uuid` (PK)   | Auto-generated unique ID                     |
| `message`             | `text`         | The love note content (max 500 chars)        |
| `from_name`           | `text`         | Sender's nickname (max 50 chars)             |
| `to_name`             | `text` (null)  | Recipient's name (optional)                  |
| `color`               | `text`         | Note color: `pink`, `yellow`, or `lavender`  |
| `spotify_track_id`    | `text` (null)  | Spotify track ID (optional)                  |
| `spotify_track_name`  | `text` (null)  | Song name                                    |
| `spotify_artist_name` | `text` (null)  | Artist name                                  |
| `spotify_album_art`   | `text` (null)  | Album cover image URL                        |
| `visitor_id`          | `text` (null)  | Anonymous visitor ID from signed cookie       |
| `created_at`          | `timestamptz`  | Timestamp of creation                        |

**RLS Policies:**
- ✅ Anyone can **read** all messages
- ✅ Anyone can **insert** new messages (visitor_id is attached server-side)
- ✅ Visitors can **delete** their own messages (ownership verified by signed cookie)
- ✅ Visitors can **update** their own messages (ownership verified by signed cookie)

---

## 🔐 How Session Management Works

The app uses **anonymous sessions** — no login, no accounts, no passwords. Here's how it works:

1. **First Visit** — When a visitor first lands on the site (or calls `/api/session`), a random UUID (`visitor_id`) is generated and stored in an **httpOnly, signed cookie** that lasts 1 year.

2. **HMAC Signing** — The `visitor_id` cookie is signed with a `SESSION_SECRET` via HMAC-SHA256. A separate `visitor_id.sig` cookie holds the signature. This prevents visitors from forging or tampering with their identity.

3. **Post Ownership** — When a visitor creates a note, their `visitor_id` is stored alongside the message in the database. The client sees a **"yours"** badge on their own posts.

4. **Delete Own Posts** — Hovering over your own note reveals a delete button. A confirmation prompt prevents accidental deletion. The API route verifies the signed cookie matches the post's `visitor_id` before allowing deletion.

5. **Nickname Memory** — After posting, the visitor's nickname is saved in a non-httpOnly cookie. The next time they open the form, the "From" field is pre-filled with their last-used name. A "Welcome back" message greets returning visitors.

6. **Rate Limiting** — An in-memory rate limiter tracks post timestamps per visitor. Each visitor can post up to **10 notes per 5 minutes**. The form shows a warning when approaching the limit, and returns HTTP `429 Too Many Requests` when exceeded.

### Security Notes

- The `visitor_id` cookie is **httpOnly** — JavaScript cannot read or modify it.
- The signature prevents cookie tampering — forging a different visitor ID requires knowing the `SESSION_SECRET`.
- Ownership checks happen **server-side** in the API route, not just via RLS. The API verifies the signed cookie, then filters the Supabase query by `visitor_id`.
- In production, always set a strong `SESSION_SECRET` (e.g., `openssl rand -hex 32`).

---

## 🎵 How Spotify Integration Works

1. **Song Search** — In Step 2 of the form, users type a song name. The frontend sends a debounced request to `/api/spotify/search`, which uses the **Client Credentials** flow to search Spotify's catalog.

2. **Track Selection** — Search results display the song name, artist, album art, and duration. Users click to select a track.

3. **Mini Player** — On the wall, notes with attached songs show a compact player with:
   - Album artwork
   - Song & artist name
   - A **Play** button that reveals a Spotify embedded player (iframe)
   - A link to open the song directly in Spotify

> The Spotify embedded player works without authentication for anyone viewing the wall. Listeners with Spotify accounts get the full track; others get a 30-second preview.

---

## 🛠️ Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start development server       |
| `npm run build` | Build for production           |
| `npm run start` | Start production server        |
| `npm run lint`  | Run ESLint                     |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Import the project on [Vercel](https://vercel.com/).
3. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SESSION_SECRET` — generate with `openssl rand -hex 32`
4. Deploy!

### Other Platforms

The app is a standard Next.js 14 project and can be deployed to any platform that supports it (Netlify, Railway, Fly.io, etc.). Just make sure to set the environment variables.

> **Important:** The in-memory rate limiter is per-process. In serverless environments (like Vercel), each function invocation may have its own memory space. For production at scale, consider using Redis or a database-backed rate limiter. For a Valentine's wall, the per-process approach is more than sufficient.

---

## 🔧 Troubleshooting

### "Failed to search Spotify"
- Make sure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set in `.env.local`
- Verify your Spotify app is active in the [Developer Dashboard](https://developer.spotify.com/dashboard)

### "Failed to fetch messages"
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify you ran **both** migration SQL files in your Supabase project
- Check that RLS policies are enabled

### "You can only delete your own messages" / delete not working
- Make sure `002_add_visitor_sessions.sql` migration has been run
- Clear your cookies and reload — a new session will be created
- If you posted messages before session management was added, those older posts won't have a `visitor_id` and cannot be deleted via the UI

### Real-time updates not working
- Make sure `alter publication supabase_realtime add table public.messages;` was executed
- In the Supabase dashboard, go to **Database → Replication** and confirm the `messages` table is listed

### Fallback messages showing instead of database
- The app gracefully falls back to sample messages if Supabase isn't configured or is empty
- Once you have Supabase set up and at least one message posted, it will use the database

### Session cookie issues in development
- The `SESSION_SECRET` falls back to a dev default automatically — no configuration needed for local development
- In production, always set a strong `SESSION_SECRET`

---

## 📝 License

This project is for personal/educational use. Feel free to fork and customize it for your own Valentine's Day surprise! 💘