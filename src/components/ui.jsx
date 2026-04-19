export function Card({ children, style }) {
  return <div style={{ background: "#1e1e2e", borderRadius: 12, padding: "16px 20px", ...style }}>{children}</div>;
}
export function StatBox({ label, value, color }) {
  return (
    <Card style={{ textAlign: "center", minWidth: 140 }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || "#fff" }}>{value}</div>
    </Card>
  );
}
export function Badge({ text, color }) {
  return (
    <span style={{ background: color || "#333", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {text}
    </span>
  );
}
export function Loader() {
  return <div style={{ color: "#888", padding: 40, textAlign: "center" }}>טוען נתונים...</div>;
}
export function ErrorMsg({ msg }) {
  return <div style={{ color: "#ef4444", padding: 20 }}>שגיאה: {msg}</div>;
}
export function Table({ rows, columns }) {
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
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
