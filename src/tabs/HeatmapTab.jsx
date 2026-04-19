import { useState, useEffect } from "react";
import { Loader, ErrorMsg } from "../components/ui";
import { pct, fetchStocks } from "../utils/helpers";

function heatColor(pnl) {
  if (pnl == null) return "#374151";
  if (pnl > 10) return "#166534";
  if (pnl > 3) return "#15803d";
  if (pnl > 0) return "#16a34a";
  if (pnl > -3) return "#991b1b";
  if (pnl > -10) return "#b91c1c";
  return "#7f1d1d";
}

export default function HeatmapTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks({ tab: "heatmap" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const bySector = data.data.reduce((acc, r) => {
    const key = r.sector || "ללא סקטור";
    if (!acc[key]) acc[key] = { name: key, stocks: [] };
    acc[key].stocks.push(r);
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>היט-מאפ לפי סקטור</h2>
      {Object.values(bySector).map((sector) => (
        <div key={sector.name} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: "#a78bfa", marginBottom: 10, fontSize: 14 }}>{sector.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sector.stocks.map((s) => (
              <div key={s.id} style={{ background: heatColor(s.pnlPercent ?? s.pnl), borderRadius: 8, padding: "10px 14px", minWidth: 90, textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{s.ticker || s.name || "?"}</div>
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>{pct(s.pnlPercent ?? s.pnl)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
