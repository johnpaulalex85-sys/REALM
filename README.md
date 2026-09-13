# REALM — Life RPG (Full-Stack Gamification Application)

> A full-stack, medieval fantasy RPG life-gamification application built with **React**, **TypeScript**, **Vite**, **Python Flask**, **PyMongo**, and **MongoDB Atlas**. Turn your real-world daily habits, tasks, and goals into an epic hero quest!

🌐 **Live Application**: [https://realm-dtga.onrender.com/](https://realm-dtga.onrender.com/)

---

## 🏰 Features

- **Server-Authoritative Progression**: All XP, level-up curves, gold economy, stamina energy costs, health exhaustion, loot drops, and attribute gains are calculated strictly on the backend.
- **JWT & Bcrypt Security**: Password hashing with `bcrypt` and token-based authentication via JWT with expiration and protected REST endpoints.
- **Medieval RPG Aesthetic**: Rich fantasy UI featuring parchment panels, castle visuals, gold borders, custom sound FX, dynamic glows, ambient lighting, and interactive modals.
- **Quest System**: Full CRUD operations for Daily and Weekly quests across Study, Health, Personal, Work, and Discipline categories.
- **Server-Side Rewards**:
  - **Intellect Critical Insight**: Chance for +25% bonus XP on Intellect quests.
  - **Wisdom Bountiful Discovery**: Chance for +30% bonus Gold on Wisdom quests.
  - **Randomized Quest Loot Drops**: Health elixirs, focus potions, time shards, and legendary relics drop upon completing quests.
- **7-Day Streak System**: Daily check-ins track consecutive habit streaks, restore health and energy, and grant XP/Gold rewards without allowing duplicate check-ins.
- **Merchant Vault / Inventory**: Buy, use, equip, or sell consumables, equipment, and relics with server validation of ownership and quantities.
- **Automatic Achievement Engine**: Evaluates criteria (streak days, total completed quests, gold earned, attribute milestones) upon actions and grants rewards automatically.
- **Adventure Activity Log**: Complete chronological audit trail of all quests created/completed, level ups, items used/sold, and achievements unlocked.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS + TailwindCSS utility classes
- **Icons**: Lucide React
- **Audio**: Web Audio API Sound System

### Backend
- **Language**: Python 3.10+
- **Framework**: Flask
- **Database**: MongoDB Atlas / MongoDB (via `PyMongo`)
- **Authentication**: PyJWT + Bcrypt
- **CORS & Environment**: `Flask-CORS`, `python-dotenv`

---

## 📁 Project Structure

```
realm---rpg-life-gamification-dashboard/
├── backend/
│   ├── .env.example              # Sample environment variables
│   ├── .env                      # Local environment configuration
│   ├── requirements.txt          # Python backend dependencies
│   ├── config.py                 # Configuration loader
│   ├── app.py                    # Flask app factory, CORS, MongoDB init
│   ├── run.py                    # Flask server entry point
│   ├── seed.py                   # System data & starter template populator
│   ├── middleware/
│   │   └── auth.py               # Token verification decorator (@token_required)
│   ├── routes/
│   │   ├── auth.py               # Register, Login, Me, Logout endpoints
│   │   ├── dashboard.py          # Aggregated dashboard API
│   │   ├── character.py          # Profile details & Campfire Rest
│   │   ├── quests.py             # Quest CRUD & completion math
│   │   ├── inventory.py          # Use, Equip, Sell inventory items
│   │   ├── achievements.py       # Achievement status & catalogue
│   │   ├── history.py            # User activity history logs
│   │   └── streak.py             # 7-day streak tracker & check-in
│   ├── services/
│   │   ├── progression.py        # Non-linear XP curve & level up logic
│   │   ├── quest_service.py      # Quest state & reward calculations
│   │   ├── reward_service.py     # Critical insight & discovery procs
│   │   ├── inventory_service.py  # Loot drops, equipment & sales
│   │   ├── achievement_service.py# Automatic achievement evaluation
│   │   └── streak_service.py     # Daily streak check-ins
│   └── utils/
│       ├── validators.py         # Email, password & ObjectId validators
│       └── responses.py          # Standardized JSON response helpers
└── src/
    ├── services/
    │   └── api.ts                # API client with token injection
    ├── context/
    │   └── AuthContext.tsx       # React auth provider & session manager
    ├── components/
    │   ├── AuthModal.tsx         # Medieval login / registration portal
    │   └── ...                   # Medieval RPG UI views & components
    ├── App.tsx                   # Main full-stack React app
    └── main.tsx                  # App entry point wrapped with AuthProvider
```

---

## 🚀 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/realm
MONGO_DB_NAME=realm
JWT_SECRET=realm_secret_jwt_key_change_in_production_2026
FRONTEND_URL=http://localhost:5173
FLASK_ENV=development
PORT=5000
```

> **Note for MongoDB Atlas**: Replace `MONGO_URI` with your MongoDB Atlas connection string (e.g., `mongodb+x509://...` or `mongodb+srv://user:password@cluster.mongodb.net/realm`).

---

## 🏃 How to Run Locally

### 1. Start the Flask Backend Server

Open Terminal 1:

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

The Flask backend server will run on: `http://localhost:5000`

### 2. Start the React Frontend

Open Terminal 2:

```bash
npm install
npm run dev
```

The Vite dev server will run on: `http://localhost:5173`

---

## 🔑 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user & initialize hero | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | End user session | Yes |
| `GET` | `/api/dashboard` | Aggregated dashboard data | Yes |
| `GET` | `/api/character` | Fetch character attributes & vitals | Yes |
| `POST` | `/api/character/rest` | Campfire Rest (+35 Energy, +20 HP) | Yes |
| `GET` | `/api/quests` | Retrieve user active and board quests | Yes |
| `POST` | `/api/quests` | Create a new quest | Yes |
| `PUT` | `/api/quests/:id` | Update quest details | Yes |
| `DELETE` | `/api/quests/:id` | Delete quest | Yes |
| `POST` | `/api/quests/:id/complete` | Complete quest & calculate rewards | Yes |
| `GET` | `/api/inventory` | Retrieve user inventory items | Yes |
| `POST` | `/api/inventory/:id/use` | Consume potion / scroll item | Yes |
| `POST` | `/api/inventory/:id/equip` | Equip or unequip gear | Yes |
| `POST` | `/api/inventory/:id/sell` | Sell inventory item for gold | Yes |
| `GET` | `/api/achievements` | Retrieve user achievements & progress | Yes |
| `GET` | `/api/history` | Retrieve user activity log | Yes |
| `GET` | `/api/streak` | Fetch 7-day streak status | Yes |
| `POST` | `/api/streak/check-in` | Perform daily streak check-in | Yes |

---

## 🔒 Security Best Practices

1. **Password Hashing**: Passwords are hashed with `bcrypt` before storing in MongoDB. Plain-text passwords are never saved or returned.
2. **JWT Route Guarding**: Authenticated endpoints verify JWT tokens via the `@token_required` decorator.
3. **Server-Side Validation**: All quest progress, gold earnings, XP calculations, and item transactions are calculated and validated server-side.
4. **Duplicate Claim Protection**: The backend enforces unique records in `quest_completions` and daily date checks on `streaks` to prevent duplicate XP/gold farming.

---

## 👥 Credits

REALM — Life RPG was developed as a **group project** by:

| Team Member | Role / Contribution |
| :--- | :--- |
| **[John Paul Alex]** | Full-Stack Development, Backend, Database & Integration |
| **[Vishal Vivek]** | Frontend Development & UI/UX |
| **[Ajay Joy]** | Backend Development & API Integration |
| **[A.Vikram]** | Testing, Documentation & Project Support |

### 🤝 Team Collaboration

The project was collaboratively designed and developed by all team members.  
Contributions included application architecture, frontend development, backend API development, database integration, authentication, gamification mechanics, testing, UI/UX design, and documentation.

