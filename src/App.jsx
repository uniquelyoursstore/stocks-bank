import { useState } from "react";
import AlertsBanner from "./components/AlertsBanner";
import BankTab from "./tabs/BankTab";
import PortfoliosTab from "./tabs/PortfoliosTab";
import TradesTab from "./tabs/TradesTab";
import HeatmapTab from "./tabs/HeatmapTab";
import RRCalculatorTab from "./tabs/RRCalculatorTab";
import EarningsTab from "./tabs/EarningsTab";
import CompareTab from "./tabs/CompareTab";
import DailyUpdateTab from "./tabs/DailyUpdateTab";

const TABS = [
  { id: "bank", label: "🏦 בנק", component: BankTab },
  { id: "portfolios", label: "📁 תיקים", component: PortfoliosTab },
  { id: "trades", label: "📈 טריידים", component: TradesTab },
  { id: "heatmap", label: "🔥 היט-מאפ", component: HeatmapTab },
  { id: "rr", label: "⚖️ R:R", component: RRCalculatorTab },
  { id: "earnings", label: "📅 יומן דוחות", component: EarningsTab },
  { id: "compare", label: "🔍 השוואה", component: CompareTab },
  { id: "daily", label: "📋 עדכון יומי", component: DailyUpdateTab },
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
