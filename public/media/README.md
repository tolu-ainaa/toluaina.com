# Media

Drop video and image files here. They are served from `/media/...`.

## Fork background loops (required for launch)
- `fork-xr.mp4`, `fork-xr.jpg` (poster)
- `fork-motion.mp4`, `fork-motion.jpg` (poster)
- 8 to 12 s, 1920x1080 or 1280x720, no audio track, under 2 MB each, H.264.
- Then point `src/data/site.json` -> `loops.xr.src` / `loops.motion.src` (and `.poster`) at them.

## Card posters and loops (optional)
- `cards/<slug>.jpg` and `cards/<slug>.mp4` (3 to 5 s, 640 px wide, under 500 KB)
- Then set `poster` / `loop` on that project in `src/data/projects-*.json`.

## XR project media
`projects/` holds the card posters (`<slug>.jpg`), hover loops (`<slug>-loop.mp4`), case-study heroes
(`<slug>-hero.mp4`) and gallery stills, all encoded by `media-source/encode-projects.py` from the
galdar-recreation source folder. Re-run that script after replacing a source file.
