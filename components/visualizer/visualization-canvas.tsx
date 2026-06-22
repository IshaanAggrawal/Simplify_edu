'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { VisualizationStep, PointerType } from '../../lib/types/visualization';

interface VisualizationCanvasProps {
  stepData?: VisualizationStep;
  layoutType?: 'list' | 'array' | 'tree' | 'graph';
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

export function VisualizationCanvas({ stepData, layoutType = 'list' }: VisualizationCanvasProps) {
  if (!stepData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-md">
        <p className="text-[var(--color-text-muted)] font-mono text-sm">Waiting for visualization data...</p>
      </div>
    );
  }

  // Very simple layout engine for MVP
  const nodePositions = useMemo(() => {
    const pos = new Map<number | string, { x: number; y: number }>();
    const nodeCount = stepData.nodes.length;
    
    // Default linear layout for arrays and lists
    const containerWidth = 850; // Approximated container width for centering
    const spacingX = 90;
    const totalWidth = (nodeCount - 1) * spacingX;
    const startX = Math.max(80, (containerWidth - totalWidth) / 2);
    const y = 200;

    if (layoutType === 'graph') {
      // MVP hardcoded diamond layout for 4-5 node graphs
      stepData.nodes.forEach((nodeVal, idx) => {
        if (idx === 0) pos.set(nodeVal, { x: containerWidth / 2 - 200, y: 200 }); // Left
        else if (idx === 1) pos.set(nodeVal, { x: containerWidth / 2, y: 80 }); // Top
        else if (idx === 2) pos.set(nodeVal, { x: containerWidth / 2, y: 320 }); // Bottom
        else if (idx === 3) pos.set(nodeVal, { x: containerWidth / 2 + 200, y: 200 }); // Right
        else pos.set(nodeVal, { x: containerWidth / 2 + 100, y: 200 }); // fallback
      });
    } else if (layoutType === 'tree' && stepData.nodes.length > 0) {
       // Root
       if (stepData.nodes.includes(3)) pos.set(3, { x: containerWidth / 2, y: 100 });
       // L1
       if (stepData.nodes.includes(9)) pos.set(9, { x: containerWidth / 2 - 100, y: 180 });
       if (stepData.nodes.includes(20)) pos.set(20, { x: containerWidth / 2 + 100, y: 180 });
       // L2
       if (stepData.nodes.includes(15)) pos.set(15, { x: containerWidth / 2 + 40, y: 260 });
       if (stepData.nodes.includes(7)) pos.set(7, { x: containerWidth / 2 + 160, y: 260 });
    } else {
      // list / array layout
      stepData.nodes.forEach((nodeVal, idx) => {
        pos.set(nodeVal, { x: startX + idx * spacingX, y });
      });
    }

    return pos;
  }, [stepData.nodes, layoutType]);

  const pointerOffsets = [-40, -60, -80, 40, 60, 80];

  return (
    <div className="w-full h-[400px] relative bg-[var(--color-bg-base)] overflow-hidden rounded-t-md border-x border-t border-[var(--color-border)]">
      <svg width="100%" height="100%" className="absolute inset-0">
        
        {/* Render Edges */}
        {stepData.edges.map(([from, to], i) => {
          const start = nodePositions.get(from);
          const end = nodePositions.get(to);
          if (!start || !end) return null;
          
          const isReversed = stepData.reversed_edges?.some(([rFrom, rTo]) => rFrom === from && rTo === to);
          const strokeColor = isReversed ? 'var(--color-edge-reversed)' : 'var(--color-edge-default)';
          
          return (
            <motion.path
              key={`edge-${from}-${to}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d={`M ${start.x + 20} ${start.y} L ${end.x - 20} ${end.y}`}
              stroke={strokeColor}
              strokeWidth={2}
              fill="none"
              markerEnd="url(#arrowhead)"
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          );
        })}

        {/* Define arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-edge-default)" />
          </marker>
        </defs>
      </svg>

      {/* Render Nodes (HTML overlaid on SVG for easier text centering and styling) */}
      {stepData.nodes.map((node) => {
        const pos = nodePositions.get(node);
        if (!pos) return null;
        
        const isActive = stepData.highlighted_nodes?.includes(node);
        
        return (
          <motion.div
            key={`node-${node}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, x: pos.x - 24, y: pos.y - 24 }}
            className={`absolute w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm shadow-md transition-colors duration-300
              ${isActive ? 'node--active bg-[var(--color-bg-surface)]' : 'bg-[var(--color-node-default)] border border-[var(--color-border)]'}`}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          >
            {node}
          </motion.div>
        );
      })}

      {/* Render Pointers */}
      {Object.entries(stepData.pointers || {}).map(([ptrName, targetNode], idx) => {
        if (targetNode === null) return null;
        const pos = nodePositions.get(targetNode);
        if (!pos) return null;
        
        const offsetIndex = Object.keys(stepData.pointers).indexOf(ptrName);
        const yOffset = pointerOffsets[offsetIndex % pointerOffsets.length];
        const color = POINTER_COLORS[ptrName as PointerType] || 'var(--color-text-secondary)';
        
        return (
          <motion.div
            key={`ptr-${ptrName}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, x: pos.x - 30, y: pos.y + yOffset }}
            className="absolute w-[60px] text-center"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          >
            <div 
              className="text-xs font-mono font-bold py-0.5 rounded px-1 inline-block bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm"
              style={{ color }}
            >
              {ptrName}
            </div>
            {yOffset < 0 ? (
               <div className="mx-auto w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] mt-1" style={{ borderTopColor: color }} />
            ) : (
               <div className="mx-auto w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] mb-1" style={{ borderBottomColor: color }} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
