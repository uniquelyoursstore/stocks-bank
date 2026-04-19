const API = "/api/stocks";

export function fmt(n, digits = 2) {
  if (n == null) return "—";
  return Number(n).toLocaleString("he-IL", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function pct(n) {
  if (n == null) return "—";
  return `${Number(n).toFixed(1)}%`;
}
export function colorPnl(val) {
  if (val == null) return "#aaa";
  return val > 0 ? "#22c55e" : val < 0 ? "#ef4444" : "#aaa";
}
export function fmtDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}
export async function fetchStocks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
