# toluaina.com

Personal portfolio for Tolu Aina: XR developer and motion designer. A fork landing page (`/`) splits into `/xr` and `/motion`, each with case studies, plus `/about` and `/contact`.

## Stack
Astro 5 (static output), plain CSS with design tokens, vanilla JS. Hosted on Vercel.

## Run locally
```
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

## Where things live
- `src/data/site.json`: name, links, showreel links, CV paths, fork loop paths
- `src/data/projects-xr.json`, `src/data/projects-motion.json`: the cards and case studies
- `public/media/`: encoded media (loops, posters, stills); `public/cv/`: CV PDFs
- `media-source/` (git-ignored): original files and the encode scripts (`encode-projects.py`, `encode-motion.py`, `encode-photos.py`)

Add a project: add an entry to the JSON, drop its media in `public/media/...`, and the card and `/xr/<slug>` or `/motion/<slug>` page build themselves.
