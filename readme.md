# 🌟 TALENT FLOW: Candidate Tracking & Job Management Portal

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue)](https://tailwindcss.com/)


A *modern front-end job portal and candidate tracking system* built with React + TypeScript.  
Features client-side persistence with *IndexedDB (Dexie.js)*, interactive dashboards, and a drag-and-drop hiring pipeline.

---

## 🚀 Project Overview

*TALENT FLOW* simulates a *full-stack job portal* with advanced front-end practices — no backend required.  
Data is stored locally in the browser via IndexedDB, giving a realistic full-stack experience on the client side.

### ✨ Key Features
- *Job Management* – Create, view, filter, and manage job postings
- *Candidate Pipeline* – Track candidates from *Applied → Hired/Rejected*
- *Drag & Drop Kanban* – Intuitive candidate movement between stages
- *Interactive Dashboard* – Real-time analytics & hiring trends
- *Detailed Profiles* – Full views for jobs & candidates
- *Resizable UI* – Sidebar with persistent preferences
- *Responsive Design* – Works seamlessly across devices

---

## 🛠 Tech Stack

*Core:* React • TypeScript • Vite • React Router  
*UI & Styling:* Tailwind CSS • shadcn/ui • Framer Motion • Lucide Icons  
*Functionality:* Dexie.js • dnd-kit • date-fns  

---

## 📋 Prerequisites

- *Node.js* v18+  
- *npm* or *yarn*

---

## 🚀 Getting Started

```bash
# 1. Clone repository
git clone <your-repository-url>
cd <repository-folder>

# 2. Install dependencies
npm install
# or
yarn install

# 3. Run dev server
npm run dev
# or
yarn dev

🏗 Architecture
<details> <summary>📂 Folder Structure</summary>
HiringPortal/
├── src/
│   ├── pages/             # Main application routes
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── mock/              # IndexedDB schema, seeds & handlers
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
│
├── public/                # Static assets & mock service worker
├── Resources/             # Design system (colors, etc.)
├── package.json           # Dependencies & scripts
├── tailwind.config.ts     # Tailwind config
├── vite.config.ts         # Vite build config
└── tsconfig.json          # TypeScript config

💾 Database (IndexedDB with Dexie.js)

Data persists across browser sessions

Schema includes jobs, candidates, notes, timelines, assessments

Automatic seeding with realistic mock data on first run

Resetting Database:

Open DevTools → Application tab

Go to Storage → IndexedDB

Delete MockHRDB

Refresh → app reseeds fresh data

🌟 Feature Highlights

Dynamic Dashboard: Interactive charts & hiring metrics

Resizable Sidebar: Persistent width settings via localStorage

Job Management: Search, filter, and paginate jobs

Drag & Drop Pipeline: Real-time candidate stage updates

Animations: Smooth transitions using Framer Motion

🔧 Technical Decisions

Skills Data Fix: Job interface updated with skills: string[] for realistic tagging

IndexedDB Versioning: Implemented schema migration strategy

Client-Centric Performance: All filters & pagination done client-side for speed

🚀 Performance Optimizations

Client-side filtering & pagination

Lazy-loaded routes & components

Optimized Framer Motion animations (60fps)

🎯 Scripts
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run lint checks

🤝 Contributing
Fork repo

Create branch → git checkout -b feature/amazing-feature

Commit changes → git commit -m 'Add amazing feature'

Push → git push origin feature/amazing-feature

Open PR 🎉

🐛 Troubleshooting

Database not updating?
→ Delete IndexedDB MockHRDB & refresh

Missing job skills?
→ Ensure seeding includes skills: string[]

Performance issues with large data?
→ Review filtering & pagination strategy
