import { useState, useEffect } from "react";
import { Card, Loader, ErrorMsg, Table } from "../components/ui";
import { fmt, colorPnl, fetchStocks, fmtDate } from "../utils/helpers";

export default function EarningsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks({ tab: "earnings" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = data.data.filter((r) => r.date >= today).sort((a, b) => a.date?.localeCompare(b.date));
  const past = data.data.filter((r) => r.date && r.date < today).sort((a, b) => b.date?.localeCompare(a.date));

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>יומן דוחות</h2>
      <h3 style={{ color: "#a78bfa", marginBottom: 12, fontSize: 14 }}>קרובים ({upcoming.length})</h3>
      <Card style={{ marginBottom: 24 }}>
        <Table rows={upcoming} columns={[
          { key: "date", label: "תאריך", render: (r) => fmtDate(r.date) },
          { key: "ticker", label: "טיקר" },
          { key: "name", label: "שם" },
          { key: "portfolio", label: "תיק" },
          { key: "notes", label: "הערות" },
        ]} />
      </Card>
      <h3 style={{ color: "#6b7280", marginBottom: 12, fontSize: 14 }}>עבר ({past.length})</h3>
      <Card>
        <Table rows={past.slice(0, 30)} columns={[
          { key: "date", label: "תאריך", render: (r) => fmtDate(r.date) },
          { key: "ticker", label: "טיקר" },
          { key: "name", label: "שם" },
          { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
        ]} />
      </Card>
    </div>
  );
}
