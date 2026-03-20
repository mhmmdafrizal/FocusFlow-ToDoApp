# ✦ Next.js Todo App

> A modern, full-stack task management application built with the latest Next.js ecosystem — clean UI, real-time updates, and production-grade architecture.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-v3-3B82F6?style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-v5-F59E0B?style=flat-square)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=flat-square)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Database** | MongoDB via Mongoose |
| **Server Actions** | Next.js Server Actions |
| **Validation** | [Zod](https://zod.dev) |
| **Global State** | [Zustand](https://zustand-demo.pmnd.rs) |
| **Server State** | [TanStack Query v5](https://tanstack.com/query) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) |
| **Styling** | Tailwind CSS v4 |
| **Icons** | [Lucide React](https://lucide.dev) |

---

## 📁 Project Structure

```
nextjstodo/
├── app/
│   ├── actions/
│   │   └── todo-actions.js        # Next.js Server Actions (CRUD)
│   ├── api/
│   │   └── test-db/
│   │       └── route.js           # DB connection test endpoint
│   ├── globals.css                # Global styles + amber theme tokens
│   ├── layout.js                  # Root layout
│   └── page.js                    # Home page (form + list layout)
│
├── components/
│   └── ui/
│       ├── button.jsx             # shadcn Button
│       ├── card.jsx               # shadcn Card
│       ├── input.jsx              # shadcn Input
│       ├── textarea.jsx           # shadcn Textarea
│       ├── todo-form.jsx          # Add task form
│       └── todo-list.jsx          # Task board with filters
│
├── hooks/
│   ├── use-create-todo.js         # TanStack mutation — create
│   ├── use-delete-todo.js         # TanStack mutation — delete
│   ├── use-get-todos.js           # TanStack query   — fetch all
│   └── use-toggle-todo.js         # TanStack mutation — toggle complete
│
├── lib/
│   ├── db.js                      # Mongoose connection helper
│   └── utils.js                   # Shared utility functions
│
├── models/
│   └── todo.js                    # Mongoose Todo schema
│
├── store/
│   └── todo-store.js              # Zustand global store
│
├── validations/
│   └── todo-schema.js             # Zod validation schema
│
├── .env                           # Environment variables (not committed)
├── next.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextjs-todo-app.git
cd nextjs-todo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- ✅ **Create** tasks with title and description
- ✅ **Toggle** completion with optimistic UI updates
- ✅ **Delete** tasks with smooth exit animations
- ✅ **Filter** tasks — All / Active / Completed
- ✅ **Progress bar** showing completion ratio
- ✅ **Server Actions** for type-safe mutations
- ✅ **Zod validation** on both client and server
- ✅ **Zustand** for instant local state sync
- ✅ **TanStack Query** for caching and background refetching
- ✅ Warm amber glassmorphism UI with staggered animations

---

## 🗺️ Architecture Overview

```
User Interaction
      │
      ▼
TodoForm / TodoList  ←─── Zustand Store (local UI state)
      │                         ▲
      ▼                         │
TanStack Query Hooks  ──────────┘
(useCreateTodo, useGetTodos, etc.)
      │
      ▼
Next.js Server Actions  ←── Zod Schema Validation
      │
      ▼
Mongoose → MongoDB Atlas
```

---

## 📦 Key Dependencies

```json
{
  "next": "^15",
  "react": "^19",
  "mongoose": "^8",
  "zod": "^3",
  "zustand": "^5",
  "@tanstack/react-query": "^5",
  "lucide-react": "latest",
  "tailwindcss": "^4"
}
```

---

## 🙌 Author

Built by **shubham panghal** — [@shubh791](https://github.com/shubh791)

---

> *"Clarity, speed, and flow — task management the modern way."*