"use client";

import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const MonacoEditor = ({
  value,
  onChange,
  language = "css",
  theme = "vs-light",
  height = "300px",
  options = {},
  readOnly = false,
  className,
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Optional: Add custom language configuration
    if (language === "css") {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
    }
  };

  // Handle value changes
  const handleChange = (value) => {
    if (onChange) {
      onChange(value || "");
    }
  };

  // Update editor value if prop changes externally
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value || "");
    }
  }, [value]);

  const defaultOptions = {
    selectOnLineNumbers: true,
    roundedSelection: true,
    readOnly,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: "on",
    lineNumbers: "on",
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderWhitespace: "selection",
    cursorBlinking: "smooth",
    smoothScrolling: true,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    fontSize: 14,
    tabSize: 2,
    ...options,
  };

  return (
    <div className={className}>
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        }
      />
    </div>
  );
};

export default MonacoEditor;
