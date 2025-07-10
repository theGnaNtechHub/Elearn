import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const PseudoCodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("vteach-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "FD7934" },
        { token: "number", foreground: "38BDF8" },
        { token: "string", foreground: "10B981" },
        { token: "identifier", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.background": "#1E293B",
        "editor.foreground": "#FFFFFF",
        "editorLineNumber.foreground": "#64748B",
        "editorCursor.foreground": "#FD7934",
      },
    });
    monaco.editor.setTheme("vteach-dark");
  };

  const handleRun = () => {
    // You’ll later connect to backend here
    setOutput("Output will appear here...");
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          fontFamily: "sans-serif",
          fontSize: "28px",
          fontWeight: "bold",
          // margin: "16px 0",
          color: "#3375D7FF",
        }}
      >
        VteacH – PseudoCodeEditor
      </h1>
      <div style={{ display: "flex", height: "100vh", width: "100%" }}>
        {/* Left - Code Editor Panel */}
        <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px", background: "#1E293B" }}>
            <button
              onClick={handleRun}
              style={{
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ▶ Run
            </button>
          </div>
          <Editor
            height="100%"
            language="plaintext"
            value={code}
            theme="vteach-dark"
            onChange={(value) => setCode(value)}
            onMount={handleEditorDidMount}
          />
        </div>

        {/* Right - Output Panel */}
        <div
          style={{
            width: "40%",
            backgroundColor: "#0f172a",
            color: "#38BDF8",
            padding: "20px",
            fontFamily: "monospace",
            overflowY: "auto",
          }}
        >
          <h3 style={{ color: "#FD7934" }}>Output</h3>
          <pre>{output || "Waiting for output..."}</pre>
        </div>
      </div>
    </>
  );
};

export default PseudoCodeEditor;
