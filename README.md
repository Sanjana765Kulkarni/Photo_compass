# Photo_compass

PhotoAI is a Progressive Web Application (PWA) that serves as an AI-powered photography assistant. It provides real-time feedback and scoring to help users capture Instagram-worthy photos. The application uses a modern full-stack architecture with a React frontend, Express backend, and PostgreSQL database integration.

## Features

- 📸 Real-time camera access and photo capture
- 🤖 AI-powered analysis: composition, lighting, focus, and suggestions
- 🏆 Scoring system for each photo
- 🖼️ Gallery with detailed feedback and scores
- ⚙️ User settings for camera grid, AI guidance, and sensitivity
- 📱 Mobile-first responsive design
- 💾 Data persistence with PostgreSQL (Neon serverless)
- 🛠️ Modern UI with shadcn/ui and Tailwind CSS
- 🚀 PWA: installable and offline-ready

## Project Structure

```
PhotoCompass-2/
  client/         # React frontend (TypeScript, Vite, Tailwind CSS)
    public/       # Static assets and PWA manifest
    src/          # Source code (components, hooks, pages, etc.)
  server/         # Express backend (TypeScript)
  shared/         # Shared TypeScript types and database schema
  package.json    # Project scripts and dependencies
  replit.md       # Developer documentation
  ...
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file with your database connection string:
     ```
     DATABASE_URL=your_postgres_connection_url
     ```

3. **Push database schema:**
   ```sh
   npm run db:push
   ```

4. **Run in development mode:**
   ```sh
   npm run dev
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend/API: [http://localhost:3000](http://localhost:3000)

5. **Build for production:**
   ```sh
   npm run build
   ```

6. **Start production server:**
   ```sh
   npm run start
   ```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query
- **Backend:** Express.js, TypeScript, Drizzle ORM
- **Database:** PostgreSQL (Neon serverless)
- **Other:** PWA, MediaStream API, Canvas API

## Deployment

- Designed for Replit deployment
- Frontend builds to `dist/public/`
- Backend builds to `dist/`
- Express serves both API and static frontend

## License

MIT

---

**Preferred communication style:** Simple, everyday language.

For more details, see [replit.md](replit.md)
