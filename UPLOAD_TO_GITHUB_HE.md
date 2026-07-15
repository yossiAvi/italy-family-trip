# העלאה נכונה ל-GitHub ול-Netlify

יש להעלות את **תוכן התיקייה הזו** לשורש המאגר.

המבנה בשורש GitHub חייב להיות:

- package.json
- package-lock.json
- netlify.toml
- index.html
- vite.config.js
- src/
- public/
- supabase/
- scripts/

בפרט, הקובץ הבא חייב להיפתח ב-GitHub:

`src/main.jsx`

אין להעלות את קובץ ה-ZIP עצמו כקובץ יחיד.
אין להעלות רק package.json / package-lock.json / netlify.toml.
אין להשאיר את כל הפרויקט בתוך תיקיית משנה נוספת.

ב-Netlify:

- Base directory: ריק או `.`
- Build command: `npm run build`
- Publish directory: `dist`

אחרי החלפת הקבצים:

Deploys → Trigger deploy → Clear cache and deploy site
