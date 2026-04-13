# סטטוס נוכחי — קרא זה בתחילת כל session

> קובץ זה מתעדכן אוטומטית בסוף כל שיחה דרך `/update-memory`.

---

## עכשיו עובדים על
האתר חי ב-Vercel ✅. בדיקת תקינות מלאה + הוספת polling מחירים אוטומטי.

## הצעד הבא (המשך ישיר)
1. **לאמת** שה-`NOTION_TOKEN` מוגדר ב-Vercel ושה-`DATABASE_ID` נכון — כל 7 הטאבים תלויים בזה
2. **שורת ביצועים** לכל מנייה: 1D / 5D / 1M / YTD / 1Y (עדיפות 1 הבאה)
3. תהליך אישור מנייה חדשה עם כפתורי הצבעה (3/3)

---

## משימות פתוחות

### עדיפות 1 — לעשות קודם
- [ ] לאמת שה-`NOTION_TOKEN` מוגדר ב-Vercel (Vercel → Project Settings → Environment Variables)
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
- ✅ כל 5 פרומפטי הסקילים הועתקו ל-`.claude/commands/`
- ✅ `src/App.jsx` — תוקן פגם קידוד cp1255
- ✅ מיזוג כל הסשנים ל-`main` + push → Vercel deploy הצליח (state: success)
- ✅ polling מחירים אוטומטי כל 15 דקות — `BankTab` + `AlertsBanner`
- ✅ אינדיקטור "עודכן HH:MM" ב-BankTab

---

## בעיות ידועות
- `App.jsx` הוא קובץ אחד של ~730 שורות — עלול לגרום לקונפליקטים כשעובדים בצוות
- לא ברור אם `NOTION_TOKEN` מוגדר ב-Vercel — יש לאמת לפני session הבא
- `DATABASE_ID` מקודד קשיח ב-`api/stocks.js` — לאמת שמצביע לנוטיין הנכון
- GitHub MCP token פג כל session — בכל session חדש צריך לחדש ע"י mcp__github__authenticate
