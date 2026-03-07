# STAI — Screenshot To AI Watchlist

> **Snap it. Identify it. Track it.**
> Upload any screenshot of a movie, TV show, or manga and let AI do the rest.

---

## What is STAI?

STAI is an AI-powered media tracker that turns screenshots into watchlist entries — automatically.

Instead of searching for titles manually, just take a screenshot of whatever you're watching or reading and upload it. STAI uses Google Gemini to identify the title, then pulls rich metadata from TMDB (movies & TV) or AniList (manga) and saves it straight to your personal watchlist.

---

## Product Pitch

We've all been there — you see a movie trailer, a manga panel, or a clip from a show and think *"I need to watch that"*, only to forget the title seconds later.

**STAI solves that.**

Take a screenshot, upload it, and STAI's AI will figure out exactly what it is and add it to your watchlist with full metadata: title, genres, average score, cover image, description, and more. No typing, no searching, no forgetting.

- 📸 **Upload a screenshot** of a movie, TV show, or manga
- 🤖 **AI identifies it** using Google Gemini 2.5
- 📚 **Rich metadata fetched** from TMDB and AniList
- ✅ **Added to your watchlist** in seconds

Whether you're a casual viewer or a power user juggling hundreds of titles across platforms, STAI turns the friction of "I need to remember that" into a single upload.

---

## Features

- **AI-Powered Identification** — Google Gemini 2.5 analyzes your screenshot and extracts title, category, genres, and description
- **Multi-source Metadata** — Pulls from [TMDB](https://www.themoviedb.org/) for movies/TV and [AniList](https://anilist.co/) for manga
- **Smart Matching** — A second AI pass selects the closest match when multiple results are found
- **Multi-language Support** — Captures original, transliterated, and translated title variants
- **Personal Dashboard** — Browse and manage your full watchlist in one place
- **Social Login** — Sign in with GitHub or Google — no passwords required
- **Secure & Lightweight** — Images are Base64-encoded and sent directly; no files stored on the server

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [Svelte](https://svelte.dev/) + [Vite](https://vitejs.dev/) |
| Backend | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| AI | [Google Gemini 2.5](https://ai.google.dev/) (Pro & Flash) |
| Database | Microsoft SQL Server via [Prisma ORM](https://www.prisma.io/) |
| Movie/TV Data | [TMDB API](https://developer.themoviedb.org/) |
| Manga Data | [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/) |
| Auth | GitHub OAuth + Google OAuth + JWT |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Microsoft SQL Server instance
- API keys for: Google Gemini, TMDB, GitHub OAuth, Google OAuth

### 1. Clone the repository

```bash
git clone https://github.com/nite2048/stai.git
cd stai
```

### 2. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
TMDB_API_KEY=your_tmdb_api_key

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=your_jwt_secret

DATABASE_URL=sqlserver://host:port;database=stai;user=sa;password=secret;encrypt=true
SHADOW_DATABASE_URL=sqlserver://host:port;database=stai_shadow;user=sa;password=secret;encrypt=true
```

### 3. Install dependencies and run migrations

```bash
# Backend
cd backend
npm install
npx prisma migrate deploy

# Frontend
cd ../frontend
npm install
```

### 4. Start the development servers

```bash
# In one terminal — backend (port 3000)
cd backend
npm run dev

# In another terminal — frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How It Works

```
User uploads screenshot
        │
        ▼
  Gemini 2.5 Pro
  (extract metadata)
        │
        ▼
  Route by category
  ┌─────┴──────┐
  │            │
TMDB API   AniList API
(movie/TV)  (manga)
  │            │
  └─────┬──────┘
        │
        ▼
  Gemini 2.5 Flash
  (pick closest match)
        │
        ▼
  Save to database
  & display on dashboard
```

1. **Screenshot upload** — The frontend encodes the image as Base64 and POSTs it to the backend.
2. **Metadata extraction** — Gemini 2.5 Pro reads the image and returns structured metadata (title, genres, category, etc.).
3. **API lookup** — The backend queries TMDB (movies/TV) or AniList (manga) using the extracted title.
4. **Best-match selection** — Gemini 2.5 Flash reviews the search results and picks the closest match.
5. **Watchlist entry** — The merged metadata is saved to the user's account and shown on their dashboard.

---

## Project Structure

```
stai/
├── backend/
│   ├── ai/                    # Google Gemini integration & prompts
│   ├── authentication/        # OAuth2 routes & JWT middleware
│   ├── database/              # Prisma client, DB operations, image storage
│   ├── prisma/                # Schema and migrations
│   └── index.js               # Express server entry point
└── frontend/
    └── src/
        ├── routes/            # Page components (Home, Upload, Dashboard, …)
        ├── lib/               # Reusable Card component & Svelte stores
        ├── App.svelte          # Root component & client-side routing
        └── main.js            # Application entry point
```

---

## Supported Media Types

| Category | Data Source | Status |
|----------|------------|--------|
| 🎬 Movies | TMDB | ✅ Supported |
| 📺 TV Shows | TMDB | ✅ Supported |
| 📖 Manga | AniList | ✅ Supported |
| 🎮 Others | — | 🚧 Coming soon |

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## License

This project does not currently have a license. All rights reserved by the author.
