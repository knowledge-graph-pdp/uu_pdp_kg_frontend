import { Fragment } from "react";

import {
  ArrowRightIcon,
  BookIcon,
  ChatIcon,
  DocIcon,
  NetworkIcon,
  VerifiedIcon,
  WarningIcon,
} from "../../components/icons";
import type { AskResponse, LegalBasis } from "../../types";

interface AnswerCardProps {
  data: AskResponse;
  onOpenGraph: () => void;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlighted({ text, highlights }: { text: string; highlights: string[] }) {
  if (highlights.length === 0) {
    return <>{text}</>;
  }
  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="hl">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function BasisChip({ item, index }: { item: LegalBasis; index: number }) {
  if (item.kind === "sanksi") {
    return (
      <span className="chip chip-sanction">
        <WarningIcon />
        {item.label}
      </span>
    );
  }
  return (
    <span className="chip chip-pasal">
      {index % 2 === 0 ? <BookIcon /> : <DocIcon />}
      {item.label}
    </span>
  );
}

export default function AnswerCard({ data, onOpenGraph }: AnswerCardProps) {
  const { answer, legal_basis: basis, graph_link: graphLink } = data;

  if (answer === null) {
    return null;
  }

  return (
    <article className="answer-card">
      <div className="question-pill">
        <ChatIcon />
        <span>
          <strong>Pertanyaan:</strong> {data.question}
        </span>
      </div>

      <p className="verified-tag">
        <VerifiedIcon />
        Rujukan Sahih
      </p>

      <p className="answer-lead">
        <Highlighted text={answer.lead} highlights={answer.highlights} />
      </p>
      <p className="answer-detail">{answer.detail}</p>

      <p className="section-label">Dasar hukum rujukan:</p>
      <div className="answer-footer">
        <div className="chips">
          {basis.map((item, index) => (
            <BasisChip key={item.label} item={item} index={index} />
          ))}
        </div>
        <button type="button" className="link-action" onClick={onOpenGraph}>
          Lihat graf rujukan
          <ArrowRightIcon />
        </button>
      </div>

      {graphLink !== null && (
        <div className="graph-link">
          <span className="graph-link-icon">
            <NetworkIcon />
          </span>
          <div className="graph-link-text">
            <strong>{graphLink.title}</strong>
            <span>{graphLink.detail}</span>
          </div>
          <span className="degree-pill">{graphLink.degrees} Derajat Relasi</span>
        </div>
      )}
    </article>
  );
}
