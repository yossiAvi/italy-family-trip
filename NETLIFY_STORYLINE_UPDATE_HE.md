# העלאת גרסת Story Line ל־Netlify

## האפשרות המומלצת — סנכרון לכל המשפחה

כדי שכל אחד יוכל להוסיף תמונות וסיפורים מהטלפון שלו, Netlify צריך לבנות את **קוד המקור** עם משתני Supabase. העלאת תיקיית `dist` בלבד תפעיל מצב מקומי, שאינו מסתנכרן בין מכשירים.

### שלבים

1. צרו פרויקט Supabase והפעילו Anonymous Sign-Ins.
2. הריצו את `supabase/storyline.sql` ב־SQL Editor.
3. העלו את קוד המקור ל־GitHub.
4. ב־Netlify חברו את ה־repository הקיים או החדש.
5. הגדרות build כבר נמצאות ב־`netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. ב־Netlify → Site configuration → Environment variables הוסיפו:

```text
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-KEY
VITE_TRIP_ID=italy-family-trip-2026
VITE_STORY_BUCKET=trip-story-images
```

7. הפעילו Deploy חדש: **Clear cache and deploy site**.
8. פתחו את האתר בטלפון ואשרו מצלמה, מיקרופון ומיקום.

## בדיקה מהירה

- פתחו את האתר בשני טלפונים.
- בטלפון הראשון הוסיפו תמונה וסיפור.
- הרשומה אמורה להופיע בטלפון השני אוטומטית.

## פריסה ידנית של `dist`

אפשר לגרור את תיקיית `dist` ל־Netlify כדי לבדוק את הממשק. במקרה כזה ה־Story Line נשמר רק בדפדפן המקומי. ניתן לגבות לקובץ JSON ולשחזר במכשיר אחר, אך זה אינו סנכרון חי.
