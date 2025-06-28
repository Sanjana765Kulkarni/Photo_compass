# PhotoAI - Instagram Perfect Shots

## Overview

PhotoAI is a Progressive Web Application (PWA) that serves as an AI-powered photography assistant. It provides real-time feedback and scoring to help users capture Instagram-worthy photos. The application uses a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database integration.

## System Architecture

The application follows a monorepo structure with clear separation between frontend, backend, and shared components:

- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture (`client/`)
- **React SPA**: Single-page application with TypeScript
- **Component Library**: shadcn/ui components providing a comprehensive design system
- **Styling**: Tailwind CSS with custom theming and responsive design
- **Camera Integration**: Real-time camera access with MediaStream API
- **PWA Features**: Manifest file for installable app experience
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture (`server/`)
- **Express Server**: RESTful API endpoints for photo management and AI analysis
- **Storage Abstraction**: Interface-based storage system with in-memory implementation
- **AI Analysis Simulation**: Mock AI scoring system for composition, lighting, and focus
- **Development Tools**: Vite integration for hot module replacement

### Database Schema (`shared/schema.ts`)
- **Users Table**: Authentication and user management
- **Photos Table**: Image storage with base64 encoding and AI analysis results
- **Settings Table**: User preferences for camera features and UI options
- **Type Safety**: Drizzle-Zod integration for runtime validation

### Shared Components (`shared/`)
- **Schema Definitions**: Centralized database schema and type definitions
- **Type Safety**: Shared TypeScript types between frontend and backend

## Data Flow

1. **Camera Capture**: User accesses device camera through browser MediaStream API
2. **Real-time Analysis**: Video frames are periodically analyzed for composition feedback
3. **Photo Capture**: High-quality images are captured and converted to base64
4. **AI Processing**: Backend simulates AI analysis providing scores and suggestions
5. **Data Persistence**: Photos and analysis results are stored in PostgreSQL database
6. **Gallery Display**: Captured photos are displayed with scores and detailed feedback

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **PostgreSQL**: Primary database with Neon serverless integration
- **Drizzle ORM**: Type-safe database toolkit

### UI and Styling
- **shadcn/ui**: React component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives

### Development Tools
- **TypeScript**: Static type checking across the entire stack
- **Vite**: Build tool and development server
- **TanStack Query**: Data fetching and caching library

### Camera and Media
- **MediaStream API**: Browser API for camera access
- **Canvas API**: Image processing and manipulation

## Deployment Strategy

The application is designed for deployment on Replit with the following considerations:

1. **Database**: Configured for Neon PostgreSQL serverless database
2. **Environment Variables**: DATABASE_URL required for database connection
3. **Build Process**: 
   - Frontend builds to `dist/public/` directory
   - Backend compiles to `dist/` directory using esbuild
4. **Production Serving**: Express serves both API endpoints and static frontend files
5. **Development Mode**: Vite middleware integration for hot reloading

### Build Commands
- `npm run dev`: Development mode with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Database schema deployment

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.