export type PointerType = 'curr' | 'prev' | 'next' | 'slow' | 'fast' | 'left' | 'right' | 'mid';

export interface VisualizationStep {
  step: number;
  description: string;
  code_line: string;
  variables: Record<string, string | number | null>;
  nodes: number[];
  edges: [number, number][]; // [fromNode, toNode]
  pointers: Partial<Record<PointerType, number | null>>; // pointer -> nodeId
  highlighted_nodes: number[];
  reversed_edges: [number, number][];
}

export interface PatternData {
  id: string;
  name: string;
  category: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_problems: number[];
  languages: {
    cpp?: string;
    python?: string;
    java?: string;
    javascript?: string;
  };
  default_input: any;
  steps: VisualizationStep[];
  pattern_explanation: string;
  when_to_use: string;
  time_complexity: string;
  space_complexity: string;
}
