```markdown
Phase A — additional integration notes

I pushed a test page at `app/picto/page.tsx` that mounts the `PicToText` component and allows quick local testing. The PicToText component will POST to `/api/ocr` (server proxy) which forwards to your HF Space. If no proxy is available, the component falls back to client-side Tesseract.js.

I also added stub API routes for tags and favorites at: `app/api/tags/route.ts` and `app/api/favorites/route.ts`. These are intentionally stubs to avoid forcing immediate DB/migration work. After you confirm, I will implement full Prisma-backed endpoints and add the Prisma schema + migrations.

Next steps for me (on your confirmation):
- Implement Prisma schema updates and migration SQL for tags, favorites, share_links, versions.
- Replace stub API routes with real DB logic (Prisma) and add tests.
- Integrate Tag UI and Favorites toggles into the main notes list and note editor.
- Add PDF export button using html2canvas + jsPDF and ensure mobile-friendly downloads.
```
