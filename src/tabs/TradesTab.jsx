import { useState, useEffect } from "react";
import { Card, Badge, Loader, ErrorMsg, Table } from "../components/ui";
import { fmt, pct, colorPnl, fetchStocks, fmtDate } from "../utils/helpers";

export default function TradesTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchStocks({ tab: "trades" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const rows = data.data.filter((r) => {
    if (filter === "open") return r.status === "פעיל" || r.status === "Open" || r.status === "פתוח";
    if (filter === "closed") return r.status === "בבדיקה" || r.status === "Closed" || r.status === "סגור";
    return true;
  });

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>טריידים</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "open", "closed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: filter === f ? "#6366f1" : "#2a2a3e", color: "#fff", fontSize: 13 }}>
            {f === "all" ? "הכל" : f === "open" ? "פעיל" : "בבדיקה"}
          </button>
        ))}
      </div>
      <Card>
        <Table
          rows={rows}
          columns={[
            { key: "ticker", label: "טיקר" },
            { key: "name", label: "שם" },
            { key: "entryPrice", label: "כניסה", align: "right", render: (r) => fmt(r.entryPrice) },
            { key: "exitPrice", label: "יציאה", align: "right", render: (r) => fmt(r.exitPrice) },
            { key: "stopLoss", label: "סטופ", align: "right", render: (r) => fmt(r.stopLoss) },
            { key: "target", label: "יעד", align: "right", render: (r) => fmt(r.target) },
            { key: "riskReward", label: "R:R", align: "right", render: (r) => fmt(r.riskReward, 1) },
            { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
            { key: "pnlPercent", label: "P&L %", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnlPercent) }}>{pct(r.pnlPercent)}</span> },
            { key: "status", label: "סטטוס", render: (r) => <Badge text={r.status || "—"} color={r.status === "פעיל" || r.status === "Open" || r.status === "פתוח" ? "#166534" : "#374151"} /> },
            { key: "date", label: "תאריך", render: (r) => fmtDate(r.date) },
          ]}
        />
      </Card>
    </div>
  );
}
