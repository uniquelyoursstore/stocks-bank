# סטטוס נוכחי — קרא זה בתחילת כל session

> קובץ זה מתעדכן אוטומטית בסוף כל שיחה דרך `/update-memory`.

---

## עכשיו עובדים על
דיבאג כולל הסתיים — כל 8 הטאבים עובדים. המשך: שורת ביצועים 1D/5D/1M ושדות טריידים בנושן.

## הצעד הבא (המשך ישיר)
1. **שורת ביצועים** לכל מנייה: 1D / 5D / 1M / YTD / 1Y (עדיפות 1)
2. **לאמת** שה-`NOTION_TOKEN` מוגדר ב-Vercel ושה-`DATABASE_ID` נכון
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
- ✅ דיבאג כולל: תוקן mapping של שדות Notion (שם החברה/שכבה/סטטוס פעיל-בבדיקה), סורטים, פילטרי סטטוס, תצוגת תאריך (he-IL), באג ב-CompareTab עם ticker ריק
- ✅ `NOTION_TOKEN` הורד מ-Vercel ל-`.env.local`, מעבר ל-`vercel dev` במקום `npm run dev` כדי שה-API ירוץ מקומית
- ✅ פיצול `App.jsx` (730 שורות) לקומפוננטות נפרדות: `src/utils/helpers.js`, `src/components/ui.jsx`, `src/components/NewsModal.jsx`, `src/components/AlertsBanner.jsx`, `src/tabs/*.jsx` (8 טאבים)
- ✅ `.claude/context/workflow.md` — מסמך פורמט עבודה מלא (Git, ברנצ'ים, לוקלי/ענן, צוות, זיכרון) — מוזג ל-`main`
- ✅ `CLAUDE.md` — נוסף workflow.md לטבלת ה-Index
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

## שדות Notion ידועים
`שם החברה, טיקר, סטטוס (פעיל/בבדיקה/הוסר), סקטור, תת-סקטור, שכבה (צמיחה/ספקולטיבי/ליבה/המתנה/הוסר), מחיר יעד, מחיר נוכחי, משקל מוצע %, סיכון, תזה, טכני, פונדמנטל, נוסף על ידי`

**לא קיים:** Entry/Exit/Stop Loss/R:R/P&L/Date — טאבי טריידים מציגים עמודות אלה ריקות.

## בעיות ידועות
- ~~`App.jsx` הוא קובץ אחד של ~730 שורות~~ — פוצל לקומפוננטות, `App.jsx` כעת ~50 שורות בלבד
- לא ברור אם `NOTION_TOKEN` מוגדר ב-Vercel — יש לאמת לפני session הבא
- `DATABASE_ID` מקודד קשיח ב-`api/stocks.js` — לאמת שמצביע לנוטיין הנכון
- GitHub MCP token פג כל session — בכל session חדש צריך לחדש ע"י mcp__github__authenticate
- 3 ברנצ'ים ריקים ב-remote (`review-open-tasks-Qbfzm`, `define-next-steps-Y6wmJ`, `project-status-review-CribY`) — לא ניתן למחוק (403), לא פוגעים בפרויקט
