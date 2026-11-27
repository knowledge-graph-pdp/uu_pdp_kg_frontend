export type TabId = "ask" | "search" | "explore" | "query";

export type LegalBasisKind = "pasal" | "sanksi";

export interface AnswerText {
  lead: string;
  highlights: string[];
  detail: string;
}

export interface LegalBasis {
  label: string;
  kind: LegalBasisKind;
}

export interface NormRow {
  label: string;
  value: string;
  tone: "accent" | "neutral";
}

export interface GraphNode {
  id: string;
  label: string;
  level: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphView {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphLink {
  title: string;
  detail: string;
  degrees: number;
}

export interface QuickAction {
  title: string;
  text: string;
}

export interface AskResponse {
  status: "answered" | "refused";
  question: string;
  message: string | null;
  answer: AnswerText | null;
  legal_basis: LegalBasis[];
  norm_summary: NormRow[];
  graph: GraphView | null;
  graph_link: GraphLink | null;
  adjustment_note: string | null;
  quick_action: QuickAction | null;
}
