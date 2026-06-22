'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  highlightLine?: number;
}

export function CodeEditor({ code, language, onChange, highlightLine }: CodeEditorProps) {
  return (
    <div className="w-full h-[400px] rounded-md overflow-hidden border border-[var(--color-border)]">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark" // We'll stick to vs-dark for simplicity, ideally custom theme
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 24,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          padding: { top: 16 },
        }}
        // In a real app we'd use editor.deltaDecorations to highlight the execution line
      />
    </div>
  );
}
