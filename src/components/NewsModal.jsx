import { useState, useEffect } from "react";
import { Loader, ErrorMsg } from "./ui";

export default function NewsModal({ ticker, onClose }) {
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
          <h3 style={{ margin: 0, color: "#a78bfa" }}>📰 חדשות: {ticker}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {!loading && !error && news.length === 0 && (
          <div style={{ color: "#888", textAlign: "center", padding: 20 }}>אין חדשות זמינות</div>
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
              {n.publisher}{n.time ? ` · ${new Date(n.time).toLocaleDateString("he-IL")}` : ""}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
