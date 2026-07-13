# Devashish Moghe — Portfolio

Personal portfolio site. Vite + React + TypeScript + Tailwind + Framer Motion + React Three Fiber.

**Live:** _(deploy to populate)_

## Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** for styling
- **Framer Motion 11** for UI animation
- **React Three Fiber 8** + **Drei 9** + **three.js** for 3D scenes
- **Lenis** for smooth scrolling
- **Lucide** for icons

## Develop

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:5190
npm run build        # production build → dist/
npm run preview      # preview the build locally
```

## Deploy (Vercel — recommended)

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel             # follow prompts; pick "Vite" framework
vercel --prod      # deploy to production
```

### Option B — GitHub → Vercel dashboard

1. Push the repo to GitHub.
2. Open https://vercel.com/new and import the repo.
3. Vercel auto-detects Vite. Settings should already be:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install --legacy-peer-deps`
4. Click **Deploy**.

The `vercel.json` in the repo handles SPA rewrites and cache headers for `/assets/*`, images, and the resume PDF.

### Other hosts

- **Netlify:** drag-and-drop `dist/` to https://app.netlify.com/drop, or connect the repo (build = `npm run build`, publish = `dist`).
- **GitHub Pages:** add a `homepage` to package.json and use a deploy action — works but needs SPA handling for hash links.
- **Render / Cloudflare Pages:** same Vite settings as Vercel.

## Structure

```
portfolio/
├── public/
│   ├── DevCV3.33.pdf       # downloadable résumé
│   └── favicon.svg
├── src/
│   ├── components/         # all sections + UI primitives
│   ├── data/projects.ts    # project + skill data
│   ├── lib/sounds.ts       # Web-Audio sound effects
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vercel.json
└── vite.config.ts
```

## Notes

- `--legacy-peer-deps` is required because `@react-three/fiber@8.x` declares React 19 as a peer; we run React 18.
- Heavy sections (`SkillsGalaxy`, `QuantZone`, `Terminal`, `AchievementVault`) are `React.lazy()`'d so the initial bundle is ~120 kB gzipped. The R3F chunk (~234 kB gzipped) only loads when a 3D section enters the viewport.
- The bottom-of-page sound effects use the Web Audio API — no audio files shipped.

## License

© 2026 Devashish Moghe — all content & code.
