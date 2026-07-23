# Italy Family Trip 2026 — v2.4.0

גרסה זו כוללת את כל פיצ׳רי 2.3.0 ובנוסף אזור “מה קורה סביבנו?” עם אירועים חיים, מבצעים רשמיים ומבצעים משפחתיים.

ראו `NEARBY_EVENTS_DEALS_HE.md` להגדרת Ticketmaster.

# Italy Family Trip 2026

אפליקציית React/Vite משפחתית למסלול רומא, סורנטו וחוף אמאלפי.

## הרצה מקומית

```bash
npm ci
npm run dev
```

## בנייה

```bash
npm run build
```

תיקיית הפרסום היא `dist`.

## Netlify

הפרויקט כולל `netlify.toml`, `_redirects` ו-`_headers`.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

## תוכן המסלול

כל יום כולל לוח זמנים, דרך הגעה, חניה, מעבר בין התחנות, פירוט אטרקציות, מסעדות, שופינג, ניווט וטיפים מעשיים.

## Story Line משפחתי – גרסה 1.2

נוסף יומן מסע אינטראקטיבי עם:

- צילום והעלאת עד 6 תמונות לכל רגע
- הקטנה אוטומטית של תמונות
- זיהוי מיקום וקישור ל־Google Maps
- הכתבה קולית בעברית (Speech-to-Text)
- הקראת הסיפור בקול (Text-to-Speech)
- ציר זמן, חיפוש וסינון לפי יום
- עריכה ומחיקה של רשומות אישיות
- גיבוי ושחזור JSON במצב מקומי
- סנכרון משפחתי בזמן אמת דרך Supabase

האפליקציה עובדת ללא הגדרה נוספת במצב מקומי. להפעלת סנכרון בין כל בני המשפחה קראו את `STORYLINE_SETUP_HE.md`.


## גרסה 1.5.0 – מרכז החוויה
- מסך מה עושים עכשיו
- מצב ילדים ומשימות
- כרטיס חניה חכם
- דירוגים משפחתיים
- מפת זיכרונות ודרכונים
- נגן מסע
- התקנת PWA ונגישות

## Version 2.0 – Shared family data

Run the full `supabase/storyline.sql` once to enable the `trip_shared_data` table, Realtime synchronization and the shared image bucket. See `SUPABASE_SHARED_DATA_HE.md`.
