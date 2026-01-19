# Velvet & You

A romantic adult couples web game featuring six interactive games built around intimacy, fun, and connection. Play solo, pass & play on one device, or connect online with your partner via room codes.

## Features

- **Truth or Dare** — Classic prompt-based game with three intensity levels
- **Would You Rather** — Thought-provoking relationship questions
- **Spin the Bottle** — Animated bottle spin with rotating prompt types
- **Naughty Quiz** — Trivia questions about your relationship
- **Couples Challenges** — Physical and emotional challenges for both players
- **Fantasy Scenario Builder** — Creative storytelling prompts

### Gameplay

- Three intensity levels: Romantic, Playful, Spicy
- Smart deck system — no repeats until the full pool is exhausted
- Turn management with alternating play
- Optional timer mode for dares and challenges
- Skip & Pass with light scoring penalty
- Favourite prompts and build custom decks
- Session history with reverse-chronological feed
- Custom prompt editor — add your own prompts to any game

### Multiplayer

- **Solo / Practice** — Draw cards freely, no turns
- **Pass & Play** — Two players share one device with hand-off screens
- **Online** — Two devices connected via Socket.IO room codes

### Accounts (Optional)

- Couple accounts with shared login
- Persist favourites, history, and scores across sessions
- Profile page with session stats

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 3 |
| State | Zustand |
| Routing | React Router v7 |
| Real-time | Socket.IO (client + server) |
| Backend | Node.js, Express 4 |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend), Railway (backend) |

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- Git

### 1. Clone and install

```bash
git clone <your-repo-url> velvet-and-you
cd velvet-and-you

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment variables

Create `server/.env` in the `server/` directory:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/velvet
JWT_SECRET=your_local_dev_secret_change_this
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
ROOM_CODE_LENGTH=6
ROOM_TTL_MINUTES=30
ROOM_DISCONNECT_TIMEOUT_SECONDS=60
```

The root `.env` is pre-configured for local development:

```env
VITE_APP_NAME=Velvet & You
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
VITE_APP_URL=http://localhost:5173
```

### 3. Run the dev servers

Open two terminals:

```bash
# Terminal 1 — Frontend (Vite, port 5173)
npm run dev

# Terminal 2 — Backend (Express + Socket.IO, port 4000)
cd server
npm run dev
```

The Vite dev server proxies `/api` and `/socket.io` to the backend automatically — no CORS workarounds needed.

## Environment Variables Reference

### Frontend (Vite)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_APP_NAME` | Application display name | `Velvet & You` |
| `VITE_API_URL` | Backend REST API base URL | `https://velvet-api.railway.app` |
| `VITE_SOCKET_URL` | Backend Socket.IO server URL | `https://velvet-api.railway.app` |
| `VITE_APP_URL` | Public frontend URL (used for invite links) | `https://velvet-and-you.vercel.app` |

### Backend (Railway)

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Server listen port (Railway sets this automatically) | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/velvet` |
| `JWT_SECRET` | Secret key for signing JWT tokens (use a long random string) | `a1b2c3...64_chars` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin (your Vercel URL) | `https://velvet-and-you.vercel.app` |
| `ROOM_CODE_LENGTH` | Length of generated room codes | `6` |
| `ROOM_TTL_MINUTES` | Room time-to-live before expiry | `30` |
| `ROOM_DISCONNECT_TIMEOUT_SECONDS` | Disconnect grace period before room closes | `60` |

## Deployment

### Vercel (Frontend)

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `velvet-and-you` (or the repo root if the project is at the top level)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables in the Vercel dashboard:
   ```
   VITE_APP_NAME=Velvet & You
   VITE_API_URL=https://your-railway-app.railway.app
   VITE_SOCKET_URL=https://your-railway-app.railway.app
   VITE_APP_URL=https://your-vercel-app.vercel.app
   ```
5. Deploy. Vercel will build and serve the SPA with the rewrite rule from `vercel.json`.

### Railway (Backend)

1. In the Railway dashboard, create a new service from the same GitHub repo
2. Set the **Root Directory** to `server/`
3. Railway auto-detects the `Procfile` and runs `node index.js`
4. Add a MongoDB plugin (or use an external MongoDB Atlas URI)
5. Set environment variables in the Railway dashboard:
   ```
   PORT=4000
   MONGO_URI=<provided by MongoDB plugin or your Atlas URI>
   JWT_SECRET=<generate a secure random string>
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=https://your-vercel-app.vercel.app
   ROOM_CODE_LENGTH=6
   ROOM_TTL_MINUTES=30
   ROOM_DISCONNECT_TIMEOUT_SECONDS=60
   ```
6. Deploy. Railway will install `server/` dependencies, run the start command, and your backend will be live at `https://your-service.railway.app`
7. Update the Vercel environment variables with the Railway URL and redeploy the frontend

### Post-deploy checklist

- [ ] Backend health check returns `{"status":"ok","ts":...}` at `GET /api/health`
- [ ] Frontend loads and connects to the backend API
- [ ] Socket.IO connects (check browser console for connection)
- [ ] Room creation and joining works across two devices
- [ ] Auth registration and login work
- [ ] Prompt data loads in all six games

## Folder Structure

```
velvet-and-you/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Fonts, icons, static images
│   ├── components/
│   │   ├── ui/              # Button, Card, Badge, Modal, Toast, ErrorBoundary, LoadingSpinner
│   │   ├── layout/          # Nav, Footer, PageWrapper
│   │   ├── games/           # GameSettingsPanel, SpinBottle
│   │   ├── multiplayer/     # RoomCreateScreen, RoomJoinScreen, RoomLobby, ModeSelector, etc.
│   │   └── shared/          # CardDisplay, TurnIndicator, ScoreBoard, AuthModal, etc.
│   ├── data/prompts/        # JSON files: truth.json, dare.json, rather.json, etc.
│   ├── hooks/               # useAuth, useSocket, useSound, useTimer, useScore, useLocalStorage
│   ├── pages/               # Home, GameLobby, GamePlay, Room, History, Favourites, Profile, NotFound
│   ├── store/               # gameStore, sessionStore, roomStore (Zustand)
│   ├── styles/              # tokens.css, globals.css
│   ├── utils/               # deck.js, scoring.js, api.js, room.js
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── middleware/           # auth.js (JWT verification)
│   ├── models/              # User.js, Room.js (Mongoose)
│   ├── routes/              # auth.js, rooms.js, profile.js
│   ├── socket/              # roomHandlers.js, gameHandlers.js
│   ├── index.js             # Express + Socket.IO server entry
│   ├── package.json         # Server dependencies
│   ├── Procfile             # Railway process definition
│   └── .env                 # Server environment variables (gitignored)
├── .env                     # Frontend environment variables (gitignored)
├── .env.production          # Production env vars (placeholder URLs)
├── .gitignore
├── AGENTS.md                # Full feature specification and coding conventions
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration with dev proxy
├── vercel.json              # Vercel SPA rewrite rules
└── README.md
```

## License

Private — for personal use only.
