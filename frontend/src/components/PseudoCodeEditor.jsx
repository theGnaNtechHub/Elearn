import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const PseudoCodeEditor = () => {
  const [code, setCode] = useState(`// Welcome to VteacH Pseudo-code Editor!
// Write your pseudo-code here and click Run to execute it.

// Example:
x = 10
y = 20
if x < y then
    print "x is less than y"
else
    print "x is greater than or equal to y"
endif`);
  const [output, setOutput] = useState("");
  const [variables, setVariables] = useState({});
  const [syntaxHints, setSyntaxHints] = useState([]);
  const [learningSuggestions, setLearningSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("vteach-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "FD7934" },
        { token: "number", foreground: "38BDF8" },
        { token: "string", foreground: "10B981" },
        { token: "identifier", foreground: "FFFFFF" },
        { token: "comment", foreground: "64748B" },
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

  // Check syntax hints when code changes
  useEffect(() => {
    const checkSyntax = async () => {
      if (!code.trim()) {
        setSyntaxHints([]);
        setLearningSuggestions([]);
        return;
      }

      try {
        // Get syntax hints
        const hintsResponse = await fetch(
          "http://localhost:5001/syntax-hints",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );
        const hintsData = await hintsResponse.json();
        if (hintsData.status === "success") {
          setSyntaxHints(hintsData.hints);
        }

        // Get learning suggestions
        const suggestionsResponse = await fetch(
          "http://localhost:5001/learning-suggestions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );
        const suggestionsData = await suggestionsResponse.json();
        if (suggestionsData.status === "success") {
          setLearningSuggestions(suggestionsData.suggestions);
        }
      } catch (error) {
        console.error("Error checking syntax:", error);
      }
    };

    const timeoutId = setTimeout(checkSyntax, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleRun = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");
    setVariables({});

    try {
      const response = await fetch("http://localhost:5001/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setOutput(result.output || "No output returned.");
        setVariables(result.variables || {});
      } else {
        setError(result.message || "An error occurred during execution.");
        if (result.errors) {
          setOutput(
            `❌ Errors found:\n${result.errors
              .map((e) => `Line ${e.line}: ${e.message}`)
              .join("\n")}`
          );
        }
      }
    } catch (error) {
      console.error("Error while fetching output:", error);
      setError(
        "❌ Error connecting to server. Please make sure the backend is running on port 5001."
      );
      setOutput(
        "❌ Connection Error: Unable to reach the pseudo-code parser server."
      );
    } finally {
      setIsLoading(false);
    }
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
          color: "#3375D7FF",
          margin: "0",
          padding: "16px 0",
        }}
      >
        VteacH – PseudoCodeEditor
      </h1>

      <div
        style={{ display: "flex", height: "calc(100vh - 80px)", width: "100%" }}
      >
        {/* Left - Code Editor Panel */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "10px",
              background: "#1E293B",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleRun}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? "#64748B" : "#10B981",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {isLoading ? "⏳ Running..." : "▶ Run"}
            </button>
          </div>

          <Editor
            height="100%"
            language="plaintext"
            value={code}
            theme="vteach-dark"
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Right - Output and Info Panel */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
          {/* Output Section */}
          <div
            style={{
              flex: "1",
              backgroundColor: "#0f172a",
              color: "#38BDF8",
              padding: "20px",
              fontFamily: "monospace",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#FD7934", marginTop: 0 }}>Output</h3>
            {error && (
              <div
                style={{
                  color: "#EF4444",
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#1F2937",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {output || "Waiting for output..."}
            </pre>
          </div>



          {/* Variables Section */}
          {Object.keys(variables).length > 0 && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #374151",
              }}
            >
              <h4 style={{ color: "#FD7934", margin: "0 0 10px 0" }}>
                Variables
              </h4>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "string" ? `"${value}"` : String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Hints */}
          {syntaxHints.length > 0 && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #374151",
              }}
            >
              <h4 style={{ color: "#F59E0B", margin: "0 0 10px 0" }}>
                Syntax Hints
              </h4>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                {syntaxHints.map((hint, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    <strong>Line {hint.line}:</strong> {hint.message}
                    {hint.suggestion && (
                      <div style={{ color: "#10B981", marginLeft: "10px" }}>
                        💡 {hint.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Suggestions */}
          {learningSuggestions.length > 0 && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #374151",
              }}
            >
              <h4 style={{ color: "#10B981", margin: "0 0 10px 0" }}>
                Learning Suggestions
              </h4>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                {learningSuggestions.map((suggestion, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PseudoCodeEditor;
