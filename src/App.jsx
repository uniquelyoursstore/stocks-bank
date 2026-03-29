import { useState, useEffect } from "react";

const API = "/api/stocks";

// ג”€ג”€ג”€ Helpers ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function fmt(n, digits = 2) {
  if (n == null) return "ג€”";
  return Number(n).toLocaleString("he-IL", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function pct(n) {
  if (n == null) return "ג€”";
  return `${Number(n).toFixed(1)}%`;
}
function colorPnl(val) {
  if (val == null) return "#aaa";
  return val > 0 ? "#22c55e" : val < 0 ? "#ef4444" : "#aaa";
}
async function fetchStocks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ג”€ג”€ג”€ Shared components ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function Card({ children, style }) {
  return <div style={{ background: "#1e1e2e", borderRadius: 12, padding: "16px 20px", ...style }}>{children}</div>;
}
function StatBox({ label, value, color }) {
  return (
    <Card style={{ textAlign: "center", minWidth: 140 }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || "#fff" }}>{value}</div>
    </Card>
  );
}
function Badge({ text, color }) {
  return (
    <span style={{ background: color || "#333", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {text}
    </span>
  );
}
function Loader() {
  return <div style={{ color: "#888", padding: 40, textAlign: "center" }}>׳˜׳•׳¢׳ ׳ ׳×׳•׳ ׳™׳...</div>;
}
function ErrorMsg({ msg }) {
  return <div style={{ color: "#ef4444", padding: 20 }}>׳©׳’׳™׳׳”: {msg}</div>;
}
function Table({ rows, columns }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ padding: "8px 12px", color: "#888", textAlign: c.align || "left", borderBottom: "1px solid #333", whiteSpace: "nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: "1px solid #2a2a3e" }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "8px 12px", textAlign: c.align || "left" }}>
                  {c.render ? c.render(row) : row[c.key] ?? "ג€”"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ג”€ג”€ג”€ News Modal ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function NewsModal({ ticker, onClose }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/news?ticker=${encodeURIComponent(ticker)}`)
      .then((r) => r.json())
      .then((d) => { setNews(d.news || []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [ticker]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#1e1e2e", borderRadius: 16, padding: 24, width: "min(580px, 90vw)", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, color: "#a78bfa" }}>נ“° ׳—׳“׳©׳•׳×: {ticker}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>ג•</button>
        </div>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {!loading && !error && news.length === 0 && (
          <div style={{ color: "#888", textAlign: "center", padding: 20 }}>׳׳™׳ ׳—׳“׳©׳•׳× ׳–׳׳™׳ ׳•׳×</div>
        )}
        {news.map((n, i) => (
          <a
            key={i}
            href={n.link}
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", padding: "12px 0", borderBottom: i < news.length - 1 ? "1px solid #2a2a3e" : "none", textDecoration: "none" }}
          >
            <div style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 5, lineHeight: 1.5 }}>{n.title}</div>
            <div style={{ color: "#6b7280", fontSize: 11 }}>
              {n.publisher}{n.time ? ` ֲ· ${new Date(n.time).toLocaleDateString("he-IL")}` : ""}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ג”€ג”€ג”€ Alerts Banner ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function AlertsBanner() {
  const [triggered, setTriggered] = useState([]);

  useEffect(() => {
    fetch("/alerts.json")
      .then((r) => r.json())
      .then(({ alerts }) => {
        const active = (alerts || []).filter((a) => a.active && !a.triggered);
        if (!active.length) return;
        const tickers = [...new Set(active.map((a) => a.ticker))].join(",");
        fetch(`/api/prices?tickers=${tickers}`)
          .then((r) => r.json())
          .then(({ prices }) => {
            const hits = active.filter((a) => {
              const livePrice = prices?.[a.ticker]?.price;
              if (livePrice == null) return false;
              return a.direction === "above" ? livePrice >= a.triggerPrice : livePrice <= a.triggerPrice;
            });
            setTriggered(hits);
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, []);

  if (!triggered.length) return null;

  return (
    <div style={{ background: "#7c1d1d", borderBottom: "2px solid #dc2626", padding: "10px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "#fca5a5", fontSize: 14 }}>נ”” ׳”׳×׳¨׳׳•׳× ׳׳—׳™׳¨ ׳”׳•׳₪׳¢׳׳•:</span>
        {triggered.map((a) => (
          <span key={a.id} style={{ background: "#991b1b", borderRadius: 8, padding: "4px 12px", color: "#fef2f2", fontSize: 13, fontWeight: 600 }}>
            {a.ticker} {a.direction === "above" ? "ג†‘" : "ג†“"} ${a.triggerPrice}{a.note ? ` ג€” ${a.note}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

// ג”€ג”€ג”€ TAB 1: ׳‘׳ ׳§ ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function BankTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livePrices, setLivePrices] = useState({});
  const [sectorFilter, setSectorFilter] = useState("all");
  const [newsModal, setNewsModal] = useState(null);

  useEffect(() => {
    fetchStocks()
      .then((d) => {
        setData(d);
        const tickers = [...new Set(d.data.map((r) => r.ticker).filter(Boolean))];
        if (tickers.length) {
          fetch(`/api/prices?tickers=${tickers.join(",")}`)
            .then((r) => r.json())
            .then(({ prices }) => setLivePrices(prices || {}))
            .catch(() => {});
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const { stats } = data;
  const allSectors = [...new Set(data.data.map((r) => r.sector).filter(Boolean))].sort();
  const filtered = sectorFilter === "all" ? data.data : data.data.filter((r) => r.sector === sectorFilter);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>׳¡׳§׳™׳¨׳× ׳‘׳ ׳§</h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatBox label="׳¡׳”׳´׳› ׳¨׳©׳•׳׳•׳×" value={stats.total} />
        <StatBox label="׳¢׳¡׳§׳׳•׳× ׳₪׳×׳•׳—׳•׳×" value={stats.openTrades ?? "ג€”"} color="#60a5fa" />
        <StatBox label="׳¢׳¡׳§׳׳•׳× ׳¡׳’׳•׳¨׳•׳×" value={stats.closedTrades ?? "ג€”"} color="#a78bfa" />
        <StatBox label="׳׳—׳•׳– ׳”׳¦׳׳—׳”" value={stats.winRate ? pct(stats.winRate) : "ג€”"} color="#22c55e" />
        <StatBox label="P&L ׳›׳•׳׳" value={fmt(stats.totalPnl)} color={colorPnl(stats.totalPnl)} />
      </div>

      {/* Sector filter buttons */}
      {allSectors.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button
            onClick={() => setSectorFilter("all")}
            style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: sectorFilter === "all" ? "#6366f1" : "#2a2a3e", color: sectorFilter === "all" ? "#fff" : "#aaa" }}
          >
            ׳›׳ ׳”׳¡׳§׳˜׳•׳¨׳™׳ ({data.data.length})
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
            { key: "name", label: "׳©׳" },
            { key: "ticker", label: "׳˜׳™׳§׳¨" },
            { key: "sector", label: "׳¡׳§׳˜׳•׳¨" },
            { key: "portfolio", label: "׳×׳™׳§" },
            {
              key: "livePrice",
              label: "׳׳—׳™׳¨ ׳—׳™",
              align: "right",
              render: (r) => {
                const lp = r.ticker ? livePrices[r.ticker] : null;
                if (!lp || lp.price == null) return <span style={{ color: "#555" }}>ג€”</span>;
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
              label: "׳¡׳˜׳˜׳•׳¡",
              render: (r) => <Badge text={r.status || "ג€”"} color={r.status === "Open" || r.status === "׳₪׳×׳•׳—" ? "#166534" : "#4b5563"} />,
            },
            {
              key: "pnl",
              label: "P&L",
              align: "right",
              render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span>,
            },
            { key: "date", label: "׳×׳׳¨׳™׳" },
            {
              key: "newsBtn",
              label: "",
              render: (r) =>
                r.ticker ? (
                  <button
                    onClick={() => setNewsModal(r.ticker)}
                    style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid #3a3a5e", background: "#2a2a3e", color: "#a78bfa", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}
                  >
                    נ“° ׳—׳“׳©׳•׳×
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

// ג”€ג”€ג”€ TAB 2: ׳×׳™׳§׳™׳ ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function PortfoliosTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const byPortfolio = data.data.reduce((acc, r) => {
    const key = r.portfolio || "׳׳׳ ׳×׳™׳§";
    if (!acc[key]) acc[key] = { name: key, count: 0, totalPnl: 0, winners: 0, closed: 0 };
    acc[key].count++;
    if (r.pnl != null) { acc[key].totalPnl += r.pnl; acc[key].closed++; if (r.pnl > 0) acc[key].winners++; }
    return acc;
  }, {});

  const portfolios = Object.values(byPortfolio).sort((a, b) => b.totalPnl - a.totalPnl);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>׳×׳™׳§׳™׳</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {portfolios.map((p) => (
          <Card key={p.name}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa" }}>
              <span>׳¨׳©׳•׳׳•׳×</span><span style={{ color: "#fff" }}>{p.count}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginTop: 4 }}>
              <span>P&L</span><span style={{ color: colorPnl(p.totalPnl) }}>{fmt(p.totalPnl)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginTop: 4 }}>
              <span>Win Rate</span>
              <span style={{ color: "#22c55e" }}>{p.closed > 0 ? pct((p.winners / p.closed) * 100) : "ג€”"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ג”€ג”€ג”€ TAB 3: ׳˜׳¨׳™׳™׳“׳™׳ ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function TradesTab() {
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
    if (filter === "open") return r.status === "Open" || r.status === "׳₪׳×׳•׳—";
    if (filter === "closed") return r.status === "Closed" || r.status === "׳¡׳’׳•׳¨";
    return true;
  });

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>׳˜׳¨׳™׳™׳“׳™׳</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "open", "closed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: filter === f ? "#6366f1" : "#2a2a3e", color: "#fff", fontSize: 13 }}>
            {f === "all" ? "׳”׳›׳" : f === "open" ? "׳₪׳×׳•׳—" : "׳¡׳’׳•׳¨"}
          </button>
        ))}
      </div>
      <Card>
        <Table
          rows={rows}
          columns={[
            { key: "ticker", label: "׳˜׳™׳§׳¨" },
            { key: "name", label: "׳©׳" },
            { key: "entryPrice", label: "׳›׳ ׳™׳¡׳”", align: "right", render: (r) => fmt(r.entryPrice) },
            { key: "exitPrice", label: "׳™׳¦׳™׳׳”", align: "right", render: (r) => fmt(r.exitPrice) },
            { key: "stopLoss", label: "׳¡׳˜׳•׳₪", align: "right", render: (r) => fmt(r.stopLoss) },
            { key: "target", label: "׳™׳¢׳“", align: "right", render: (r) => fmt(r.target) },
            { key: "riskReward", label: "R:R", align: "right", render: (r) => fmt(r.riskReward, 1) },
            { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
            { key: "pnlPercent", label: "P&L %", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnlPercent) }}>{pct(r.pnlPercent)}</span> },
            { key: "status", label: "׳¡׳˜׳˜׳•׳¡", render: (r) => <Badge text={r.status || "ג€”"} color={r.status === "Open" || r.status === "׳₪׳×׳•׳—" ? "#166534" : "#374151"} /> },
            { key: "date", label: "׳×׳׳¨׳™׳" },
          ]}
        />
      </Card>
    </div>
  );
}

// ג”€ג”€ג”€ TAB 4: ׳”׳™׳˜-׳׳׳₪ ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function HeatmapTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks({ tab: "heatmap" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const bySector = data.data.reduce((acc, r) => {
    const key = r.sector || "׳׳׳ ׳¡׳§׳˜׳•׳¨";
    if (!acc[key]) acc[key] = { name: key, stocks: [] };
    acc[key].stocks.push(r);
    return acc;
  }, {});

  function heatColor(pnl) {
    if (pnl == null) return "#374151";
    if (pnl > 10) return "#166534";
    if (pnl > 3) return "#15803d";
    if (pnl > 0) return "#16a34a";
    if (pnl > -3) return "#991b1b";
    if (pnl > -10) return "#b91c1c";
    return "#7f1d1d";
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>׳”׳™׳˜-׳׳׳₪ ׳׳₪׳™ ׳¡׳§׳˜׳•׳¨</h2>
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

// ג”€ג”€ג”€ TAB 5: ׳׳—׳©׳‘׳•׳ R:R ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function RRCalculatorTab() {
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [capital, setCapital] = useState("");
  const [riskPct, setRiskPct] = useState("1");

  const e = parseFloat(entry), s = parseFloat(stop), t = parseFloat(target), cap = parseFloat(capital), rp = parseFloat(riskPct);
  const riskPerShare = e && s ? Math.abs(e - s) : null;
  const rewardPerShare = e && t ? Math.abs(t - e) : null;
  const rr = riskPerShare && rewardPerShare ? (rewardPerShare / riskPerShare).toFixed(2) : null;
  const riskAmount = cap && rp ? (cap * rp) / 100 : null;
  const shares = riskAmount && riskPerShare ? Math.floor(riskAmount / riskPerShare) : null;
  const positionSize = shares && e ? shares * e : null;

  const Field = ({ label, value, onChange, placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</label>
      <input type="number" value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={placeholder} style={{ width: "100%", background: "#2a2a3e", border: "1px solid #444", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>׳׳—׳©׳‘׳•׳ R:R</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <Field label="׳׳—׳™׳¨ ׳›׳ ׳™׳¡׳”" value={entry} onChange={setEntry} placeholder="0.00" />
          <Field label="׳¡׳˜׳•׳₪ ׳׳•׳¡" value={stop} onChange={setStop} placeholder="0.00" />
          <Field label="׳™׳¢׳“" value={target} onChange={setTarget} placeholder="0.00" />
          <Field label="׳”׳•׳ ׳׳¡׳™׳›׳•׳ ($)" value={capital} onChange={setCapital} placeholder="10000" />
          <Field label="% ׳¡׳™׳›׳•׳ ׳׳”׳•׳" value={riskPct} onChange={setRiskPct} placeholder="1" />
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <StatBox label="׳™׳—׳¡ R:R" value={rr ? `1 : ${rr}` : "ג€”"} color={rr >= 2 ? "#22c55e" : rr >= 1 ? "#facc15" : "#ef4444"} />
          <StatBox label="׳¡׳™׳›׳•׳ ׳₪׳¨ ׳׳ ׳™׳”" value={riskPerShare ? `$${fmt(riskPerShare)}` : "ג€”"} color="#f97316" />
          <StatBox label="׳₪׳•׳˜׳ ׳¦׳™׳׳ ׳₪׳¨ ׳׳ ׳™׳”" value={rewardPerShare ? `$${fmt(rewardPerShare)}` : "ג€”"} color="#22c55e" />
          <StatBox label="׳›׳׳•׳× ׳׳ ׳™׳•׳×" value={shares ?? "ג€”"} color="#60a5fa" />
          <StatBox label="׳’׳•׳“׳ ׳₪׳•׳–׳™׳¦׳™׳”" value={positionSize ? `$${fmt(positionSize)}` : "ג€”"} color="#a78bfa" />
          <StatBox label="׳¡׳›׳•׳ ׳¡׳™׳›׳•׳" value={riskAmount ? `$${fmt(riskAmount)}` : "ג€”"} color="#ef4444" />
        </div>
      </div>
    </div>
  );
}

// ג”€ג”€ג”€ TAB 6: ׳™׳•׳׳ ׳“׳•׳—׳•׳× ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function EarningsTab() {
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
      <h2 style={{ marginBottom: 20 }}>׳™׳•׳׳ ׳“׳•׳—׳•׳×</h2>
      <h3 style={{ color: "#a78bfa", marginBottom: 12, fontSize: 14 }}>׳§׳¨׳•׳‘׳™׳ ({upcoming.length})</h3>
      <Card style={{ marginBottom: 24 }}>
        <Table rows={upcoming} columns={[
          { key: "date", label: "׳×׳׳¨׳™׳" },
          { key: "ticker", label: "׳˜׳™׳§׳¨" },
          { key: "name", label: "׳©׳" },
          { key: "portfolio", label: "׳×׳™׳§" },
          { key: "notes", label: "׳”׳¢׳¨׳•׳×" },
        ]} />
      </Card>
      <h3 style={{ color: "#6b7280", marginBottom: 12, fontSize: 14 }}>׳¢׳‘׳¨ ({past.length})</h3>
      <Card>
        <Table rows={past.slice(0, 30)} columns={[
          { key: "date", label: "׳×׳׳¨׳™׳" },
          { key: "ticker", label: "׳˜׳™׳§׳¨" },
          { key: "name", label: "׳©׳" },
          { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
        ]} />
      </Card>
    </div>
  );
}

// ג”€ג”€ג”€ TAB 7: ׳”׳©׳•׳•׳׳” ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function CompareTab() {
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
  const stockA = rows.find((r) => r.ticker === selectedA);
  const stockB = rows.find((r) => r.ticker === selectedB);
  const metrics = ["entryPrice", "exitPrice", "stopLoss", "target", "riskReward", "pnl", "pnlPercent", "sector", "portfolio", "date"];
  const labels = { entryPrice: "׳׳—׳™׳¨ ׳›׳ ׳™׳¡׳”", exitPrice: "׳׳—׳™׳¨ ׳™׳¦׳™׳׳”", stopLoss: "׳¡׳˜׳•׳₪", target: "׳™׳¢׳“", riskReward: "R:R", pnl: "P&L", pnlPercent: "P&L %", sector: "׳¡׳§׳˜׳•׳¨", portfolio: "׳×׳™׳§", date: "׳×׳׳¨׳™׳" };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>׳”׳©׳•׳•׳׳× ׳׳ ׳™׳•׳×</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[{ val: selectedA, set: setSelectedA, label: "׳׳ ׳™׳” ׳׳³" }, { val: selectedB, set: setSelectedB, label: "׳׳ ׳™׳” ׳‘׳³" }].map(({ val, set, label }) => (
          <div key={label} style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>{label}</label>
            <select value={val} onChange={(e) => set(e.target.value)} style={{ width: "100%", background: "#2a2a3e", border: "1px solid #444", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14 }}>
              <option value="">׳‘׳—׳¨ ׳˜׳™׳§׳¨...</option>
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
                <th style={{ padding: "8px 12px", color: "#888", textAlign: "left", borderBottom: "1px solid #333" }}>׳׳“׳“</th>
                <th style={{ padding: "8px 12px", color: "#60a5fa", textAlign: "center", borderBottom: "1px solid #333" }}>{selectedA || "׳׳³"}</th>
                <th style={{ padding: "8px 12px", color: "#f97316", textAlign: "center", borderBottom: "1px solid #333" }}>{selectedB || "׳‘׳³"}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m} style={{ borderBottom: "1px solid #2a2a3e" }}>
                  <td style={{ padding: "8px 12px", color: "#aaa" }}>{labels[m]}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: ["pnl", "pnlPercent"].includes(m) ? colorPnl(stockA?.[m]) : "#fff" }}>{stockA?.[m] ?? "ג€”"}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: ["pnl", "pnlPercent"].includes(m) ? colorPnl(stockB?.[m]) : "#fff" }}>{stockB?.[m] ?? "ג€”"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ג”€ג”€ג”€ TAB 8: ׳¢׳“׳›׳•׳ ׳™׳•׳׳™ ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

function DailyUpdateTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks({ tab: "trades", status: "Open" }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) return <Loader />;
  if (error) return <ErrorMsg msg={error} />;

  const open = data.data.filter((r) => r.status === "Open" || r.status === "׳₪׳×׳•׳—");
  const unrealizedPnl = open.reduce((s, r) => s + (r.pnl ?? 0), 0);

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>׳¢׳“׳›׳•׳ ׳™׳•׳׳™</h2>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>{today}</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatBox label="׳₪׳•׳–׳™׳¦׳™׳•׳× ׳₪׳×׳•׳—׳•׳×" value={open.length} color="#60a5fa" />
        <StatBox label="P&L ׳׳ ׳׳׳•׳׳©" value={fmt(unrealizedPnl)} color={colorPnl(unrealizedPnl)} />
        <StatBox label="׳¨׳©׳•׳׳•׳× ׳”׳™׳•׳" value={data.stats.total} />
      </div>
      <h3 style={{ fontSize: 14, color: "#a78bfa", marginBottom: 12 }}>׳₪׳•׳–׳™׳¦׳™׳•׳× ׳₪׳×׳•׳—׳•׳× ׳׳¡׳§׳™׳¨׳”</h3>
      <Card>
        <Table
          rows={open}
          columns={[
            { key: "ticker", label: "׳˜׳™׳§׳¨" },
            { key: "name", label: "׳©׳" },
            { key: "entryPrice", label: "׳›׳ ׳™׳¡׳”", align: "right", render: (r) => fmt(r.entryPrice) },
            { key: "stopLoss", label: "׳¡׳˜׳•׳₪", align: "right", render: (r) => fmt(r.stopLoss) },
            { key: "target", label: "׳™׳¢׳“", align: "right", render: (r) => fmt(r.target) },
            { key: "riskReward", label: "R:R", align: "right", render: (r) => fmt(r.riskReward, 1) },
            { key: "pnl", label: "P&L", align: "right", render: (r) => <span style={{ color: colorPnl(r.pnl) }}>{fmt(r.pnl)}</span> },
            { key: "notes", label: "׳”׳¢׳¨׳•׳×" },
          ]}
        />
      </Card>
    </div>
  );
}

