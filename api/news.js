export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

  const { ticker } = req.query;
    if (!ticker) return res.status(400).json({ error: "ticker param required" });

  try {
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(ticker)}&quotesCount=1&newsCount=8&enableFuzzyQuery=false`;
        const r = await fetch(url, {
                headers: {
                          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                          Accept: "application/json",
                },
        });
        if (!r.ok) throw new Error(`Yahoo Finance responded with ${r.status}`);
        const data = await r.json();
        const news = (data?.news ?? []).map((n) => ({
                title: n.title,
                link: n.link,
                publisher: n.publisher,
                time: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toISOString() : null,
        }));
        return res.status(200).json({ news });
  } catch (err) {
        return res.status(500).json({ error: err.message });
  }
}
