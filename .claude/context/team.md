# צוות, כלים, תהליכים ואבטחה

## הצוות

| שם | סקטור | כלי עיקרי |
|----|-------|----------|
| אייל | אנרגיה | Claude Chat + Claude Code (עיקר הפיתוח) |
| גיא | חלל, הגנה | Claude Cowork |
| רוני | בריאות, שבבים, פיננסים | Claude Chat |

## כללי תהליך
- **מנייה חדשה לבנק** → דורש 3/3 הצבעות מהצוות
- **סט-אפ טכני על מנייה קיימת** → ללא צורך באישור
- **יעד שנתי:** תשואה של 30%

---

## כלים

| כלי | שימוש |
|-----|-------|
| Claude Chat | ניתוחים, STOCK_ADD, סקילים, בריף בוקר |
| Claude Code | כתיבת קוד, git push, debug, שינויים גדולים |
| Claude Cowork (גיא) | לא ברור עדיין — לברר |
| Notion MCP | גישה ישירה לבנק המניות |
| Vercel | auto-deploy מ-GitHub, מחזיק את ה-env vars |
| Yahoo Finance | מחירים חיים (חינמי, ללא מפתח API) |

---

## כללי אבטחה
- **לעולם** אל תדפיס GitHub PAT בצ'אט — GitHub מבטל אותו תוך שניות
- `NOTION_TOKEN` — נמצא ב-Vercel Environment Variables בלבד, **לא בקוד**
- עריכת קבצים → רק דרך git (add / commit / push)

## העדפות עבודה — Claude Code
- **אוטומציה תמיד לפני שאלה** — לפני שמבקשים מהמשתמש לעשות משהו ידנית, לנסות כל דרך אוטומטית אפשרית (GitHub API, curl, MCP tools וכו')
- **GitHub MCP token** פג כל session — להשתמש ב-`mcp__github__authenticate` בתחילת session לחידוש. אחרי auth, ה-callback URL מגיע מהמשתמש
- **בדיקת deploy** — להשתמש ב-GitHub Deployments API (`curl https://api.github.com/repos/uniquelyoursstore/stocks-bank/deployments`) במקום לבקש מהמשתמש לבדוק
- **גישה לאתר** — הפרוקסי של הסביבה חוסם `stocks-bank.vercel.app` — לבדוק סטטוס דרך GitHub API ולא דרך curl ישיר לאתר

---

## ויזיה לטווח ארוך
אתר / אפליקציה עצמאית עם מחירים חיים, גרפים, חדשות, סט-אפים, היסטוריה — הכל במקום אחד. עובד ממובייל ומחשב. Notion הוא מאגר זמני ויוחלף בהדרגה.