// ג”€ג”€ג”€ App Shell ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€

const TABS = [
  { id: "bank", label: "נ¦ ׳‘׳ ׳§", component: BankTab },
  { id: "portfolios", label: "נ“ ׳×׳™׳§׳™׳", component: PortfoliosTab },
  { id: "trades", label: "נ“ˆ ׳˜׳¨׳™׳™׳“׳™׳", component: TradesTab },
  { id: "heatmap", label: "נ”¥ ׳”׳™׳˜-׳׳׳₪", component: HeatmapTab },
  { id: "rr", label: "ג–ן¸ R:R", component: RRCalculatorTab },
  { id: "earnings", label: "נ“… ׳™׳•׳׳ ׳“׳•׳—׳•׳×", component: EarningsTab },
  { id: "compare", label: "נ” ׳”׳©׳•׳•׳׳”", component: CompareTab },
  { id: "daily", label: "נ“‹ ׳¢׳“׳›׳•׳ ׳™׳•׳׳™", component: DailyUpdateTab },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("bank");
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component ?? BankTab;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#13131f", color: "#fff", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <AlertsBanner />
      <div style={{ background: "#1e1e2e", borderBottom: "1px solid #2a2a3e", padding: "0 24px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ padding: "16px 0", fontWeight: 800, fontSize: 18, color: "#a78bfa", whiteSpace: "nowrap" }}>
            Stocks Bank
          </div>
          <nav style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "16px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeTab === tab.id ? "#a78bfa" : "#888",
                  borderBottom: activeTab === tab.id ? "2px solid #a78bfa" : "2px solid transparent",
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px" }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
