# ClinLink - Clinician-Researcher Matching Platform

## Overview

ClinLink is a web application that connects healthcare professionals with research experts. Clinicians can submit clinical challenges or problems they're facing, and the system uses TF-IDF (Term Frequency-Inverse Document Frequency) matching algorithms to identify researchers whose expertise aligns with those challenges. The platform facilitates evidence-based healthcare solutions by bridging the gap between clinical practice and academic research.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, utilizing a single-page application (SPA) architecture with client-side routing via Wouter.

**UI Component System**: Built on shadcn/ui (New York variant) with Radix UI primitives, providing a comprehensive set of accessible, customizable components. The design system emphasizes professional networking patterns inspired by LinkedIn and Material Design principles for information hierarchy.

**Styling**: Tailwind CSS with custom design tokens defined through CSS variables, enabling consistent theming. The color system uses HSL values with alpha channel support for flexible opacity control. Typography uses Inter as the primary font for professional readability.

**State Management**: TanStack Query (React Query) handles server state, API calls, and caching. Local component state managed through React hooks. Query client configured with infinite stale time to minimize unnecessary refetches.

**Form Handling**: React Hook Form with Zod schema validation for type-safe form management.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript. Middleware includes JSON body parsing with raw body access for webhook support, and custom request logging for API routes.

**API Design**: RESTful API with three main endpoints:
- POST `/api/researchers` - Create new researcher profiles
- GET `/api/researchers` - Retrieve all researchers
- POST `/api/clinician-problems` - Submit clinical problems and receive matched researchers

**Matching Algorithm**: Natural language processing using the `natural` library's TF-IDF implementation. The algorithm tokenizes problem descriptions, calculates term frequency-inverse document frequency scores against researcher profiles (descriptions + keywords), and normalizes results to return ranked matches with percentage scores.

**Data Validation**: Zod schemas (via drizzle-zod) ensure type safety and runtime validation for all incoming data before database operations.

### Data Storage

**Database**: PostgreSQL database provided by Replit, configured via Drizzle ORM with Neon serverless driver. All data persists between server restarts.

**Schema**: Three main tables with UUID primary keys:
- `researchers` - Researcher profiles with array of keywords, capacity field (1-20 projects)
- `clinician_problems` - Submitted clinical challenges with title, domain, keywords, description, and timestamps
- `matches` - Junction table linking problems to researchers with scores and rankings

**Current Implementation**: DbStorage class implements IStorage interface using Drizzle ORM for all database operations. Database connection configured with WebSocket support (ws library) and secure WebSocket transport. Initial seeding script (`seed-database.ts`) populates database with 8 pre-configured researchers on first run.

**ORM**: Drizzle ORM provides type-safe database access with PostgreSQL dialect. Migration files configured to output to `./migrations` directory. Schema changes applied via `npm run db:push`.

### Routing and Navigation

**Client-Side Routing**: Wouter provides lightweight routing with four main routes:
- `/` - Home/landing page
- `/submit-problem` - Problem submission form
- `/matches/:id` - Display matching results for a specific problem
- `/researchers` - Browse all researchers directory-style

**Server-Side Routing**: Express handles API routes separately from static asset serving. Vite development server middleware integrates for hot module replacement during development.

### Build and Development

**Build Tool**: Vite for fast development with HMR, React plugin, and runtime error overlay. Production builds bundle client assets to `dist/public` while server code bundles via esbuild to `dist/index.js`.

**Development Environment**: Integrated Replit plugins for cartographer (dependency visualization) and dev banner. TypeScript configured with strict mode, ESNext modules, and path aliases for clean imports.

**Code Organization**: Monorepo structure with three main directories:
- `client/` - React frontend application
- `server/` - Express backend services
- `shared/` - Common schema definitions and types

## External Dependencies

### Database Services
- **Neon**: Serverless PostgreSQL database provider (via `@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support and Zod integration for schema validation

### UI Component Libraries
- **Radix UI**: Comprehensive suite of unstyled, accessible UI primitives including dialogs, dropdowns, tooltips, navigation menus, and form controls
- **shadcn/ui**: Pre-styled component library built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

### Utility Libraries
- **Natural**: NLP library providing TF-IDF algorithms and tokenization for text matching
- **TanStack Query**: Server state management and data fetching
- **Wouter**: Lightweight client-side routing
- **class-variance-authority & clsx**: Dynamic className generation and merging
- **date-fns**: Date manipulation utilities
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Build tool and development server with HMR
- **TypeScript**: Type safety across the entire codebase
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **esbuild**: Fast JavaScript bundler for production server builds

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (configured but may not be actively used given in-memory storage)