import { VisualizationStep } from '../types/visualization';

export function validateSteps(steps: any[]): { isValid: boolean; sanitizedSteps: VisualizationStep[]; error?: string } {
  if (!Array.isArray(steps)) {
    return { isValid: false, sanitizedSteps: [], error: 'AI did not return a JSON array' };
  }

  const sanitized: VisualizationStep[] = [];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    
    // Basic validation
    if (typeof s.step !== 'number') s.step = i;
    if (!s.description) s.description = 'Executing...';
    if (!s.code_line) s.code_line = '';
    
    // Ensure nodes/edges are arrays
    const nodes = Array.isArray(s.nodes) ? s.nodes : [];
    const edges = Array.isArray(s.edges) ? s.edges : [];
    const reversed_edges = Array.isArray(s.reversed_edges) ? s.reversed_edges : [];
    const highlighted_nodes = Array.isArray(s.highlighted_nodes) ? s.highlighted_nodes : [];
    
    // Sanitize pointers
    const pointers = s.pointers || {};
    
    // Sanitize variables
    const variables = s.variables || {};

    sanitized.push({
      step: s.step,
      description: s.description,
      code_line: s.code_line,
      data_structure_type: s.data_structure_type || undefined,
      variables,
      nodes,
      edges,
      pointers,
      highlighted_nodes,
      reversed_edges
    });
  }

  return { isValid: true, sanitizedSteps: sanitized };
}
