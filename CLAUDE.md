# Stocks Bank — Project Context

## מה הפרויקט
דשבורד משותף לניהול תיק מניות של 3 שותפים. מקור האמת: Notion. ממשק: React app ב-Vercel.

## Stack
- Frontend: React + Vite → Vercel (https://stocks-bank.vercel.app)
- Backend: Vercel Serverless Functions (`/api/`)
- Database: Notion (env var: `NOTION_TOKEN`)
- מחירים חיים: Yahoo Finance API (חינמי, polling כל 15 דקות)
- Repo: https://github.com/uniquelyoursstore/stocks-bank

## הצוות
- **אייל** — סקטור אנרגיה, עיקר הפיתוח
- **גיא** — סקטור חלל והגנה
- **רוני** — סקטור בריאות, שבבים, פיננסים
- כלל: מנייה חדשה = **3/3 הצבעות**. סט-אפ טכני = ללא אישור.

---

## התחלת session — קרא תמיד
**אחרי קובץ זה, קרא מיד:** `.claude/context/status.md` — איפה עצרנו ומה הצעד הבא.

---

## Index — מה לקרוא לפי משימה

| משימה | קרא |
|-------|-----|
| עבודה על UI / טאבים / קומפוננטות | `.claude/context/features.md` |
| עבודה על API / Notion / נתונים | `.claude/context/notion.md` |
| הוספה / עדכון / הבנה של מניות | `.claude/context/stocks.md` + `.claude/context/notion.md` |
| הבנת תפקידים / כלים / אבטחה | `.claude/context/team.md` |
| תכנון מה הלאה | `.claude/context/features.md` (חלק "משימות פתוחות") |
