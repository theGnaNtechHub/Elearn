import React, { useState, useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

type SyntaxHint = {
  line: number;
  message: string;
  suggestion?: string;
};

type LearningSuggestion = string;

type EvaluationResult = {
  status: "success" | "error";
  output?: string;
  variables?: Record<string, string | number | boolean>;
  message?: string;
  errors?: { line: number; message: string }[];
};

const PseudoCodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>(`// Welcome to VteacH Pseudo-code Editor!
// Write your pseudo-code here and click Run to execute it.

// Example:
x = 10
y = 20
if x < y then
    print "x is less than y"
else
    print "x is greater than or equal to y"
endif
`);

  const [output, setOutput] = useState<string>("");
  const [variables, setVariables] = useState<
    Record<string, string | number | boolean>
  >({});
  const [syntaxHints, setSyntaxHints] = useState<SyntaxHint[]>([]);
  const [learningSuggestions, setLearningSuggestions] = useState<
    LearningSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleEditorDidMount: OnMount = (editor, monaco) => {
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

  useEffect(() => {
    const checkSyntax = async () => {
      if (!code.trim()) {
        setSyntaxHints([]);
        setLearningSuggestions([]);
        return;
      }

      // Implement exponential backoff for API calls
      const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            if (response.status === 429 && retries > 0) { // Too Many Requests
              await new Promise(res => setTimeout(res, delay));
              return fetchWithRetry(url, options, retries - 1, delay * 2);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response;
        } catch (error) {
          if (retries > 0) {
            await new Promise(res => setTimeout(res, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
          }
          throw error;
        }
      };

      try {
        // Fetch syntax hints
        const hintsResponse = await fetchWithRetry(
          "http://localhost:5001/syntax-hints",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        const hintsData: { status: string; hints: SyntaxHint[] } = await hintsResponse.json();
        if (hintsData.status === "success") {
          setSyntaxHints(hintsData.hints);
        }

        // Fetch learning suggestions
        const suggestionsResponse = await fetchWithRetry(
          "http://localhost:5001/learning-suggestions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        const suggestionsData: {
          status: string;
          suggestions: LearningSuggestion[];
        } = await suggestionsResponse.json();
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

    // Implement exponential backoff for API calls
    const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status === 429 && retries > 0) { // Too Many Requests
            await new Promise(res => setTimeout(res, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
      }
    };

    try {
      const response = await fetchWithRetry("http://localhost:5001/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result: EvaluationResult = await response.json();

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#F8FAFC",
          zIndex: "10",
          borderRadius: "8px",
        }}
      >
        <b>
          <h2 style={{ fontSize: "32px", color: "#02388A", margin: "0" }}>
            MR PSEUDO –{" "}
            <span style={{ fontWeight: "1500" }}>The Pseudo Code Editor</span>
          </h2>
        </b>
        <p style={{ color: "#6B7280", fontSize: "18px", marginTop: "4px" }}>
          Write, validate, and improve your logic with real-time feedback
        </p>
      </div>

      {/* Main Editor and Info Panels Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "20px",
          flex: "1",
          overflow: "hidden",
        }}
      >
        {/* Left Panel - Editor Section */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column", flex: "1", borderRadius: "8px", overflow: "hidden" }}>
          {/* Run Button Section */}
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
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
            >
              {isLoading ? "⏳ Running..." : "▷ Run"}
            </button>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: "1", height: "100%" }}>
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
        </div>

        {/* Right Panel - Output and Information Section */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column", flex: "1", borderRadius: "8px", overflow: "hidden" }}>
          {/* Output Section */}
          <div
            style={{
              flex: "1",
              backgroundColor: "#0f172a",
              color: "#38BDF8",
              padding: "20px",
              fontFamily: "monospace",
              overflowY: "auto",
              borderRadius: "8px 8px 0 0",
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
                overflowY: "auto",
              }}
            >
              <h4 style={{ color: "#FD7934", margin: "0 0 10px 0" }}>
                Variables
              </h4>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "string" ? value : String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Hints Section */}
          {syntaxHints.length > 0 && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #374151",
                overflowY: "auto",
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

          {/* Learning Suggestions Section */}
          {learningSuggestions.length > 0 && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #374151",
                overflowY: "auto",
                borderRadius: "0 0 8px 8px",
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
    </div>
  );
};

export default PseudoCodeEditor;