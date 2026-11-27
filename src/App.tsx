import { useState } from "react";

import TopNav from "./components/TopNav";
import AskPage from "./features/ask/AskPage";
import type { TabId } from "./types";

const TAB_TITLES: Record<Exclude<TabId, "ask">, string> = {
  search: "Search",
  explore: "Explore",
  query: "Query",
};

export default function App() {
  const [tab, setTab] = useState<TabId>("ask");

  return (
    <div className="shell">
      <TopNav active={tab} onChange={setTab} />
      {tab === "ask" ? (
        <AskPage onNavigate={setTab} />
      ) : (
        <main className="placeholder-page">
          <h1>{TAB_TITLES[tab]}</h1>
          <p>Halaman ini belum tersedia.</p>
        </main>
      )}
    </div>
  );
}
