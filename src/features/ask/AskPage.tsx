import { useEffect, useRef, useState } from "react";

import { AskError, askQuestion, isAbort } from "../../api/ask";
import { BulbIcon, ShieldIcon } from "../../components/icons";
import type { AskResponse, TabId } from "../../types";
import AnswerCard from "./AnswerCard";
import AskBar from "./AskBar";
import NormPanel from "./NormPanel";
import { ErrorCard, LoadingCard, RefusalCard } from "./StateCards";

interface AskPageProps {
  onNavigate: (tab: TabId) => void;
}

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "answered"; data: AskResponse }
  | { kind: "refused"; message: string }
  | { kind: "error"; error: AskError };

const POPULAR_TOPICS = [
  "Notifikasi kebocoran data 3×24 jam",
  "Persetujuan pemrosesan anak",
  "Hak menghapus data pribadi",
  "Penunjukan DPO",
];

const TOPIC_QUESTIONS: Record<string, string> = {
  "Notifikasi kebocoran data 3×24 jam": "Berapa lama batas waktu pemberitahuan kebocoran data pribadi?",
  "Persetujuan pemrosesan anak": "Bagaimana persetujuan pemrosesan data pribadi anak?",
  "Hak menghapus data pribadi": "Bagaimana hak subjek untuk menghapus data pribadi?",
  "Penunjukan DPO": "Kapan pengendali data wajib menunjuk pejabat pelindungan data pribadi?",
};

export default function AskPage({ onNavigate }: AskPageProps) {
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [view, setView] = useState<View>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  async function submit(raw: string) {
    const trimmed = raw.trim();
    if (trimmed.length < 3) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLastQuestion(trimmed);
    setView({ kind: "loading" });

    try {
      const data = await askQuestion(trimmed, controller.signal);
      if (data.status === "refused") {
        setView({ kind: "refused", message: data.message ?? "" });
      } else {
        setView({ kind: "answered", data });
      }
    } catch (error) {
      if (isAbort(error)) {
        return;
      }
      if (error instanceof AskError) {
        setView({ kind: "error", error });
        return;
      }
      setView({
        kind: "error",
        error: new AskError(
          "server",
          "Terjadi kesalahan tak terduga. Kirim ulang pertanyaan.",
          error instanceof Error ? error.message : String(error),
        ),
      });
    }
  }

  function clear() {
    controllerRef.current?.abort();
    setQuestion("");
    setView({ kind: "idle" });
    inputRef.current?.focus();
  }

  function pickTopic(topic: string) {
    const text = TOPIC_QUESTIONS[topic] ?? topic;
    setQuestion(text);
    void submit(text);
  }

  function editQuestion() {
    inputRef.current?.focus();
    inputRef.current?.select();
  }

  return (
    <main className="ask-page">
      <section className="hero">
        <span className="hero-badge">
          <i className="hero-dot" />
          <ShieldIcon />
          Asisten Hukum UU PDP No. 27/2022
        </span>
        <h1>Tanya jawab kepatuhan data pribadi dengan rujukan pasal presisi.</h1>
        <p>
          Akses cepat penafsiran pasal, verifikasi ambang batas kewajiban hukum, dan analisis keterhubungan regulasi
          berbasis graf.
        </p>
      </section>

      <AskBar
        value={question}
        disabled={view.kind === "loading"}
        inputRef={inputRef}
        onChange={setQuestion}
        onSubmit={() => void submit(question)}
        onClear={clear}
      />

      <div className="topics">
        <span className="topics-label">
          <BulbIcon />
          Topik populer:
        </span>
        {POPULAR_TOPICS.map((topic) => (
          <button key={topic} type="button" className="topic-chip" onClick={() => pickTopic(topic)}>
            {topic}
          </button>
        ))}
      </div>

      <div className="results">
        {view.kind === "loading" && <LoadingCard />}

        {view.kind === "refused" && (
          <RefusalCard message={view.message} onEdit={editQuestion} onSearch={() => onNavigate("search")} />
        )}

        {view.kind === "error" && <ErrorCard error={view.error} onRetry={() => void submit(lastQuestion)} />}

        {view.kind === "answered" && (
          <div className="answer-grid">
            <AnswerCard data={view.data} onOpenGraph={() => onNavigate("explore")} />
            <NormPanel data={view.data} />
          </div>
        )}
      </div>
    </main>
  );
}
