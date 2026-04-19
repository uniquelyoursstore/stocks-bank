import { useState, useEffect } from "react";

export default function AlertsBanner() {
  const [triggered, setTriggered] = useState([]);

  useEffect(() => {
    let activeAlerts = [];

    const checkAlerts = () => {
      if (!activeAlerts.length) return;
      const tickers = [...new Set(activeAlerts.map((a) => a.ticker))].join(",");
      fetch(`/api/prices?tickers=${tickers}`)
        .then((r) => r.json())
        .then(({ prices }) => {
          const hits = activeAlerts.filter((a) => {
            const livePrice = prices?.[a.ticker]?.price;
            if (livePrice == null) return false;
            return a.direction === "above" ? livePrice >= a.triggerPrice : livePrice <= a.triggerPrice;
          });
          setTriggered(hits);
        })
        .catch(() => {});
    };

    fetch("/alerts.json")
      .then((r) => r.json())
      .then(({ alerts }) => {
        activeAlerts = (alerts || []).filter((a) => a.active && !a.triggered);
        checkAlerts();
      })
      .catch(() => {});

    const interval = setInterval(checkAlerts, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!triggered.length) return null;

  return (
    <div style={{ background: "#7c1d1d", borderBottom: "2px solid #dc2626", padding: "10px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "#fca5a5", fontSize: 14 }}>🔔 התראות מחיר הופעלו:</span>
        {triggered.map((a) => (
          <span key={a.id} style={{ background: "#991b1b", borderRadius: 8, padding: "4px 12px", color: "#fef2f2", fontSize: 13, fontWeight: 600 }}>
            {a.ticker} {a.direction === "above" ? "↑" : "↓"} ${a.triggerPrice}{a.note ? ` — ${a.note}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
