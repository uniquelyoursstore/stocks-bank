import { useState, useEffect } from "react";
import { Card, StatBox, Loader, ErrorMsg, Table } from "../components/ui";
import { fmt, colorPnl, fetchStocks } from "../utils/helpers";

export default function DailyUpdateTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks({ tab: "trades", status: "פעיל" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const open = data.data.filter((r) => r.status === "פעיל" || r.status === "Open" || r.status === "פתוח");
  const unrealizedPnl = open.reduce((s, r) => s + (r.pnl ?? 0), 0);

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>עדכון יומי</h2>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>{today}</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatBox label="פוזיציות פתוחות" value={open.length} color="#60a5fa" />
        <StatBox label="P&L לא ממומש" value={fmt(unrealizedPnl)} color={colorPnl(unrealizedPnl)} />
        <StatBox label="רשומות היום" value={data.stats.total} />
      </div>
      <h3 style={{ fontSize: 14, color: "#a78bfa", marginBottom: 12 }}>פוזיציות פתוחות לסקירה</h3>
      <Card>
        <Table
          rows={open}
          columns={[
            { key: "ticker", label: "טיקר" },
            { key: "name", label: "שם" },
            { key: "entryPrice", label: "כניסה", align: "right", render: (r) => fmt(r.entryPrice) },
            { key: "stopLoss", label: "סטופ", align: "right", render: (r) => fmt(r.stopLoss) },
            { key: "target", label: "יעד", align: "right", render: (r) => fmt(r.target) },
            { key: "riskReward", label: "R:R", align: "right", render: (r) => fmt(r.riskReward, 1) },
            { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
            { key: "notes", label: "הערות" },
          ]}
        />
      </Card>
    </div>
  );
}
