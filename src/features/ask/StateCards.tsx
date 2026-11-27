import { useState } from "react";

import { AskError } from "../../api/ask";
import { WarningIcon } from "../../components/icons";

interface RefusalCardProps {
  message: string;
  onEdit: () => void;
  onSearch: () => void;
}

export function RefusalCard({ message, onEdit, onSearch }: RefusalCardProps) {
  return (
    <section className="state-card" aria-live="polite">
      <span className="state-icon state-icon-warm">§</span>
      <h2>Dasar hukum tidak ditemukan</h2>
      <p>{message}</p>
      <div className="state-actions">
        <button type="button" className="btn-primary" onClick={onEdit}>
          Ubah pertanyaan
        </button>
        <button type="button" className="btn-secondary" onClick={onSearch}>
          Cari pasal di Search
        </button>
      </div>
    </section>
  );
}

export function LoadingCard() {
  return (
    <section className="loading-card" aria-busy="true" aria-live="polite">
      <p className="loading-label">Menelusuri subgraf dan menyusun jawaban...</p>
      <div className="skeleton-group">
        <span className="skeleton skeleton-tag" />
        <span className="skeleton skeleton-line" style={{ width: "61%" }} />
        <span className="skeleton skeleton-line" style={{ width: "36%" }} />
      </div>
      <div className="skeleton-group">
        <span className="skeleton skeleton-tag" />
        <span className="skeleton skeleton-line" style={{ width: "53%" }} />
        <span className="skeleton skeleton-line" style={{ width: "31%" }} />
      </div>
      <div className="skeleton-group">
        <span className="skeleton skeleton-tag" />
        <span className="skeleton skeleton-line" style={{ width: "49%" }} />
      </div>
    </section>
  );
}

interface ErrorCardProps {
  error: AskError;
  onRetry: () => void;
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section className="state-card" role="alert">
      <span className="state-icon state-icon-danger">
        <WarningIcon />
      </span>
      <h2>Gagal menyusun jawaban</h2>
      <p>{error.message}</p>
      <div className="state-actions">
        <button type="button" className="btn-primary" onClick={onRetry}>
          Kirim ulang
        </button>
        <button type="button" className="btn-secondary" onClick={() => setShowDetail((open) => !open)}>
          {showDetail ? "Sembunyikan detail" : "Lihat detail error"}
        </button>
      </div>
      {showDetail && <pre className="error-detail">{error.detail}</pre>}
    </section>
  );
}
