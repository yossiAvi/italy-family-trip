# פרסום הפרויקט ב-Netlify

הפרויקט מותאם כעת לשתי שיטות פרסום.

## שיטה 1 — העלאה ידנית, ללא GitHub

זו השיטה המהירה ביותר לקבלת קישור לוואטסאפ.

1. השתמשו בחבילה `italy-family-trip-netlify-dist.zip` שקיבלתם יחד עם הפרויקט.
2. חלצו את קובץ ה-ZIP במחשב.
3. היכנסו ל-Netlify ובחרו **Add new project → Deploy manually**.
4. גררו לאזור ההעלאה את התיקייה שחולצה. בתוכה חייבים להופיע ישירות `index.html`, תיקיית `assets` ושאר קובצי האתר.
5. בסיום תקבלו כתובת המסתיימת ב-`netlify.app`.
6. לשינוי הכתובת: **Project configuration → Domain management → Options → Edit project name**.

> בפרסום ידני מעלים את קובצי ה-build המוכנים, לא את תיקיית קוד המקור.

## שיטה 2 — GitHub ופרסום אוטומטי

שיטה זו עדיפה כאשר תרצו לעדכן את האתר בהמשך.

1. צרו Repository חדש ב-GitHub והעלו את כל תוכן חבילת המקור.
2. ב-Netlify בחרו **Add new project → Import an existing project**.
3. חברו את GitHub ובחרו את ה-Repository.
4. Netlify יקרא את `netlify.toml` אוטומטית:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node.js: גרסה 20
5. לחצו **Deploy**.

## בדיקה מקומית

```bash
npm ci
npm run build
npm run preview
```

## עדכון האתר בהמשך

- בחיבור ל-GitHub: כל Push לענף הראשי ייצור פרסום חדש אוטומטית.
- בפרסום ידני: הריצו שוב `npm run build` והעלו מחדש את תיקיית `dist`.

## הערות

- אין צורך להגדיר משתני סביבה כרגע.
- תמונות היעדים נטענות מ-Unsplash ומזג האוויר נטען מ-Open-Meteo, לכן חלקים אלה דורשים אינטרנט.
- קובצי `_redirects` ו-`netlify.toml` מונעים שגיאות 404 ברענון של אפליקציית React.
