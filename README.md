# Muhammad Muttayab — Portfolio

Personal portfolio for Muhammad Muttayab, AI Engineer & Data Scientist. Live at [muttayab.dev](https://muttayab.dev).

## Stack

- [Vite](https://vitejs.dev) + [React 18](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) with a small set of [shadcn/ui](https://ui.shadcn.com) primitives (`src/components/ui`)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Formspree](https://formspree.io) for the contact form
- "Ask about my work": BM25 retrieval over `src/content` + [Groq](https://groq.com) (`openai/gpt-oss-120b`) behind a Vercel Edge Function (`api/chat.ts`)
- Deployed on Vercel

## Development

```sh
npm install
cp .env.example .env.local   # then set GROQ_API_KEY (server-side only; never VITE_-prefixed)
npm run dev        # http://localhost:8080  (/api/chat is served by a dev middleware in vite.config.ts)
npm run typecheck  # tsc
npm run lint       # eslint
npm run build      # production build -> dist/
```

## Layout

```
api/chat.ts              # Edge function: retrieval + streamed Groq answer (needs GROQ_API_KEY)
src/
  content/               # ALL site copy as typed data: profile, experience, projects (+ case studies), skills
  content/knowledge.ts   # flattens content into chunks + BM25 retrieval, shared with api/chat.ts
  pages/Index.tsx        # home: Hero + lazy-loaded sections
  pages/ProjectPage.tsx  # /projects/:slug case-study pages
  components/            # one file per section, AskMe (chat), Magnetic, ScrollManager
  components/case-study/ # PipelineDiagram
  components/ui/         # shadcn primitives actually used by the site
  index.css              # theme tokens (light/dark) + the few global component classes
public/                  # profile image, CV, robots/sitemap
```

To change any copy, edit `src/content/*`. Adding a `caseStudy` to a project in `projects.ts` automatically
creates its `/projects/<slug>` page, links it from the Experience/Projects sections and feeds the assistant.
Set `GROQ_API_KEY` in Vercel → Settings → Environment Variables for production.
