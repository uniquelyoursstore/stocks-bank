const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = "40a2ec9c01e84410bb7c91fd44ad3b1c";
const DATA_SOURCE_ID = "98f866f4-f4fa-45ca-a1b2-5f4b0445800f";

const notionHeaders = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function queryDatabase(filter, sorts, pageSize = 100) {
  const body = { page_size: pageSize };
  if (filter) body.filter = filter;
  if (sorts) body.sorts = sorts;

  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: notionHeaders,
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion query failed: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.results;
}

function extractProp(props, key) {
  const prop = props[key];
  if (!prop) return null;
  switch (prop.type) {
    case "title":
      return prop.title.map((t) => t.plain_text).join("");
    case "rich_text":
      return prop.rich_text.map((t) => t.plain_text).join("");
    case "number":
      return prop.number;
    case "select":
      return prop.select?.name ?? null;
    case "multi_select":
      return prop.multi_select.map((s) => s.name);
    case "checkbox":
      return prop.checkbox;
    case "date":
      return prop.date?.start ?? null;
    case "url":
      return prop.url;
    case "formula":
      return prop.formula?.number ?? prop.formula?.string ?? null;
    case "rollup":
      return prop.rollup?.number ?? null;
    default:
      return null;
  }
}

function mapRow(page) {
  const p = page.properties;
  return {
    id: page.id,
    created: page.created_time,
    updated: page.last_edited_time,
    // Common fields — extend as needed based on your Notion schema
    name: extractProp(p, "Name") ?? extractProp(p, "שם") ?? extractProp(p, "Stock"),
    ticker: extractProp(p, "Ticker") ?? extractProp(p, "טיקר"),
    sector: extractProp(p, "Sector") ?? extractProp(p, "סקטור"),
    status: extractProp(p, "Status") ?? extractProp(p, "סטטוס"),
    portfolio: extractProp(p, "Portfolio") ?? extractProp(p, "תיק"),
    entryPrice: extractProp(p, "Entry Price") ?? extractProp(p, "מחיר כניסה"),
    exitPrice: extractProp(p, "Exit Price") ?? extractProp(p, "מחיר יציאה"),
    stopLoss: extractProp(p, "Stop Loss") ?? extractProp(p, "סטופ"),
    target: extractProp(p, "Target") ?? extractProp(p, "יעד"),
    riskReward: extractProp(p, "R:R") ?? extractProp(p, "risk_reward"),
    pnl: extractProp(p, "P&L") ?? extractProp(p, "רווח/הפסד"),
    pnlPercent: extractProp(p, "P&L %") ?? extractProp(p, "% רווח/הפסד"),
    date: extractProp(p, "Date") ?? extractProp(p, "תאריך"),
    notes: extractProp(p, "Notes") ?? extractProp(p, "הערות"),
    tags: extractProp(p, "Tags") ?? extractProp(p, "תגיות") ?? [],
    // Raw props for any unmapped field
    _raw: p,
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: "NOTION_TOKEN env var not set" });
  }

  try {
    const { tab, ticker, portfolio, status, limit } = req.query;
    const pageSize = Math.min(parseInt(limit) || 100, 200);

    let filter = null;
    let sorts = [{ timestamp: "created_time", direction: "descending" }];

    // Per-tab filtering
    if (tab === "trades") {
      filter = {
        or: [
          { property: "Status", select: { equals: "Open" } },
          { property: "Status", select: { equals: "Closed" } },
          { property: "סטטוס", select: { equals: "פתוח" } },
          { property: "סטטוס", select: { equals: "סגור" } },
        ],
      };
      sorts = [{ property: "Date", direction: "descending" }];
    } else if (tab === "heatmap") {
      sorts = [{ property: "Sector", direction: "ascending" }];
    } else if (tab === "earnings") {
      filter = {
        property: "Date",
        date: { is_not_empty: true },
      };
      sorts = [{ property: "Date", direction: "ascending" }];
    }

    // Additional filters from query params
    const andFilters = [];
    if (filter) andFilters.push(filter);
    if (ticker) {
      andFilters.push({
        or: [
          { property: "Ticker", rich_text: { contains: ticker } },
          { property: "טיקר", rich_text: { contains: ticker } },
        ],
      });
    }
    if (portfolio) {
      andFilters.push({
        or: [
          { property: "Portfolio", select: { equals: portfolio } },
          { property: "תיק", select: { equals: portfolio } },
        ],
      });
    }
    if (status) {
      andFilters.push({
        or: [
          { property: "Status", select: { equals: status } },
          { property: "סטטוס", select: { equals: status } },
        ],
      });
    }

    const combinedFilter =
      andFilters.length === 0
        ? null
        : andFilters.length === 1
        ? andFilters[0]
        : { and: andFilters };

    const pages = await queryDatabase(combinedFilter, sorts, pageSize);
    const rows = pages.map(mapRow);

    // Aggregate stats
    const stats = {
      total: rows.length,
      dataSourceId: DATA_SOURCE_ID,
      databaseId: DATABASE_ID,
    };

    if (tab === "trades" || !tab) {
      const closed = rows.filter(
        (r) => r.status === "Closed" || r.status === "סגור"
      );
      const open = rows.filter(
        (r) => r.status === "Open" || r.status === "פתוח"
      );
      const winners = closed.filter((r) => (r.pnl ?? 0) > 0);
      stats.openTrades = open.length;
      stats.closedTrades = closed.length;
      stats.winRate =
        closed.length > 0
          ? ((winners.length / closed.length) * 100).toFixed(1)
          : null;
      stats.totalPnl = closed.reduce((sum, r) => sum + (r.pnl ?? 0), 0);
    }

    return res.status(200).json({ data: rows, stats });
  } catch (err) {
    console.error("stocks API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
