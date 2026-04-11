# alert-add — הוספת התראת מחיר

> סקיל זה רץ ב-Claude Chat.
> העתק לכאן את הפרומפט המלא מהסקיל בצ'אט הרגיל.

---

## פונקציה
הוספת התראת מחיר לטיקר → עדכון `public/alerts.json` בגיטהאב.

## פורמט alerts.json
```json
{
  "alerts": [
    { "ticker": "TICKER", "direction": "above|below", "triggerPrice": 0.00 }
  ]
}
```

## פרומפט

## מה הסקיל הזה עושה
מוסיף התראת מחיר בקלות מקסימלית — רק טיקר ומחיר. כל השאר אוטומטי.
תמיד מביא מחיר חי מ-Yahoo Finance — לא מסתמך על מחירים ישנים מהקובץ.

## לוגיקת כיוון ו-triggerPrice

אין לשאול על כיוון. Claude מחשב אוטומטית:
- alertPrice > currentPrice → צריכה לעלות → direction = "above" → triggerPrice = alertPrice × 0.99
- alertPrice < currentPrice → צריכה לרדת → direction = "below" → triggerPrice = alertPrice × 1.01

עגל triggerPrice לשתי ספרות. triggerPrice מחושב מ-alertPrice בלבד.

## שלב 1 — נסה לפרסר מהודעה ישירה

אם ההודעה מכילה טיקר + מחיר — פרסר ישירות וקפוץ לשלב 3:
- "alert NVDA 150" → ticker=NVDA, alertPrice=150
- "PLTR 130 — תמיכה" → ticker=PLTR, alertPrice=130, note="תמיכה"

## שלב 2 — אם חסר מידע, שאל

### 2א — בחירת מנייה (אם לא צוינה)
השתמש ב-AskUserQuestion עם 4 מניות פופולריות + Other:
- NVDA, RKLB, ASTS, PLTR

### 2ב — שלוף מחיר חי
מיד לאחר קבלת הטיקר:
GET https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=1d
שלוף: data.chart.result[0].meta.regularMarketPrice

### 2ג — שאל על מחיר ההתראה
"[TICKER] — מחיר נוכחי: $X.XX (live). מה המחיר להתראה?"

## שלב 3 — חשב כיוון ו-triggerPrice

direction    = alertPrice > livePrice ? "above" : "below"
triggerPrice = direction == "above" ? alertPrice × 0.99 : alertPrice × 1.01
עגל ל-2 ספרות אחרי הנקודה.

## שלב 4 — עדכן קבצים

### stock-bank.jsx — מצא const ALERTS_DATA = [ והוסף:
{ id: <timestamp>, ticker: "TICKER", price: ALERT_PRICE, triggerPrice: TRIGGER_PRICE, direction: "above"|"below", note: "", active: true, triggered: false, createdAt: "<ISO>" },

### alerts.json — הוסף למערך ועדכן exportedAt:
{
  "id": NUMBER,
  "ticker": "TICKER",
  "price": ALERT_PRICE,
  "triggerPrice": TRIGGER_PRICE,
  "direction": "above"|"below",
  "note": "",
  "active": true,
  "triggered": false,
  "createdAt": "<ISO>"
}

## שלב 5 — אישור

✅ התראה נוספה!

🔔 TICKER — מתריע כש [≥/≤] $TRIGGER_PRICE
   יעד: $ALERT_PRICE | מחיר נוכחי (live): $LIVE_PRICE
   צריכה [לעלות/לרדת] X%

📁 stock-bank.jsx ו-alerts.json עודכנו
⏰ בדיקה כל 30 דקות בשעות המסחר

## טיפול בשגיאות
- Yahoo Finance נכשל → ציין שהמחיר לא זמין ובקש מהמשתמש לאשר כיוון ידנית
- קובץ לא נמצא → בקש גישה מחדש לתיקייה
