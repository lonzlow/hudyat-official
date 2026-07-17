# Hudyat — New Era University Student Publication

The official digital student publication of New Era University. A modern content management system for publishing news, features, editorials, opinions, literary works, and sports coverage.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Fonts:** Inter & Playfair Display (Google Fonts)
- **Theme:** Light/Dark mode via [next-themes](https://github.com/pacocoursey/next-themes)

## Features

- **Multi-section publication** — News, Features, Editorials, Opinions, Literary, Sports
- **Article pages** — Individual article view with rich content
- **Category browsing** — Browse articles by section
- **Search** — Full-text search across articles
- **Responsive design** — Optimized for mobile, tablet, and desktop
- **Dark mode** — Toggle between light and dark themes
- **Splash screen** — Animated loading experience
- **YouTube integration** — Embedded video content

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── article/[slug]/     # Dynamic article pages
│   ├── editorial/          # Editorial section
│   ├── feature/            # Feature stories
│   ├── literary/           # Literary works
│   ├── news/               # News section
│   ├── newsroom/           # Newsroom overview
│   ├── opinion/            # Opinion pieces
│   ├── search/             # Search page
│   └── sports/             # Sports coverage
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # React components
│   │   ├── article/        # Article-specific components
│   │   ├── feedback/       # Loading/splash screen
│   │   ├── home/           # Homepage components
│   │   ├── layout/         # Header, footer, shell
│   │   ├── media/          # Media components
│   │   └── ui/             # shadcn/ui primitives
│   ├── data/               # Static content data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & Supabase client
│   │   └── supabase/       # Supabase client setup
│   └── types/              # TypeScript type definitions
├── .env.local              # Environment variables (not committed)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com/) project

### Installation

```bash
git clone <repository-url>
cd hudyat-official
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run gen:types` | Generate Supabase TypeScript types |
