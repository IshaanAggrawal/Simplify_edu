import { VisualizationStep } from '../../lib/types/visualization';

interface StepDescriptionProps {
  stepData?: VisualizationStep;
}

export function StepDescription({ stepData }: StepDescriptionProps) {
  if (!stepData) return null;

  return (
    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-base)]">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Description</h4>
        <p className="text-[var(--color-text-primary)] leading-relaxed">
          {stepData.description}
        </p>
      </div>
      
      {stepData.code_line && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Executing Line</h4>
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md p-2 font-mono text-sm text-[var(--color-accent)]">
            {stepData.code_line}
          </div>
        </div>
      )}

      {stepData.variables && Object.keys(stepData.variables).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Variables</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(stepData.variables).map(([key, value]) => (
              <div key={key} className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded p-2 flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-text-muted)]">{key}</span>
                <span className="font-mono text-sm font-medium">
                  {value === null ? 'null' : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
