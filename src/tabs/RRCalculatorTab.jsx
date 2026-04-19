import { useState } from "react";
import { Card, StatBox } from "../components/ui";
import { fmt } from "../utils/helpers";

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</label>
      <input type="number" value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={placeholder} style={{ width: "100%", background: "#2a2a3e", border: "1px solid #444", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
    </div>
  );
}

export default function RRCalculatorTab() {
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

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>מחשבון R:R</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <Field label="מחיר כניסה" value={entry} onChange={setEntry} placeholder="0.00" />
          <Field label="סטופ לוס" value={stop} onChange={setStop} placeholder="0.00" />
          <Field label="יעד" value={target} onChange={setTarget} placeholder="0.00" />
          <Field label="הון לסיכון ($)" value={capital} onChange={setCapital} placeholder="10000" />
          <Field label="% סיכון מהון" value={riskPct} onChange={setRiskPct} placeholder="1" />
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <StatBox label="יחס R:R" value={rr ? `1 : ${rr}` : "—"} color={rr >= 2 ? "#22c55e" : rr >= 1 ? "#facc15" : "#ef4444"} />
          <StatBox label="סיכון פר מניה" value={riskPerShare ? `$${fmt(riskPerShare)}` : "—"} color="#f97316" />
          <StatBox label="פוטנציאל פר מניה" value={rewardPerShare ? `$${fmt(rewardPerShare)}` : "—"} color="#22c55e" />
          <StatBox label="כמות מניות" value={shares ?? "—"} color="#60a5fa" />
          <StatBox label="גודל פוזיציה" value={positionSize ? `$${fmt(positionSize)}` : "—"} color="#a78bfa" />
          <StatBox label="סכום סיכון" value={riskAmount ? `$${fmt(riskAmount)}` : "—"} color="#ef4444" />
        </div>
      </div>
    </div>
  );
}
