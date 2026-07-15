# העלאה נכונה ל-GitHub ול-Netlify

העלה את כל הקבצים והתיקיות שבתיקייה זו לשורש המאגר.

חובה שיופיעו בשורש GitHub:

- package.json
- package-lock.json
- index.html
- netlify.toml
- src/
- public/
- supabase/

גרסה זו אינה תלויה בסקריפט `scripts/verify-project.mjs` בזמן ה-Build.
גם אם תיקיית `scripts` לא תועלה, `npm run build` יריץ ישירות `vite build`.

לאחר Push:

1. Netlify → Deploys
2. Trigger deploy
3. Clear cache and deploy site

הגדרות Build:

- Base directory: ריק או `.`
- Build command: `npm run build`
- Publish directory: `dist`
