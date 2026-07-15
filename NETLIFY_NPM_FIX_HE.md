# תיקון שגיאת npm ETIMEDOUT ב-Netlify

השגיאה נגרמה משום שקובץ `package-lock.json` הישן נוצר בסביבת פיתוח פנימית וכלל כתובות של registry פנימי שאינו נגיש מ-Netlify.

בגרסה 1.2.1 בוצעו התיקונים הבאים:

- כל כתובות החבילות ב-`package-lock.json` הוחלפו ל-`https://registry.npmjs.org/`.
- נוסף קובץ `.npmrc` שמכריח שימוש ב-registry הציבורי.
- נוספו ל-`netlify.toml` משתני registry ונסיונות חוזרים.
- גרסאות התלויות הראשיות ננעלו כדי למנוע שינוי לא צפוי בזמן build.

## מה להעלות ל-GitHub

החלף במאגר את הקבצים הבאים לפחות:

- `package.json`
- `package-lock.json`
- `.npmrc`
- `netlify.toml`

הדרך הבטוחה היא להחליף את כל תוכן המאגר בתוכן החבילה המתוקנת.

## לאחר העדכון

ב-Netlify פתח:

`Deploys -> Trigger deploy -> Clear cache and deploy site`

אין צורך להגדיר Proxy ואין להשתמש בכתובת ה-registry הפנימי שהופיעה בשגיאה.
