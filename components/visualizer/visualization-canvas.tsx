'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { VisualizationStep, PointerType } from '../../lib/types/visualization';

interface VisualizationCanvasProps {
  stepData?: VisualizationStep;
  layoutType?: 'list' | 'array' | 'tree' | 'graph' | 'matrix' | 'call_stack';
}

const POINTER_COLORS: Record<string, string> = {
  curr: 'var(--color-pointer-curr)',
  prev: 'var(--color-pointer-prev)',
  next: 'var(--color-pointer-next)',
  slow: 'var(--color-pointer-slow)',
  fast: 'var(--color-pointer-fast)',
  left: 'var(--color-pointer-slow)',
  right: 'var(--color-pointer-fast)',
  mid: 'var(--color-pointer-curr)',
};

const W = 850;
const H = 400;
const NODE_R = 24; // half of node width

export function VisualizationCanvas({ stepData, layoutType }: VisualizationCanvasProps) {
  if (!stepData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-md">
        <p className="text-[var(--color-text-muted)] font-mono text-sm">Waiting for visualization data...</p>
      </div>
    );
  }

  const type = stepData.data_structure_type || layoutType || 'list';
  const isMatrix = type === 'matrix';

  // ── Matrix rendering — completely different DOM structure ──────────────────
  if (isMatrix) {
    return <MatrixCanvas stepData={stepData} />;
  }

  return <NodeCanvas stepData={stepData} type={type} />;
}

