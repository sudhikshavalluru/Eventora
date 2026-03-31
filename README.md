<div align="center">


  <h1>Evently — Professional Event Management</h1>
  <p>A full-stack event management platform with role-based dashboards, real-time team chat, budget tracking, and MySQL-backed authentication.</p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat&logo=tailwindcss)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
  ![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql)
</div>

---

## Overview

Evently is a professional event management dashboard built for three types of users — **Managers**, **Staff**, and **Customers**. Each role gets a fully tailored experience with dedicated features, a role-specific login portal, and a unified MySQL-backed authentication system.

---

## Features

### Authentication
- Global landing login/signup page (first entry point)
- Role-specific login/signup portals (Manager, Staff, Customer)
- MySQL database with bcrypt password hashing
- New users must sign up before they can log in
- Persistent sessions via Zustand store

### Manager Dashboard
- Create, edit, and delete events
- Event health scores (task completion % + seat fill %)
- Budget tracking with expenses and revenues
- Guest list management with RSVP status
- Staff assignment and task management
- Vendor management
- Seating chart builder
- Event timeline planner
- Calendar view
- Analytics overview

### Customer Dashboard
- Discover and register for public events
- Countdown timers on registered tickets
- Category filter chips for event browsing
- Save/wishlist events with heart button
- Search events by title or location
- Early bird and late registration pricing display

### Staff Dashboard
- View assigned tasks across all events
- Task priority badges (high / medium / low)
- Mark tasks complete/incomplete
- Personal stats cards (assigned, completed, high priority, events involved)
- Real-time team chat with manager and other staff

### Global Features
- 🌙 Dark mode / Light mode toggle (persisted)
- 🔔 Role-based notification panel with mark-all-read and dismiss
- Responsive sidebar with user profile, bell icon, and theme toggle
- Toast notifications for all actions
- Smooth animations via Framer Motion

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| State Management | Zustand (with persist) |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Database | MySQL 8+ |
| Password Hashing | bcryptjs |

---

## Project Structure

```
evently/
├── src/
│   ├── components/
│   │   ├── LandingAuth.tsx        # Global login/signup (entry point)
│   │   ├── AuthPage.tsx           # Role-specific login/signup
│   │   ├── Dashboard.tsx          # Manager dashboard
│   │   ├── CustomerDashboard.tsx  # Customer dashboard
│   │   ├── StaffDashboard.tsx     # Staff dashboard
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── NotificationPanel.tsx  # Slide-in notifications
│   │   ├── EventDetails.tsx       # Event detail view
│   │   ├── CalendarView.tsx       # Calendar
│   │   ├── BudgetTracker.tsx      # Budget management
│   │   ├── GuestList.tsx          # Guest management
│   │   ├── SeatingChart.tsx       # Seating builder
│   │   ├── StaffManager.tsx       # Staff & task manager
│   │   ├── TaskList.tsx           # Task list
│   │   ├── Timeline.tsx           # Event timeline
│   │   └── VendorManager.tsx      # Vendor management
│   ├── store/
│   │   ├── useEventStore.ts       # Event state (Zustand)
│   │   ├── useThemeStore.ts       # Dark/light mode (Zustand)
│   │   └── useUserStore.ts        # User auth fallback (Zustand)
│   ├── utils/
│   │   ├── api.ts                 # Frontend API helper
│   │   └── cn.ts                  # Tailwind class merger
│   ├── types/index.ts             # TypeScript types
│   ├── data/mockData.ts           # Seed data
│   └── App.tsx                    # Root component & routing
├── server/
│   ├── index.js                   # Express server + MySQL
│   ├── .env                       # DB credentials
│   └── package.json
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repository
```bash
git https://github.com/sudhikshavalluru/Eventora
cd Eventora
```

### 2. Set up the MySQL database
```sql
CREATE DATABASE Eventora;
```

### 3. Configure the backend
```bash
cd server
```
Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Varma
DB_NAME=Eventora
PORT=4000
```

### 4. Install dependencies

Frontend:
```bash
# from project root
npm install
```

Backend:
```bash
cd server
npm install
```

### 5. Start the backend
```bash
cd server
npm run dev
```
You should see:
```
✅ Database ready
🚀 Server running on http://localhost:4000
```

### 6. Start the frontend
```bash
# from project root
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## User Flow

```
Landing Login/Signup
        ↓
  Role Selection
  (Manager / Customer / Staff)
        ↓
  Role-specific Login/Signup
        ↓
      Dashboard
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login with email & password |

### Register
```json
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

## Environment Variables

### `server/.env`
| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `` |
| `DB_NAME` | Database name | `evently` |
| `PORT` | Server port | `4000` |

---

## Scripts

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run lint` | TypeScript type check |

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start with file watching |
| `npm start` | Start production server |

---

## License

MIT © Evently Team
