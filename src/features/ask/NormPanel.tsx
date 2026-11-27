import { ClipboardIcon, ScaleIcon } from "../../components/icons";
import type { AskResponse, GraphView } from "../../types";

interface NormPanelProps {
  data: AskResponse;
}

const WIDTH = 400;
const HEIGHT = 96;
const PAD_X = 36;

function MiniGraph({ graph }: { graph: GraphView }) {
  const maxLevel = Math.max(...graph.nodes.map((node) => node.level), 1);
  const byLevel = new Map<number, string[]>();
  for (const node of graph.nodes) {
    byLevel.set(node.level, [...(byLevel.get(node.level) ?? []), node.id]);
  }

  const positions = new Map<string, { x: number; y: number }>();
  for (const [level, ids] of byLevel) {
    const x = PAD_X + (level / maxLevel) * (WIDTH - PAD_X * 2);
    ids.forEach((id, index) => {
      const y = ((index + 1) / (ids.length + 1)) * HEIGHT;
      positions.set(id, { x, y });
    });
  }

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mini-graph" role="img" aria-label="Peta keterhubungan pasal">
      {graph.edges.map((edge) => {
        const from = positions.get(edge.source);
        const to = positions.get(edge.target);
        if (from === undefined || to === undefined) {
          return null;
        }
        return (
          <line
            key={`${edge.source}-${edge.target}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="mini-edge"
          />
        );
      })}
      {graph.nodes.map((node) => {
        const point = positions.get(node.id);
        if (point === undefined) {
          return null;
        }
        const isLast = node.level === maxLevel;
        return (
          <g key={node.id}>
            <circle cx={point.x} cy={point.y} r={9} className={isLast ? "mini-node mini-node-end" : "mini-node"} />
            {node.label !== "" && (
              <text x={point.x} y={point.y - 14} textAnchor="middle" className="mini-label">
                {node.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function NormPanel({ data }: NormPanelProps) {
  const { norm_summary: rows, graph, adjustment_note: note, quick_action: action } = data;

  return (
    <aside className="side-column">
      <section className="side-card">
        <header className="side-card-head">
          <h2>Intisari Norma</h2>
          <ScaleIcon />
        </header>

        <ul className="norm-rows">
          {rows.map((row) => (
            <li key={row.label} className="norm-row">
              <span>{row.label}</span>
              <strong className={row.tone === "accent" ? "tone-accent" : undefined}>{row.value}</strong>
            </li>
          ))}
        </ul>

        {graph !== null && (
          <>
            <p className="side-label">Peta Keterhubungan Pasal:</p>
            <div className="mini-graph-box">
              <MiniGraph graph={graph} />
            </div>
          </>
        )}

        {note !== null && <p className="side-note">{note}</p>}
      </section>

      {action !== null && (
        <section className="quick-action">
          <header>
            <ClipboardIcon />
            <h3>{action.title}</h3>
          </header>
          <p>{action.text}</p>
        </section>
      )}
    </aside>
  );
}
