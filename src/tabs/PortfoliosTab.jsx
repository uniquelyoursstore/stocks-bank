import { useState, useEffect } from "react";
import { Card } from "../components/ui";
import { Loader, ErrorMsg } from "../components/ui";
import { fmt, pct, colorPnl, fetchStocks } from "../utils/helpers";

export default function PortfoliosTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const byPortfolio = data.data.reduce((acc, r) => {
    const key = r.portfolio || "ללא תיק";
    if (!acc[key]) acc[key] = { name: key, count: 0, totalPnl: 0, winners: 0, closed: 0 };
    acc[key].count++;
    if (r.pnl != null) { acc[key].totalPnl += r.pnl; acc[key].closed++; if (r.pnl > 0) acc[key].winners++; }
    return acc;
  }, {});

  const portfolios = Object.values(byPortfolio).sort((a, b) => b.totalPnl - a.totalPnl);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>תיקים</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {portfolios.map((p) => (
          <Card key={p.name}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa" }}>
              <span>רשומות</span><span style={{ color: "#fff" }}>{p.count}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginTop: 4 }}>
              <span>P&L</span><span style={{ color: colorPnl(p.totalPnl) }}>{fmt(p.totalPnl)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginTop: 4 }}>
              <span>Win Rate</span>
              <span style={{ color: "#22c55e" }}>{p.closed > 0 ? pct((p.winners / p.closed) * 100) : "—"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
