import type { TabId } from "../types";

interface TopNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "ask", label: "Ask" },
  { id: "search", label: "Search" },
  { id: "explore", label: "Explore" },
  { id: "query", label: "Query" },
];

export default function TopNav({ active, onChange }: TopNavProps) {
  return (
    <header className="topnav">
      <div className="brand">
        <span className="brand-mark" />
        <div className="brand-text">
          <strong>PDP-Graph</strong>
          <span>UU NO. 27/2022</span>
        </div>
      </div>

      <nav className="tabs" aria-label="Navigasi utama">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === active ? "tab tab-active" : "tab"}
            aria-current={tab.id === active ? "page" : undefined}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="nav-right">
        <button type="button" className="sync-pill">
          Sync
        </button>
        <span className="avatar" />
      </div>
    </header>
  );
}
