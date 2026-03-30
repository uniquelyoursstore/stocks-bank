export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: "tickers param required" });

  const tickerList = tickers.split(",").map((t) => t.trim()).filter(Boolean);
  const results = {};

  await Promise.all(
    tickerList.map(async (ticker) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
        const r = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        if (!r.ok) { results[ticker] = null; return; }
        const data = await r.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) { results[ticker] = null; return; }
        const price = meta.regularMarketPrice ?? null;
        const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? null;
        results[ticker] = {
          price,
          prevClose,
          change: price != null && prevClose != null ? price - prevClose : null,
          changePct: price != null && prevClose != null ? ((price - prevClose) / prevClose) * 100 : null,
          currency: meta.currency ?? "USD",
        };
      } catch {
        results[ticker] = null;
      }
    })
  );

  return res.status(200).json({ prices: results });
}
