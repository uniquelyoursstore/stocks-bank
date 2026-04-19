import { useState, useEffect } from "react";
import { Card, StatBox, Badge, Loader, ErrorMsg, Table } from "../components/ui";
import NewsModal from "../components/NewsModal";
import { fmt, pct, colorPnl, fetchStocks, fmtDate } from "../utils/helpers";

export default function BankTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livePrices, setLivePrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [newsModal, setNewsModal] = useState(null);

  useEffect(() => {
    let tickers = [];

    const fetchPrices = () => {
      if (!tickers.length) return;
      fetch(`/api/prices?tickers=${tickers.join(",")}`)
        .then((r) => r.json())
        .then(({ prices }) => {
          setLivePrices(prices || {});
          setLastUpdated(new Date());
        })
        .catch(() => {});
    };

    fetchStocks()
      .then((d) => {
        setData(d);
        tickers = [...new Set(d.data.map((r) => r.ticker).filter(Boolean))];
        fetchPrices();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    const interval = setInterval(fetchPrices, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const { stats } = data;
  const allSectors = [...new Set(data.data.map((r) => r.sector).filter(Boolean))].sort();
  const filtered = sectorFilter === "all" ? data.data : data.data.filter((r) => r.sector === sectorFilter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>סקירת בנק</h2>
        {lastUpdated && (
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            עודכן {lastUpdated.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatBox label="סה״כ רשומות" value={stats.total} />
        <StatBox label="עסקאות פתוחות" value={stats.openTrades ?? "—"} color="#60a5fa" />
        <StatBox label="עסקאות סגורות" value={stats.closedTrades ?? "—"} color="#a78bfa" />
        <StatBox label="אחוז הצלחה" value={stats.winRate ? pct(stats.winRate) : "—"} color="#22c55e" />
        <StatBox label="P&L כולל" value={fmt(stats.totalPnl)} color={colorPnl(stats.totalPnl)} />
      </div>

      {allSectors.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button
            onClick={() => setSectorFilter("all")}
            style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: sectorFilter === "all" ? "#6366f1" : "#2a2a3e", color: sectorFilter === "all" ? "#fff" : "#aaa" }}
          >
            כל הסקטורים ({data.data.length})
          </button>
          {allSectors.map((s) => {
            const count = data.data.filter((r) => r.sector === s).length;
            return (
              <button
                key={s}
                onClick={() => setSectorFilter(s)}
                style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: sectorFilter === s ? "#6366f1" : "#2a2a3e", color: sectorFilter === s ? "#fff" : "#aaa" }}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      )}

      <Card>
        <Table
          rows={filtered.slice(0, 50)}
          columns={[
            { key: "name", label: "שם" },
            { key: "ticker", label: "טיקר" },
            { key: "sector", label: "סקטור" },
            { key: "portfolio", label: "תיק" },
            {
              key: "livePrice",
              label: "מחיר חי",
              align: "right",
              render: (r) => {
                const lp = r.ticker ? livePrices[r.ticker] : null;
                if (!lp || lp.price == null) return <span style={{ color: "#555" }}>—</span>;
                return (
                  <span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>${fmt(lp.price)}</span>
                    {lp.changePct != null && (
                      <span style={{ color: colorPnl(lp.changePct), fontSize: 11, marginRight: 5 }}>
                        {lp.changePct > 0 ? "+" : ""}{lp.changePct.toFixed(1)}%
                      </span>
                    )}
                  </span>
                );
              },
            },
            {
              key: "status",
              label: "סטטוס",
              render: (r) => <Badge text={r.status || "—"} color={r.status === "פעיל" || r.status === "Open" || r.status === "פתוח" ? "#166534" : "#4b5563"} />,
            },
            {
              key: "pnl",
              label: "P&L",
              align: "right",
              render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span>,
            },
            { key: "date", label: "תאריך", render: (r) => fmtDate(r.date) },
            {
              key: "newsBtn",
              label: "",
              render: (r) =>
                r.ticker ? (
                  <button
                    onClick={() => setNewsModal(r.ticker)}
                    style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid #3a3a5e", background: "#2a2a3e", color: "#a78bfa", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}
                  >
                    📰 חדשות
                  </button>
                ) : null,
            },
          ]}
        />
      </Card>

      {newsModal && <NewsModal ticker={newsModal} onClose={() => setNewsModal(null)} />}
    </div>
  );
}
