import { useState, useEffect } from "react";
import { Card, Loader, ErrorMsg } from "../components/ui";
import { colorPnl, fetchStocks, fmtDate } from "../utils/helpers";

export default function CompareTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");

  useEffect(() => {
    fetchStocks().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const rows = data.data;
  const tickers = [...new Set(rows.map((r) => r.ticker).filter(Boolean))].sort();
  const stockA = selectedA ? rows.find((r) => r.ticker === selectedA) : null;
  const stockB = selectedB ? rows.find((r) => r.ticker === selectedB) : null;
  const metrics = ["entryPrice", "exitPrice", "stopLoss", "target", "riskReward", "pnl", "pnlPercent", "sector", "portfolio", "date"];
  const labels = { entryPrice: "מחיר כניסה", exitPrice: "מחיר יציאה", stopLoss: "סטופ", target: "יעד", riskReward: "R:R", pnl: "P&L", pnlPercent: "P&L %", sector: "סקטור", portfolio: "תיק", date: "תאריך" };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>השוואת מניות</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[{ val: selectedA, set: setSelectedA, label: "מניה א׳" }, { val: selectedB, set: setSelectedB, label: "מניה ב׳" }].map(({ val, set, label }) => (
          <div key={label} style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>{label}</label>
            <select value={val} onChange={(e) => set(e.target.value)} style={{ width: "100%", background: "#2a2a3e", border: "1px solid #444", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14 }}>
              <option value="">בחר טיקר...</option>
              {tickers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>
      {(stockA || stockB) && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", color: "#888", textAlign: "left", borderBottom: "1px solid #333" }}>מדד</th>
                <th style={{ padding: "8px 12px", color: "#60a5fa", textAlign: "center", borderBottom: "1px solid #333" }}>{selectedA || "א׳"}</th>
                <th style={{ padding: "8px 12px", color: "#f97316", textAlign: "center", borderBottom: "1px solid #333" }}>{selectedB || "ב׳"}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m} style={{ borderBottom: "1px solid #2a2a3e" }}>
                  <td style={{ padding: "8px 12px", color: "#aaa" }}>{labels[m]}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: ["pnl", "pnlPercent"].includes(m) ? colorPnl(stockA?.[m]) : "#fff" }}>{m === "date" ? fmtDate(stockA?.[m]) : (stockA?.[m] ?? "—")}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: ["pnl", "pnlPercent"].includes(m) ? colorPnl(stockB?.[m]) : "#fff" }}>{m === "date" ? fmtDate(stockB?.[m]) : (stockB?.[m] ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
