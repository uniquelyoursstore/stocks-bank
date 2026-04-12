# סטטוס נוכחי — קרא זה בתחילת כל session

> קובץ זה מתעדכן אוטומטית בסוף כל שיחה דרך `/update-memory`.

---

## עכשיו עובדים על
תיקון קידוד עברית ב-App.jsx + העלאה ל-main. הפרויקט מחכה לחיבור Vercel.

## הצעד הבא (המשך ישיר)
1. **חובה ידני** — לפתוח Vercel, לחבר את הריפו `uniquelyoursstore/stocks-bank` ולהגדיר `NOTION_TOKEN`
2. לאחר מכן — עדכון מחירים אוטומטי כל 15 דקות (עדיפות 1)
3. שורת ביצועים לכל מנייה: 1D / 5D / 1M / YTD / 1Y

---

## משימות פתוחות

### עדיפות 0 — חסום (דורש פעולה ידנית)
- [ ] חיבור Vercel לריפו + הגדרת `NOTION_TOKEN` (ידני — אין גישת CLI)

### עדיפות 1 — לעשות קודם
- [ ] עדכון מחירים אוטומטי כל 15 דקות (Yahoo Finance polling)
- [ ] שורת ביצועים לכל מנייה: 1D / 5D / 1M / YTD / 1Y

### עדיפות 2 — חשוב
- [ ] תהליך אישור מנייה חדשה עם כפתורי הצבעה (3/3)
- [ ] סנכרון Cowork לגיא

### עדיפות 3 — עתידי
- [ ] יצוא PDF / Excel לדוחות שבועיים
- [ ] היסטוריית שינויים לכל מנייה
- [ ] החלפת Notion ב-DB אחר

---

## הושלם לאחרונה
- ✅ `api/stocks.js` — Vercel serverless function לנוטיין
- ✅ `src/App.jsx` — דאשבורד עם 8 טאבים ומחירים חיים
- ✅ `public/alerts.json` — קובץ התראות (RDW מעל $10.32, KTOS מתחת $70.70)
- ✅ `vercel.json` — routing לפונקציות API
- ✅ `vite.config.js` — proxy לפיתוח מקומי
- ✅ מבנה זיכרון: `CLAUDE.md` + `.claude/context/` + `.claude/commands/`
- ✅ `status.md` — קובץ quick-start לכל session, מחובר ל-`/update-memory`
- ✅ סקיל `/update-memory` — נוצר, נבדק ועובד
- ✅ כל 5 פרומפטי הסקילים הועתקו ל-`.claude/commands/` (morning-brief, stock-add, alert-add, technical-analysis, weekly-review)
- ✅ `src/App.jsx` — תוקן פגם קידוד cp1255 שהפך כל הטקסט העברי לג'יבריש + שבר פילטרי סטטוס

---

## בעיות ידועות
- `App.jsx` הוא קובץ אחד של 715 שורות — עלול לגרום לקונפליקטים כשעובדים בצוות
- Vercel לא מחובר — האתר `stocks-bank.vercel.app` לא קיים עדיין, צריך לחבר ידנית