// ── Matrix Canvas ──────────────────────────────────────────────────────────────
function MatrixCanvas({ stepData }: { stepData: VisualizationStep }) {
  const cols = stepData.matrix_rows || Math.ceil(Math.sqrt(stepData.nodes.length)) || 4;
  const rows = Math.ceil(stepData.nodes.length / cols);
  const cellSize = Math.min(64, Math.floor((W - 80) / cols));

  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-[var(--color-bg-base)] border-x border-t border-[var(--color-border)] rounded-t-md overflow-auto p-4">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}>
        {stepData.nodes.map((val, idx) => {
          const isHighlighted = stepData.highlighted_nodes?.includes(val);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center justify-center rounded font-mono text-xs font-bold border transition-colors duration-300 ${
                isHighlighted
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                  : 'bg-[var(--color-node-default)] border-[var(--color-border)] text-[var(--color-text-primary)]'
              }`}
              style={{ width: cellSize, height: cellSize }}
              transition={{ delay: idx * 0.01 }}
            >
              {val}
            </motion.div>
          );
        })}
      </div>
      {rows > 0 && (
        <div className="mt-3 text-xs text-[var(--color-text-muted)] font-mono">
          {rows} × {cols} matrix
        </div>
      )}
    </div>
  );
}

// ── Node Canvas (list / array / tree / graph / call_stack) ─────────────────────
function NodeCanvas({ stepData, type }: { stepData: VisualizationStep; type: string }) {
  const nodePositions = useMemo(() => {
    const pos = new Map<number, { x: number; y: number }>();
    if (!stepData || stepData.nodes.length === 0) return pos;
    const nodeCount = stepData.nodes.length;

    if (type === 'graph') {
      // Circular layout
      const radius = Math.min(W, H) / 2.6;
      const cx = W / 2, cy = H / 2;
      stepData.nodes.forEach((val, idx) => {
        const angle = (idx / nodeCount) * 2 * Math.PI - Math.PI / 2;
        pos.set(val, { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
      });

    } else if (type === 'tree') {
      // BFS hierarchical layout — works for any node values
      const inDeg = new Map<number, number>();
      stepData.nodes.forEach(n => inDeg.set(n, 0));
      stepData.edges.forEach(([, v]) => inDeg.set(v, (inDeg.get(v) || 0) + 1));

      let root = stepData.nodes.find(n => inDeg.get(n) === 0) ?? stepData.nodes[0];

      const levelNodes = new Map<number, number[]>();
      const queue = [{ node: root, depth: 0 }];
      const visited = new Set([root]);

      while (queue.length > 0) {
        const { node, depth } = queue.shift()!;
        if (!levelNodes.has(depth)) levelNodes.set(depth, []);
        levelNodes.get(depth)!.push(node);

        stepData.edges
          .filter(([u]) => u === node)
          .map(([, v]) => v)
          .filter(v => !visited.has(v))
          .forEach(v => { visited.add(v); queue.push({ node: v, depth: depth + 1 }); });
      }

      // Place any disconnected nodes
      let overflow = 0;
      const maxDepth = Math.max(...Array.from(levelNodes.keys()), 0);
      stepData.nodes.filter(n => !visited.has(n)).forEach(n => {
        overflow++;
        if (!levelNodes.has(maxDepth + 1)) levelNodes.set(maxDepth + 1, []);
        levelNodes.get(maxDepth + 1)!.push(n);
      });

      const layerH = Math.min(80, (H - 80) / (levelNodes.size + 1));
      levelNodes.forEach((nodesInLevel, depth) => {
        const spacingX = W / (nodesInLevel.length + 1);
        nodesInLevel.forEach((node, idx) => {
          pos.set(node, { x: spacingX * (idx + 1), y: 60 + depth * layerH });
        });
      });

    } else if (type === 'call_stack') {
      // Vertical stack layout — newest frame at top
      const frameH = Math.min(60, (H - 40) / nodeCount);
      stepData.nodes.forEach((val, idx) => {
        pos.set(val, { x: W / 2, y: H - 30 - idx * frameH });
      });

    } else {
      // Linear — array / list
      const spacingX = Math.min(90, (W - 80) / Math.max(nodeCount, 1));
      const totalWidth = (nodeCount - 1) * spacingX;
      const startX = Math.max(40 + NODE_R, (W - totalWidth) / 2);
      stepData.nodes.forEach((val, idx) => {
        pos.set(val, { x: startX + idx * spacingX, y: H / 2 });
      });
    }

    return pos;
  }, [stepData, type]);

  const pointerOffsets = [-50, -70, -90, 50, 70, 90];
  const isCallStack = type === 'call_stack';

  return (
    <div className="w-full h-[400px] relative bg-[var(--color-bg-base)] overflow-hidden rounded-t-md border-x border-t border-[var(--color-border)]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-edge-default)" />
          </marker>
          <marker id="arrowhead-rev" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-edge-reversed)" />
          </marker>
        </defs>

        {stepData.edges.map(([from, to], i) => {
          const start = nodePositions.get(from);
          const end = nodePositions.get(to);
          if (!start || !end) return null;

          const isReversed = stepData.reversed_edges?.some(([rf, rt]) => rf === from && rt === to);
          const color = isReversed ? 'var(--color-edge-reversed)' : 'var(--color-edge-default)';
          const markerId = isReversed ? 'arrowhead-rev' : 'arrowhead';

          // Offset line ends by node radius so arrows don't overlap the circle
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const x1 = start.x + (dx / dist) * NODE_R;
          const y1 = start.y + (dy / dist) * NODE_R;
          const x2 = end.x - (dx / dist) * (NODE_R + 2);
          const y2 = end.y - (dy / dist) * (NODE_R + 2);

          return (
            <motion.path
              key={`edge-${from}-${to}-${i}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              stroke={color}
              strokeWidth={isCallStack ? 1.5 : 2}
              fill="none"
              markerEnd={`url(#${markerId})`}
              transition={{ duration: 0.4 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {stepData.nodes.map((node) => {
        const pos = nodePositions.get(node);
        if (!pos) return null;
        const isActive = stepData.highlighted_nodes?.includes(node);

        return (
          <motion.div
            key={`node-${node}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1, x: pos.x - NODE_R, y: pos.y - NODE_R }}
            className={`absolute w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold shadow-md transition-colors duration-200 ${
              isActive
                ? 'bg-[var(--color-accent)] text-white shadow-[0_0_16px_var(--color-accent-glow)]'
                : 'bg-[var(--color-node-default)] border border-[var(--color-border)] text-[var(--color-text-primary)]'
            }`}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
          >
            {node}
          </motion.div>
        );
      })}

      {/* Pointers */}
      {Object.entries(stepData.pointers || {}).map(([ptrName, targetNode]) => {
        if (targetNode === null || targetNode === undefined) return null;
        const pos = nodePositions.get(targetNode as number);
        if (!pos) return null;

        const idx = Object.keys(stepData.pointers).indexOf(ptrName);
        const yOffset = pointerOffsets[idx % pointerOffsets.length];
        const color = POINTER_COLORS[ptrName as PointerType] || 'var(--color-text-secondary)';
        const above = yOffset < 0;

        return (
          <motion.div
            key={`ptr-${ptrName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: pos.x - 28, y: pos.y + yOffset }}
            className="absolute w-[56px] text-center pointer-events-none"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          >
            {!above && (
              <div className="mx-auto w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] mb-0.5" style={{ borderBottomColor: color }} />
            )}
            <div className="text-[11px] font-mono font-bold py-0.5 rounded px-1.5 inline-block bg-[var(--color-bg-surface)] border border-[var(--color-border)]" style={{ color }}>
              {ptrName}
            </div>
            {above && (
              <div className="mx-auto w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] mt-0.5" style={{ borderTopColor: color }} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
